// Enum definitions matching Prisma schema
export enum PropertyType {
    HOUSE = 'HOUSE',
    APARTMENT = 'APARTMENT',
    LAND = 'LAND',
    OFFICE = 'OFFICE',
    COMMERCIAL = 'COMMERCIAL',
    WAREHOUSE = 'WAREHOUSE',
    ROOM = 'ROOM',
    OTHER = 'OTHER',
}

export enum OperationType {
    SALE = 'SALE',
    RENT_TEMPORARY = 'RENT_TEMPORARY',
    RENT_PERMANENT = 'RENT_PERMANENT',
    ANTICRETICO = 'ANTICRETICO',
}

export enum PropertyStatus {
    AVAILABLE = 'AVAILABLE',
    RESERVED = 'RESERVED',
    SOLD = 'SOLD',
    RENTED = 'RENTED',
    INACTIVE = 'INACTIVE',
}

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    propertyType: PropertyType;
    operationType: OperationType;
    status: PropertyStatus;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state?: string;
    country: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking?: number;
    floor?: number;
    amenities: string[];
    contactPhone: string;
    contactEmail?: string;
    contactWhatsApp?: string;
    ownerId: string;
    ownerName: string;
    ownerImage?: string;
    images: PropertyImage[];
    createdAt: string;
}

export interface PropertyImage {
    id: string;
    url: string;
    order: number;
}

// Dummy data - Properties
export const dummyProperties: Property[] = [
    {
        id: 'prop-001',
        title: 'Departamento moderno en Zona Sur',
        description: 'Hermoso departamento ubicado en el corazón de la Zona Sur, con vista a la ciudad, completamente amueblado y equipado con todo lo necesario para vivir cómodamente.',
        price: 150000,
        propertyType: PropertyType.APARTMENT,
        operationType: OperationType.SALE,
        status: PropertyStatus.AVAILABLE,
        latitude: -17.8084,
        longitude: -63.1833,
        address: 'Calle Las Flores 456, Apt 12B',
        city: 'La Paz',
        state: 'La Paz',
        country: 'Bolivia',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        parking: 1,
        floor: 8,
        amenities: ['wifi', 'aire acondicionado', 'balcón', 'ascensor', 'seguridad 24/7'],
        contactPhone: '+591 7 123 4567',
        contactEmail: 'juan@example.com',
        contactWhatsApp: '+591 7 123 4567',
        ownerId: 'user-001',
        ownerName: 'Juan Pérez',
        ownerImage: '👨‍💼',
        images: [
            { id: 'img-001', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', order: 1 },
            { id: 'img-002', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', order: 2 },
            { id: 'img-003', url: 'https://images.unsplash.com/photo-1552539618-2d96c4ee0267?w=400&h=300&fit=crop', order: 3 },
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prop-002',
        title: 'Casa con piscina en Achumani',
        description: 'Casa de tres pisos con acabados de lujo, piscina, jardín privado y estacionamiento para 3 vehículos. Ubicada en una zona residencial tranquila y segura.',
        price: 350000,
        propertyType: PropertyType.HOUSE,
        operationType: OperationType.SALE,
        status: PropertyStatus.AVAILABLE,
        latitude: -17.7521,
        longitude: -63.2194,
        address: 'Avenida Achumani 789',
        city: 'La Paz',
        state: 'La Paz',
        country: 'Bolivia',
        bedrooms: 4,
        bathrooms: 3,
        area: 350,
        parking: 3,
        amenities: ['piscina', 'jardín', 'terraza', 'seguridad', 'puerta automática'],
        contactPhone: '+591 7 234 5678',
        contactEmail: 'maria@example.com',
        contactWhatsApp: '+591 7 234 5678',
        ownerId: 'user-002',
        ownerName: 'María García',
        ownerImage: '👩‍💼',
        images: [
            { id: 'img-004', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', order: 1 },
            { id: 'img-005', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', order: 2 },
            { id: 'img-006', url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=300&fit=crop', order: 3 },
        ],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prop-003',
        title: 'Oficina ejecutiva Centro',
        description: 'Oficina completamente equipada en el centro de la ciudad, con acceso a internet de alta velocidad, salas de reuniones y recepción compartida.',
        price: 2500,
        propertyType: PropertyType.OFFICE,
        operationType: OperationType.RENT_PERMANENT,
        status: PropertyStatus.AVAILABLE,
        latitude: -17.7898,
        longitude: -63.1814,
        address: 'Calle Comercio 234, Piso 5',
        city: 'La Paz',
        country: 'Bolivia',
        bedrooms: 0,
        bathrooms: 1,
        area: 80,
        parking: 2,
        amenities: ['internet', 'aire acondicionado', 'ascensor', 'seguridad'],
        contactPhone: '+591 7 345 6789',
        contactEmail: 'carlos@example.com',
        ownerId: 'user-003',
        ownerName: 'Carlos López',
        ownerImage: '👨‍💻',
        images: [
            { id: 'img-007', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', order: 1 },
            { id: 'img-008', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', order: 2 },
        ],
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prop-004',
        title: 'Terreno para proyecto inmobiliario',
        description: 'Terreno de amplia extensión ubicado en zona de expansión, ideal para proyectos de vivienda o comerciales. Servicios disponibles en la zona.',
        price: 80000,
        propertyType: PropertyType.LAND,
        operationType: OperationType.SALE,
        status: PropertyStatus.AVAILABLE,
        latitude: -17.6521,
        longitude: -63.1333,
        address: 'Camino a Los Andes km 5',
        city: 'La Paz',
        country: 'Bolivia',
        area: 2500,
        parking: 0,
        amenities: ['servicios disponibles', 'acceso carretero'],
        contactPhone: '+591 7 456 7890',
        contactWhatsApp: '+591 7 456 7890',
        ownerId: 'user-004',
        ownerName: 'Roberto Morales',
        ownerImage: '👨‍🌾',
        images: [
            { id: 'img-009', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', order: 1 },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prop-005',
        title: 'Departamento amueblado para alquiler',
        description: 'Departamento completamente amueblado con servicios incluidos. Ideal para estudiantes o profesionales. Disponible inmediatamente.',
        price: 800,
        propertyType: PropertyType.APARTMENT,
        operationType: OperationType.RENT_TEMPORARY,
        status: PropertyStatus.AVAILABLE,
        latitude: -17.7934,
        longitude: -63.1980,
        address: 'Calle 6 de Agosto 567',
        city: 'La Paz',
        country: 'Bolivia',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        parking: 1,
        amenities: ['amueblado', 'wifi', 'servicios incluidos'],
        contactPhone: '+591 7 567 8901',
        contactEmail: 'ana@example.com',
        contactWhatsApp: '+591 7 567 8901',
        ownerId: 'user-005',
        ownerName: 'Ana Rodríguez',
        ownerImage: '👩‍🏫',
        images: [
            { id: 'img-010', url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop', order: 1 },
            { id: 'img-011', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', order: 2 },
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prop-006',
        title: 'Local comercial Centro',
        description: 'Local comercial con gran visibilidad en la zona más transitada del centro. Perfecto para tienda, restaurante o cafetería.',
        price: 3000,
        propertyType: PropertyType.COMMERCIAL,
        operationType: OperationType.RENT_PERMANENT,
        status: PropertyStatus.RESERVED,
        latitude: -17.7907,
        longitude: -63.1828,
        address: 'Avenida Mariscal Santa Cruz 890',
        city: 'La Paz',
        country: 'Bolivia',
        area: 150,
        parking: 0,
        amenities: ['visibilidad', 'piso estratégico'],
        contactPhone: '+591 7 678 9012',
        ownerId: 'user-006',
        ownerName: 'Diego Torres',
        ownerImage: '👨‍💼',
        images: [
            { id: 'img-012', url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop', order: 1 },
        ],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Dummy user data for profile
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    bio?: string;
    rating: number;
    totalReviews: number;
    totalProperties: number;
    joinDate: string;
}

export const currentUser: UserProfile = {
    id: 'current-user',
    name: 'Mi Perfil',
    email: 'miusuario@example.com',
    phone: '+591 7 999 8888',
    avatar: '👤',
    bio: 'Agente inmobiliario profesional con 5 años de experiencia',
    rating: 4.8,
    totalReviews: 24,
    totalProperties: 12,
    joinDate: '2020-01-15',
};
