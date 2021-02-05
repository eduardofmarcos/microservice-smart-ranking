import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.logger.log(`category ${JSON.stringify(category)}`);

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      ackErrors.map(async ackError =>{
        if (error.message.includes(ackError)){
          await channel.ack(originalMessage)
        }
      })
    }
  }

  @MessagePattern('get-categories')
  async getCategories() {
    return await this.appService.getCategories();
  }

  @MessagePattern('get-category')
  async getACategory(@Payload() _id: string) {
    console.log(_id);
    return await this.appService.getACategory(_id);
  }
}
