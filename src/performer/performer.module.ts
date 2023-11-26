import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { AlbumModule } from '../album/album.module';

@Module({
  providers: [PerformerService],
  imports: [
    TypeOrmModule.forFeature([PerformerEntity]),
    forwardRef(() => AlbumModule),
  ],
})
export class PerformerModule {}
