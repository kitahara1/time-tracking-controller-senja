import UserRepository from "../../repository/User.repository.js";
import TimeEntryRepository from "../../repository/TimeEntry.repository.js";
import md5 from 'md5';
import {customAlphabet} from "nanoid";

class EmployeeService {
  constructor(server) {
    this.server = server;
    this.UserRepository = new UserRepository(server);
    this.TimeEntryRepository = new TimeEntryRepository(server);
  }

  async getLogTIme(filter) {
    try {
      const result = await this.TimeEntryRepository.getLogTime(filter);
      return {
        timeEntryList: result
      }
    } catch (e) {
      console.error(e);
      this.server.ErrorLog(e);
      return -2;
    }
  }

  async deleteLogTime(id) {
    const checkLogTime = await this.TimeEntryRepository.getTimeEntryById(id)
    if(!checkLogTime) return -1;
    try {
      await this.TimeEntryRepository.deleteLogTime(id);
    } catch (e) {
      console.error(e);
      this.server.ErrorLog(e);
      return -2;
    }
  }

  async editLogTime(data) {
    const checkLogTime = await this.TimeEntryRepository.getTimeEntryById(data.id)
    if(!checkLogTime) return -1;
    if(new Date(data.startTime) >= Date.now()) return -2
    if(new Date(data.endTime) >= Date.now()) return -3
    if(new Date(data.startTime) >= new Date(data.endTime)) return -4;

    try {
      await this.TimeEntryRepository.EditLogTIme(data);

      return 0;
    } catch (e) {
      console.error(e);
      this.server.ErrorLog(e);
      return -5;
    }
  }

  async EntryLogTIme(data) {
    const checkUser = await this.UserRepository.checkIfUserExistByEmployeeId(data.employeeId);
    if(!checkUser) return -1;
    if(new Date(data.startTime) >= Date.now()) return -2
    if(new Date(data.endTime) >= Date.now()) return -3
    if(new Date(data.startTime) >= new Date(data.endTime)) return -4;

    try {
      await this.TimeEntryRepository.CreateLogTime(data);

      return 0;
    } catch (e) {
      console.error(e);
      this.server.ErrorLog(e);
      return -5;
    }
  }
}

export default EmployeeService