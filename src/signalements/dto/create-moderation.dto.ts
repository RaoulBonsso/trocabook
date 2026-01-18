import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateModerationDto {
  @ApiProperty({ description: 'Signalement ID' })
  @IsNotEmpty()
  @IsString()
  signalement_id: string;

  @ApiProperty({ description: 'Action (avertissement, suspension, blocage)' })
  @IsNotEmpty()
  @IsString()
  action: 'avertissement' | 'suspension' | 'blocage';

  @ApiProperty({ description: 'Duration in days' })
  @IsNotEmpty()
  @IsNumber()
  duree: number;

  @ApiProperty({ description: 'Commentaire' })
  @IsNotEmpty()
  @IsString()
  commentaire: string;
}
