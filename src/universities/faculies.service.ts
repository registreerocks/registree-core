import { Injectable } from '@nestjs/common';
import { Faculty } from './models/faculty.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
  ) {}

  async getFacultyById(facultyId: string): Promise<Faculty | null> {
    return await this.facultyModel
      .findOne({
        _id: facultyId,
      })
      .exec();
  }
}
