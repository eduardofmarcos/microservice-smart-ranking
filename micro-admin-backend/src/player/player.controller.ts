import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PlayerService } from './../player/player.service';

import { Player } from './interfaces/player.interface';

const ackErrors: string[] = ['E11000'];

@Controller('/api/v1/')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  private logger = new Logger(PlayerController.name);

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
    //   await this.playerService.createPlayer(player);
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
}
