import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { UserService } from 'src/users/users.service';
import { Payload } from 'src/security/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: true,
    });
  }

  async validate(payload: Payload): Promise<any> {
    const user = await this.UserService.tokenValidateUser(payload.user_id);

    if (!user) throw new HttpException('토큰 사용자가 존재하지 않습니다.', HttpStatus.UNAUTHORIZED);

    return user;
  }
}
