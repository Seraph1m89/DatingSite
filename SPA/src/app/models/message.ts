export interface Message {
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderMainPhotoUrl: string;
    recipientId: number;
    recipientKnownAs: string;
    recipientMainPhotoUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}
