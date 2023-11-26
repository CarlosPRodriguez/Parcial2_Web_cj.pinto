import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  //NotFoundException,
} from '@nestjs/common';
import { TrackEntity } from './track.entity';
//import { AlbumEntity } from '../album/album.entity';
import { TrackDto } from './track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
    //@InjectRepository(AlbumEntity)
    //private albumRepository: Repository<AlbumEntity>, // Inyectar el repositorio de Album
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
    if (trackDto.duracion <= 0) {
      throw new BadRequestException('La duración debe ser positivo.');
    }
    const prueba = await this.trackRepository.findOne({
      where: { id: trackDto.id },
      relations: ['album'],
    });
    if (prueba.album.id === albumId) {
      throw new BadRequestException(
        'No se debe eliminar el album si tiene asociados',
      );
    }
    const track = new TrackEntity();
    track.album.id = albumId;
    Object.assign(track, trackDto);
    return await this.trackRepository.save(track);
  }
}
