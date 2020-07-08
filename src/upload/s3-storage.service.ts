import S3 from 'aws-sdk/clients/s3';
import { IObjectStorageProvider } from './interfaces/object-storage-provider.interface';
import { UploadOptions } from './upload.options';
import { UPLOAD_OPTIONS } from './upload.constants';
import { Inject } from '@nestjs/common';

export class S3StorageService implements IObjectStorageProvider {
  private readonly s3: S3;
  constructor(@Inject(UPLOAD_OPTIONS) private readonly options: UploadOptions) {
    this.s3 = new S3({
      endpoint: options.endpoint,
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
    });
  }
  async putObject(buffer: Buffer, fileKey: string): Promise<boolean> {
    const params = {
      Bucket: 'dashboard-cdn',
      Key: fileKey,
      Body: buffer,
      ACL: 'private',
    };
    return this.s3
      .putObject(params)
      .promise()
      .then(() => true);
  }
}
