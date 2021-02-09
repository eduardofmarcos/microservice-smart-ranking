import {
  Body,
  Put,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/CreateCategory.dto';
import { UpdateCategoryDTO } from './dtos/UpdateCateogory.dto';
import { ProxyFactory } from './../common/ProxyFactory';

@Controller('/api/v1/')
export class CategoryController {
  private logger = new Logger(CategoryController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ProxyFactory.getProxyInstance();
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    this.clientAdminBackend.emit('create-category', createCategoryDTO);
  }

  @Get('categories')
  getCategories(): Observable<any> {
    return this.clientAdminBackend.send('get-categories', '');
  }

  @Get('categories/:_id')
  getACategory(@Param('_id') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-category', _id);
  }

  @Put('categories/:_id')
  @UsePipes(ValidationPipe)
  updateACategory(
    @Param('_id') _id: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Observable<any> {
    return this.clientAdminBackend.emit('update-category', {
      _id: _id,
      category: updateCategoryDTO,
    });
  }

  @Delete('categories/:_id')
  deleteACategory(@Param('_id') _id: string): Observable<any> {
    return this.clientAdminBackend.emit('delete-category', _id);
  }
}
