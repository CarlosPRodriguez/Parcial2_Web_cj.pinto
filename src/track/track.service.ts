import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  //NotFoundException,
} from '@nestjs/common';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackDto } from './track.dto';

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
    return await this.trackRepository.findOne({
      where: { id },
      relations: ['album'],
    });
  }

  async create(albumId: string, trackDto: TrackDto): Promise<TrackEntity> {
    if (trackDto.duracion < 0) {
      throw new BadRequestException('La duración debe ser positivo.');
    }
    const album = await this.albumRepository.findOne({
      where: { id: trackDto.album.id },
      relations: ['album'],
    });
    if (!album) {
      throw new BadRequestException(
        'No se debe  crear el track si el album no existe',
      );
    }
    const track = new TrackEntity();
    track.album.id = albumId;
    Object.assign(track, trackDto);
    return await this.trackRepository.save(track);
  }
}
