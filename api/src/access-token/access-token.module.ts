import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ApiAccessTokenController } from './access-token.controller';
import { ApiAccessTokenRepository } from './repositories/api-access-token.repository';
import {
  ApiAccessToken,
  ApiAccessTokenSchema,
} from './repositories/schemas/api-access-token.schema';
import { AccessTokenService } from './services/access-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiAccessToken.name, schema: ApiAccessTokenSchema },
    ]),
    AuthModule,
  ],
  providers: [AccessTokenService, ApiAccessTokenRepository],
  controllers: [ApiAccessTokenController],
})
export class AccessTokenModule {}
