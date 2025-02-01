import UserRepository from "../../repository/User.repository.js";
import md5 from 'md5';
import {customAlphabet} from "nanoid";
import EmployeeRepository from "../../repository/Employee.repository.js";

class EmployeeService {
  constructor(server) {
    this.server = server;
    this.UserRepository = new UserRepository(server);
    this.EmployeeRepository = new EmployeeRepository(server);
  }

  async getEmployee() {
    try {
      const result = await this.EmployeeRepository.getUser();

      const totalHoursMap = {};

      result.timeEntries.forEach(entry => {
        const { employee_id, start_time, end_time } = entry;
        console.log(employee_id, start_time, end_time);
        const hours = Math.round((new Date(end_time) - new Date(start_time)) / 3600000);

        if (!totalHoursMap[employee_id]) {
          totalHoursMap[employee_id] = 0;
        }
        totalHoursMap[employee_id] += hours;
      });

      const employeesWithHours = result.employees.map(emp => ({
        _id: emp._id,
        name: emp.name,
        email: emp.user_id?.email || null,
        totalHours: totalHoursMap[emp._id] || 0
      }));
      return {
        employeeList: employeesWithHours
      }
    } catch (e) {
      console.error(e);
      this.server.ErrorLog(e);
      return -2;
    }
  }

  async createEmployee(data) {
    const checkUser = await this.UserRepository.checkIfUserExist(data.email);

    if(checkUser) return -1;

    const passwordGenerator = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6);
    data.password = md5(data.password + '-' + this.server.env.HASH_SALT);

    try {
      const result = await this.UserRepository.createUser(data);
      return 0
    } catch (e) {
      console.error(e);
      this.server.ErrorLog(e);
      return -2;
    }
  }
}

export default EmployeeService