import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row' as any,
        justifyContent: 'space-between' as any,
        alignItems: 'center' as any,
        flexWrap: 'wrap' as any,
        gap: 16,
    },
    leftSection: {
        flexDirection: 'row' as any,
        alignItems: 'center' as any,
        gap: 12,
        flexWrap: 'wrap' as any,
    },
    brand: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3b82f6',
        letterSpacing: 1,
    },
    copyright: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    rightSection: {
        flexDirection: 'row' as any,
        gap: 20,
        flexWrap: 'wrap' as any,
    },
    linkContainer: {
        cursor: 'pointer' as any,
    },
    link: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    linkHover: {
        color: '#3b82f6',
    },
});

function FooterLink({ children }: { children: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <View
            style={styles.linkContainer}
            // @ts-ignore
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Text style={[styles.link, isHovered && styles.linkHover]}>
                {children}
            </Text>
        </View>
    );
}

export default function AuthFooter() {
    return (
        <View style={styles.footer}>
            <View style={styles.leftSection}>
                <Text style={styles.brand}>HO-MY</Text>
                <Text style={styles.copyright}>© 2026 Todos los derechos reservados</Text>
            </View>

            <View style={styles.rightSection}>
                <FooterLink>Términos y Condiciones</FooterLink>
                <FooterLink>Política de Privacidad</FooterLink>
                <FooterLink>Contacto</FooterLink>
            </View>
        </View>
    );
}
