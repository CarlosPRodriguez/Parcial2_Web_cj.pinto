import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Injectable,
  //NotFoundException,
} from '@nestjs/common';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackDto } from './track.dto';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/bussines-errors';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>, // Inyectar el repositorio de Album
  ) {}

  async findAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find({ relations: ['album'] });
  }

  async findOne(id: string): Promise<TrackEntity> {
    const track: TrackEntity = await this.trackRepository.findOne({
      where: { id },
      relations: ['album'],
    });
    if (!track)
      throw new BusinessLogicException(
        'The track with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return track;
  }

  async create(albumId: string, trackDto: TrackDto): Promise<TrackEntity> {
    if (trackDto.duracion < 0)
      throw new BusinessLogicException(
        'La duración debe ser positivo.',
        BusinessError.BAD_REQUEST,
      );

    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['tracks'],
    });
    if (!album)
      throw new BusinessLogicException(
        'No se debe  crear el track si el album no existe',
        BusinessError.NOT_FOUND,
      );

    const track = new TrackEntity();
    track.album = album;
    Object.assign(track, trackDto);
    //album.tracks = [...album.tracks, track];
    //await this.albumRepository.save(album);
    return await this.trackRepository.save(track);
  }
}
