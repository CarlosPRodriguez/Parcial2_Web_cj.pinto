/* eslint-disable prettier/prettier */
import { Body, Controller, Get,  Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussines-errors.interceptor';

import { plainToInstance } from 'class-transformer';
import { TrackService } from './track.service';
import { TrackDto } from './track.dto';
import { TrackEntity } from './track.entity';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get(':albumId/tracks')
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':albumId/tracks/:trackId')
  async findOne(@Param('trackId') trackId: string) {
    return await this.trackService.findOne(trackId);
  }

  @Post(':albumId/tracks')
  async create(@Param('albumId') albumId, @Body() trackDto: TrackDto) {
    const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
    return await this.trackService.create(albumId, track);
  }

}
