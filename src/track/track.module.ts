import { Module, forwardRef } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { AlbumModule } from '../album/album.module';
import { TrackController } from './track.controller';
import { AlbumEntity } from 'src/album/album.entity';

@Module({
  providers: [TrackService],
  imports: [
    TypeOrmModule.forFeature([TrackEntity, AlbumEntity]),
    forwardRef(() => AlbumModule),
  ],
  controllers: [TrackController],
})
export class TrackModule {}
