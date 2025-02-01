import Primary from "./Primary.js";
import EmployeeController from '../../controller/primary/Employee.controller.js';

class EmployeeRoute extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/employee';
    this.EmployeeController = new EmployeeController(this.server);

    this.routes();
  }

  routes() {
    this.API.post(this.endpointPrefix, this.AuthorizationMiddleware.check(), (req, res) => this.EmployeeController.createEmployee(req, res));
    this.API.get(this.endpointPrefix, this.AuthorizationMiddleware.check(), (req, res) => this.EmployeeController.getEmployee(req, res));
  }
}

export default EmployeeRoute;