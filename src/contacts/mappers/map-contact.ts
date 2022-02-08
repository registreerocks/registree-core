import { GetUserResponse } from 'src/auth0-data/dto/get-user.response';
import { Contact } from '../models/contact.model';

export const mapContact = (response: GetUserResponse): Contact => {
  return {
    name: response.name,
    email: response.email,
    userId: response.user_id,
    dbId: response.app_metadata.db_id,
    calendlyLink: response.calendlyLink,
  };
};
