import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { GetMessagesArgs } from './dto/get-message.args';
import { PubSub } from 'graphql-subscriptions';
import { UsersService } from 'src/users/users.service';
export declare class MessagesService {
    private readonly chatReponsitory;
    private readonly usersService;
    private readonly pubSub;
    constructor(chatReponsitory: ChatsRepository, usersService: UsersService, pubSub: PubSub);
    createMessage({ content, chatId }: CreateMessageInput, userId: string): Promise<Message>;
    getMessages({ chatId, skip, limit }: GetMessagesArgs): Promise<any[]>;
    messageCreated(): Promise<AsyncIterator<unknown, any, undefined>>;
    countMessages(chatId: string): Promise<any>;
}
