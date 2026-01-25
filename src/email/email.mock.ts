/**
 * Mock implementation of EmailService for unit testing
 * Tracks sent emails without actually sending them
 */

export class MockEmailService {
  private sentEmails: Array<{
    to: string;
    subject: string;
    type: 'welcome' | 'message_notification';
    data: any;
  }> = [];

  async sendWelcomeEmail(email: string, firstName: string) {
    this.sentEmails.push({
      to: email,
      subject: 'Bienvenue sur Trocabook',
      type: 'welcome',
      data: { firstName },
    });
    return { success: true };
  }

  async sendMessageNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
  ) {
    this.sentEmails.push({
      to: recipientEmail,
      subject: 'Nouveau message sur Trocabook',
      type: 'message_notification',
      data: { recipientName, senderName },
    });
    return { success: true };
  }

  // Helper methods for testing
  getSentEmails() {
    return this.sentEmails;
  }

  getLastEmail() {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  clearSentEmails() {
    this.sentEmails = [];
  }

  getEmailsSentTo(email: string) {
    return this.sentEmails.filter(e => e.to === email);
  }
}
