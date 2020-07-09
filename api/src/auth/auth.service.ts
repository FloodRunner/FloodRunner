import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private _logger = new Logger('AuthService');

  constructor() {}
}
