import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEnfantDto {
  @ApiProperty({ description: 'Parent ID' })
  @IsNotEmpty()
  @IsString()
  parent_id: string;

  @ApiProperty({ description: 'First name' })
  @IsNotEmpty()
  @IsString()
  prenom: string;

  @ApiProperty({ description: 'Last name' })
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

  @ApiProperty({ description: 'Other information', required: false })
  @IsOptional()
  @IsString()
  autres_infos?: string;
}
