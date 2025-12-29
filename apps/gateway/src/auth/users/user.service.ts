import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async UpsertUser(
        input: {
            clerkUserId: string,
            email: string,
            name: string;
        }
    ) {
        const now = new Date();

        return await this.userModel.findOneAndUpdate({
            clerkUserId: input.clerkUserId,
        }, {
            $set: {
                email: input.email,
                name: input.name,
                lastSeenAt: now
            },
            $setOnInsert: {
                role: 'user'
            }
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });
    }

    async findByUserClerkId(clerkUserId: string) {
        return await this.userModel.findOne({ clerkUserId });
    }
}
