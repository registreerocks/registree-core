import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface QueryResponse extends JsonObject {
  details: [];
  metrics: Metrics;
  responses: Responses;
  results: Results;
  timestamp: string;
}

type Metrics = {
  accepted: number;
  attended: number;
  responded: number;
  viewed: number;
};

type Responses = {
  [k: string]: Response;
};

type Response = {
  accepted: boolean;
  attended: boolean;
  responded: string;
  sent: string;
  viewed: string;
};

type Results = {
  [k: string]: Result;
};

type Result = {
  avg: string;
  complete: boolean;
  degree_name: string;
  term: number;
  timestamp: string;
};

type Details = {
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
};
