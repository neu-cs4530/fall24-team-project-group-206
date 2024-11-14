import { Schema } from 'mongoose';
/**
 * Mongoose schema for Community.
 *
 * This schema defines the structure each community.
 * Each community includes the following fields:
 * - `name`: The name of the community.
 * - `tags`: An array of strings with the tag names.
 * - `users`: An array of strings of the user's names.
 * - `questions`: An array of references to `Question` documents associated with the community.
 */
const communitySchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    tags: {
      type: [String],
    },
    users: {
      type: [String],
    },
    questions: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    },
  },
  { collection: 'Community' },
);

export default communitySchema;
