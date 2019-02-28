import { Request, Response } from 'express';
import crypto from 'crypto';

// const bufSecret = new Buffer(process.env.MSTEAMS_WEBHOOK_SECRET, 'base64');
export let healthCheck = (req: Request, res: Response) => {
  res.status(200)
    .send({
      message: 'GET request successful!!',
    });
};
