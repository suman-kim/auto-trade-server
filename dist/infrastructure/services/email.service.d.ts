import { ConfigService } from '@nestjs/config';
import { Notification } from '../../entities/notification.entity';
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendNotificationEmail(to: string, notification: Notification, userData?: any): Promise<void>;
    private generateEmailContent;
    private generateTradeEmailContent;
    private generatePriceAlertEmailContent;
    private generatePortfolioEmailContent;
    private generateStrategyEmailContent;
    private generateSystemAlertEmailContent;
    private generateHtmlEmail;
    private generateTextEmail;
    testEmailConnection(): Promise<boolean>;
}
