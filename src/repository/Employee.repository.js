import mongoose from 'mongoose';

class Employee {
  constructor(server) {
    this.server = server;
    this.EmployeeModel = server.EmployeeModel;
    this.TimeEntryModel = server.TimeEntryModel
  }

  /**
   * Get user
   * @return {Promise<mongoose.Document & {name: string, email: string, role: string}>}
   */
  async getUser() {
    const employees = await this.EmployeeModel.find()
      .select('_id name user_id')
      .populate('user_id', 'email name')  // Get user details
      .lean();  // Convert to plain objects for easier processing

    const timeEntries = await this.TimeEntryModel.find()
      .select('employee_id start_time end_time description')
      .lean();

    const data = {
      employees: employees,
      timeEntries: timeEntries
    }
    return data ? data : null;
  }
}

export default Employee