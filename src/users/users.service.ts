import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDTO, UserDTO } from 'src/users/dto/user.dto';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/security/payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp(newUser: UserDTO): Promise<void> {
    let { password } = newUser;
    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);
    newUser.password = password;

    let existUser: UserDTO = await this.userRepository.findOne({
      where: { email: newUser.email },
    });

    if (existUser) throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.CONFLICT);

    await this.userRepository.save(newUser);
  }

  async login(newUser: LoginDTO): Promise<{ accessToken: string; username: string } | undefined> {
    let existUser: User = await this.userRepository.findOne({
      where: { email: newUser.email },
    });

    const validatePassword = await bcrypt.compare(newUser.password, existUser.password);

    if (!existUser || !validatePassword)
      throw new HttpException('존재하지 않은 이메일이거나 비밀번호가 틀렸습니다.', HttpStatus.PRECONDITION_FAILED);

    const payload: Payload = {
      id: existUser.id,
      name: existUser.name,
      is_admin: existUser.is_admin,
      point: existUser.point,
    };
    //jwtRaddis
    return {
      accessToken: this.jwtService.sign(payload),
      username: existUser.name,
    };
  }

  async tokenValidateUser(userId: number): Promise<UserDTO | undefined> {
    return await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'is_admin', 'point', 'profile_image'],
    });
  }
}
