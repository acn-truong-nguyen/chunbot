import express from 'express';
import { healthCheck } from '../controllers/main-controller';
import { echoMessage, incomingJenkins } from '../controllers/incoming-message-controller';

const router = express.Router();

router.get('/health', healthCheck);
router.post('/echo', echoMessage);
router.post('/jenkins', incomingJenkins);

export let getRouter = () => {
  return router;
};
