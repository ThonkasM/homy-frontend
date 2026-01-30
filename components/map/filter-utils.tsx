export interface PropertyTypeFilter {
    type: string;
    label: string;
}

export const PROPERTY_TYPE_FILTERS: PropertyTypeFilter[] = [
    { type: 'HOUSE', label: 'Casa' },
    { type: 'APARTMENT', label: 'Departamento' },
    { type: 'OFFICE', label: 'Oficina' },
    { type: 'LAND', label: 'Terreno' },
    { type: 'COMMERCIAL', label: 'Comercial' },
    { type: 'WAREHOUSE', label: 'Almacén' },
    { type: 'ROOM', label: 'Habitación' },
];

export const getFilterButtonColor = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
        case 'HOUSE':
            return '#5585b5'; // Azul
        case 'APARTMENT':
            return '#10b981'; // Verde
        case 'OFFICE':
            return '#f97316'; // Naranja
        case 'LAND':
            return '#f59e0b'; // Ámbar
        case 'COMMERCIAL':
            return '#8b5cf6'; // Púrpura
        case 'WAREHOUSE':
            return '#6366f1'; // Índigo
        case 'ROOM':
            return '#ec4899'; // Rosa
        default:
            return '#5585b5'; // Azul por defecto
    }
};
