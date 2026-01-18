import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBesoinLivreDto {
  @ApiProperty({ description: 'Child ID this need is for' })
  @IsNotEmpty()
  @IsString()
  enfant_id: string;

  @ApiProperty({ description: 'Title' })
  @IsNotEmpty()
  @IsString()
  titre: string;

  @ApiProperty({ description: 'Subject' })
  @IsNotEmpty()
  @IsString()
  matiere: string;

  @ApiProperty({ description: 'Class' })
  @IsNotEmpty()
  @IsString()
  classe: string;

  @ApiProperty({ description: 'School' })
  @IsNotEmpty()
  @IsString()
  ecole: string;

  @ApiProperty({ description: 'Is urgent?' })
  @IsNotEmpty()
  @IsBoolean()
  urgence: boolean;

  @ApiProperty({ description: 'Radius in km' })
  @IsNotEmpty()
  @IsNumber()
  rayon_km: number;
}
