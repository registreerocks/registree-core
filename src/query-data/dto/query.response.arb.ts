import fc, { Arbitrary } from 'fast-check';
import {
  DetailsDto,
  MetricsDto,
  QueryResponse,
  ResponseDto,
  ResponsesDto,
  ResultDto,
  ResultsDto,
} from './query.response';

export function arbitraryQueryResponse(): Arbitrary<QueryResponse> {
  return arbitraryResponsesDto().chain((responses: ResponsesDto) => {
    // Generate results matching up with the response keys.
    const keys: string[] = Object.keys(responses);
    const maybeResults: Arbitrary<ResultsDto> =
      keys.length === 0
        ? fc.constant({})
        : arbitraryResultsDto(fc.constantFrom(...keys));

    return fc.record({
      details: fc.array(arbitraryDetailsDto()),
      metrics: arbitraryMetricsDto(),
      responses: fc.constant(responses),
      results: maybeResults,
      timestamp: fc.string(),
    });
  });
}

export function arbitraryMetricsDto(): Arbitrary<MetricsDto> {
  return fc.record({
    accepted: fc.integer(),
    attended: fc.integer(),
    responded: fc.integer(),
    viewed: fc.integer(),
  });
}

export function arbitraryResponsesDto(): Arbitrary<ResponsesDto> {
  return fc.dictionary(fc.string(), arbitraryResponseDto());
}

export function arbitraryResponseDto(): Arbitrary<ResponseDto> {
  return fc.record({
    accepted: fc.boolean(),
    attended: fc.boolean(),
    responded: fc.string(),
    sent: fc.string(),
    viewed: fc.string(),
    student_info: fc.record({
      user_id: fc.string(),
      student_number: fc.string(),
    }),
  });
}

export function arbitraryResultsDto(
  keyArb: Arbitrary<string>,
): Arbitrary<ResultsDto> {
  return fc.dictionary(keyArb, arbitraryResultDto());
}

export function arbitraryResultDto(): Arbitrary<ResultDto> {
  return fc.record({
    avg: fc.string(),
    complete: fc.boolean(),
    degree_name: fc.string(),
    degree_id: fc.string(),
    term: fc.integer(),
    timestamp: fc.string(),
  });
}

export function arbitraryDetailsDto(): Arbitrary<DetailsDto> {
  return fc.record(
    {
      absolute: fc.integer({ min: 1 }),
      course_id: fc.string(),
      course_name: fc.string(),
      degree_id: fc.string(),
      degree_name: fc.string(),
      faculty_id: fc.string(),
      faculty_name: fc.string(),
      percentage: fc.integer({ min: 1, max: 100 }),
      university_id: fc.string(),
      university_name: fc.string(),
    },
    {
      requiredKeys: [
        // 'absolute',
        'course_id',
        'course_name',
        'degree_id',
        'degree_name',
        'faculty_id',
        'faculty_name',
        // 'percentage',
        'university_id',
        'university_name',
      ],
    },
  );
}
