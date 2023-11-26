import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
//import { TrackEntity } from '../track/track.entity';
//import { PerformerEntity } from '../performer/performer.entity';
import { AlbumDto } from './album.dto';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/bussines-errors';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    //@InjectRepository(TrackEntity)
    //private trackRepository: Repository<TrackEntity>, // Inyectar el repositorio de Track
    //@InjectRepository(PerformerEntity)
    //private perfomerRepository: Repository<PerformerEntity>, // Inyectar el repositorio de Performer
  ) {}

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find({
      relations: ['tracks', 'performers'],
    });
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return album;
  }

  async create(albumDto: AlbumDto): Promise<AlbumEntity> {
    if (new String(albumDto.nombre) === '') {
      throw new BadRequestException(' El nombre esta vacio.');
    }
    if (new String(albumDto.descripcion) === '') {
      throw new BadRequestException(' La descripcion esta vacio.');
    }

    const album = new AlbumEntity();
    Object.assign(album, albumDto);
    return await this.albumRepository.save(album);
  }

  async delete(id: string): Promise<void> {
    //No se debe eliminar si tiene asosciados
    const prueba = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks'],
    });
    // Si llega el caso que no encuentra el album con el id proporcionado

    if (!prueba) {
      throw new BusinessLogicException(
        'No existe album con el id proporcionado',
        BusinessError.NOT_FOUND,
      );
    }

    if (prueba.tracks.length > 0) {
      throw new BusinessLogicException(
        'No se debe eliminar el album si tiene asociados',
        BusinessError.BAD_REQUEST,
      );
    }

    await this.albumRepository.remove(prueba);
  }
}
