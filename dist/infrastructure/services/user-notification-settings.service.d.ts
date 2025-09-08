import { Repository } from 'typeorm';
import { UserNotificationSettings } from '../../entities/user-notification-settings.entity';
import { User } from '../../entities/user.entity';
import { CreateNotificationSettingsDto, UpdateNotificationSettingsDto } from '../../dtos/notification.dto';
export declare class UserNotificationSettingsService {
    private readonly settingsRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(settingsRepository: Repository<UserNotificationSettings>, userRepository: Repository<User>);
    getUserSettings(userId: number): Promise<UserNotificationSettings>;
    createDefaultSettings(userId: number): Promise<UserNotificationSettings>;
    createSettings(userId: number, createDto: CreateNotificationSettingsDto): Promise<UserNotificationSettings>;
    updateSettings(userId: number, updateDto: UpdateNotificationSettingsDto): Promise<UserNotificationSettings>;
    updateNotificationType(userId: number, notificationType: string, enabled: boolean, deliveryMethods?: {
        email?: boolean;
        push?: boolean;
        websocket?: boolean;
    }): Promise<UserNotificationSettings>;
    deleteSettings(userId: number): Promise<void>;
    getAllSettings(): Promise<UserNotificationSettings[]>;
    getUsersWithNotificationEnabled(notificationType: string): Promise<User[]>;
    getUsersWithDeliveryMethodEnabled(notificationType: string, deliveryMethod: string): Promise<User[]>;
    getSettingsStatistics(): Promise<any>;
    validateSettings(settings: any): Promise<boolean>;
}
