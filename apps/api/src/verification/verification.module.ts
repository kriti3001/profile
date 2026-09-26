import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [AuthModule, StorageModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
