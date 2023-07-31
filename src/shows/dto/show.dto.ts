import { IsDate, IsEmpty, IsNumber, IsString, MaxLength, MinDate } from 'class-validator';
import { ShowCategory } from '../show-category.enum';

export class ShowDTO {
  @IsString({ message: '공연 제목을 입력해 주세요.' })
  title: string;

  @IsString({ message: '공연 설명을 입력해 주세요.' })
  description: string;

  show_poster: string;

  @IsDate({ message: '공연 일시를 입력해 주세요.' })
  @MinDate(new Date(Date.now()))
  show_time: Date;

  @IsString({ message: '공연 카테고리를 입력해 주세요.' })
  show_category: ShowCategory;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: '최대 좌석은 숫자만 입력해 주세요.' })
  @MaxLength(40, { message: '공연의 최대 좌석은 40좌석입니다. ' })
  max_seat: number;

  @IsString({ message: '지역을 입력해 주세요.' })
  location: string;

  created_at: Date;
  updated_at: Date;

  @IsEmpty({ message: '공연 등록 시, 유저 아이디 값은 필수입니다.' })
  user_id: number;
}
