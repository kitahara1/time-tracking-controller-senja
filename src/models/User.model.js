import mongoose from 'mongoose';

class User {
  constructor() {
    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        maxlength: 15,
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['admin', 'employee'], // Allowed values
        required: true,
        default: 'employee', // Default role
      },
      created_at: {
        type: Date,
        default: Date.now,
        required: true,
      },
      updated_at: {
        type: Date,
        default: null,
      },
      created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    }, {
      collection: 'users',
      timestamps: false,
    });

    this.table = mongoose.model('users', userSchema);
  }
}

export default User;