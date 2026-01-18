import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Book ID' })
  @IsNotEmpty()
  @IsString()
  livre_id: string;

  @ApiProperty({ description: 'Seller ID' })
  @IsNotEmpty()
  @IsString()
  vendeur_id: string;

  @ApiProperty({ description: 'Type: achat, echange, don' })
  @IsNotEmpty()
  @IsString()
  type_transaction: string;

  @ApiProperty({ description: 'Rendez-vous location', required: false })
  @IsOptional()
  @IsString()
  rendezvous_localisation?: string;

  @ApiProperty({ description: 'Rendez-vous date', required: false })
  @IsOptional()
  @IsDateString()
  rendezvous_date?: string;
}
