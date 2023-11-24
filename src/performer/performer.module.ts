import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrackEntity } from "src/track/track.entity";

@Module({
  providers: [PerformerService],
  imports: [TypeOrmModule.forFeature([TrackEntity])],
})
export class PerformerModule {}
