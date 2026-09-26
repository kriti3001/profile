import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { EntraTokenVerifier } from './entra-token.verifier';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [EntraTokenVerifier, AuthGuard],
  exports: [EntraTokenVerifier, AuthGuard],
})
export class AuthModule {}
