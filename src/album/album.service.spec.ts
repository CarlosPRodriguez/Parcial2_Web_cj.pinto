/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/

import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from '../track/track.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Service: Album', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let albumList: AlbumEntity[];
  //let deleteSpy: { calledWithId: string | null };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();
    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();

   
  });

  const seedDatabase = async () => {

    repository.clear();

    const trackTest = new TrackEntity();
    trackTest.id = faker.string.uuid();
    trackTest.nombre = faker.location.city();
    trackTest.duracion = faker.number.int();
    
    const performerTest = new PerformerEntity();
    performerTest.id = faker.string.uuid();
    performerTest.nombre = faker.location.city();
    performerTest.imagen = faker.image.url();
    performerTest.descripcion= faker.lorem.sentence();


    albumList = Array.from({ length: 5 }).map(() => ({
      id: faker.string.uuid(),
      nombre: faker.company.name(),
      caratula: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      tracks: [trackTest], // Incluye el tracks 
      performers:[performerTest],
    }));

    
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //PRUEBA CON FINDALL
  it('findAll should return all albums', async () => {
    const result = await service.findAll();
    expect(result).toEqual(albumList);
  });

  //PRUEBA CON FINDONE
  it('findOne should return an album by ID', async () => {
    const album = albumList[0];
    const result = await service.findOne(album.id);
    expect(result).toEqual(album);
  });

  it('findOne should return an NotFoundException if not found album', async () => {
    const AlbumFalso = faker.string.uuid();
    await expect(service.findOne(AlbumFalso)).rejects.toThrow(NotFoundException);
  });

  //PRUEBA CON EL METODO CREATE 
  it('Error con descipcion vacia', async () => {
    const nuevo = {
      id: faker.string.uuid(),
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: '',
      performers: [],
      tracks: [],
    };
    await expect(service.create(nuevo)).rejects.toThrow(BadRequestException);
  });  

  it('album should be created correctly', async () => {
    const crearAlbum = {
      id: faker.string.uuid(),
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      performers: [],
      tracks: [],
    };

    const savedAlbum = await service.create(crearAlbum);
    expect(savedAlbum).toBeDefined();
    expect(savedAlbum.nombre).toEqual(crearAlbum.nombre);
    expect(savedAlbum.descripcion).toEqual(crearAlbum.descripcion);
  });

  //Prueba de metodo delete 


});
