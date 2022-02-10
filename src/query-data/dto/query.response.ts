import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface QueryResponse extends JsonObject {
  details: DetailsDto[];
  metrics: MetricsDto;
  responses: ResponsesDto;
  results: ResultsDto;
  timestamp: string;
}

export type MetricsDto = {
  accepted: number;
  attended: number;
  responded: number;
  viewed: number;
};

export type ResponsesDto = {
  [k: string]: ResponseDto;
};

export type ResponseDto = {
  accepted: boolean;
  attended: boolean;
  responded: string;
  sent: string;
  viewed: string;
  student_info: {
    user_id: string;
    student_number: string;
  };
};

export type ResultsDto = {
  [k: string]: ResultDto;
};

export type ResultDto = {
  avg: string;
  complete: boolean;
  degree_name: string;
  degree_id: string;
  term: number;
  timestamp: string;
};

export type DetailsDto = {
  absolute: number;
  course_id: string;
  course_name: string;
  degree_id: string;
  degree_name: string;
  faculty_id: string;
  faculty_name: string;
  percentage: number;
  university_id: string;
  university_name: string;
  average: number;
};
