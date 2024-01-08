import { Expose } from 'class-transformer';

export class UploadImageResponse {
  @Expose()
  public image!: string;
}
