import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../../album/album.entity';
import { AeropuertoEntity } from '../../track/track.entity';

//TODO: Add more entities here, fix paths

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [AerolineaEntity, AeropuertoEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity]),
];
