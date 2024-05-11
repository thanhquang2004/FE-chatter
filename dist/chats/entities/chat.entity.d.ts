import { AbstractEntity } from '../../common/database/abstract.entity';
import { Message } from '../messages/entities/message.entity';
export declare class Chat extends AbstractEntity {
    name: string;
    isPrivate: boolean;
    member?: string[];
    latestMessage?: Message;
}
