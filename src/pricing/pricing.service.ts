import { Injectable, Inject } from '@nestjs/common';
import { partial, clamp } from 'lodash';
import { PRICING_OPTIONS } from './pricing.constants';
import { PricingOptions } from './pricing.options';
import { Quote } from './models/quote.model';

// Same as the below, clamp might be more readable though
// Math.min(max - min, rsvpCount - min) * pricePerRsvp;
const calculateTierAmount = (
  min: number,
  max: number,
  price: number,
  rsvpCount: number,
) => (clamp(rsvpCount, min, max) - min) * price;

@Injectable()
export class PricingService {
  public readonly calculatePrice: (rsvpCount: number) => number;

  constructor(
    @Inject(PRICING_OPTIONS) private readonly options: PricingOptions,
  ) {
    const tierCalculators = options.tiers.map(tier =>
      partial(calculateTierAmount, tier.min, tier.max, tier.price),
    );
    this.calculatePrice = (rsvpCount: number) =>
      tierCalculators.reduce(
        (acc, cur) => acc + cur(rsvpCount),
        this.options.baseCost,
      );
  }

  getQuote(totalStudents: number): Quote {
    return {
      numberOfStudents: totalStudents,
      rsvpCostBreakdown: [5, 10, 20, 50, 100].map(i => ({
        cost: this.calculatePrice(Math.floor((i / 100) * totalStudents)),
        percent: i,
      })),
    };
  }
}
