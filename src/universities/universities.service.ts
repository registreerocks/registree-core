import { Injectable } from '@nestjs/common';
import { StudentDataService } from 'src/student-data/student-data.service';
import { University } from './models/university.model';
import { Faculty } from './models/faculty.model';
import { Degree } from './models/degree.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UniversitiesService {
  constructor(
    private readonly studentDataService: StudentDataService,
    @InjectModel(Degree.name) private degreeModel: Model<Degree>,
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
    @InjectModel(University.name) private universityModel: Model<University>,
  ) {}

  async getUniversities(): Promise<University[]> {
    const res = await this.universityModel.find().exec();
    return res;
  }

  async getUniversityFaculties(universityId: string): Promise<Faculty[]> {
    return this.facultyModel
      .find({ university: new Types.ObjectId(universityId) })
      .exec();
  }

  async getFacultyDegrees(facultyId: string): Promise<Degree[]> {
    return this.degreeModel
      .find({ faculty: new Types.ObjectId(facultyId) })
      .exec();
  }

  async getUniversity(universityId: string): Promise<University | null> {
    return this.universityModel.findById(universityId).exec();
  }
}
