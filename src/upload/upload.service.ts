import { Injectable, Inject } from '@nestjs/common';
import { ReadStream } from 'fs';
import { slugify } from 'transliteration';
import hasha from 'hasha';
import { IObjectStorageProvider } from './interfaces/object-storage-provider.interface';
import { OBJECT_STORAGE } from './upload.constants';

@Injectable()
export class UploadService {
  constructor(
    @Inject(OBJECT_STORAGE)
    private readonly objectStorageProvider: IObjectStorageProvider,
  ) {}

  async saveFile({
    createReadStream,
    filename,
  }: {
    createReadStream: () => ReadStream;
    filename: string;
  }): Promise<string> {
    const buffer = await this.streamToBuffer(createReadStream());
    const fileHash = hasha(buffer, {
      algorithm: 'sha256',
    });
    const fileKey = `attachments/${fileHash}/${slugify(filename)}`;
    const res = await this.objectStorageProvider
      .putObject(buffer, fileKey)
      .then(() => fileKey);
    return res;
  }

  getFileLink(fileKey: string): Promise<string> {
    return this.objectStorageProvider.getObjectUrl(fileKey);
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
