import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateTransactionDto {
  @ApiProperty({ description: 'ID of the parent making the offer/book owner' })
  @IsNotEmpty()
  @IsString()
  parent_offreur_id: string;

  // parent_demandeur_id usually comes from auth token (req.user.uid)

  @ApiProperty({ description: 'ID of the book involved in the initial exchange proposal' })
  @IsNotEmpty()
  @IsString()
  livre_id: string;

  @ApiProperty({ description: 'Type of transaction: echange or achat', enum: ['echange', 'achat'] })
  @IsNotEmpty()
  @IsString()
  type: 'echange' | 'achat';

  @ApiPropertyOptional({ description: 'Price for purchase' })
  @IsOptional()
  @IsNumber()
  prix?: number;
}

