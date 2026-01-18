import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSignalementDto {
  @ApiProperty({ description: 'Target Type (parent, livre, message)' })
  @IsNotEmpty()
  @IsString()
  cible_type: 'parent' | 'livre' | 'message';

  @ApiProperty({ description: 'Target ID' })
  @IsNotEmpty()
  @IsString()
  cible_id: string;

  @ApiProperty({ description: 'Motif' })
  @IsNotEmpty()
  @IsString()
  motif: string;

  @ApiProperty({ description: 'Description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
