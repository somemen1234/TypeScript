import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { ShowService } from './shows.service';
import { AuthGuard } from 'src/security/auth.guard';
import { GetUser } from 'src/security/get-user.decorator';
import { ShowDTO } from './dto/show.dto';
import { Response } from 'express';
import { MulterRequest } from 'src/middlewares/multer-request.interface';
import { Payload } from 'src/security/payload.interface';
import { SeatInfoDTO } from 'src/seats/dto/seat.dto';
import { SeatValidationPipe } from 'src/seats/pipes/seat-validation.pipe';
import { ShowValidationPipe } from './pipes/show-validation.pipe';
import { registrationAuthorityPipe } from '../users/pipes/registration-authority.pipe';

@Controller('show')
export class ShowController {
  constructor(private ShowService: ShowService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async registerShow(
    @GetUser(registrationAuthorityPipe) user: Payload,
    @Body(ShowValidationPipe) showDTO: ShowDTO,
    @Body(SeatValidationPipe) seatInfoDTO: SeatInfoDTO,
    @Req() req: MulterRequest,
    @Res() res: Response
  ): Promise<any> {
    const showImg = req.file ? req.file.location : null;
    showDTO.show_poster = showImg;
    showDTO.user_id = user.user_id;

    await this.ShowService.register(showDTO, seatInfoDTO);
    return res.status(HttpStatus.CREATED).json({ message: '공연이 생성되었습니다.' });
  }
}
