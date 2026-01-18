import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateEvaluationDto {
  @ApiProperty({ description: 'ID of the exchange' })
  @IsNotEmpty()
  @IsString()
  echange_id: string;

  @ApiProperty({ description: 'ID of the parent being evaluated' })
  @IsNotEmpty()
  @IsString()
  evalue_id: string;

  @ApiProperty({ description: 'Rating (1-5)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  note: number;

  @ApiProperty({ description: 'Comment' })
  @IsNotEmpty()
  @IsString()
  commentaire: string;

  @ApiProperty({ description: 'Tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
