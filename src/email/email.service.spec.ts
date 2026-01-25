import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                EMAIL_USER: 'test@trocabook.com',
                EMAIL_PASSWORD: 'test_password',
                EMAIL_HOST: 'smtp.gmail.com',
                EMAIL_PORT: 587,
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should not throw error when sending welcome email', async () => {
      // Arrange
      const email = 'jean.dupont@example.com';
      const name = 'Jean';

      // Act & Assert - should not throw
      await expect(service.sendWelcomeEmail(email, name)).resolves.not.toThrow();
    });

    it('should handle missing email configuration gracefully', async () => {
      // Arrange
      const unconfiguredService = new EmailService({
        get: jest.fn(() => undefined),
      } as any);

      // Act & Assert - should not throw even when not configured
      await expect(
        unconfiguredService.sendWelcomeEmail('test@example.com', 'Test'),
      ).resolves.not.toThrow();
    });
  });

  describe('sendMessageNotificationEmail', () => {
    it('should not throw error when sending message notification', async () => {
      // Arrange
      const recipientEmail = 'recipient@example.com';
      const recipientName = 'Marie';
      const senderName = 'Pierre';

      // Act & Assert - should not throw
      await expect(
        service.sendMessageNotificationEmail(recipientEmail, recipientName, senderName),
      ).resolves.not.toThrow();
    });

    it('should handle missing email configuration gracefully', async () => {
      // Arrange
      const unconfiguredService = new EmailService({
        get: jest.fn(() => undefined),
      } as any);

      // Act & Assert - should not throw even when not configured
      await expect(
        unconfiguredService.sendMessageNotificationEmail('test@example.com', 'Test', 'Sender'),
      ).resolves.not.toThrow();
    });
  });
});
