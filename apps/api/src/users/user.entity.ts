import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/enums';

/** Swagger schema for a User record as returned by the API. */
export class UserEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'owner@example.com' })
  email: string;

  @ApiProperty({ example: 'Anjali Sharma' })
  name: string;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role: UserRole;

  @ApiProperty({ type: String, nullable: true, example: '+91 98765 43210' })
  phone: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Entra External ID object ID (oid)' })
  entraObjectId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
