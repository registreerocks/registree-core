import { BaseFaculty } from '../models/faculty.model';
import { FacultyResponse } from 'src/student-data/dto/faculty.response';

export const mapFaculty = (dto: FacultyResponse): BaseFaculty => ({
  id: dto._id,
  description: dto.asset.data.description,
  name: dto.asset.data.name,
  universityId: dto.asset.data.university_id,
});
