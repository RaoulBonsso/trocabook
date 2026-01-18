import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

  // Initial role for the book (usually 'recoit' from demandeur perspective or 'donne' from offreur perspective?)
  // If demandeur initiates, they want to RECEIVE the book 'livre_id'.
  // So 'livre_id' is owned by 'parent_offreur_id'.
}
