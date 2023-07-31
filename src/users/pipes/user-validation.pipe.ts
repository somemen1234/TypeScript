import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UserStatus } from '../user-status.enum';

interface signUpInfo extends Object {
  password: string;
  confirmPassword: string;
  is_admin: string;
}

//회원가입할 때 필요한 유효성 검사를 위한 pipe
export class UserValidationPipe implements PipeTransform {
  readonly statusOptions = [UserStatus.CLIENT, UserStatus.ORGANIZER];
  transform(value: signUpInfo) {
    const password = value.password;
    const confirmPassword = value.confirmPassword;
    const isAdmin = value.is_admin;

    if (password !== confirmPassword) throw new BadRequestException('비밀번호와 비밀번호 확인이 다릅니다. ');

    if (!this.isStatusValid(isAdmin))
      throw new BadRequestException('가입 유형은 CLIENT 아니면 ORGANIZER 둘 중 하나로 입력해 주세요.');
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.statusOptions.indexOf(status);

    return index !== -1;
  }
}
