import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    login(user: User, response: Response): Promise<void>;
    verifyWs(request: Request): TokenPayload;
    logout(response: Response): void;
}
