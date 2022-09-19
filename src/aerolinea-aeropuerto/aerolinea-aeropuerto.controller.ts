import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Controller('aerolineas')
export class AerolineaAeropuertoController {
  constructor(
    private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
  ) {}

  @Post(':aerolineaId/aeropuertos/:aeropuertoId')
  async addAeropuertoToAerolinea(
    @Param('aeropuertoId') aeropuertoId: string,
    @Param('aerolineaId') aerolineaId: string,
  ) {
    return await this.aerolineaAeropuertoService.addAeropuertoToAerolinea(
      aeropuertoId,
      aerolineaId,
    );
  }

  @Get(':aerolineaId/aeropuertos')
  async getAeropuertosByAerolinea(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaAeropuertoService.findAeropuertosByAerolinea(
      aerolineaId,
    );
  }

  @Get(':aerolineaId/aeropuertos/:aeropuertoId')
  async getAeropuertoByAerolinea(
    @Param('aeropuertoId') aeropuertoId: string,
    @Param('aerolineaId') aerolineaId: string,
  ) {
    return await this.aerolineaAeropuertoService.findAeropuertoByAerolinea(
      aeropuertoId,
      aerolineaId,
    );
  }

  @Put(':aerolineaId/aeropuertos')
  async updateAeropuertosByAerolinea(
    @Param('aerolineaId') aerolineaId: string,
    @Body() aeropuertos: AeropuertoEntity[],
  ) {
    return await this.aerolineaAeropuertoService.updateAeropuertosByAerolinea(
      aerolineaId,
      aeropuertos,
    );
  }

  @Delete(':aerolineaId/aeropuertos')
  async deleteAeropuertoFromAerolinea(
    @Param('aerolineaId') aerolineaId: string,
  ) {
    return await this.aerolineaAeropuertoService.deleteAeropuertosByAerolinea(
      aerolineaId,
    );
  }
}
