import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: "The user's first name" })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: "The user's last name" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: "The user's age" })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ description: 'Number of children' })
  @IsNotEmpty()
  @IsNumber()
  numberOfChildren: number;

  @ApiProperty({ description: 'Telephone number' })
  @IsNotEmpty()
  @IsString()
  telephone: string;

  @ApiProperty({ description: 'Location' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: "The user's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's password" })
  @IsNotEmpty()
  @Length(8, 100)
  password: string;

  @ApiProperty({
    description: "The user's roles",
    example: ['viewer', 'editor', 'admin'],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  roles?: string[];
}
