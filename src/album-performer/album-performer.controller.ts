/* eslint-disable prettier/prettier */
//import { plainToInstance } from 'class-transformer';

import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/bussines-errors.interceptor';
import { AlbumPerformerService } from './album-performer.service';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumPerformerController {
  constructor(private readonly albumPerformerService: AlbumPerformerService) {}

  @Post(':albumId/performers/:performerId')
  async addPerformerAlbum(
    @Param('albumId') albumId: string,
    @Param('performerId') performerId: string,
  ) {
    return await this.albumPerformerService.addPerformerAlbum(
      albumId,
      performerId,
    );
  }
}
