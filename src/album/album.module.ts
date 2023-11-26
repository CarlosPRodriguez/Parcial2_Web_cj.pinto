import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { Module, forwardRef } from '@nestjs/common';
import { PerformerModule } from '../performer/performer.module';
import { TrackModule } from '../track/track.module';

@Module({
  providers: [AlbumService],
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
    forwardRef(() => PerformerModule),
    forwardRef(() => TrackModule),
  ],
})
export class AlbumModule {}
