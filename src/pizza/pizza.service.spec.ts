import { Test, TestingModule } from '@nestjs/testing';
import { PizzaService } from './pizza.service';

describe('ExerciseService', () => {
  let service: PizzaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PizzaService],
    }).compile();

    service = module.get<PizzaService>(PizzaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
