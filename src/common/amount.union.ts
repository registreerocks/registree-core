import { createUnionType } from '@nestjs/graphql';
import { Absolute } from './absolute.model';
import { Percentage } from './percentage.model';

export const AmountUnion = createUnionType({
  name: 'Amount',
  types: () => [Absolute, Percentage],
  resolveType(value) {
    // XXX: Return string references instead of type instances, to work around upstream
    //      @nestjs/graphql bug.
    // See: https://github.com/registreerocks/registree-core/issues/367
    if ((value as Absolute).absolute) {
      return 'Absolute';
    }
    if ((value as Percentage).percentage) {
      return 'Percentage';
    }
    return null;
  },
});

export const getUnionValue = (amount: Percentage | Absolute) => {
  switch (amount.amountType) {
    case 'Percentage':
      return amount.percentage;
    case 'Absolute':
      return amount.absolute;
  }
};
