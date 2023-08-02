import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RedisCacheService } from 'src/cache/redis.service';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  constructor(private redisCacheService: RedisCacheService) {
    super({});
  }

  // @ts-ignore
  async canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) throw new UnauthorizedException();

    const token = request.headers.authorization.split(' ')[1];
    const result = await this.tokenValidation(token);

    //블랙리스트에 등록된 토큰인지 체크
    if (!result) throw new UnauthorizedException('이미 로그아웃한 계정입니다.');

    return super.canActivate(context);
  }

  private async tokenValidation(token: string) {
    const result = await this.redisCacheService.get(token);
    if (result === 'blackList') return false;

    return true;
  }
}
