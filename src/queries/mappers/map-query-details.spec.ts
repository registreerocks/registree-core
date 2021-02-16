import fc from 'fast-check';
import { arbitraryQueryResponse } from 'src/query-data/dto/query.response.arb';
import { DetailsDto, QueryResponse } from '../../query-data/dto/query.response';
import { DegreeSelection } from '../models/degree-selection.model';
import { mapQueryDetails } from './map-query-details';

describe('mapQueryDetails', () => {
  test('empty input', () => {
    const response: Partial<QueryResponse> = {};
    expect(() => mapQueryDetails(response as QueryResponse)).toThrowError(
      "Cannot read property 'map' of undefined",
    );
  });

  test('arbitrary valid input', () => {
    fc.assert(
      fc.property(arbitraryQueryResponse(), (response: QueryResponse) => {
        const { parameters, rawResults, updatedAt, ...rest } = mapQueryDetails(
          response,
        );

        expect(
          parameters.map((p: DegreeSelection) => p.degreeId),
        ).toStrictEqual(response.details.map((d: DetailsDto) => d.degree_id));

        parameters.forEach((p: DegreeSelection, i: number) => {
          const d: DetailsDto = response.details[i];

          const { amountType, ...rest } = p.amount;
          switch (amountType) {
            case 'Absolute':
              expect(rest).toStrictEqual({ absolute: d.absolute });
              break;
            case 'Percentage':
              expect(rest).toStrictEqual({ percentage: d.percentage });
              break;
            default:
              fail(p.amount);
          }
        });

        expect(rawResults).toBeInstanceOf(Array);
        expect(updatedAt).toBeInstanceOf(Date);
        expect(rest).toStrictEqual({});
      }),
    );
  });
});
