import { registerAs } from '@nestjs/config';

export const StorageConfig = registerAs('storage', () => {
  const useLocal = process.env.LOCAL_OBJECT_STORAGE === 'true';
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET;
  if (useLocal || (endpoint && accessKeyId && secretAccessKey)) {
    return {
      useLocal,
      endpoint,
      accessKeyId,
      secretAccessKey,
    };
  } else {
    throw new Error('Incomplete storage config provided');
  }
});
