import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl
} from 'class-validator';

export class CreateLivreDto {
  @ApiProperty({ description: 'Title of the book' })
  @IsNotEmpty()
  @IsString()
  titre: string;

  @ApiProperty({ description: 'Author of the book' })
  @IsNotEmpty()
  @IsString()
  auteur: string;

  @ApiProperty({ description: 'Description of the book' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Category' })
  @IsNotEmpty()
  @IsString()
  categorie: string;

  @ApiProperty({ description: 'Year of publication' })
  @IsNotEmpty()
  @IsNumber()
  annee_publication: number;

  @ApiProperty({ description: 'Condition/State of the book' })
  @IsNotEmpty()
  @IsString()
  etat: string;

  @ApiProperty({ description: 'Language' })
  @IsNotEmpty()
  @IsString()
  langue: string;

  @ApiProperty({ description: 'Image URL', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ description: 'Is available?', default: true })
  @IsOptional()
  @IsBoolean()
  disponible?: boolean = true;
}
