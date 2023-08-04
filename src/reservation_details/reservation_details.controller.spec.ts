import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailController } from './reservation_details.controller';

describe('ReservationDetailsController', () => {
  let controller: ReservationDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationDetailController],
    }).compile();

    controller = module.get<ReservationDetailController>(ReservationDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
