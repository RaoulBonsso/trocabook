import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEnfantDto {
  @ApiProperty({ description: 'Parent ID' })
  @IsNotEmpty()
  @IsString()
  parent_id: string;

  @ApiProperty({ description: 'Nom' })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({ description: 'Age' })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ description: 'Class/Grade' })
  @IsNotEmpty()
  @IsString()
  classe: string;

  @ApiProperty({ description: 'Ecole' })
  @IsNotEmpty()
  @IsString()
  ecole: string;

  @ApiProperty({ description: 'Matieres', type: [String] })
  @IsArray()
  @IsString({ each: true })
  matieres: string[];
}
