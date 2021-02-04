import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import {ClientProxy, ClientProxyFactory, Transport} from '@nestjs/microservices'
import { CreateCategoryDTO } from './dtos/CreateCategory.dto';

@Controller('/api/v1')
export class AppController {
  private logger = new Logger(AppController.name)

  private clientAdminBackend: ClientProxy

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options:{
        urls:['amqp://user:LHXJ315UHXYZ@54.146.70.104/smartranking'],
        queue:'admin-backend'
      }
    })
  }

 @Post('categories')
 @UsePipes(ValidationPipe)
 async createCategory(@Body() createCategoryDTO: CreateCategoryDTO){
   return await this.clientAdminBackend.emit('create-category',createCategoryDTO)
 }

}
