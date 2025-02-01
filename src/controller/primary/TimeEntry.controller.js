import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import TimeEntryScheme from '../../validators/primary/TimeEntry.validator.js';
import TimeEntryService from "../../services/primary/TimeEntry.service.js";

// Library
import Ajv from 'ajv';
import addFormats from "ajv-formats";

class EmployeeController {
  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    addFormats(this.Ajv);
    this.DataScheme = new TimeEntryScheme();
    this.TimeEntryService = new TimeEntryService(this.server);
  }

  async getAll(req, res) {
    const data = req.query;
    const schemeValidate = this.Ajv.compile(this.DataScheme.get);

    if(!schemeValidate(data)) return res.status(400).json(this.ResponsePreset.resErr(
        400,
        schemeValidate.errors[0].message,
        'validator',
        schemeValidate.errors[0]
    ));
    const result = await this.TimeEntryService.getLogTIme(data);
    return res.status(200).json(this.ResponsePreset.resOK('OK', result));
  }

  async editLogTIme(req, res) {
    const data = {...req.query, ...req.body};
    const schemeValidate = this.Ajv.compile(this.DataScheme.edit);

    if(!schemeValidate(data)) return res.status(400).json(this.ResponsePreset.resErr(
        400,
        schemeValidate.errors[0].message,
        'validator',
        schemeValidate.errors[0]
    ));

    data.createdBy = req.middlewares.authorization.userId;
    const result = await this.TimeEntryService.editLogTime(data);

    if(result === -1) return res.status(404).json(this.ResponsePreset.resErr(
        404,
        'Log Time Not Found',
        'service',
        { code: result }
    ));
    if (result === -2) return res.status(500).json(this.ResponsePreset.resErr(
        500,
        'Internal Server Error',
        'service',
        {code: -2}
    ));
    return res.status(200).json(this.ResponsePreset.resOK('OK'));
  }

  async deleteLogTime(req, res) {
    const data = req.query;
    const schemeValidate = this.Ajv.compile(this.DataScheme.delete);

    if(!schemeValidate(data)) return res.status(400).json(this.ResponsePreset.resErr(
        400,
        schemeValidate.errors[0].message,
        'validator',
        schemeValidate.errors[0]
    ));
    const result = await this.TimeEntryService.deleteLogTime(data.id);

    if(result === -1) return res.status(404).json(this.ResponsePreset.resErr(
        404,
        'Log Time Not Found',
        'service',
        { code: result }
    ));
    if (result === -2) return res.status(500).json(this.ResponsePreset.resErr(
        500,
        'Internal Server Error',
        'service',
        {code: -2}
    ));
    return res.status(200).json(this.ResponsePreset.resOK('OK'));
  }

  async EntryLogTime(req, res) {
    const data = req.body
    const schemeValidate = this.Ajv.compile(this.DataScheme.create);

    if(!schemeValidate(data)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    data.createdBy = req.middlewares.authorization.userId;
    const result = await this.TimeEntryService.EntryLogTIme(data);

    if(result === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Employee Not Found',
      'service',
      { code: result }
    ));
    if(result === -2) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Start time must before now',
      'service',
      { code: result }
    ));
    if(result === -3) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'End time must before now',
      'service',
      { code: result }
    ));
    if(result === -4) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Start time must before end time',
      'service',
      { code: result }
    ));
    if (result === -5) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Internal Server Error',
      'service',
      {code: result}
    ));

    return res.status(201).json(this.ResponsePreset.resOK('OK'));
  }
}

export default EmployeeController;