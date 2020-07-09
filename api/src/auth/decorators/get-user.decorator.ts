import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { User } from '../repositories/schemas/user.schema';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
