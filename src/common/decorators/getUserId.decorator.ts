import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUserPayload } from '@/auth/dto/jwt-payload.dto';

export const GetUserId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<string | null> => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const jwtService = new JwtService({
        secret: process.env.JWT_SECRET,
      });
      const decoded = jwtService.decode<JwtUserPayload>(token);

      return decoded?.userId || null;
    } catch (error) {
      throw new Error(error);
    }
  },
);
