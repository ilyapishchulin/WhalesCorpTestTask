import { FastifyRequest, FastifyReply } from 'fastify';

export class ServerHandler<Params, Response> {
  public request: FastifyRequest;
  public reply: FastifyReply;

  constructor(request: FastifyRequest, reply: FastifyReply) {
    this.request = request;
    this.reply = reply;
  }

  public getParams(): Params {
    return this.request.params as Params;
  }

  public isValidParams(params: Params): boolean {
    return true;
  }

  initHandler(): Promise<Response> {
    if (!this.isValidParams(this.getParams())) {
      this.reply.status(400);
      return Promise.resolve({} as Response);
    }

    return this.handle();
  }

  public async handle(): Promise<Response> {
    this.reply.status(404);
    return Promise.resolve({} as Response);
  }
}
