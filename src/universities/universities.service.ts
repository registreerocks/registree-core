import { Injectable } from '@nestjs/common';
import { StudentDataService } from 'src/student-data/student-data.service';
import { mapUniversity } from './mappers/map-university';
import { BaseUniversity } from './models/university.model';
import { mapDegree } from './mappers/map-degree';
import { mapFaculty } from './mappers/map-faculty';
import { BaseFaculty } from './models/faculty.model';
import { BaseDegree } from './models/degree.model';

@Injectable()
export class UniversitiesService {
  constructor(private readonly studentDataService: StudentDataService) {}

  async getUniversities(): Promise<BaseUniversity[]> {
    const res = await this.studentDataService.getUniversities();
    return res.map(mapUniversity);
  }

  async getUniversityFaculties(universityId: string): Promise<BaseFaculty[]> {
    const res = await this.studentDataService.getUniversityFaculties(
      universityId,
    );
    return res.map(mapFaculty);
  }

  async getFacultyDegrees(facultyId: string): Promise<BaseDegree[]> {
    const res = await this.studentDataService.getFacultyDegrees(facultyId);
    return res.map(mapDegree);
  }

  async getUniversity(universityId: string): Promise<BaseUniversity | null> {
    const res = await this.studentDataService.getUniversities();
    const university = res.find(u => u._id === universityId);
    return university ? mapUniversity(university) : null;
  }
}
