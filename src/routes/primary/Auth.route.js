import Primary from "./Primary.js";
import AuthController from '../../controller/primary/Auth.controller.js';

class Authentication extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/auth';
    this.AuthController = new AuthController(this.server);

    this.routes();
  }

  routes() {
    this.API.post(this.endpointPrefix + '/login', (req, res) => this.AuthController.login(req, res));
    this.API.get(this.endpointPrefix + '/refresh-token', this.AuthorizationMiddleware.check(), (req, res) => this.AuthController.refreshToken(req, res));
    this.API.get(this.endpointPrefix + '/token-check', this.AuthorizationMiddleware.check(), (req, res) => this.AuthController.tokenCheck(req, res));
  }
}

export default Authentication;