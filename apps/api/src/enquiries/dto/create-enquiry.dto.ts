import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// `source` is always DIRECT for enquiries made through this API; portal-sourced ones arrive via a future sync.
export class CreateEnquiryDto {
  @ApiProperty({ example: 'Rahul Verma', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tenantName: string;

  @ApiProperty({ example: '+91 91234 56789', maxLength: 150, description: 'Phone number or email' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  tenantContact: string;

  @ApiPropertyOptional({ example: 'Is the flat still available from next month?', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
