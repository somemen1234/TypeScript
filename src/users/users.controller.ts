import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Res,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  UsePipes,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from './users.service';
import { LoginDTO, SignUpDTO } from 'src/users/dto/user.dto';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/security/auth.guard';
import { UserValidationPipe } from './pipes/user-validation.pipe';
import { MulterRequest } from '../middlewares/multer-request.interface';
import { GetUser } from 'src/security/get-user.decorator';
import { Payload } from 'src/security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('user')
@Injectable()
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @Get('/redis')
  async setRedis() {
    console.log(this.cacheManager);
    try {
      await this.cacheManager.set('hello4', ' world');
      console.log('done setting', await this.cacheManager.store.keys());
    } catch (error) {
      console.log(error.message);
    }
  }

  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async signUpAccount(
    @Body(UserValidationPipe) UserDTO: SignUpDTO,
    @Req() req: MulterRequest,
    @Res() res: Response
  ): Promise<Object> {
    const profileImg = req.file ? req.file.location : null;
    UserDTO.profile_image = profileImg;

    await this.userService.signUp(UserDTO);
    return res.status(HttpStatus.CREATED).json({ message: '회원가입이 완료되었습니다.' });
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async loginAccount(@Body() LoginDTO: LoginDTO, @Res() res: Response): Promise<Object> {
    const { accessToken, username } = await this.userService.login(LoginDTO);

    res.setHeader('authorization', `Bearer ${accessToken}`);

    return res.status(HttpStatus.OK).json({ message: `${username}님 환영합니다.` });
  }

  //커스텀 AuthGuard, GetUser를 만들어 사용
  @Get('/userInfo')
  @UseGuards(AuthGuard)
  getUserInfo(@GetUser() user: Payload, @Res() res: Response): Object {
    return res.status(HttpStatus.OK).json({ user });
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async userLogOut(@Res() res: Response, @Req() req: Request): Promise<Object> {
    const token = req.header('authorization').split(' ')[1];
    const newDate: number = Date.now() / 1000;
    const result = this.jwtService.verify(token);
    const expireTime = Math.ceil(result.exp - newDate);
    const a = await this.cacheManager.set(token, expireTime, expireTime);
    console.log(a);

    return res.status(HttpStatus.OK).json({ message: '로그아웃 하셨습니다.' });
  }
}
