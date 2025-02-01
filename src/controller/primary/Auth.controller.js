import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import AuthValidator from '../../validators/primary/Auth.validator.js';
import AuthService from '../../services/primary/Auth.service.js';

// Library
import Ajv from 'ajv';

class Auth {
  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.DataScheme = new AuthValidator();
    this.AuthService = new AuthService(this.server);
  }

  async register(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.register);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const { name, username, password} = req.body;
    const resRegister = await this.AuthService.register(name, password, username);

    if(resRegister === -1) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, User has been registered',
      'service',
      { code: -1 }
    ));

    if (resRegister === -2) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Internal Server Error',
      'service',
      {code: -2}
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', {user_id: resRegister}));
  }

  async login(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.login);
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const { username, password } = req.body;
    const resLogin = await this.AuthService.login(username, password);

    if(resLogin === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Username or Password is wrong',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', resLogin))
  }

  async refreshToken(req, res) {
    const tokenData = req.middlewares.authorization;
    const { refreshToken } = req.query;
    const getRefreshTokenSrv = await this.AuthService.refreshToken(tokenData, refreshToken);

    if(getRefreshTokenSrv === -1) return res.status(401).json(this.ResponsePreset.resErr(
      401,
      'Refresh Token Unauthorized',
      'service',
      { code: -1 }
    ));

    if(getRefreshTokenSrv === -2) return res.status(401).json(this.ResponsePreset.resErr(
      401,
      'Refresh Token Id Not Same',
      'service',
      { code: -2 }
    ));

    if(getRefreshTokenSrv === -3) return res.status(401).json(this.ResponsePreset.resErr(
      401,
      'Refresh Token User Id Not Same',
      'service',
      { code: -3 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', getRefreshTokenSrv));
  }

  async tokenCheck(req, res) {
    const getTokenCheckSrv = await this.AuthService.tokenCheck(req.middlewares.authorization.userId);

    if(getTokenCheckSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, User Id Not Found',
      'service',
      { code: -1 }
    ));
    if(getTokenCheckSrv === -2) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Internal Server Error',
      'service',
      { code: -2 }
    ));
    return res.status(200).json(this.ResponsePreset.resOK('OK', getTokenCheckSrv));
  }
}

export default Auth;