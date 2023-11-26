import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { AlbumModule } from '../album/album.module';
import { PerformerController } from './performer.controller';

@Module({
  providers: [PerformerService],
  imports: [
    TypeOrmModule.forFeature([PerformerEntity]),
    forwardRef(() => AlbumModule),
  ],
  controllers: [PerformerController],
})
export class PerformerModule {}
