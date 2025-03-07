"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const users_repository_1 = require("./users.repository");
const s3_service_1 = require("../common/s3/s3.service");
const users_constants_1 = require("./users.constants");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const injection_tokens_1 = require("../common/constants/injection-tokens");
let UsersService = class UsersService {
    constructor(usersRepository, s3Service, pubSub) {
        this.usersRepository = usersRepository;
        this.s3Service = s3Service;
        this.pubSub = pubSub;
    }
    async create(createUserInput) {
        try {
            return this.toEntity(await this.usersRepository.create({
                ...createUserInput,
                password: await this.hashPassword(createUserInput.password),
            }));
        }
        catch (err) {
            if (err.message.includes('E11000')) {
                throw new common_1.UnprocessableEntityException('Email already exists.');
            }
            throw err;
        }
    }
    async uploadImage(file, userId) {
        await this.s3Service.upload({
            bucket: users_constants_1.USERS_BUCKET,
            key: this.getUserImage(userId),
            file,
        });
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    async findAll() {
        return (await this.usersRepository.find({})).map((user) => this.toEntity(user));
    }
    async findOne(_id) {
        return this.toEntity(await this.usersRepository.findOne({ _id }));
    }
    async searchByName(name) {
        const users = (await this.usersRepository.find({ name })).map((user) => this.toEntity(user));
        this.pubSub.publish('userSearched', { userSearched: users });
        return users;
    }
    async update(_id, updateUserInput) {
        if (updateUserInput.password) {
            updateUserInput.password = await this.hashPassword(updateUserInput.password);
        }
        return this.toEntity(await this.usersRepository.findOneAndUpdate({ _id }, {
            $set: {
                ...updateUserInput,
            },
        }));
    }
    async remove(_id) {
        return this.toEntity(await this.usersRepository.findOneAndDelete({ _id }));
    }
    async verifyUser(email, password) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new common_1.UnauthorizedException('Credentials are not valid.');
        }
        return this.toEntity(user);
    }
    toEntity(userDocument) {
        const user = {
            ...userDocument,
            imageUrl: this.s3Service.getObjectUrl(users_constants_1.USERS_BUCKET, this.getUserImage(userDocument._id.toHexString())),
        };
        delete user.password;
        return user;
    }
    getUserImage(userId) {
        return `${userId}.${users_constants_1.USERS_IMAGE_FILE_EXTENSION}`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(injection_tokens_1.PUB_SUB)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        s3_service_1.S3Service,
        graphql_subscriptions_1.PubSub])
], UsersService);
//# sourceMappingURL=users.service.js.map