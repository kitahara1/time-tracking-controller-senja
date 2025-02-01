import mongoose from 'mongoose';

class UserRepository {
  constructor(server) {
    this.server = server;
    this.UserModel = server.UserModel;
    this.EmployeeModel = server.EmployeeModel;
  }

  /**
   * Authenticate user
   * @param username {string}
   * @param password {string}
   * @return {Promise<String>}
   */
  async authenticateUser(username, password) {
    const user = await this.UserModel.findOne({
      username: username,
      password: password,
    });

    return user ? user._id : null;
  }

  /**
   * Get user by id
   * @param userId {number}
   * @return {Promise<mongoose.Document & {name: string, email: string, role: string}>}
   */
  async getUserById(userId) {
    const data = await this.UserModel.findOne({
      _id: userId
    }).select('_id name email role');
    if (!data) return null;
    const employee = await this.EmployeeModel.findOne({
      user_id: data._id
    })
    if (!employee) return null;

    data._doc.employeeId = employee._id;
    return data._doc;
  }

  /**
   * Check if a user are exists or not
   * @param email {string}
   * @return {Promise<boolean>}
   */
  async checkIfUserExist(email) {
    const data = await this.UserModel.findOne({
      email: email
    })

    return !!data;
  }

  /**
   * Check if a user are exists or not by employeeId
   * @param employeeId {string}
   * @return {Promise<boolean>}
   */
  async checkIfUserExistByEmployeeId(employeeId) {
    const data = await this.EmployeeModel.findOne({
      _id: employeeId
    })

    return !!data;
  }

  /**
   * Create new user and employee
   * @param data {{
   *   username,
   *   email,
   *   password,
   *   role,
   *   createdBy
   * }}
   * @return {Promise<number>}
   */
  async createUser(data) {
    const transaction = await mongoose.startSession();
    transaction.startTransaction();
    try {
      const user = await this.UserModel.create([{
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        created_by: data.createdBy
      }], {transaction});

      await this.EmployeeModel.create([{
        user_id: user[0]._id,
        name: data.name,
        created_by: data.createdBy
      }], {transaction});

      await transaction.commitTransaction();
      transaction.endSession();

      return 0;
    } catch (e) {
      await transaction.abortTransaction();
      transaction.endSession();
      console.error(e);
      this.server.ErrorLog(e);
      throw e;
    }
  }


}

export default UserRepository