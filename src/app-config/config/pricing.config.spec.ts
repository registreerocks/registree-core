import { PricingConfig } from './pricing.config';

describe('PricingConfig', () => {
  test.todo('tiers are contiguous');

  test('hardcoded value snapshot', () => {
    expect(PricingConfig()).toMatchInlineSnapshot(`
      Object {
        "baseCost": 2500,
        "tiers": Array [
          Object {
            "max": 10,
            "min": 0,
            "price": 200,
          },
          Object {
            "max": 50,
            "min": 10,
            "price": 175,
          },
          Object {
            "max": 100,
            "min": 50,
            "price": 150,
          },
          Object {
            "max": 150,
            "min": 100,
            "price": 125,
          },
          Object {
            "max": 200,
            "min": 150,
            "price": 100,
          },
          Object {
            "max": Infinity,
            "min": 200,
            "price": 75,
          },
        ],
      }
    `);
  });
});
