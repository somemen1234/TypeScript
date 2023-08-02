import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ShowDTO } from '../dto/show.dto';
import { ShowCategory } from '../show-category.enum';

export class ShowValidationPipe implements PipeTransform {
  readonly categoryOptions = [ShowCategory.CONCERT, ShowCategory.MAGIC, ShowCategory.MUSICAL, ShowCategory.OPERA];
  transform(value: ShowDTO) {
    const category = value.show_category;

    if (!this.isCategoryValid(category)) throw new BadRequestException('정해진 공연 카테고리와 일치하는 값이 아닙니다.');
    return value;
  }

  private isCategoryValid(status: any) {
    const index = this.categoryOptions.indexOf(status);

    return index !== -1;
  }
}
