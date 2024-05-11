import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessagesArgs } from './dto/get-message.args';
import { MessageCreatedArgs } from './dto/message-created.args';
export declare class MessagesResolver {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    createMessage(createMessageInput: CreateMessageInput, user: TokenPayload): Promise<Message>;
    getMessages(getMessageArgs: GetMessagesArgs): Promise<Message[]>;
    messageCreated(_messageCreatedArgs: MessageCreatedArgs): Promise<AsyncIterator<unknown, any, undefined>>;
}
