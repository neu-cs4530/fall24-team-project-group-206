// Community Document Schema
import mongoose, { Model } from 'mongoose';
import { User } from '../types';
import userSchema from './schema/community';

/**
 * Mongoose model for the `Community` collection.
 *
 * This model is created using the `Community` interface and the `communitySchema`, representing the
 * `Community` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<User>}
 */
const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
