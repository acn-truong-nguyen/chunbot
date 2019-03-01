import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { getRouter } from './routers/main-router';
import { ewLogger } from './common/logger';
import { msTeamsWebhookRoutes } from './routers/msteams-webhook';
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
      .use('/msteams-webhook', msTeamsWebhookRoutes);
        // support application/json type post data
    this.app.use(bodyParser.json());
        // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
        // Routing
    this.app.use('/', getRouter());
  }

}

export default new App().app;
