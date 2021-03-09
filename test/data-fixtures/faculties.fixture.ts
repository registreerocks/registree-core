import { DocumentDefinition, Types } from 'mongoose';
import type { Faculty } from '../../src/universities/models/faculty.model';

/**
 * Get faculty data in a form that's ready to be loaded.
 */
export function getFaculties(): DocumentDefinition<Faculty>[] {
  return faculties.map(faculty => ({
    ...faculty,
    id: faculty._id,
    university: new Types.ObjectId(faculty.university),
    groupedDegrees: [],
    degrees: [],
  }));
}

type FacultyRaw = Pick<Faculty, 'name' | 'description'> & {
  _id: string;
  university: string;
};

const faculties: FacultyRaw[] = [
  {
    _id: '5ef1144a1c7d4d99fe6d9813',
    name: 'Faculty of Commerce',
    description:
      'Commerce degree programmes prepare students for the personnel needs of the fast-growing world of financial service industries and prepare them for participation in the global economy.',
    university: '5ef1144a1c7d4d99fe6d9812',
  },
];
