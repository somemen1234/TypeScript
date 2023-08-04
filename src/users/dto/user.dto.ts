import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';
import { UserStatus } from 'src/users/user-status.enum';

export class UserDTO {
  email: string;
  password: string;
  name: string;
  profile_image: string;
  point: number;
  is_admin: UserStatus;
}

export class SignUpDTO {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자와 숫자의 조합으로 입력해 주세요.' })
  @MinLength(8, { message: '비밀번호는 8자 이상입니다. ' })
  password: string;

  @IsString({ message: '비밀번호 확인은 문자와 숫자의 조합으로 입력해 주세요.' })
  confirmPassword: string;

  @Length(2, 19, { message: '이름은 2자 이상 20자 미만입니다. ' })
  @Matches(new RegExp(/^[가-힣a-zA-Z]+$/), {
    message: '이름은 한글과 영어만 입력이 가능합니다.',
  })
  name: string;

  profile_image: string;
  point: number;

  @IsString({ message: '가입 유형은 문자열로 입력해 주세요.' })
  is_admin: UserStatus;
}

export class LoginDTO {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자와 숫자의 조합으로 입력해 주세요.' })
  @MinLength(8, { message: '비밀번호는 8자 이상입니다. ' })
  password: string;
}
