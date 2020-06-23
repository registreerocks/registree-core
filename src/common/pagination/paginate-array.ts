import { SpecifiedArguments } from './find-many-cursors';
import _ from 'lodash';

export function paginateArray<Model extends { id: string }>(
  source: Model[],
  { after, before, first, last }: SpecifiedArguments,
): Model[] {
  // Paginate Forwards
  if (first) {
    // Can use dropWhile().tail() as well
    return _.chain(source)
      .takeRightWhile(o => o.id !== after?.id)
      .take(first)
      .value();
  }
  // Paginate Backwards
  if (before && last) {
    return _.chain(source)
      .takeWhile(o => o.id !== before.id)
      .takeRight(last)
      .value();
  } else {
    throw new Error('Invalid pagination arguments');
  }
}
