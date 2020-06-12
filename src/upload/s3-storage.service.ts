import S3 from 'aws-sdk/clients/s3';
import { IObjectStorageProvider } from './interfaces/object-storage-provider.interface';
import { ConfigService } from '@nestjs/config';

export class S3StorageService implements IObjectStorageProvider {
  private readonly s3: S3;
  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('storage.endpoint');
    const accessKeyId = this.configService.get<string>('storage.accessKeyId');
    const secretAccessKey = this.configService.get<string>(
      'storage.secretAccessKey',
    );
    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3 = new S3({
        endpoint,
        accessKeyId,
        secretAccessKey,
      });
    } else {
      throw new Error(
        'S3StorageService failed to iniitalize: invalid configuration provided',
      );
    }
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
