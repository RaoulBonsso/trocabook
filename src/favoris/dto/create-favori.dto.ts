import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriDto {
  @ApiProperty({ description: 'Book ID' })
  @IsNotEmpty()
  @IsString()
  livre_id: string;
}
