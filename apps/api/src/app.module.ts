import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AgreementsModule } from './agreements/agreements.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { PaymentsModule } from './payments/payments.module';
import { PropertiesModule } from './properties/properties.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    SearchModule,
    EnquiriesModule,
    VerificationModule,
    AgreementsModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}
