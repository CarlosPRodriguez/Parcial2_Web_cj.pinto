import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
//import { AlbumEntity } from 'src/album/album.entity';

export class TrackDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  @IsNumber()
  @IsNotEmpty()
  readonly duracion: number;
  // @IsString()
  // @IsNotEmpty()
  // readonly album: AlbumEntity;
}
