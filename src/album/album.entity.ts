import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  caratula: string;

  @Column()
  fechaLanzamiento: Date;

  @Column()
  descripcion: string;

  //OneToMany con TrackEntity
  @OneToMany((type) => TrackEntity, (track) => track.album)
  //@JoinTable()
  tracks: TrackEntity[];

  //ManyToMany
  @ManyToMany((type) => PerformerEntity, (performer) => performer.albums)
  @JoinTable()
  performers: PerformerEntity[];
}
