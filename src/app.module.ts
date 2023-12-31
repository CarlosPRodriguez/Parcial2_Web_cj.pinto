import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TrackModule } from './track/track.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from './album/album.module';
import { PerformerModule } from './performer/performer.module';
import { AlbumEntity } from './album/album.entity';
import { TrackEntity } from './track/track.entity';
import { PerformerEntity } from './performer/performer.entity';
import { AlbumPerformerModule } from './album-performer/album-performer.module';

@Module({
  imports: [
    AlbumModule,
    TrackModule,
    PerformerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '201616667',
      database: 'postgres',
      entities: [
        AlbumEntity,
        TrackEntity,
        PerformerEntity,
        //TODO Agregar Entities
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AlbumPerformerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
