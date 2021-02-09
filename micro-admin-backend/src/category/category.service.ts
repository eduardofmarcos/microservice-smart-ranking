import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './../category/interfaces/category.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  private logger = new Logger(CategoryService.name);

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

  async updateACategory(data: any): Promise<void> {
    const _id = data._id;
    const category: Category = data.category;
    try {
      await this.categoryModel.findByIdAndUpdate(
        { _id: _id },
        {
          $set: category,
        },
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteACategory(_id: string): Promise<void> {
    await this.categoryModel.findOneAndDelete({ _id });
  }
}
