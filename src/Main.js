import sendLogs from './helpers/Logger.helper.js';

import MiddlewareHandler from './middlewares/Handler.middleware.js';
import RouteHandler from './routes/Handler.route.js';
import ModelHandler from "./models/Handler.model.js";
import logError from "./helpers/LogToFile.helper.js";


// Library
import * as dotenv from 'dotenv';
import os from 'os';
import cluster from 'cluster';
import FS from 'fs-extra';
import Express from 'express';
import UserModel from "./models/User.model.js";
import EmployeeModel from "./models/Employee.model.js";
import TimeEntryModel from "./models/TimeEntry.model.js";

class Server {
  constructor() {
    // Logger
    this.sendLogs = sendLogs;
    this.ErrorLog = logError;

    // File System
    this.FS = FS;

    // .env config
    dotenv.config();
    this.env = process.env;

    // Total Server CPUs
    const numCPUs = os.cpus().length;

    // Root directory
    this.root = process.cwd();


    if(this.env.MULTI_THREAD === 'true') {
      this.multiThreads(numCPUs);
    } else {
      this.sendLogs('Total CPUs: ' + numCPUs);
      this.sendLogs('Starting Server with 1 thread...');

      this.init();
    }
  }
  
  async init() {
    // Initiate Server Data
    const serverDataPath = '/server_data';
    const resourceFolder = '/src/resources';
    const storageData = '/storage';
    const imageData = '/storage/image'
    const logDir = '/server_data/log'
    if (!FS.existsSync(this.root + serverDataPath)) {
      this.sendLogs('Initiate Server Data...');
      this.FS.mkdirSync(this.root + serverDataPath);
      this.FS.copySync(this.root + resourceFolder, process.cwd() + serverDataPath);
    }
    if (!FS.existsSync(this.root + storageData)) {
      this.sendLogs('Initiate Storage Data...');
      this.FS.mkdirSync(this.root + storageData);
    }
    if (!FS.existsSync(this.root + imageData)) {
      this.sendLogs('Initiate Storage Image Data...');
      this.FS.mkdirSync(this.root + imageData);
    }
    if (!FS.existsSync(this.root + logDir)) {
      this.sendLogs('Initiate Log File Data...');
      this.FS.mkdirSync(this.root + logDir);
    }

    this.model = new ModelHandler(this);
    const isModelConnected = await this.model.connect();
    if (isModelConnected === -1) return;

    this.UserModel = new UserModel().table;
    this.EmployeeModel = new EmployeeModel().table;
    this.TimeEntryModel = new TimeEntryModel().table;

    this.run();
  }

  run() {
    this.API = Express();
    const middlewareHandler = new MiddlewareHandler(this);

    middlewareHandler.global();
    new RouteHandler(this);
    middlewareHandler.missingRoute();
    

    this.API.listen(this.env.PORT, this.env.IP, () => this.sendLogs('Server Started, Listening PORT ' + this.env.PORT));
  }

  multiThreads(numCPUs) { 
    if(cluster.isPrimary) {
      this.sendLogs('Total CPUs ' + numCPUs);
      this.sendLogs('Starting Server with ' + numCPUs + ' threads...');

      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // This event is first when worker died
      cluster.on('exit', (worker, code, signal) => {
        this.sendLogs(`worker ${worker.process.pid} died`);
      });
    } else {
      this.init();
    }
  }
}

new Server();