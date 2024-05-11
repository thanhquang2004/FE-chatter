import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: User, response: Response): Promise<void>;
    logout(response: Response): void;
}
