import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CategoryService } from './../category/category.service';
import { Category } from './../category/interfaces/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  logger = new Logger(CategoryController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.logger.log(`category ${JSON.stringify(category)}`);

    try {
      await this.categoryService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      ackErrors.filter(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }

  @EventPattern('update-category')
  async updateACategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.categoryService.updateACategory(data);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      ackErrors.filter(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Ctx() context) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      return await this.categoryService.getCategories();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('get-category')
  async getACategory(@Payload() _id: string, @Ctx() context) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      return await this.categoryService.getACategory(_id);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('delete-category')
  async deleteACategory(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    // console.log(channel)
    // console.log(originalMessage)
    // console.log(data.updateCategoryDTO.description)
    try {
      await this.categoryService.deleteACategory(_id);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      ackErrors.filter(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }
}
