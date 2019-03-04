import crypto from 'crypto';
import { NextFunction, Response, Request } from 'express';

export abstract class APIAuth {
  static handleEvent(req: Request, res: Response, next: NextFunction): void {}
}

export class MSTeamsOutgoingHmacAuth extends APIAuth {
  static handleEvent = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    const bufSecret = new Buffer(process.env.MSTEAMS_OUTGOING_WEBHOOK_SECRET, 'base64');
    const msgHash = `HMAC ${crypto.createHmac('sha256', bufSecret)
                                .update(req.body.toString())
                                .digest('base64')}`;
    if (msgHash === auth) {
      return next();
    }
    return res.status(403)
    .send('{ "type": "message", "text": "Error: message sender cannot be authenticated." }');
  }
}

export class JenkinsIncomingHmacAuth extends APIAuth {
  static handleEvent = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    const apiKey = process.env.JENKINS_BOT_INCOMING_API_KEY;

    if (apiKey === auth) {
      return next();
    }
    return res.status(403)
    .send('{ "type": "message", "text": "Error: message sender cannot be authenticated." }');
  }
}
