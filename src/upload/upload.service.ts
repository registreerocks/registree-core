import { Injectable, Inject } from '@nestjs/common';
import { ReadStream } from 'fs';
import { slugify } from 'transliteration';
import hasha from 'hasha';
import { IObjectStorageProvider } from './interfaces/object-storage-provider.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject('IObjectStorageProvider')
    private readonly objectStorageProvider: IObjectStorageProvider,
  ) {}

  async saveFile(
    readStreamCreator: () => ReadStream,
    filename: string,
  ): Promise<string> {
    const buffer = await this.streamToBuffer(readStreamCreator());
    const fileHash = hasha(buffer, {
      algorithm: 'sha256',
    });
    const fileKey = `attachments/${fileHash}/${slugify(filename)}`;
    const res = await this.objectStorageProvider
      .putObject(buffer, fileKey)
      .then(() => fileKey);
    return res;
  }

  private async streamToBuffer(stream: ReadStream): Promise<Buffer> {
    const buffer: any[] = [];

    return new Promise((resolve, reject) =>
      stream
        .on('error', error => reject(error))
        .on('data', data => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer))),
    );
  }
}
