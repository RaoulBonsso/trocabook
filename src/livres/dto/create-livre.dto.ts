import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';

export class CreateLivreDto {
  @ApiProperty({ description: 'Title of the book' })
  @IsNotEmpty()
  @IsString()
  titre: string;

  @ApiProperty({ description: 'Subject/Matiere' })
  @IsNotEmpty()
  @IsString()
  matiere: string;

  @ApiProperty({ description: 'Class/Grade' })
  @IsNotEmpty()
  @IsString()
  classe: string;

  @ApiProperty({ description: 'School' })
  @IsNotEmpty()
  @IsString()
  ecole: string;

  @ApiProperty({ description: 'Condition (neuf, bon, moyen, mauvais)' })
  @IsNotEmpty()
  @IsString()
  etat: 'neuf' | 'bon' | 'moyen' | 'mauvais';

  @ApiProperty({ description: 'Description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Images URLs' })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ description: 'Language' })
  @IsNotEmpty()
  @IsString()
  langue: string;

  @ApiProperty({ description: 'School Year' })
  @IsNotEmpty()
  @IsString()
  annee_scolaire: string;

  @ApiProperty({ description: 'Is available?', default: true })
  @IsOptional()
  @IsBoolean()
  disponible: boolean = true;

  @ApiProperty({ description: 'Status' })
  @IsNotEmpty()
  @IsString()
  statut: 'disponible' | 'en_negociation' | 'echange';

  @ApiProperty({ description: 'Latitude' })
  @IsNotEmpty()
  @IsNumber()
  localisation_lat: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNotEmpty()
  @IsNumber()
  localisation_lng: number;

  @ApiProperty({ description: 'ID of the child who owns the book' })
  @IsNotEmpty()
  @IsString()
  enfant_id: string;
}

