import { Alert, Linking, Platform } from 'react-native';

interface MapHelpers {
    handleOpenMap: () => Promise<void>;
    handleContactWhatsApp: () => Promise<void>;
}

interface UseMapActionsProps {
    property: {
        latitude?: number;
        longitude?: number;
        title: string;
        owner?: {
            phone?: string;
        };
    } | null;
}

export const useMapActions = ({ property }: UseMapActionsProps): MapHelpers => {
    const handleOpenMap = async () => {
        try {
            if (!property) return;

            const { latitude, longitude, title } = property;

            if (!latitude || !longitude) {
                Alert.alert('⚠️ Error', 'La propiedad no tiene coordenadas registradas');
                return;
            }

            let mapUrl = '';

            if (Platform.OS === 'ios') {
                mapUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
            } else {
                mapUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(title)})`;
            }

            Linking.openURL(mapUrl).catch((err) => {
                console.error('Error abriendo mapas:', err);
                const fallbackUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
                Linking.openURL(fallbackUrl).catch(() => {
                    Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
                });
            });
        } catch (error) {
            console.error('Error abriendo mapas:', error);
            Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
        }
    };

    const handleContactWhatsApp = async () => {
        if (!property?.owner?.phone) {
            Alert.alert('Error', 'No hay número de teléfono disponible');
            return;
        }

        const phoneNumber = property.owner.phone.replace(/[^\d+]/g, '');
        const whatsappUrl = Platform.OS === 'web'
            ? `https://web.whatsapp.com/send?phone=${phoneNumber}`
            : `whatsapp://send?phone=${phoneNumber}`;

        try {
            const canOpen = await Linking.canOpenURL(whatsappUrl);
            if (canOpen) {
                await Linking.openURL(whatsappUrl);
            } else {
                Alert.alert(
                    'WhatsApp no disponible',
                    '¿Deseas llamar al propietario?',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                            text: 'Llamar',
                            onPress: async () => {
                                const callUrl = `tel:${phoneNumber}`;
                                await Linking.openURL(callUrl);
                            }
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir WhatsApp');
        }
    };

    return {
        handleOpenMap,
        handleContactWhatsApp,
    };
};
