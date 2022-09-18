import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/bussiness-errors';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,

    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async addAeropuertoToAerolinea(aeropuertoId: string, aerolineaId: string) {
    const aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: aeropuertoId },
      relations: ['aerolineas'],
    });
    if (!aeropuerto) {
      throw new BusinessLogicException(
        'Aeropuerto no encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAeropuertosByAerolinea(aerolineaId: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return aerolinea.aeropuertos;
  }

  async findAeropuertoByAerolinea(aeropuertoId: string, aerolineaId: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    const aeropuerto = aerolinea.aeropuertos.find(
      (aeropuerto) => aeropuerto.id === aeropuertoId,
    );
    if (!aeropuerto) {
      throw new BusinessLogicException(
        'Aeropuerto no encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return aeropuerto;
  }

  async updateAeropuertosByAerolinea(
    aerolineaId: string,
    aeropuertos: AeropuertoEntity[],
  ) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async deleteAeropuertosByAerolinea(aerolineaId: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    aerolinea.aeropuertos = [];
    return await this.aerolineaRepository.save(aerolinea);
  }
}
