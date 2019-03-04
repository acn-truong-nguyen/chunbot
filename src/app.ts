import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { getRouter } from './routers/main-router';
import { ewLogger } from './common/logger';
class App {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app
      .use(helmet())
      .use(ewLogger)
      .use('/', getRouter());
  }

}

export default new App().app;
