/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussines-errors.interceptor';
import { AlbumService } from './album.service';
import { AlbumDto } from './album.dto';
import { AlbumEntity } from './album.entity';
import { plainToInstance } from 'class-transformer';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':albumId')
  async findOne(@Param('albumId') albumId: string) {
    return await this.albumService.findOne(albumId);
  }

  @Post()
  async create(@Body() albumDto: AlbumDto) {
    const album: AlbumEntity = plainToInstance(AlbumEntity, albumDto);
    return await this.albumService.create(album);
  }


  @Delete(':albumId')
  @HttpCode(204)
  async delete(@Param('albumId') albumId: string) {
    return await this.albumService.delete(albumId);
  }
}
