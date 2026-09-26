import { Injectable } from '@nestjs/common';
import type { User } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import { PropertiesService } from '../properties/properties.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly properties: PropertiesService,
  ) {}

  /** Anyone may enquire about a publicly visible property; drafts/archived are 404. */
  async create(propertyId: string, dto: CreateEnquiryDto) {
    await this.properties.findPublic(propertyId);
    return this.prisma.enquiry.create({ data: { ...dto, propertyId } });
  }

  /** Enquiries on a property, newest first. Owner only. */
  async listForOwner(user: User, propertyId: string) {
    await this.properties.findOwned(user, propertyId);
    return this.prisma.enquiry.findMany({ where: { propertyId }, orderBy: { createdAt: 'desc' } });
  }
}
