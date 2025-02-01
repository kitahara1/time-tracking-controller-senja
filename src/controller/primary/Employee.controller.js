import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import EmployeeScheme from '../../validators/primary/Employee.validator.js';
import EmployeeService from '../../services/primary/Employee.service.js';

// Library
import Ajv from 'ajv';
import addFormats from "ajv-formats";

class EmployeeController {
  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    addFormats(this.Ajv);
    this.DataScheme = new EmployeeScheme();
    this.EmployeeService = new EmployeeService(this.server);
  }

  async getEmployee(req, res) {
    const employeeList = await this.EmployeeService.getEmployee();
    return res.status(200).json(this.ResponsePreset.resOK('OK', employeeList));
  }

  async createEmployee(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.register);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const data = req.body;
    data.createdBy = req.middlewares.authorization.userId;
    const resRegister = await this.EmployeeService.createEmployee(data);

    if(resRegister === -1) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Employee has been registered',
      'service',
      { code: -1 }
    ));

    if (resRegister === -2) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Internal Server Error',
      'service',
      {code: -2}
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK'));
  }
}

export default EmployeeController;