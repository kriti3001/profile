import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Property, PropertyStatus, User } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ListPropertiesQueryDto, PUBLIC_STATUSES } from './dto/list-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const withPhotos = { photos: { orderBy: { createdAt: 'asc' } } } satisfies Prisma.PropertyInclude;

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(owner: User, dto: CreatePropertyDto) {
    const { photoUrls, availableFrom, ...fields } = dto;
    return this.prisma.property.create({
      data: {
        ...fields,
        availableFrom: new Date(availableFrom),
        ownerId: owner.id,
        photos: photoUrls?.length ? { create: photoUrls.map((url) => ({ url })) } : undefined,
      },
      include: withPhotos,
    });
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

    const [data, total] = await this.prisma.$transaction([
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
