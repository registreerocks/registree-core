import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PRICING_OPTIONS } from './pricing.constants';

describe('PricingService', () => {
  let service: PricingService;
  const BASE_COST = 2500;
  const TIERS = [
    { min: 0, max: 10, price: 200, maxCost: 2000 },
    { min: 10, max: 50, price: 175, maxCost: 9000 },
    { min: 50, max: 100, price: 150, maxCost: 16500 },
    { min: 100, max: 150, price: 125, maxCost: 22750 },
    { min: 150, max: 200, price: 100, maxCost: 27750 },
    { min: 200, max: Infinity, price: 75 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: PRICING_OPTIONS,
          useValue: { tiers: TIERS, baseCost: BASE_COST },
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuote', () => {
    it('should return the cost for 100% equal to the cost given by calculatePrice', () => {
      // Different paths, same destination
      const rsvpCount = 12;
      const expectedResult = service.calculatePrice(rsvpCount);
      const result = service.getQuote(rsvpCount);
      expect(result.rsvpCostBreakdown.find(c => c.percent === 100)?.cost).toBe(
        expectedResult,
      );
    });
  });

  describe('calculatePrice', () => {
    it('should return base cost when 0 RSVPs', () => {
      const price = service.calculatePrice(0);

      expect(price).toBe(BASE_COST);
    });

    it('should return base cost + tier max at the tier cutoffs', () => {
      TIERS.forEach(tier => {
        if (tier.maxCost) {
          const price = service.calculatePrice(tier.max);
          expect(price).toBe(tier.maxCost + BASE_COST);
        }
      });
    });
  });
});
