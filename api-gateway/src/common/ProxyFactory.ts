import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export class ProxyFactory {
  static getProxyInstance() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:LHXJ315UHXYZ@54.146.70.104/smartranking'],
        queue: 'admin-backend',
      },
    });
  }
}
