import { AbstractEntity } from 'src/common/database/abstract.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Message extends AbstractEntity {
    content: string;
    createAt: Date;
    user: User;
    chatId: string;
}
