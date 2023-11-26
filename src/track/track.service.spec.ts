/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from 'src/album/album.entity';

describe('Service: Track', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let trackList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    trackList = [];
    for (let i = 0; i < 3; i++) {
      const track: TrackEntity = await repository.save({
        nombre : faker.person.fullName(),
        duracion: faker.number.int(),
      });

      trackList.push(track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Prueba findall
  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(trackList.length);
  });
  //Prueba findone
  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity= trackList[0];
    const track: TrackEntity = await service.findOne(
      storedTrack.id,
    );
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre);
    expect(track.duracion).toEqual(storedTrack.duracion);
    expect(track.album.id).toEqual(storedTrack.album.id);
  });

  it('findOne should throw an exception for an invalid track', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The track with the given id was not found',
    );
  });
  //Prueba create
  it('create should return a new track', async () => {
    const newAlbum: AlbumEntity = {
      id: faker.string.uuid(),
      nombre: faker.company.name(),
      caratula: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      tracks: [],  
      performers:[],
    }
    const track: TrackEntity = {
      id: '',
      nombre: faker.person.fullName(),
      duracion: faker.number.int(),
      album: newAlbum ,
    };

    const newTrack: TrackEntity = await service.create(newAlbum.id, track);
    expect(newTrack).not.toBeNull();

    const storedTrack: TrackEntity = await repository.findOne({
      where: { id: newTrack.id },
    });
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.nombre).toEqual(newTrack.nombre);
    expect(storedTrack.duracion).toEqual(newTrack.duracion);
    expect(storedTrack.album.id).toEqual(newTrack.album.id);
  });
});
