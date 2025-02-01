import ResponsePreset from '../helpers/ResponsePreset.helper.js';

// Library
import JWT from "jsonwebtoken";

class Authorization {
  constructor(server) {
    this.server = server;
    this.ResponsePreset = new ResponsePreset();
  }

  check() {
    return (req, res, next) => {
      req.middlewares.authorization = {};
      const token = req.headers['authorization'];
      
      if(!token || token === 'undefined') {
        return res.status(401).json(this.ResponsePreset.resErr(
          401,
          'Request Unauthorized',
          'token',
          { code: -1 }
        ));
      }
      
      JWT.verify(token, this.server.env.JWT_TOKEN_SECRET, (err, data) => {
        if(err) {
          if(!err.name === 'TokenExpiredError') return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Unauthorized',
            'token',
            { code: -2 }
          ));
          
          if(!req.path.endsWith('refresh-token')) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Expired',
            'token',
            { code: -3 }
          ));
          
          data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        }
        req.middlewares.authorization = data;

        return next();
      });
    }
  }
}

export default Authorization;