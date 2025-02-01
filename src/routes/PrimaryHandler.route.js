import AuthRoute from './primary/Auth.route.js';
import EmployeeRoute from "./primary/Employee.route.js";
import TimeEntryRoute from "./primary/TimeEntry.route.js";

class PrimaryHandler {
  constructor(server) {
    new AuthRoute(server);
    new EmployeeRoute(server);
    new TimeEntryRoute(server);
  }
}

export default PrimaryHandler;