import { DegreeResponse } from 'src/student-data/dto/degree.response';
import { BaseDegree } from '../models/degree.model';

export const mapDegree = (dto: DegreeResponse): BaseDegree => ({
  id: dto._id,
  description: dto.asset.data.description,
  level: dto.asset.data.level,
  name: dto.asset.data.name,
});
