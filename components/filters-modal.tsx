import { PropertyFilters } from '@/hooks/use-properties';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useCallback, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: PropertyFilters;
    onApplyFilters: (filters: PropertyFilters) => void;
    selectedPropertyTypes: { [key: string]: boolean };
    onTogglePropertyType: (type: string) => void;
}

const propertyTypes = [
    { type: 'HOUSE', label: 'Casa' },
    { type: 'APARTMENT', label: 'Departamento' },
    { type: 'OFFICE', label: 'Oficina' },
    { type: 'LAND', label: 'Terreno' },
    { type: 'COMMERCIAL', label: 'Comercial' },
    { type: 'WAREHOUSE', label: 'Almacén' },
    { type: 'ROOM', label: 'Habitación' },
];

const operationTypes = [
    { type: 'SALE', label: 'Venta', icon: 'home' },
    // { type: 'RENT_TEMPORARY', label: 'Alquiler Temporal', icon: 'time' }, // OCULTO
    { type: 'RENT_PERMANENT', label: 'Alquiler Permanente', icon: 'calendar' },
    { type: 'ANTICRETICO', label: 'Anticretico', icon: 'key' },
];

const currencies = [
    { code: 'BOB', label: 'Bolivianos', symbol: 'Bs' },
    { code: 'USD', label: 'Dólares', symbol: '$' },
];

const sortOptions = [
    { value: 'createdAt-desc', label: 'Más recientes', sortBy: 'createdAt', sortOrder: 'desc' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor', sortBy: 'price', sortOrder: 'asc' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor', sortBy: 'price', sortOrder: 'desc' },
    { value: 'title-asc', label: 'Nombre: A-Z', sortBy: 'title', sortOrder: 'asc' },
];

const getFilterButtonColor = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
        case 'HOUSE':
            return '#5585b5';
        case 'APARTMENT':
            return '#10b981';
        case 'OFFICE':
            return '#f97316';
        case 'LAND':
            return '#f59e0b';
        case 'COMMERCIAL':
            return '#8b5cf6';
        case 'WAREHOUSE':
            return '#6366f1';
        case 'ROOM':
            return '#ec4899';
        default:
            return '#5585b5';
    }
};

export default function FiltersModal({
    visible,
    onClose,
    filters: initialFilters,
    onApplyFilters,
    selectedPropertyTypes,
    onTogglePropertyType,
}: FiltersModalProps) {
    const { width } = useWindowDimensions();
    const isMobile = width <= 768;

    // Estado local de filtros
    const [localFilters, setLocalFilters] = useState<PropertyFilters>(initialFilters);

    // Precio slider state - dual range [min, max]
    const [priceRange, setPriceRange] = useState<number[]>([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 1000000
    ]);

    // Estado temporal para visualización inmediata del slider (optimización de rendimiento)
    const [tempPriceRange, setTempPriceRange] = useState<number[]>([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 1000000
    ]);

    // Secciones colapsables
    const [expandedSections, setExpandedSections] = useState({
        propertyType: false,
        operationType: false,
        price: false,
        rooms: false,
        location: false,
        sort: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Optimizar callbacks del slider para mejor rendimiento
    const handlePriceRangeChange = useCallback((values: number[]) => {
        // Solo actualizar visualización inmediata (sin operaciones pesadas)
        setTempPriceRange(values);
    }, []);

    const handlePriceRangeFinish = useCallback((values: number[]) => {
        // Actualizar estado real cuando el usuario termine de arrastrar
        setPriceRange(values);
    }, []);

    const toggleOperationType = (opType: string) => {
        setLocalFilters(prev => ({
            ...prev,
            operationType: prev.operationType === opType ? undefined : opType as any,
        }));
    };

    const toggleCurrency = (curr: string) => {
        setLocalFilters(prev => ({
            ...prev,
            currency: prev.currency === curr ? undefined : curr as any,
        }));
    };

    const handleApplyFilters = () => {
        // Actualizar filtros con valores del slider
        const updatedFilters = {
            ...localFilters,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 1000000 ? priceRange[1] : undefined,
        };
        onApplyFilters(updatedFilters);
        onClose();
    };

    const handleClearAllFilters = () => {
        setLocalFilters({
            page: 1,
            limit: 20,
        });
        setPriceRange([0, 1000000]);
        setTempPriceRange([0, 1000000]);
        // Limpiar todos los tipos de propiedad - solo toggle si está seleccionado
        propertyTypes.forEach(pt => {
            if (selectedPropertyTypes[pt.type]) {
                onTogglePropertyType(pt.type);
            }
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name="filter" size={22} color="#5585b5" />
                            <Text style={styles.modalTitle}>Filtros Avanzados</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={28} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filtersList} showsVerticalScrollIndicator={false}>
                        {/* Sección: Tipo de Propiedad */}
                        <TouchableOpacity
                            style={styles.filterSectionHeader}
                            onPress={() => toggleSection('propertyType')}
                        >
                            <View style={styles.filterSectionHeaderLeft}>
                                <MaterialCommunityIcons name="home-variant" size={20} color="#5585b5" />
                                <Text style={styles.filterSectionTitle}>Tipo de Propiedad</Text>
                            </View>
                            <Ionicons
                                name={expandedSections.propertyType ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {expandedSections.propertyType && (
                            <View style={styles.filterSectionContent}>
                                {propertyTypes.map((pt) => (
                                    <TouchableOpacity
                                        key={pt.type}
                                        style={styles.filterItemContainer}
                                        onPress={() => onTogglePropertyType(pt.type)}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                selectedPropertyTypes[pt.type] && {
                                                    backgroundColor: getFilterButtonColor(pt.type),
                                                    borderColor: getFilterButtonColor(pt.type),
                                                }
                                            ]}
                                        >
                                            {selectedPropertyTypes[pt.type] && (
                                                <Ionicons name="checkmark" size={16} color="#ffffff" />
                                            )}
                                        </View>
                                        <Text style={styles.filterItemLabel}>{pt.label}</Text>
                                        <View
                                            style={[
                                                styles.colorIndicator,
                                                { backgroundColor: getFilterButtonColor(pt.type) }
                                            ]}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Sección: Tipo de Operación */}
                        <TouchableOpacity
                            style={styles.filterSectionHeader}
                            onPress={() => toggleSection('operationType')}
                        >
                            <View style={styles.filterSectionHeaderLeft}>
                                <MaterialCommunityIcons name="tag-multiple" size={20} color="#5585b5" />
                                <Text style={styles.filterSectionTitle}>Tipo de Operación</Text>
                            </View>
                            <Ionicons
                                name={expandedSections.operationType ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {expandedSections.operationType && (
                            <View style={styles.filterSectionContent}>
                                {operationTypes.map((op) => (
                                    <TouchableOpacity
                                        key={op.type}
                                        style={styles.filterChipContainer}
                                        onPress={() => toggleOperationType(op.type)}
                                    >
                                        <View
                                            style={[
                                                styles.filterChip,
                                                localFilters.operationType === op.type && styles.filterChipSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name={op.icon as any}
                                                size={16}
                                                color={localFilters.operationType === op.type ? '#ffffff' : '#5585b5'}
                                            />
                                            <Text
                                                style={[
                                                    styles.filterChipText,
                                                    localFilters.operationType === op.type && styles.filterChipTextSelected,
                                                ]}
                                            >
                                                {op.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Sección: Rango de Precios con SLIDER */}
                        <TouchableOpacity
                            style={styles.filterSectionHeader}
                            onPress={() => toggleSection('price')}
                        >
                            <View style={styles.filterSectionHeaderLeft}>
                                <MaterialCommunityIcons name="cash-multiple" size={20} color="#5585b5" />
                                <Text style={styles.filterSectionTitle}>Rango de Precios</Text>
                            </View>
                            <Ionicons
                                name={expandedSections.price ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {expandedSections.price && (
                            <View style={styles.filterSectionContent}>
                                {/* Moneda */}
                                <Text style={styles.filterSubtitle}>Moneda</Text>
                                <View style={styles.currencyContainer}>
                                    {currencies.map((curr) => (
                                        <TouchableOpacity
                                            key={curr.code}
                                            style={[
                                                styles.currencyChip,
                                                localFilters.currency === curr.code && styles.currencyChipSelected,
                                            ]}
                                            onPress={() => toggleCurrency(curr.code)}
                                        >
                                            <Text
                                                style={[
                                                    styles.currencyChipText,
                                                    localFilters.currency === curr.code && styles.currencyChipTextSelected,
                                                ]}
                                            >
                                                {curr.symbol}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Rango de Precios - Dual Range Slider */}
                                <View style={styles.priceRangeHeader}>
                                    <View style={styles.priceRangeLabel}>
                                        <Text style={styles.filterSubtitle}>Mínimo</Text>
                                        <Text style={styles.priceValue}>{tempPriceRange[0].toLocaleString()}</Text>
                                    </View>
                                    <View style={[styles.priceRangeLabel, { alignItems: 'flex-end' }]}>
                                        <Text style={styles.filterSubtitle}>Máximo</Text>
                                        <Text style={styles.priceValue}>{tempPriceRange[1].toLocaleString()}</Text>
                                    </View>
                                </View>
                                <MultiSlider
                                    values={tempPriceRange}
                                    onValuesChange={handlePriceRangeChange}
                                    onValuesChangeFinish={handlePriceRangeFinish}
                                    min={0}
                                    max={1000000}
                                    step={500}
                                    sliderLength={isMobile ? width - 88 : 450}
                                    snapped
                                    allowOverlap={false}
                                    minMarkerOverlapDistance={40}
                                    selectedStyle={{
                                        backgroundColor: '#5585b5',
                                    }}
                                    unselectedStyle={{
                                        backgroundColor: '#e2e8f0',
                                    }}
                                    markerStyle={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 10,
                                        backgroundColor: '#5585b5',
                                    }}
                                    pressedMarkerStyle={{
                                        height: 22,
                                        width: 22,
                                        borderRadius: 11,
                                    }}
                                    containerStyle={{
                                        height: 50,
                                        marginVertical: 10,
                                        alignSelf: 'center',
                                    }}
                                    trackStyle={{
                                        height: 4,
                                        borderRadius: 2,
                                    }}
                                />
                            </View>
                        )}

                        {/* Sección: Habitaciones y Baños */}
                        <TouchableOpacity
                            style={styles.filterSectionHeader}
                            onPress={() => toggleSection('rooms')}
                        >
                            <View style={styles.filterSectionHeaderLeft}>
                                <MaterialCommunityIcons name="bed" size={20} color="#5585b5" />
                                <Text style={styles.filterSectionTitle}>Habitaciones y Baños</Text>
                            </View>
                            <Ionicons
                                name={expandedSections.rooms ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {expandedSections.rooms && (
                            <View style={styles.filterSectionContent}>
                                <View style={styles.roomsRow}>
                                    {/* Habitaciones */}
                                    <View style={styles.roomsCol}>
                                        <Text style={styles.filterSubtitle}>Habitaciones</Text>
                                        <View style={styles.roomsButtonsRow}>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <TouchableOpacity
                                                    key={`bed-${num}`}
                                                    style={[
                                                        styles.roomButton,
                                                        localFilters.dormitorios_min === num && styles.roomButtonSelected,
                                                    ]}
                                                    onPress={() => setLocalFilters(prev => ({
                                                        ...prev,
                                                        dormitorios_min: prev.dormitorios_min === num ? undefined : num,
                                                    }))}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.roomButtonText,
                                                            localFilters.dormitorios_min === num && styles.roomButtonTextSelected,
                                                        ]}
                                                    >
                                                        {num}+
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Baños */}
                                    <View style={styles.roomsCol}>
                                        <Text style={styles.filterSubtitle}>Baños</Text>
                                        <View style={styles.roomsButtonsRow}>
                                            {[1, 2, 3, 4].map((num) => (
                                                <TouchableOpacity
                                                    key={`bath-${num}`}
                                                    style={[
                                                        styles.roomButton,
                                                        localFilters.baños_min === num && styles.roomButtonSelected,
                                                    ]}
                                                    onPress={() => setLocalFilters(prev => ({
                                                        ...prev,
                                                        baños_min: prev.baños_min === num ? undefined : num,
                                                    }))}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.roomButtonText,
                                                            localFilters.baños_min === num && styles.roomButtonTextSelected,
                                                        ]}
                                                    >
                                                        {num}+
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Sección: Ubicación */}
                        <TouchableOpacity
                            style={styles.filterSectionHeader}
                            onPress={() => toggleSection('location')}
                        >
                            <View style={styles.filterSectionHeaderLeft}>
                                <MaterialCommunityIcons name="map-marker" size={20} color="#5585b5" />
                                <Text style={styles.filterSectionTitle}>Ubicación</Text>
                            </View>
                            <Ionicons
                                name={expandedSections.location ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {expandedSections.location && (
                            <View style={styles.filterSectionContent}>
                                <Text style={styles.filterSubtitle}>Ciudad</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="Ej: Cochabamba, Santa Cruz"
                                    placeholderTextColor="#94a3b8"
                                    value={localFilters.city || ''}
                                    onChangeText={(text) => setLocalFilters(prev => ({
                                        ...prev,
                                        city: text || undefined,
                                    }))}
                                />
                            </View>
                        )}

                        {/* Sección: Ordenamiento */}
                        <TouchableOpacity
                            style={styles.filterSectionHeader}
                            onPress={() => toggleSection('sort')}
                        >
                            <View style={styles.filterSectionHeaderLeft}>
                                <MaterialCommunityIcons name="sort" size={20} color="#5585b5" />
                                <Text style={styles.filterSectionTitle}>Ordenar por</Text>
                            </View>
                            <Ionicons
                                name={expandedSections.sort ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {expandedSections.sort && (
                            <View style={styles.filterSectionContent}>
                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.filterItemContainer}
                                        onPress={() => setLocalFilters(prev => ({
                                            ...prev,
                                            sortBy: option.sortBy,
                                            sortOrder: option.sortOrder as any,
                                        }))}
                                    >
                                        <View
                                            style={[
                                                styles.radioButton,
                                                localFilters.sortBy === option.sortBy &&
                                                localFilters.sortOrder === option.sortOrder &&
                                                styles.radioButtonSelected,
                                            ]}
                                        >
                                            {localFilters.sortBy === option.sortBy &&
                                                localFilters.sortOrder === option.sortOrder && (
                                                    <View style={styles.radioButtonInner} />
                                                )}
                                        </View>
                                        <Text style={styles.filterItemLabel}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Espacio al final */}
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    {/* Botones de acción */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.filterActionButton}
                            onPress={handleClearAllFilters}
                        >
                            <Ionicons name="trash-outline" size={18} color="#64748b" />
                            <Text style={styles.filterActionButtonText}>Limpiar Todo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterActionButton, styles.filterActionButtonPrimary]}
                            onPress={handleApplyFilters}
                        >
                            <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                            <Text style={styles.filterActionButtonPrimaryText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingTop: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5585b5',
    },
    filtersList: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    filterItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    filterItemLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    filterActionButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 6,
    },
    filterActionButtonPrimary: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    filterActionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    filterActionButtonPrimaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        marginLeft: 6,
    },
    filterSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    filterSectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterSectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    filterSectionContent: {
        marginTop: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginBottom: 12,
    },
    filterSubtitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
        marginTop: 8,
    },
    filterChipContainer: {
        marginBottom: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
    },
    filterChipSelected: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
    },
    filterChipTextSelected: {
        color: '#ffffff',
    },
    currencyContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    currencyChip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        alignItems: 'center',
    },
    currencyChipSelected: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    currencyChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    currencyChipTextSelected: {
        color: '#ffffff',
    },
    priceInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 14,
        color: '#1f2937',
        marginBottom: 12,
    },
    priceRangeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 4,
    },
    priceRangeLabel: {
        flex: 1,
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5585b5',
        marginTop: 4,
    },
    roomsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    roomsCol: {
        flex: 1,
    },
    roomsButtonsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    roomButton: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomButtonSelected: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    roomButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1f2937',
    },
    roomButtonTextSelected: {
        color: '#ffffff',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    radioButtonSelected: {
        borderColor: '#5585b5',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#5585b5',
    },
});
