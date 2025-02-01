import mongoose from 'mongoose';

class Employee {
  constructor() {
    const employeeSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
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
      collection: 'employee',
      timestamps: false,
    });

    this.table = mongoose.model('employee', employeeSchema);
  }
}

export default Employee;