import { BadRequestException, PipeTransform } from '@nestjs/common';

export class keywordValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!value) throw new BadRequestException('키워드가 입력되지 않았습니다. ');
  }
}
