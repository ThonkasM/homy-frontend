import { PROPERTY_TYPES_CONFIG, PropertyTypeConfig } from '@/config/property-types.config';
import { useEffect, useState } from 'react';

export function usePropertyTypeConfig(propertyType: string) {
    const [config, setConfig] = useState<PropertyTypeConfig | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!propertyType) {
            setConfig(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Usar la configuración local (sincronizada con backend)
            const propertyConfig = PROPERTY_TYPES_CONFIG[propertyType];

            if (!propertyConfig) {
                setError(`Tipo de propiedad no soportado: ${propertyType}`);
                setConfig(null);
            } else {
                setConfig(propertyConfig);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar configuración');
            setConfig(null);
        } finally {
            setLoading(false);
        }
    }, [propertyType]);

    return { config, loading, error };
}
