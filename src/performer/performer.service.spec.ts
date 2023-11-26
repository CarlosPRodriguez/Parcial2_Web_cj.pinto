/* eslint-disable prettier/prettier */
/* archivo ../shared/testing-utils/typeorm-testing-config.ts*/
import { Repository } from 'typeorm';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('Service: Performer', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];
    for (let i = 0; i < 3; i++) {
      const performer: PerformerEntity = await repository.save({
        nombre: faker.person.fullName(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence(),
      });

      performerList.push(performer);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  //Pruerba findall
  it('findAll should return all museums', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performerList.length);
  });
  //Prueba findone
  it('findOne should return a museum by id', async () => {
    const storedPerformer: PerformerEntity = performerList[0];
    const performer: PerformerEntity = await service.findOne(
      storedPerformer.id,
    );
    expect(performer).not.toBeNull();
    expect(performer.nombre).toEqual(storedPerformer.nombre);
    expect(performer.descripcion).toEqual(storedPerformer.descripcion);
    expect(performer.imagen).toEqual(storedPerformer.imagen);
  });

  it('findOne should throw an exception for an invalid museum', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });
  //Prueba create
  it('create should return a new performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.person.fullName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      albums: []
    }

    const newPerfomer: PerformerEntity = await service.create(performer);
    expect(newPerfomer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({where: {id: newPerfomer.id}})
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.nombre).toEqual(newPerfomer.nombre)
    expect(storedPerformer.descripcion).toEqual(newPerfomer.descripcion)
    expect(storedPerformer.imagen).toEqual(newPerfomer.imagen)
  });
});
