import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { isPublic } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly configService: ConfigService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicRoute = this.reflector.get<boolean>(isPublic, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');
    // console.log('API Key Guard:', authHeader, config.database.apiKey);
    return authHeader === this.configService.get<string>('API_KEY');
  }
}
