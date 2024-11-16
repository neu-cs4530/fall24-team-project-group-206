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
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    tags: {
      type: [String],
    },
    community: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { collection: 'User' },
);

export default userSchema;
