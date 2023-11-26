import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
//import { TrackEntity } from '../track/track.entity';
//import { PerformerEntity } from '../performer/performer.entity';
import { AlbumDto } from './album.dto';

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
    if (new String(albumDto.nombre).length == 0) {
      throw new BadRequestException(' El nombre esta vacio.');
    }
    if (new String(albumDto.descripcion).length == 0) {
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
    if (prueba.tracks.length > 0) {
      throw new BadRequestException(
        'No se debe eliminar el album si tiene asociados',
      );
    }
    // Si llega el caso que no encuentra el album con el id proporcionado
    if (!prueba) {
      throw new NotFoundException('No existe album con el id proporcionado');
    }

    await this.albumRepository.delete(id);
  }

  //Asociacion

  // async addAlbumToPerfomer(
  //   albumId: string,
  //   perfomerId: string,
  // ): Promise<AlbumEntity> {
  //   const album = await this.albumRepository.findOne({
  //     where: { id: albumId },
  //     relations: ['performers'],
  //   });
  //   if (!album) throw new NotFoundException('Album no encontrada.');

  //   const perfomer = await this.perfomerRepository.findOne({
  //     where: { id: perfomerId },
  //   });
  //   if (!perfomer) throw new NotFoundException('Performer no encontrado.');
  //   // Performer no debe tener mas de 3 segun en el enunciado del parcial
  //   if (album.performers.length >= 3) {
  //     throw new BadRequestException(
  //       'El album tiene mas de tres performers asociados.',
  //     );
  //   }
  //   album.performers.push(perfomer);
  //   return this.albumRepository.save(album);
  // }
}
