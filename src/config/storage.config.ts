import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  useLocal: process.env.LOCAL_OBJECT_STORAGE ? true : false,
  localDirectory: process.env.LOCAL_OBJECT_DIRECTORY,
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET,
}));
