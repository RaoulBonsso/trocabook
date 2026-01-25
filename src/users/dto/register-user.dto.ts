import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
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

  @ApiProperty({ description: "The user's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's password" })
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @ApiProperty({ description: 'Telephone number' })
  @IsNotEmpty()
  @IsString()
  telephone: string;

  @ApiProperty({ description: 'City' })
  @IsNotEmpty()
  @IsString()
  ville: string;

  @ApiProperty({ description: 'Latitude' })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ description: 'Number of children' })
  @IsNotEmpty()
  @IsNumber()
  numberOfChildren: number;

  // Keeping age as optional if frontend still sends it, but it's not in the main schema request.
  // I will make it optional to avoid breaking if frontend still sends it.
  @ApiPropertyOptional({ description: "The user's age" })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    description: "The user's roles",
    example: ['viewer', 'editor', 'admin'],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  roles?: string[];

  @ApiProperty({ description: "Whether the user accepted the CGU" })
  @IsNotEmpty()
  @IsBoolean()
  cgu_valide: boolean;
}

