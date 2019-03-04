import express from 'express';
import { healthCheck } from '../controllers/main-controller';
import { incomingJenkins, buildJenkins } from '../controllers/incoming-message-controller';
import bodyParser from 'body-parser';
import { MSTeamsOutgoingHmacAuth, JenkinsIncomingHmacAuth } from '../common/hmac';

const router = express.Router();

router.post('/msteams',
            bodyParser.raw({type: '*/*'}),
            MSTeamsOutgoingHmacAuth.handleEvent,
            buildJenkins);

router.use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: false }))
      .get('/health', healthCheck)
      .post('/jenkins',
            JenkinsIncomingHmacAuth.handleEvent,
            incomingJenkins);

export let getRouter = () => {
  return router;
};
