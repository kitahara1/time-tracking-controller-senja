// Library
import JWT from 'jsonwebtoken';
import md5 from 'md5';
import { customAlphabet } from 'nanoid';
import UserRepository from "../../repository/User.repository.js";

class Auth {
  constructor(server) {
    this.server = server;
    this.UserRepository = new UserRepository(server);
  }

  generateToken(userId, notVerified) { 
    const idGen = customAlphabet('1234567890', 10);
    
    return JWT.sign(
      {
        tokenId: idGen(),
        userId,
        ...(notVerified === true ? { notVerified } : {})
      },
      this.server.env.JWT_TOKEN_SECRET,
      { expiresIn: this.server.env.JWT_TOKEN_EXPIRED }
    )
  }

  generateWithRefreshToken(userId) {
    const idGen = customAlphabet('1234567890', 10);
    const tokenId = idGen();
    const token = JWT.sign(
      {
        tokenId,
        userId
      },
      this.server.env.JWT_TOKEN_SECRET,
      { expiresIn: this.server.env.JWT_TOKEN_EXPIRED }
    );

    return {
      token,
      refreshToken: JWT.sign(
        {
          tokenId,
          userId,
          refreshToken: true
        },
        this.server.env.JWT_TOKEN_SECRET
      )
    }
  }

  // async register(name, password, username) {
  //   const userModelData = await this.UserModel.findOne({
  //     where: {
  //       name: name
  //     }
  //   });
  //
  //   if(userModelData !== null) return -1;
  //
  //   password = md5(password + '-' + this.server.env.HASH_SALT);
  //
  //   const transaction = await this.UserModel.sequelize.transaction();
  //   try {
  //     const resUserUpdateModel = await this.UserModel.create(
  //       {
  //         username: username,
  //         name: name,
  //         password: password,
  //       },
  //       {transaction}
  //     );
  //
  //     await transaction.commit();
  //     return resUserUpdateModel.uuid;
  //   } catch (e) {
  //     if (!transaction) await transaction.rollback();
  //     console.error(e);
  //     this.server.ErrorLog(e);
  //     return -2;
  //   }
  // }

  async login(username, password) {
    password = md5(password + '-' + this.server.env.HASH_SALT);
    console.log(password);
    const auth = await this.UserRepository.authenticateUser(username, password);

    if(auth === null) return -1;

    return this.generateWithRefreshToken(auth);
  }

  async refreshToken(dataToken, refreshToken) {
    return JWT.verify(refreshToken, this.server.env.JWT_TOKEN_SECRET, (err, data) => {
      if(err) {
        return -1;
      }
      if(data.tokenId !== dataToken.tokenId) return -2;
      if(data.userId !== dataToken.userId) return -3;

      return this.generateWithRefreshToken(dataToken.userId);
    });
  }

  async tokenCheck(userId) {
    try {
      const data = await this.UserRepository.getUserById(userId)
      if(data === null) return -1;

      return {
        ...data,
      };
    } catch (e) {
      console.error(e)
      this.server.ErrorLog(e);
      return -2
    }
  }
}

export default Auth;