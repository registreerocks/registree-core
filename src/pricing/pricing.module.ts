import { Module, Provider, DynamicModule } from '@nestjs/common';
import { PricingService } from './pricing.service';
import {
  PricingAsyncOptions,
  PricingOptions,
  PricingOptionsFactory,
} from './pricing.options';
import { PRICING_OPTIONS } from './pricing.constants';

@Module({
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {
  static forRootAsync(options: PricingAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      PricingOptions | Promise<PricingOptions>
    > = {
      provide: PRICING_OPTIONS,
      useFactory: async (optionsFactory: PricingOptionsFactory) =>
        await optionsFactory.createPricingOptions(),
      inject: [options.useExisting],
    };
    return {
      module: PricingModule,
      providers: [optionsProvider],
    };
  }
}
