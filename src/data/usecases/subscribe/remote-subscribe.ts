import { HttpPostClient } from '../../protocols/http/http-post-client'
import { SubscribeParams, Subscribe } from '../../../domain/usecases/subscribe'
import { HttpStatusCode } from '../../protocols/http/http-response'
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials-error'
import { UnexpectedError } from '../../../domain/errors/unexpected-error'
import { SubscriberModel } from '../../../domain/models/subscriber-model'

/* eslint-disable prettier/prettier */
export class RemoteSubscribe implements Subscribe {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<SubscribeParams, SubscriberModel>,
  ) { }

  async subscribe(params: SubscribeParams): Promise<SubscriberModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: throw new UnexpectedError()
    }
  }
}
