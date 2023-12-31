import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/users/users.service';
import { Payload } from 'src/security/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<any> {
    const user = await this.userService.tokenValidateUser(payload.id);
    if (!user) return new HttpException('토큰 사용자가 존재하지 않습니다.', HttpStatus.UNAUTHORIZED);

    return user;
  }
}
