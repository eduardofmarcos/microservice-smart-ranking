import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/categories/category.interface';
import { Player } from './interfaces/players/player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private logger = new Logger(AppService.name);

  //Create a Category
  async createCategory(category: Category): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(category);
      return await createdCategory.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getACategory(_id: string): Promise<Category> {
    try {
      return await this.categoryModel.findById({ _id: _id });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
