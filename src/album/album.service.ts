import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from 'src/track/track.entity';
import { PerformerEntity } from 'src/performer/performer.entity';
import { AlbumDto } from './album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>, // Inyectar el repositorio de Track
    @InjectRepository(PerformerEntity)
    private perfomerRepository: Repository<PerformerEntity>, // Inyectar el repositorio de Performer
  ) {}

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find({
      relations: ['tracks', 'perfomers'],
    });
  }

  async findOne(id: string): Promise<AlbumEntity> {
    return await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
  }

  async create(albumDto: AlbumDto): Promise<AlbumEntity> {
    if (new String(albumDto.nombre) == ' ') {
      throw new BadRequestException(' El nombre esta vacio.');
    }
    if (new String(albumDto.descipcion) == ' ') {
      throw new BadRequestException(' La descripcion esta vacio.');
    }

    const album = new AlbumEntity();
    Object.assign(album, albumDto);
    return await this.albumRepository.save(album);
  }

  async delete(id: string): Promise<void> {
    await this.albumRepository.delete(id);
  }

  //Asociacion

  async addAlbumToPerfomer(
    albumId: string,
    perfomerId: string,
  ): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['performers'],
    });
    if (!album) throw new NotFoundException('Album no encontrada.');

    const perfomer = await this.perfomerRepository.findOne({
      where: { id: perfomerId },
    });
    if (!perfomer) throw new NotFoundException('Performer no encontrado.');

    album.performers.push(perfomer);
    return this.albumRepository.save(album);
  }
}
