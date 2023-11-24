/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/

import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from 'src/track/track.entity';
import { PerformerEntity } from 'src/performer/performer.entity';

describe('Service: Album', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let albumList: AlbumEntity[];
  let deleteSpy: { calledWithId: string | null };

  beforeEach(async () => {
    // Crear un aeropuerto de prueba
    const trackTest = new TrackEntity();
    trackTest.id = faker.datatype.uuid();
    trackTest.nombre = faker.address.cityName();
    trackTest.duracion = faker.number();
   
    albumList = Array.from({ length: 5 }).map(() => ({
      id: faker.datatype.uuid(),
      nombre: faker.company.name(),
      caratula: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamineto: faker.date.past(),
      tracks: [trackTest], // Incluye el tracks de prueba
    }));

    deleteSpy = { calledWithId: null };

    const mockAlbumRepository = {
      find: jest.fn().mockResolvedValue(albumList),
      findOne: jest.fn().mockImplementation((options) => {
        const id = options.where.id;
        return Promise.resolve(albumList.find(a => a.id === id));
      }),
      save: jest.fn().mockImplementation((alb) => Promise.resolve({ id: faker.datatype.uuid(), ...alb })),
      delete: jest.fn().mockImplementation((id: string) => {
        deleteSpy.calledWithId = id;
        return Promise.resolve({ affected: 1 });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        AlbumService,
        {
          provide: getRepositoryToken(AlbumEntity),
          useValue: mockAlbumRepository,
        },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all albums', async () => {
    const result = await service.findAll();
    expect(result).toEqual(albumList);
  });

  it('findOne should return an album by ID', async () => {
    const album = albumList[0];
    const result = await service.findOne(album.id);
    expect(result).toEqual(album);
  });
  
});
