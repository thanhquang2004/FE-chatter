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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const chats_repository_1 = require("./chats.repository");
const mongoose_1 = require("mongoose");
const users_service_1 = require("../users/users.service");
let ChatsService = class ChatsService {
    constructor(chatsRepository, usersService) {
        this.chatsRepository = chatsRepository;
        this.usersService = usersService;
    }
    async create(createChatInput, userId) {
        return this.chatsRepository.create({
            ...createChatInput,
            userId,
            messages: [],
        });
    }
    async findMany(prePipelineStages = [], paginationArgs) {
        const pipeline = [
            ...prePipelineStages,
            {
                $set: {
                    latestMessage: {
                        $cond: [
                            '$messages',
                            { $arrayElemAt: ['$messages', -1] },
                            { createdAt: new Date() },
                        ],
                    },
                },
            },
            { $sort: { 'latestMessage.createdAt': -1 } },
            { $unset: 'messages' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'latestMessage.userId',
                    foreignField: '_id',
                    as: 'latestMessage.user',
                },
            },
        ];
        if (paginationArgs?.skip !== undefined) {
            pipeline.push({ $skip: paginationArgs.skip });
        }
        if (paginationArgs?.limit !== undefined) {
            pipeline.push({ $limit: paginationArgs.limit });
        }
        const chats = await this.chatsRepository.model.aggregate(pipeline);
        chats.forEach((chat) => {
            if (!chat.latestMessage?._id) {
                delete chat.latestMessage;
                return;
            }
            chat.latestMessage.user = this.usersService.toEntity(chat.latestMessage.user[0]);
            delete chat.latestMessage.userId;
            chat.latestMessage.chatId = chat._id;
        });
        return chats;
    }
    async findOne(_id) {
        console.log(_id);
        const chats = await this.findMany([
            { $match: { _id: new mongoose_1.Types.ObjectId(_id) } },
        ]);
        console.log(chats);
        if (!chats[0]) {
            throw new common_1.NotFoundException(`No chat was found with ID ${_id}`);
        }
        return chats[0];
    }
    update(id, updateChatInput) {
        return `This action updates a #${id} chat`;
    }
    remove(id) {
        return `This action removes a #${id} chat`;
    }
    async countChats() {
        return this.chatsRepository.model.countDocuments({});
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chats_repository_1.ChatsRepository,
        users_service_1.UsersService])
], ChatsService);
//# sourceMappingURL=chats.service.js.map