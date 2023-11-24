import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  //controllers: [AeropuertoController],
})
export class TrackModule {}
