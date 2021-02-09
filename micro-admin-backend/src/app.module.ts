import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category/interfaces/category.schema';
import { PlayerSchema } from './player/interfaces/player.schema';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:rWN9pMFmjPBhdYJP@cluster0-shard-00-00.e6pt3.mongodb.net:27017,cluster0-shard-00-01.e6pt3.mongodb.net:27017,cluster0-shard-00-02.e6pt3.mongodb.net:27017/sradmbackend?ssl=true&replicaSet=atlas-zmisih-shard-0&authSource=admin&retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    CategoryModule,
    PlayerModule,
  ],
})
export class AppModule {}
