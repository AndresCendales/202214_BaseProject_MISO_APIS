import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from "@nestjs/typeorm";

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertoList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    aerolineaRepository.clear();
    aeropuertoRepository.clear();

    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.name.firstName(),
        codigo: faker.company.companySuffix(),
        ciudad: faker.address.city(),
        pais: faker.address.country(),
        aerolineas: [],
      });
      aeropuertoList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      website: faker.internet.url(),
      aeropuertos: aeropuertoList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoToAerolinea should add a aeropuerto to a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.name.firstName(),
      codigo: faker.company.companySuffix(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
    });

    const aerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      website: faker.internet.url(),
      aeropuertos: [],
    });

    const result: AerolineaEntity = await service.addAeropuertoToAerolinea(
      aeropuerto.id,
      aerolinea.id,
    );
    expect(result).not.toBeNull();
    expect(result.aeropuertos).toHaveLength(1);
    expect(result.aeropuertos[0].id).toEqual(aeropuerto.id);
    expect(result.aeropuertos[0].nombre).toEqual(aeropuerto.nombre);
    expect(result.aeropuertos[0].codigo).toEqual(aeropuerto.codigo);
    expect(result.aeropuertos[0].ciudad).toEqual(aeropuerto.ciudad);
    expect(result.aeropuertos[0].pais).toEqual(aeropuerto.pais);
  });

  it('findAeropuertosByAerolinea should return a list of aeropuertos', async () => {
    const result: AeropuertoEntity[] = await service.findAeropuertosByAerolinea(
      aerolinea.id,
    );
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);
  });

  it('findAeropuertoByAerolinea should return a aeropuerto', async () => {
    const result: AeropuertoEntity = await service.findAeropuertoByAerolinea(
      aeropuertoList[0].id,
      aerolinea.id,
    );
    expect(result).not.toBeNull();
    expect(result.id).toEqual(aeropuertoList[0].id);
    expect(result.nombre).toEqual(aeropuertoList[0].nombre);
    expect(result.codigo).toEqual(aeropuertoList[0].codigo);
    expect(result.ciudad).toEqual(aeropuertoList[0].ciudad);
    expect(result.pais).toEqual(aeropuertoList[0].pais);
  });

  it('updateAeropuertosByAerolinea should update a aeropuerto', async () => {
    const a: AeropuertoEntity[] = [];
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: 'New name',
      codigo: 'New code',
      ciudad: 'New city',
      pais: 'New country',
    });
    a.push(aeropuerto);

    const result: AerolineaEntity = await service.updateAeropuertosByAerolinea(
      aerolinea.id,
      a,
    );

    expect(result).not.toBeNull();
    expect(result.aeropuertos[0].id).toEqual(aeropuerto.id);
    expect(result.aeropuertos[0].nombre).toEqual(aeropuerto.nombre);
    expect(result.aeropuertos[0].codigo).toEqual(aeropuerto.codigo);
    expect(result.aeropuertos[0].ciudad).toEqual(aeropuerto.ciudad);
    expect(result.aeropuertos[0].pais).toEqual(aeropuerto.pais);
  });

  it('deleteAeropuertosByAerolinea should delete a aeropuerto', async () => {
    const result: AerolineaEntity = await service.deleteAeropuertosByAerolinea(
      aerolinea.id,
    );
    expect(result).not.toBeNull();
    expect(result.aeropuertos).toHaveLength(0);
  });
});
