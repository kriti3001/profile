import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Property, PropertyStatus, User } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UploadTarget } from '../storage/upload-rules';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ListPropertiesQueryDto, PUBLIC_STATUSES, SortOption } from './dto/list-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const withPhotos = { photos: { orderBy: { createdAt: 'asc' } } } satisfies Prisma.PropertyInclude;
const MAX_PHOTOS_PER_PROPERTY = 20;

const SEARCH_FIELDS = ['title', 'description', 'city', 'locality'] as const;
const MAX_SEARCH_TERMS = 10;

// Newest first breaks ties within a price; id makes paging deterministic.
const SORT_ORDER: Record<SortOption, Prisma.PropertyOrderByWithRelationInput[]> = {
  newest: [{ createdAt: 'desc' }, { id: 'asc' }],
  price_asc: [{ price: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
  price_desc: [{ price: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
  price_dec: [{ price: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
};

/**
 * Prisma's `contains` becomes ILIKE '%term%' without escaping LIKE wildcards, so a search for "%" or "_"
 * would match everything. Escape them (and the escape character) with Postgres's default LIKE escape, "\".
 */
function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, '\\$&');
}

/** An inclusive { gte, lte } filter, or undefined if neither bound is set. */
function range(label: string, min?: number, max?: number): Prisma.IntFilter | undefined {
  if (min !== undefined && max !== undefined && min > max) {
    throw new BadRequestException(`min${label} must not be greater than max${label}`);
  }
  return min !== undefined || max !== undefined ? { gte: min, lte: max } : undefined;
}

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  create(owner: User, dto: CreatePropertyDto) {
    const { availableFrom, ...fields } = dto;
    return this.prisma.property.create({
      data: { ...fields, availableFrom: new Date(availableFrom), ownerId: owner.id },
      include: withPhotos,
    });
  }

  /** Records a photo the owner has uploaded to Blob Storage via a SAS URL from POST /uploads/sas-token. */
  async addPhoto(user: User, propertyId: string, blobUrl: string) {
    await this.findOwned(user, propertyId);
    const count = await this.prisma.propertyPhoto.count({ where: { propertyId } });
    if (count >= MAX_PHOTOS_PER_PROPERTY) {
      throw new BadRequestException(`A property can have at most ${MAX_PHOTOS_PER_PROPERTY} photos`);
    }

    const url = await this.storage.promoteUpload(UploadTarget.PROPERTY_PHOTO, propertyId, blobUrl);
    return this.prisma.propertyPhoto.create({ data: { propertyId, url } });
  }

  async list(query: ListPropertiesQueryDto) {
    const { city, locality, category, page, limit } = query;
    const terms = query.q?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (terms.length > MAX_SEARCH_TERMS) {
      throw new BadRequestException(`q can contain at most ${MAX_SEARCH_TERMS} words`);
    }

    // Undefined filters are ignored by Prisma. status + city + locality hit the composite index;
    // the q terms use the trigram indexes on the searched columns.
    const where: Prisma.PropertyWhereInput = {
      status: query.status ?? PropertyStatus.PUBLISHED,
      city,
      locality,
      category,
      propertyType: query.propertyType?.length ? { in: query.propertyType } : undefined,
      price: range('Price', query.minPrice, query.maxPrice),
      area: range('Area', query.minArea, query.maxArea),
      bhk: query.bhk?.length || query.minBhk !== undefined ? { in: query.bhk, gte: query.minBhk } : undefined,
      furnishingStatus: query.furnishing?.length ? { in: query.furnishing } : undefined,
      isVerified: query.verified,
      // Every term must match somewhere: "balcony indore" finds an Indore listing whose description mentions a balcony.
      AND: terms.length
        ? terms.map((term) => ({
            OR: SEARCH_FIELDS.map((field) => ({ [field]: { contains: escapeLike(term), mode: 'insensitive' } })),
          }))
        : undefined,
    };

    // Two independent reads in parallel, deliberately not a $transaction: a transaction must start within
    // Prisma's 2s maxWait, which a fresh connection to the Azure database (~1.5s TLS handshake) can exceed
    // (P2028). A page and its total count being momentarily out of step is harmless for listings.
    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: withPhotos,
        orderBy: SORT_ORDER[query.sortBy],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  /** A publicly visible property (PUBLISHED or RENTED). Drafts and archived listings are 404 here. */
  async findPublic(id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id, status: { in: PUBLIC_STATUSES } },
      include: withPhotos,
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  findMine(owner: User) {
    return this.prisma.property.findMany({
      where: { ownerId: owner.id },
      include: withPhotos,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(user: User, id: string, dto: UpdatePropertyDto) {
    await this.findOwned(user, id);
    const { availableFrom, ...fields } = dto;
    return this.prisma.property.update({
      where: { id },
      data: { ...fields, availableFrom: availableFrom ? new Date(availableFrom) : undefined },
      include: withPhotos,
    });
  }

  /**
   * The property if `user` owns it: 404 if it doesn't exist, 403 if someone else owns it.
   * ownerId is whoever created the listing, so this covers both owners and the creating broker.
   */
  async findOwned(user: User, id: string): Promise<Property> {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.ownerId !== user.id) throw new ForbiddenException('You do not own this property');
    return property;
  }
}
