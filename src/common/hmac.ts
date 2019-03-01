import crypto from 'crypto';
import { logger } from './logger';
import { IncomingMessage, ServerResponse } from 'http';

export abstract class Hmac {
  public static handle(req: IncomingMessage, res: ServerResponse, buf: Buffer, encoding: string) {
    const auth = req.headers.authorization;
    const bufSecret = new Buffer(process.env.MSTEAMS_OUTGOING_WEBHOOK_SECRET, 'base64');
    const msgHash = `HMAC${crypto.createHmac('sha256', bufSecret)
                                 .update(buf)
                                 .digest('base64')}`;
    if (msgHash === auth) {
      return;
    }
    throw new Error();
  }
}
