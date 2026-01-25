import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({ description: 'The Firebase ID token' })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
