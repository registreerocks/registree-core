export interface UniversityResponse {
  _id: string;
  asset: {
    data: {
      asset_type: 'university';
      country: string;
      name: string;
      physical_address: string;
      short: string;
    };
  };
}
