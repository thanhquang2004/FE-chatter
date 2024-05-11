import { ConfigService } from '@nestjs/config';
import { FileUploadOption } from './file-upload-option.interface';
export declare class S3Service {
    private readonly configService;
    private readonly client;
    constructor(configService: ConfigService);
    upload({ bucket, key, file }: FileUploadOption): Promise<void>;
    getObjectUrl(bucket: string, key: string): string;
}
