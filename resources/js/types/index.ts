import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    [key: string]: unknown;
    flash: {
        success: string;
        error: string;
        warning: string;
        info: string;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    image_versions: {
        original: string;
        thumbnail: string;
        small: string;
        medium: string;
        large: string;
    } | null;
}

export interface Brand {
    id: number;
    name: string;
    description: string;
    image_versions: {
        original: string;
        thumbnail: string;
        small: string;
        medium: string;
        large: string;
    } | null;
}

export interface Quality {
    id: number;
    name: string;
    description: string;
    image_versions: {
        original: string;
        thumbnail: string;
        small: string;
        medium: string;
        large: string;
    } | null;
}

export interface Color {
    id: number;
    name: string;
    hexadecimal: string;
}

export interface Size {
    id: number;
    name: string;
    label: string;
}

export interface ProductIndex {
    id: number;
    name: string;
    sku: string;
    category: {
        id: number;
        name: string;
    } | null;
    price: string;
    is_active: boolean;
    created_at: string;
    thumbnail: string | null;
    total_stock: number;
}

export interface ProductRelated {
    categories: {
        id: number;
        name: string;
    }[];
    brands: {
        id: number;
        name: string;
    }[];
    colors: {
        id: number;
        name: string;
        hexadecimal: string;
    }[];
    sizes: {
        id: number;
        label: string;
    }[];
    qualities: {
        id: number;
        name: string;
    }[];
}
