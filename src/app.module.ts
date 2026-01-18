import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { EnfantsModule } from './enfants/enfants.module';
import { FirebaseModule } from './firebase/firebase.module';
import { LivresModule } from './livres/livres.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule.forRoot(),
    AuthModule,
    UsersModule,
    EnfantsModule,
    LivresModule,
    TransactionsModule,
    ChatsModule,
  ],
})
export class AppModule {}
