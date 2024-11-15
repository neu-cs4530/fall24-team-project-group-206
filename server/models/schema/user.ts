import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Tag collection.
 *
 * This schema defines the structure for storing tags in the database.
 * Each tag includes the following fields:
 * - `name`: The name of the tag. This field is required.
 * - `description`: A brief description of the tag. This field is required.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
      required: true,
    },
    community: {
      type: { type: Schema.Types.ObjectId, ref: 'Community' },
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { collection: 'User' },
);

export default userSchema;
