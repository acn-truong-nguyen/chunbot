import express from 'express';
import { getTestApi } from '../controllers/main-controller';
import { echoMessage } from '../controllers/incoming-message-controller';

const router = express.Router();

router.get('/test', getTestApi);
router.post('/echo', echoMessage);

export let getRouter = () => {
  return router;
};
