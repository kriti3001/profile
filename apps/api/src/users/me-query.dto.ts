import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../generated/prisma/enums';

export class MeQueryDto {
  @ApiPropertyOptional({
    enum: UserRole,
    enumName: 'UserRole',
    description: 'Role for a brand-new account (picked at sign-up). Ignored if the account already exists.',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
