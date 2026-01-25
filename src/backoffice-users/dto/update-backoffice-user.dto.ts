import { PartialType } from '@nestjs/swagger';
import { CreateBackofficeUserDto } from './create-backoffice-user.dto';

export class UpdateBackofficeUserDto extends PartialType(CreateBackofficeUserDto) {}
