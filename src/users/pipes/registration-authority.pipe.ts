import { BadRequestException, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { Payload } from 'src/security/payload.interface';
import { UserStatus } from '../user-status.enum';

export class registrationAuthorityPipe implements PipeTransform {
  readonly statusOptions = UserStatus.ORGANIZER;
  transform(value: Payload) {
    const isAdmin = value.is_admin;

    if (isAdmin !== this.statusOptions) throw new UnauthorizedException('공연을 등록할 권한이 없습니다. ');

    return value;
  }
}
