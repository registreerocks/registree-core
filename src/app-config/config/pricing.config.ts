import { registerAs } from '@nestjs/config';

export const PricingConfig = registerAs('pricing', () => ({
  baseCost: 2500,
  tiers: [
    { min: 0, max: 10, price: 200 },
    { min: 10, max: 50, price: 175 },
    { min: 50, max: 100, price: 150 },
    { min: 100, max: 150, price: 125 },
    { min: 150, max: 200, price: 100 },
    { min: 200, max: Infinity, price: 75 },
  ],
}));
