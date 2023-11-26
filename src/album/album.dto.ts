import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AlbumDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly caratula: string;

  @IsDate()
  @IsNotEmpty()
  readonly fechaLanzamiento: Date;

  @IsString()
  readonly descripcion: string;
}
