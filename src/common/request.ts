export interface IRequest extends Request {
  rawBody?: string;
}

export function getRawRequestBody(req: any, res: Response, buf: any, encoding: any) {
  req.rawBody = buf.toString();
  console.log('rawBody', req.rawBody);
}
