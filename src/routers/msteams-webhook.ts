import { NextFunction, Response, Request, Router } from 'express';
import crypto from 'crypto';
import bodyParser = require('body-parser');
import { buildJenkins } from '../controllers/incoming-message-controller';
import { logger } from '../common/logger';

export const msTeamsWebhookRoutes = Router()
  .use(bodyParser.raw({type: '*/*'}))
  .post('/buildJenkins',
        eventParser(process.env.MSTEAMS_OUTGOING_WEBHOOK_SECRET),
        buildJenkins);

function eventParser(secret: any) {
  const hmacSecret = secret;
  function hmacAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    logger.info(hmacSecret);
    logger.warn(process.env.MSTEAMS_OUTGOING_WEBHOOK_SECRET);
    const bufSecret = new Buffer(process.env.MSTEAMS_OUTGOING_WEBHOOK_SECRET, 'base64');
    const msgHash = `HMAC${crypto.createHmac('sha256', bufSecret)
                                 .update(req.body.toString())
                                 .digest('base64')}`;
    if (msgHash === auth) {
      return next();
    }
    return res.status(403)
    .send('{ "type": "message", "text": "Error: message sender cannot be authenticated." }');
  }
  return hmacAuth;
}
