import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
    
    // Vérifier si les credentials sont configurés
    if (!emailUser || !emailPassword) {
      this.logger.warn('⚠️ Email credentials not configured. Email notifications will be disabled.');
      this.logger.warn('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
      this.isConfigured = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
        port: this.configService.get('EMAIL_PORT', 587),
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });
      this.isConfigured = true;
      this.logger.log('✅ Email service configured successfully');
    } catch (error) {
      this.logger.error('❌ Failed to configure email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Envoie un email de bienvenue personnalisé
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    if (!this.isConfigured) {
      this.logger.warn(`Email not sent to ${to}: Service not configured`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Trocabook" <${this.configService.get('EMAIL_USER')}>`,
        to,
        subject: '🎉 Bienvenue dans l\'écosystème Trocabook !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Bienvenue ${name} ! 👋</h1>
            <p>Nous sommes ravis de vous accueillir dans la communauté <strong>Trocabook</strong>.</p>
            <p>Vous pouvez maintenant :</p>
            <ul>
              <li>📚 Ajouter vos livres scolaires</li>
              <li>🔄 Échanger avec d'autres parents</li>
              <li>💬 Discuter en toute sécurité</li>
              <li>⭐ Évaluer vos échanges</li>
            </ul>
            <p style="margin-top: 30px;">À très bientôt sur Trocabook !</p>
            <p style="color: #888; font-size: 12px;">L'équipe Trocabook</p>
          </div>
        `,
      });
      this.logger.log(`✅ Email de bienvenue envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'envoi de l'email à ${to}:`, error.message);
    }
  }

  /**
   * Envoie une notification d'email pour un nouveau message
   */
  async sendMessageNotificationEmail(
    to: string,
    recipientName: string,
    senderName: string,
  ): Promise<void> {
    if (!this.isConfigured) {
      this.logger.warn(`Email not sent to ${to}: Service not configured`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Trocabook" <${this.configService.get('EMAIL_USER')}>`,
        to,
        subject: `💬 Nouveau message de ${senderName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">Bonjour ${recipientName},</h2>
            <p>Vous avez reçu un nouveau message de <strong>${senderName}</strong> sur Trocabook.</p>
            <p>Connectez-vous à l'application pour consulter votre message et répondre.</p>
            <p style="margin-top: 30px;">À bientôt !</p>
            <p style="color: #888; font-size: 12px;">L'équipe Trocabook</p>
          </div>
        `,
      });
      this.logger.log(`✅ Notification email envoyée à ${to}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'envoi de la notification à ${to}:`, error.message);
    }
  }
}
