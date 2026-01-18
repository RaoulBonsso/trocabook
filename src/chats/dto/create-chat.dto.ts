import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ description: 'ID of the parent to chat with' })
  @IsNotEmpty()
  @IsString()
  other_parent_id: string;

  @ApiProperty({ description: 'Book ID context' })
  @IsNotEmpty()
  @IsString()
  livre_id: string;
}
