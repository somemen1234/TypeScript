import { IsDate, IsNumber, IsString, MinLength } from 'class-validator';
import { ShowCategory } from '../show-category.enum';
import { Type } from 'class-transformer';

export class ShowDTO {
  @IsString({ message: '공연 제목을 입력해 주세요.' })
  title: string;

  @IsString({ message: '공연 설명을 입력해 주세요.' })
  description: string;

  show_poster: string;

  @IsDate({ message: '공연 일시를 입력해 주세요.' })
  @Type(() => Date)
  show_time: Date;

  @IsString({ message: '공연 카테고리를 입력해 주세요.' })
  show_category: ShowCategory;

  @IsNumber({}, { message: '최대 좌석은 숫자만 입력해 주세요.' })
  @Type(() => Number)
  max_seat: number;

  @IsString({ message: '지역을 입력해 주세요.' })
  location: string;

  created_at: Date;
  updated_at: Date;

  user_id: number;
}
