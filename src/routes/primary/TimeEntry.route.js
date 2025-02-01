import Primary from "./Primary.js";
import TimeEntryController from "../../controller/primary/TimeEntry.controller.js";

class TimeEntryRoute extends Primary {
    constructor(server) {
        super(server);

        this.endpointPrefix = this.endpointPrefix + '/time-entry';
        this.TimeEntryController = new TimeEntryController(this.server);

        this.routes();
    }

    routes() {
        this.API.post(this.endpointPrefix, this.AuthorizationMiddleware.check(), (req, res) => this.TimeEntryController.EntryLogTime(req, res));
        this.API.get(this.endpointPrefix, this.AuthorizationMiddleware.check(), (req, res) => this.TimeEntryController.getAll(req, res));
        this.API.put(this.endpointPrefix, this.AuthorizationMiddleware.check(), (req, res) => this.TimeEntryController.editLogTIme(req, res));
        this.API.delete(this.endpointPrefix, this.AuthorizationMiddleware.check(), (req, res) => this.TimeEntryController.deleteLogTime(req, res));
    }
}

export default TimeEntryRoute;