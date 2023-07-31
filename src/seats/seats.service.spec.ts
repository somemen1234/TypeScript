import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seats.service';

describe('SeatsService', () => {
  let service: SeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatService],
    }).compile();

    service = module.get<SeatService>(SeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
