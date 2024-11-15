// Community Document Schema
import mongoose, { Model } from 'mongoose';
import { Community } from '../types';
import communitySchema from './schema/community';

/**
 * Mongoose model for the `Community` collection.
 *
 * This model is created using the `Community` interface and the `communitySchema`, representing the
 * `Community` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<Community>}
 */
const CommunityModel: Model<Community> = mongoose.model<Community>('Community', communitySchema);

export default CommunityModel;
