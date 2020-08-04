import { UniversityResponse } from 'src/student-data/dto/university.response';
import { BaseUniversity } from '../models/university.model';

export const mapUniversity = (dto: UniversityResponse): BaseUniversity => ({
  country: dto.asset.data.country,
  id: dto._id,
  name: dto.asset.data.name,
  physicalAddress: dto.asset.data.physical_address,
  shortName: dto.asset.data.short,
});
