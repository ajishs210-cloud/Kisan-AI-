
export interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
    imageUrl?: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}
