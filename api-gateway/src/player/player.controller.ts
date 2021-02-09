import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  ValidationPipe,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { ProxyFactory } from './../common/ProxyFactory';

@Controller('/api/v1/')
export class PlayerController {
  private logger = new Logger(PlayerController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ProxyFactory.getProxyInstance();
  }

  @Get('players')
  getPlayers(): Observable<any> {
    return this.clientAdminBackend.send('get-players', '');
  }

  @Get('players/:_id')
  getAPlayer(@Param('_id') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-player', _id);
  }

  @Post('players')
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    const isCategoryExists = await this.clientAdminBackend
      .send('get-category', createPlayerDTO.category_id)
      .toPromise();

    if (!isCategoryExists) {
      throw new BadRequestException('this category does not exist');
    }
    console.log('registrado');
  }

  @Put('players/_id')
  @UsePipes(ValidationPipe)
  updateAPlayer(
    @Param('_id') _id: string,
    @Body() updatePlayerDTO: UpdatePlayerDTO,
  ) {
    return this.clientAdminBackend.emit('update-player', {
      _id: _id,
      player: updatePlayerDTO,
    });
  }

  @Delete('/players/:_id')
  deleteAPlayer(@Param('_id') _id: string) {
    return this.clientAdminBackend.emit('delete-player', _id);
  }
}
