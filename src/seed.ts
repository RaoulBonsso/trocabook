import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackofficeUsersService } from './backoffice-users/backoffice-users.service';
import { BackofficeRole } from './backoffice-users/dto/create-backoffice-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(BackofficeUsersService);

  const email = 'admin@trocabook.com';
  const password = 'adminpassword123';

  try {
    console.log(`Creating Super Admin: ${email}...`);
    await service.create({
      email,
      password,
      nom: 'Admin',
      prenom: 'Super',
      role: BackofficeRole.SUPER_ADMIN,
    });
    console.log('Super Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    if (error.message.includes('email already exists')) {
        console.log('User already exists.');
    } else {
        console.error('Error creating user:', error.message);
    }
  } finally {
    await app.close();
  }
}

bootstrap();
