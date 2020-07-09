import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
  });

  describe('holder', () => {
    it('passes', async () => {});
  });
});
