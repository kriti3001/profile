import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { EntraTokenVerifier } from './entra-token.verifier';

// Import this module wherever a controller uses @Protected().
@Module({
  providers: [EntraTokenVerifier, AuthGuard],
  exports: [EntraTokenVerifier, AuthGuard],
})
export class AuthModule {}
