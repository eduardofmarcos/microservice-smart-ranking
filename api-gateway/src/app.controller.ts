import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/CreateCategory.dto';

@Controller('/api/v1/')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:LHXJ315UHXYZ@54.146.70.104/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    this.clientAdminBackend.emit('create-category', createCategoryDTO);
  }

  @Get('categories')
  getCategories() : Observable<any> {
    return this.clientAdminBackend.send('get-categories','');
  }

  @Get('categories/:_id')
  getACategory(@Param('_id') _id: string) : Observable<any> {
    return this.clientAdminBackend.send('get-category', _id);
  }
}
