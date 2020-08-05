import { Type } from '@nestjs/common';

export interface PricingOptions {
  tiers: { min: number; max: number; price: number }[];
  baseCost: number;
}
export interface PricingAsyncOptions {
  useExisting: Type<PricingOptionsFactory>;
}
export interface PricingOptionsFactory {
  createPricingOptions(): Promise<PricingOptions> | PricingOptions;
}
