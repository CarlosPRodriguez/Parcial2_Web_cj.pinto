/* eslint-disable prettier/prettier */
/* archivo ../shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../../album/album.entity';
import { PerformerEntity } from '../../performer/performer.entity';
import { TrackEntity } from '../../track/track.entity';

//TODO: Add more entities here, fix paths

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [AlbumEntity, TrackEntity, PerformerEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([AlbumEntity, TrackEntity, PerformerEntity]),
];
/* archivo ../shared/testing-utils/typeorm-testing-config.ts*/