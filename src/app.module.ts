import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { EmailModule } from './email/email.module';
import { EnfantsModule } from './enfants/enfants.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { FavorisModule } from './favoris/favoris.module';
import { FirebaseModule } from './firebase/firebase.module';
import { LivresModule } from './livres/livres.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SignalementsModule } from './signalements/signalements.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule.forRoot(),
    EmailModule,
    AuthModule,
    UsersModule,
    EnfantsModule,
    LivresModule,
    TransactionsModule,
    ChatsModule,
    EvaluationsModule,
    NotificationsModule,
    SignalementsModule,
    FavorisModule,
  ],
})
export class AppModule {}
