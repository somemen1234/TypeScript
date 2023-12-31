import { Controller, Post, UseGuards, Body, Req, Res, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { ShowService } from './shows.service';
import { AuthGuard } from 'src/security/auth.guard';
import { GetUser } from 'src/security/get-user.decorator';
import { ShowDTO, keywordDTO } from './dto/show.dto';
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
  @UseGuards(AuthGuard)
  async registerShow(
    @Body(ShowValidationPipe) showDTO: ShowDTO,
    @Body(SeatValidationPipe) seatInfoDTO: SeatInfoDTO,
    @GetUser(registrationAuthorityPipe) user: Payload,
    @Req() req: MulterRequest,
    @Res() res: Response
  ): Promise<any> {
    const showImg = req.file ? req.file.location : null;
    showDTO.show_poster = showImg;
    showDTO.user_id = user.id;

    await this.ShowService.register(showDTO, seatInfoDTO);
    return res.status(HttpStatus.CREATED).json({ message: '공연이 생성되었습니다.' });
  }

  @Get()
  async getAllShows(@Res() res: Response): Promise<any> {
    const results = await this.ShowService.getAllShows();
    return res.status(HttpStatus.OK).json({ shows: results });
  }

  @Get('/search')
  async searchShow(@Query() keyword: keywordDTO, @Res() res: Response): Promise<any> {
    const results = await this.ShowService.searchShow(keyword);
    return res.status(HttpStatus.OK).json({ show: results });
  }

  @Get(':showId')
  async getShow(@Param('showId') showId: number, @Res() res: Response): Promise<any> {
    const result = await this.ShowService.getShow(showId);

    return res.status(HttpStatus.OK).json({ show: result.show, available: result.available });
  }
}
