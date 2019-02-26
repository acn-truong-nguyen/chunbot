import { Request, Response } from 'express';

export let echoMessage = (req: Request, res: Response) => {
  res.writeHead(200);
  console.log(req.body);
  const responseMsg = {
    type: 'message',
    textFormat: 'plain',
    text: `Hello, <at>${req.body.from.name}</at>`,
    conversation:
    { isGroup: true,
      id: '19:f4fe078740c240698b0c36b0ce2e8e4b@thread.skype;messageid=1551073705375',
      conversationType: 'channel',
    },
  };
  res.write(JSON.stringify(responseMsg));
  console.log(res);
  res.end();
};

export let incomingJenkins = (req: Request, res: Response) => {

}