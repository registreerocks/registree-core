export interface IObjectStorageProvider {
  /** Stores an object
   * @returns True if a file were saved, false if no file were saved (the file already exists)
   */
  putObject(buffer: Buffer, fileKey: string): Promise<boolean>;

  getObjectUrl(fileKey: string): Promise<string>;
}
