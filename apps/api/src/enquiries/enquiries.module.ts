import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PropertiesModule } from '../properties/properties.module';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';

@Module({
  imports: [AuthModule, PropertiesModule],
  controllers: [EnquiriesController],
  providers: [EnquiriesService],
})
export class EnquiriesModule {}
