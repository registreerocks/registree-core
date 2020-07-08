import { createUnionType } from '@nestjs/graphql';
import { Absolute } from './absolute.model';
import { Percentage } from './percentage.model';

export const AmountUnion = createUnionType({
  name: 'Amount',
  types: () => [Absolute, Percentage],
  resolveType(value) {
    if ((value as Absolute).amount) {
      return Absolute;
    }
    if ((value as Percentage).percentage) {
      return Percentage;
    }
    return null;
  },
});
