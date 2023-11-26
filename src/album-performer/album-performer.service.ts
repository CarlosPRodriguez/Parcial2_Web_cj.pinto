import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/bussines-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumPerformerService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,

    @InjectRepository(PerformerEntity)
    private readonly performerRepository: Repository<PerformerEntity>,
  ) {}

  async addPerformerAlbum(
    albumId: string,
    performerId: string,
  ): Promise<AlbumEntity> {
    const performer: PerformerEntity = await this.performerRepository.findOne({
      where: { id: performerId },
    });

    if (!performer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['performers', 'tracks'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (album.performers.length > 3)
      throw new BusinessLogicException(
        'El album no puede tener mas de 3 performers asociados',
        BusinessError.BAD_REQUEST,
      );
    album.performers = [...album.performers, performer];
    return await this.albumRepository.save(album);
  }

  async findPerformerByAlbumIdPerformerId(
    albumId: string,
    performerId: string,
  ): Promise<PerformerEntity> {
    const performer: PerformerEntity = await this.performerRepository.findOne({
      where: { id: performerId },
    });
    if (!performer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const albumPerformer: PerformerEntity = album.performers.find(
      (e) => e.id === performer.id,
    );

    if (!albumPerformer)
      throw new BusinessLogicException(
        'The performer with the given id is not associated to the album',
        BusinessError.PRECONDITION_FAILED,
      );

    return albumPerformer;
  }

  async findPerformersByAlbumId(albumId: string): Promise<PerformerEntity[]> {
    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (album.performers.length > 3)
      throw new BusinessLogicException(
        'El album no puede tener mas de 3 performers asociados',
        BusinessError.BAD_REQUEST,
      );
    return album.performers;
  }
}
