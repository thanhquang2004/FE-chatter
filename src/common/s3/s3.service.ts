import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { FileUploadOption } from './file-upload-option.interface';

@Injectable()
export class S3Service {
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

    const clientConfig: S3ClientConfig = { region: 'us-east-1' };

    if (accessKeyId && secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.client = new S3Client(clientConfig);
  }

  async upload({ bucket, key, file }: FileUploadOption) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      }),
    );
  }

  getObjectUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
