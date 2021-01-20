import { registerAs } from '@nestjs/config';
import { UploadOptions } from '../../upload/upload.options';
import * as Joi from 'joi';

const requiredIfNot = ref =>
  Joi.string().when(ref, {
    is: true,
    then: Joi.allow(''),
    otherwise: Joi.required(),
  });

const StorageConfigSchema = Joi.object({
  LOCAL_OBJECT_STORAGE: Joi.boolean().falsy('').default(false),
  S3_ENDPOINT: requiredIfNot('LOCAL_OBJECT_STORAGE'),
  S3_ACCESS_KEY_ID: requiredIfNot('LOCAL_OBJECT_STORAGE'),
  S3_SECRET: requiredIfNot('LOCAL_OBJECT_STORAGE'),
});

type StorageConfigSchemaType = {
  LOCAL_OBJECT_STORAGE: boolean;
  S3_ENDPOINT: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET: string;
};

export const StorageConfig = registerAs(
  'storage',
  (): UploadOptions => {
    const validated = Joi.attempt(
      process.env,
      StorageConfigSchema,
      'StorageConfig:',
      {
        abortEarly: false,
        stripUnknown: true,
      },
    ) as StorageConfigSchemaType;

    const useLocal = validated.LOCAL_OBJECT_STORAGE;

    if (useLocal) {
      return { useLocal };
    } else {
      return {
        useLocal,
        endpoint: validated.S3_ENDPOINT,
        accessKeyId: validated.S3_ACCESS_KEY_ID,
        secretAccessKey: validated.S3_SECRET,
      };
    }
  },
);
