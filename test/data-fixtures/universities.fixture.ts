import { DocumentDefinition } from 'mongoose';
import type { University } from '../../src/universities/models/university.model';

/**
 * Get university data in a form that's ready to be loaded.
 */
export function getUniversities(): DocumentDefinition<University>[] {
  return universities.map(university => ({
    ...university,
    id: university._id,
    faculties: [],
  }));
}

type UniversityRaw = Pick<
  University,
  'country' | 'name' | 'physicalAddress' | 'shortName'
> & { _id: string };

const universities: UniversityRaw[] = [
  {
    _id: '5ef1144a1c7d4d99fe6d9812',
    country: 'South Africa',
    name: 'University of Cape Town',
    physicalAddress:
      'University of Cape Town, Woolsack Drive, Rondebosch, 7701',
    shortName: 'UCT',
  },
];
