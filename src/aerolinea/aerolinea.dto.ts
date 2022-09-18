import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsDateString()
  @IsNotEmpty()
  readonly fecha_fundacion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly website: string;
}
