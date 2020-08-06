export interface FacultyResponse {
  _id: string;
  asset: {
    data: {
      asset_type: 'faculty';
      description: string;
      id: string;
      name: string;
      university_id: string;
    };
  };
}
