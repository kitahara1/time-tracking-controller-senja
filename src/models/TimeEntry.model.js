import mongoose from 'mongoose';

class TimeEntry {
  constructor() {
    const timeEntrySchema = new mongoose.Schema({
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true,
      },
      start_time: {
        type: Date,
        required: true,
      },
      end_time: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
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
      collection: 'time_entry',
      timestamps: false,
    });

    this.table = mongoose.model('time_entry', timeEntrySchema);
  }
}

export default TimeEntry;