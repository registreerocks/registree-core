import { Injectable } from '@nestjs/common';
import { University } from './models/university.model';
import { Faculty } from './models/faculty.model';
import { Degree } from './models/degree.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import _ from 'lodash';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(Degree.name) private degreeModel: Model<Degree>,
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
    @InjectModel(University.name) private universityModel: Model<University>,
  ) {}

  async getUniversities(): Promise<University[]> {
    const res = await this.universityModel.find().exec();
    return res;
  }

  async getUniversitiesById(keys: readonly string[]): Promise<University[]> {
    return this.universityModel
      .find()
      .where('_id')
      .in(keys.map(x => new Types.ObjectId(x)))
      .exec();
  }

  async getFacultiesById(keys: readonly string[]): Promise<Faculty[]> {
    return this.facultyModel
      .find()
      .where('_id')
      .in(keys.map(x => new Types.ObjectId(x)))
      .exec();
  }

  async getDegreesById(keys: readonly string[]): Promise<Degree[]> {
    return this.degreeModel
      .find()
      .where('_id')
      .in(keys.map(x => new Types.ObjectId(x)))
      .exec();
  }

  async getUniversityFaculties(universityId: string): Promise<Faculty[]> {
    return this.facultyModel
      .find({ university: new Types.ObjectId(universityId) })
      .exec();
  }

  async getFaculiesDegrees(
    keys: readonly string[],
  ): Promise<{ id: string; degrees: Degree[] }[]> {
    const res = await this.degreeModel
      .find()
      .where('faculty')
      .in(keys.map(x => new Types.ObjectId(x)))
      .exec();

    return _.chain(res)
      .groupBy(x => x.faculty as Types.ObjectId)
      .toPairs()
      .map(([key, value]) => ({ id: key, degrees: value }))
      .value();
  }

  async getFacultyDegrees(
    facultyId: string,
  ): Promise<{ id: string; degrees: Degree[] }> {
    return this.degreeModel
      .find({ faculty: new Types.ObjectId(facultyId) })
      .exec()
      .then(x => ({ id: facultyId, degrees: x }));
  }

  async getUniversity(universityId: string): Promise<University | null> {
    return this.universityModel.findById(universityId).exec();
  }
}
