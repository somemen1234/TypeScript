import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ShowDTO } from '../dto/show.dto';
import { ShowCategory } from '../show-category.enum';

export class ShowValidationPipe implements PipeTransform {
  readonly categoryOptions = [ShowCategory.CONCERT, ShowCategory.MAGIC, ShowCategory.MUSICAL, ShowCategory.OPERA];
  transform(value: ShowDTO) {
    const category = value.show_category;
    const showTime = value.show_time;
    const currentDate = new Date(Date.now());
    const maxSeat = value.max_seat;

    if (maxSeat < 10) throw new BadRequestException('공연 등록 시, 최소 10좌석이상은 선택하셔야 합니다.');
    if (maxSeat > 40) throw new BadRequestException('공연 최대 좌석은 40석입니다.');
    if (showTime < currentDate) throw new BadRequestException('공연 시간은 현재보다 이전 시간을 선택할 수 없습니다.');
    if (!this.isCategoryValid(category)) throw new BadRequestException('주어진 공연 카테고리와 일치하는 값이 아닙니다.');
    return value;
  }

  private isCategoryValid(status: any) {
    const index = this.categoryOptions.indexOf(status);

    return index !== -1;
  }
}
