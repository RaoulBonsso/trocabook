import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


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

  @ApiPropertyOptional({ description: 'Ecole' })
  @IsOptional()
  @IsString()
  ecole?: string;

  @ApiProperty({ description: 'Matieres', type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  matieres?: string[];
}

