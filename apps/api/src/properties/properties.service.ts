import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Property, PropertyStatus, User } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UploadTarget } from '../storage/upload-rules';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ListPropertiesQueryDto, PUBLIC_STATUSES } from './dto/list-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const withPhotos = { photos: { orderBy: { createdAt: 'asc' } } } satisfies Prisma.PropertyInclude;
const MAX_PHOTOS_PER_PROPERTY = 20;

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
    const { city, locality, category, propertyType, minPrice, maxPrice, page, limit } = query;
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new BadRequestException('minPrice must not be greater than maxPrice');
    }

    // Undefined filters are ignored by Prisma; status + city + locality hit the composite index.
    const where: Prisma.PropertyWhereInput = {
      status: query.status ?? PropertyStatus.PUBLISHED,
      city,
      locality,
      category,
      propertyType,
      price: minPrice !== undefined || maxPrice !== undefined ? { gte: minPrice, lte: maxPrice } : undefined,
    };

    // Two independent reads in parallel, deliberately not a $transaction: a transaction must start within
    // Prisma's 2s maxWait, which a fresh connection to the Azure database (~1.5s TLS handshake) can exceed
    // (P2028). A page and its total count being momentarily out of step is harmless for listings.
    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: withPhotos,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
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
