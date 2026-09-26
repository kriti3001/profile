import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PropertiesModule } from '../properties/properties.module';
import { StorageModule } from '../storage/storage.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [AuthModule, StorageModule, PropertiesModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
