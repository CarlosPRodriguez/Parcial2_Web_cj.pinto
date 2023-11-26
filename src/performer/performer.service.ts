import {
  BadRequestException,
  Injectable,
  //NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformerEntity } from './performer.entity';
import { Repository } from 'typeorm';
import { PerformerDto } from './performer.dto';

@Injectable()
export class PerformerService {
  constructor(
    @InjectRepository(PerformerEntity)
    private perfomerRepository: Repository<PerformerEntity>,
  ) {}

  async findAll(): Promise<PerformerEntity[]> {
    return await this.perfomerRepository.find({ relations: ['albums'] });
  }

  async findOne(id: string): Promise<PerformerEntity> {
    return await this.perfomerRepository.findOne({
      where: { id },
      relations: ['albums'],
    });
  }

  async create(perfomerDto: PerformerDto): Promise<PerformerEntity> {
    if (perfomerDto.descripcion.length > 100) {
      throw new BadRequestException(
        'La descripción debe ser menor a 100 caracteres.',
      );
    }

    const perfomer = new PerformerEntity();
    Object.assign(perfomer, perfomerDto);
    return await this.perfomerRepository.save(perfomer);
  }

  // relacion asociacion
  // async addPerformerToAlbum(
  //   albumId: string,
  //   perfomerId: string,
  // ): Promise<PerformerEntity> {
  //   const performer = await this.perfomerRepository.findOne({
  //     where: { id: perfomerId },
  //     relations: ['albums'],
  //   });
  //   if (!performer) throw new NotFoundException('Performer no encontrado.');

  //   const album = await this.albumRepository.findOne({
  //     where: { id: albumId },
  //   });
  //   if (!album) throw new NotFoundException('Album no encontrado.');

  //   performer.albums.push(album);
  //   return this.perfomerRepository.save(performer);
  // }
}
