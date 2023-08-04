import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailService } from './reservation_details.service';

describe('ReservationDetailsService', () => {
  let service: ReservationDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationDetailService],
    }).compile();

    service = module.get<ReservationDetailService>(ReservationDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
