import {
  Injectable,
  //NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformerEntity } from './performer.entity';
import { Repository } from 'typeorm';
import { PerformerDto } from './performer.dto';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/bussines-errors';

@Injectable()
export class PerformerService {
  constructor(
    @InjectRepository(PerformerEntity)
    private performerRepository: Repository<PerformerEntity>,
  ) {}

  async findAll(): Promise<PerformerEntity[]> {
    return await this.performerRepository.find({ relations: ['albums'] });
  }

  async findOne(id: string): Promise<PerformerEntity> {
    const performer: PerformerEntity = await this.performerRepository.findOne({
      where: { id },
      relations: ['albums'],
    });
    if (!performer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return performer;
  }

  async create(perfomerDto: PerformerDto): Promise<PerformerEntity> {
    if (perfomerDto.descripcion.length > 100)
      throw new BusinessLogicException(
        'La descripción debe ser menor  a 100 caracteres.',
        BusinessError.BAD_REQUEST,
      );

    const perfomer = new PerformerEntity();
    Object.assign(perfomer, perfomerDto);
    return await this.performerRepository.save(perfomer);
  }
}
