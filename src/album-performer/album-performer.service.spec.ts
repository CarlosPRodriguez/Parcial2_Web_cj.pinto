/* tslint:disable:no-unused-variable */
/* archivo ../shared/testing-utils/typeorm-testing-config.ts*/
import { Repository } from 'typeorm';
import { AlbumPerformerService } from './album-performer.service';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('Service: AlbumPerformer', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    performerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performersList = [];
    for (let i = 0; i < 3; i++) {
      const performer: PerformerEntity = await performerRepository.save({
        nombre: faker.person.fullName(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence(),
      });
      performersList.push(performer);
    }

    album = await albumRepository.save({
      nombre: faker.person.firstName(),
      caratula: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      performers: performersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerAlbum should add an performer to a album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.fullName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence(),
    });

    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.person.firstName(),
      caratula: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
    });

    const result: AlbumEntity = await service.addPerformerAlbum(
      newAlbum.id,
      newPerformer.id,
    );

    expect(result.performers.length).toBe(1);
    expect(result.performers[0]).not.toBeNull();
    expect(result.performers[0].nombre).toBe(newPerformer.nombre);
    expect(result.performers[0].imagen).toBe(newPerformer.imagen);
    expect(result.performers[0].descripcion).toBe(newPerformer.descripcion);
  });

  it('addPerformerAlbum should thrown exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.person.firstName(),
      caratula: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addPerformerAlbum(newAlbum.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });

  it('addPerformerAlum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.fullName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addPerformerAlbum('0', newPerformer.id),
    ).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
  });
});
