import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export type User = {
  email: string;
};

export type ReqWithUser = Request & {
  user: User;
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ReqWithUser>();
    const session = request.cookies.session as string | undefined | null;
    if (!session) return false;

    try {
      const decodedCookie = await admin
        .auth()
        .verifySessionCookie(session, true);
      if (decodedCookie.email) {
        request.user = {
          email: decodedCookie.email,
        };
      }
      return !!decodedCookie.email;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
