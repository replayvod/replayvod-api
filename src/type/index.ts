export interface Video {
    id: number;
    filename: string;
    status: "PENDING" | "DONE" | "FAILED";
    displayName: string;
    startDownloadAt: Date;
    downloadedAt: Date | null;
    viewerCount: number;
    language: string;
    quality: "LOW" | "MEDIUM" | "HIGH";
    duration: number | null;
    size: number | null;
    thumbnail: string | null;
    broadcasterId: string;
    jobId: string;
    streamId: string;
    tags: {
        tag: {
            name: string;
        };
    }[];
    titles: {
        title: {
            name: string;
        };
    }[];
    videoCategory: {
        videoId: number;
        categoryId: string;
        category: {
            name: string;
        };
    }[];

    isChecked?: boolean;
}

type WithNotNull<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? Exclude<T[P], null> : T[P];
};

type CompletedVideoConstraints = {
    status: "DONE";
    downloadedAt: Date;
    size: number;
    thumbnail: string;
    channel: Channel;
};

export type CompletedVideo = WithNotNull<Video, "downloadedAt" | "size" | "thumbnail"> & CompletedVideoConstraints;

export interface TableProps {
    items: Video[];
}

export interface Task {
    _id?: string;
    id: string;
    name: string;
    description: string;
    taskType: string;
    metadata?: {
        [key: string]: string;
    };
    interval: number;
    lastExecution: Date;
    lastDuration: number;
    nextExecution: Date;
}

export interface Log {
    id: number;
    filename: string;
    downloadUrl: string;
    lastWriteTime: string;
}

export interface EventLog {
    id: number;
    domain: string;
}

export interface EventSub {
    _id?: string;
    id: string;
    status: string;
    type: string;
    user_id: string;
    user_login?: string;
    created_at: Date;
    cost: number;
}

export interface EventSubCost {
    total: number;
    total_cost: number;
    max_total_cost: number;
}

export interface Stream {
    id: string;
    isMature: true;
    language: string;
    startedAt: string;
    thumbnailUrl: string;
    type: string;
    broadcasterId: string;
    viewerCount: number;
    fetchId: string;
}

export interface Channel {
    broadcasterId: string;
    broadcasterLogin: string;
    broadcasterName: string;
    displayName: string;
    broadcasterType: string;
    createdAt: string;
    description: string;
    offlineImageUrl: string;
    profileImageUrl: string;
    profilePicture: string;
    type: string;
    viewCount: number;
}

export enum Quality {
    LOW = "480",
    MEDIUM = "720",
    HIGH = "1080",
}

export interface Category {
    id: string;
    boxArtUrl?: string;
    igdbId?: string;
    name: string;
}

export interface Settings {
    userId?: string;
    timeZone: string;
    dateTimeFormat: string;
}
export const DateTimeFormats = [
    "2023/10/05 18:00:00",
    "05-10-2023 18:00:00",
    "10/05/2023 18:00:00",
    "05/10/2023 18:00:00",
    "2023-10-05T18:00:00Z",
    "10-05-2023 18:00:00",
    "2023.10.05 18:00:00",
    "18:00:00 05/10/2023",
];

interface NavLinkItem {
    href: string;
    text: string;
}

export interface NavLinkBar {
    href: string;
    icon: string;
    text: string;
    items?: NavLinkItem[];
}
