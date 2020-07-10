import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { IObjectStorageProvider } from './interfaces/object-storage-provider.interface';
import path from 'path';
const uploadDir = `${__dirname}/../../uploads`;

@Injectable()
export class FsStorageService implements IObjectStorageProvider {
  async putObject(buffer: Buffer, fileKey: string): Promise<boolean> {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const fileDir = path.resolve(uploadDir, path.dirname(fileKey));
    const fullPath = path.resolve(uploadDir, fileKey);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir);
      await this.saveFile(buffer, fullPath);
      return true;
    } else {
      return false;
    }
  }

  getObjectUrl(fileKey: string): Promise<string> {
    return Promise.resolve(path.resolve(uploadDir, fileKey));
  }

  private async saveFile(file: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file, (errorWrite: Error | null) => {
        if (errorWrite) {
          reject(errorWrite);
        }
        resolve();
      });
    });
  }
}
