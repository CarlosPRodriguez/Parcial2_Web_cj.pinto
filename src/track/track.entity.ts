import { AlbumEntity } from '../album/album.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  duracion: number;

  //ManyToOne con Albumentity
  @ManyToOne((type) => AlbumEntity, (album) => album.tracks)
  @JoinTable()
  album: AlbumEntity[];
}
