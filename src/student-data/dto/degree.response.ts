export interface DegreeResponse {
  _id: string;
  asset: {
    data: {
      asset_type: 'degree';
      description: string;
      faculty_id: string;
      id: string;
      level: string;
      name: string;
      university_id: string;
    };
  };
}
