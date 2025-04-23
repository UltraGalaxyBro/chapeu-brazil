import { LucideIcon } from 'lucide-react';

export interface ImageVersions {
    original: string;
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
}

export interface ProductQuality {
    id: number;
    name: string;
}

export interface ProductImage {
    id: number;
    image_versions: { [key: string]: string };
    image_metadata: { [key: string]: unknown };
    order: number;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    color_id: number;
    size_id: number;
    stock: number;
    additional_price: number;
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface SharedData {
    name: string;
    auth: Auth;
    flash: {
        success: string | null;
        error: string | null;
        warning: string | null;
        info: string | null;
    };
    [key: string]: unknown;
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
    image_versions: ImageVersions | null;
}

export interface Brand {
    id: number;
    name: string;
    description: string;
    image_versions: ImageVersions | null;
}

export interface Quality {
    id: number;
    name: string;
    description: string;
    image_versions: ImageVersions | null;
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

export interface ProductCreate {
    categories: { id: number; name: string }[];
    brands: { id: number; name: string }[];
    colors: { id: number; name: string; hexadecimal: string }[];
    sizes: { id: number; label: string }[];
    qualities: { id: number; name: string }[];
}

export interface ProductEdit {
    categories: { id: number; name: string }[];
    brands: { id: number; name: string }[];
    colors: { id: number; name: string; hexadecimal: string }[];
    sizes: { id: number; label: string }[];
    qualities: { id: number; name: string }[];
    product: {
        id: number;
        category_id: number;
        brand_id: number;
        name: string;
        sku: string;
        description: string;
        cost: number;
        price: number;
        is_active: boolean;
        keywords: string;
        qualities: { id: number }[];
        variants: {
            id: number;
            color_id: number;
            size_id: number;
            stock: number;
            additional_price: number;
        }[];
    };
    productImages: {
        id: number;
        path: string;
        order: number;
    }[];
}