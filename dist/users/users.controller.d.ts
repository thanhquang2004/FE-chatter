/// <reference types="multer" />
import { TokenPayload } from 'src/auth/token-payload.interface';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    uploadFile(file: Express.Multer.File, user: TokenPayload): Promise<void>;
}
