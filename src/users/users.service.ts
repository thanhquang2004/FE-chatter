import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { USERS_IMAGE_FILE_EXTENSION, USERS_BUCKET } from './users.constants';
import { UserDocument } from './entities/users.document';
import { User } from './entities/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/constants/injection-tokens';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      return this.toEntity(
        await this.usersRepository.create({
          ...createUserInput,
          password: await this.hashPassword(createUserInput.password),
        }),
      );
    } catch (err) {
      if (err.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw err;
    }
  }

  async uploadImage(file: Buffer, userId: string) {
    await this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: this.getUserImage(userId),
      file,
    });
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findAll() {
    return (await this.usersRepository.find({})).map((user) =>
      this.toEntity(user),
    );
  }

  async findOne(_id: string) {
    return this.toEntity(await this.usersRepository.findOne({ _id }));
  }

  async searchByName(name: string) {
    const users = (await this.usersRepository.find({ name })).map((user) =>
      this.toEntity(user),
    );

    this.pubSub.publish('userSearched', { userSearched: users });
    return users;
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }

    return this.toEntity(
      await this.usersRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...updateUserInput,
          },
        },
      ),
    );
  }

  async remove(_id: string) {
    return this.toEntity(await this.usersRepository.findOneAndDelete({ _id }));
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.toEntity(user);
  }

  toEntity(userDocument: UserDocument): User {
    const user = {
      ...userDocument,
      imageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        this.getUserImage(userDocument._id.toHexString()),
      ),
    };
    delete user.password;
    return user;
  }

  private getUserImage(userId: string) {
    return `${userId}.${USERS_IMAGE_FILE_EXTENSION}`;
  }
}
