import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.name.firstName(),
        codigo: faker.company.companySuffix(),
        ciudad: faker.address.city(),
        pais: faker.address.country(),
        aerolineas: [],
      });
      aeropuertoList.push(aeropuerto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findall should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(
      storedAeropuerto.id,
    );
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre);
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo);
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad);
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais);
  });

  it('findOne should return null if aeropuerto does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Aeropuerto no encontrado',
    );
  });

  it('create should create a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      nombre: faker.name.firstName(),
      codigo: faker.company.companySuffix(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      aerolineas: [],
    };

    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto: AeropuertoEntity = await service.findOne(
      newAeropuerto.id,
    );
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toEqual(aeropuerto.codigo);
    expect(storedAeropuerto.ciudad).toEqual(aeropuerto.ciudad);
    expect(storedAeropuerto.pais).toEqual(aeropuerto.pais);
  });

  it('update should update a aeropuerto', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    storedAeropuerto.nombre = 'New name';
    storedAeropuerto.codigo = 'New code';
    storedAeropuerto.ciudad = 'New city';
    storedAeropuerto.pais = 'New country';

    const updatedAeropuerto: AeropuertoEntity = await service.update(
      storedAeropuerto.id,
      storedAeropuerto,
    );
    expect(updatedAeropuerto).not.toBeNull();
    expect(updatedAeropuerto.nombre).toEqual(storedAeropuerto.nombre);
    expect(updatedAeropuerto.codigo).toEqual(storedAeropuerto.codigo);
    expect(updatedAeropuerto.ciudad).toEqual(storedAeropuerto.ciudad);
    expect(updatedAeropuerto.pais).toEqual(storedAeropuerto.pais);
  });

  it('update should throw an error if aeropuerto does not exist', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    storedAeropuerto.id = '0';

    await expect(() =>
      service.update('0', storedAeropuerto),
    ).rejects.toHaveProperty('message', 'Aeropuerto no encontrado');
  });

  it('delete should delete a aeropuerto', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(storedAeropuerto.id);

    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: storedAeropuerto.id },
    });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an error if aeropuerto does not exist', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Aeropuerto no encontrado',
    );
  });
});
