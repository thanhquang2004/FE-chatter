import { ObjectType, Field } from '@nestjs/graphql';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Message } from '../messages/entities/message.entity';

@ObjectType()
export class Chat extends AbstractEntity {
  @Field()
  name: string;

  @Field()
  isPrivate: boolean;

  @Field(() => [String])
  member?: string[];

  @Field(() => Message, { nullable: true })
  latestMessage?: Message;
}
