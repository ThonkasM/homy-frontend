# 🔍 Guía de Filtros Avanzados - Homi

## Resumen de Implementación

Se ha implementado un sistema completo de filtros avanzados en la pantalla de inicio (`home.tsx`) que permite a los usuarios buscar y filtrar propiedades de manera elegante y eficiente.

---

## 📋 Características Implementadas

### 1. **Filtros Disponibles**

#### 🏠 Tipo de Propiedad
- Casa
- Departamento
- Oficina
- Terreno
- Comercial
- Almacén
- Habitación

**Multi-selección**: Los usuarios pueden seleccionar múltiples tipos de propiedad simultáneamente.

#### 🏷️ Tipo de Operación
- **Venta**: Compra definitiva
- **Alquiler Temporal**: Renta por corto plazo
- **Alquiler Permanente**: Renta por largo plazo
- **Anticretico**: Sistema de garantía boliviano

**Selección única**: Solo un tipo de operación puede estar activo a la vez.

#### 💰 Rango de Precios
- **Moneda**: BOB (Bolivianos), USD (Dólares), ARS (Pesos Argentinos)
- **Precio Mínimo**: Campo numérico para establecer precio base
- **Precio Máximo**: Campo numérico para establecer tope de precio

#### 🛏️ Habitaciones y Baños
- **Habitaciones**: Filtro por cantidad mínima (1+ a 5+)
- **Baños**: Filtro por cantidad mínima (1+ a 4+)

**Selección única**: Solo un valor puede estar activo para cada categoría.

#### 📍 Ubicación
- **Ciudad**: Búsqueda por nombre de ciudad (ej: Cochabamba, Santa Cruz)
- Soporte para búsqueda parcial (case-insensitive)

#### 📊 Ordenamiento
- **Más recientes**: Por fecha de creación (descendente)
- **Precio: Menor a Mayor**: Ordenar por precio ascendente
- **Precio: Mayor a Menor**: Ordenar por precio descendente
- **Nombre: A-Z**: Ordenar alfabéticamente

---

## 🎨 Interfaz de Usuario

### Modal de Filtros

El modal de filtros utiliza **secciones colapsables** para organizar los diferentes tipos de filtros:

```
┌─────────────────────────────┐
│  🔍 Filtros Avanzados    ✕  │
├─────────────────────────────┤
│ 🏠 Tipo de Propiedad    ▼   │
│   ☑ Casa                    │
│   ☑ Departamento            │
│   ...                       │
├─────────────────────────────┤
│ 🏷️ Tipo de Operación    ▼   │
│   [ Venta ]                 │
│   [ Alquiler Temporal ]     │
│   ...                       │
├─────────────────────────────┤
│ 💰 Rango de Precios     ▼   │
│   Moneda: [Bs] [$] [ARS$]  │
│   Min: [_______]            │
│   Max: [_______]            │
├─────────────────────────────┤
│ 🛏️ Habitaciones y Baños ▼   │
│   Habitaciones: [1+][2+]... │
│   Baños: [1+][2+]...        │
├─────────────────────────────┤
│ 📍 Ubicación            ▼   │
│   Ciudad: [_______]         │
├─────────────────────────────┤
│ 📊 Ordenar por          ▼   │
│   ⚫ Más recientes           │
│   ⚪ Precio: Menor a Mayor   │
│   ...                       │
├─────────────────────────────┤
│ [🗑️ Limpiar] [✓ Aplicar]    │
└─────────────────────────────┘
```

### Chips de Filtros Activos

Los filtros activos se muestran como **chips removibles** debajo del botón de filtros:

```
┌─────────────────────────────────┐
│ [🔍 Filtros (5)]                │
├─────────────────────────────────┤
│ [Venta ✕] [Min: 50000 ✕]       │
│ [2+ Hab. ✕] [Cochabamba ✕]     │
└─────────────────────────────────┘
```

### Badge de Filtros Activos

Un **badge numérico** en el botón de filtros indica cuántos filtros están activos:

```
┌──────────────────┐
│ 🔍 Filtros  (5)  │
└──────────────────┘
```

---

## 🔧 Arquitectura Técnica

### 1. **Hook Actualizado: `use-properties.ts`**

```typescript
export interface PropertyFilters {
    propertyType?: string;
    operationType?: 'SALE' | 'RENT_TEMPORARY' | 'RENT_PERMANENT' | 'ANTICRETICO';
    status?: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'INACTIVE';
    postStatus?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    currency?: 'BOB' | 'USD' | 'ARS' | 'PEN' | 'CLP' | 'MXN' | 'COP';
    search?: string;
    amenities?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
```

### 2. **API Service Expandido: `api.ts`**

La función `getProperties()` ahora soporta todos los parámetros de filtrado:

```typescript
async getProperties(filters?: {
    page?: number;
    limit?: number;
    propertyType?: string;
    operationType?: string;
    status?: string;
    currency?: string;
    search?: string;
    amenities?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: string;
})
```

Los filtros se envían al backend como **query parameters**:

```
GET /api/properties?operationType=SALE&minPrice=50000&bedrooms=2&sortBy=price&sortOrder=asc
```

### 3. **Estado de Filtros en `home.tsx`**

```typescript
// Estado principal de filtros (se envía al backend)
const [advancedFilters, setAdvancedFilters] = useState<PropertyFilters>({
  page: 1,
  limit: 20,
});

// Estado de UI para tipos de propiedad (multi-selección)
const [selectedPropertyTypes, setSelectedPropertyTypes] = useState({
  HOUSE: true,
  APARTMENT: true,
  // ...
});

// Estado de secciones colapsables
const [expandedSections, setExpandedSections] = useState({
  propertyType: true,
  operationType: false,
  price: false,
  rooms: false,
  location: false,
  sort: false,
});
```

---

## 🚀 Flujo de Filtrado

### 1. **Apertura del Modal**
El usuario presiona el botón "Filtros" → Se abre el modal con los filtros actuales seleccionados.

### 2. **Selección de Filtros**
El usuario selecciona/deselecciona filtros en las diferentes secciones colapsables.

### 3. **Aplicar Filtros**
El usuario presiona "Aplicar Filtros" → Se ejecuta `applyFilters()`:

```typescript
const applyFilters = async () => {
  setFilterModalVisible(false);
  await loadPropertiesWithFilters();
};
```

### 4. **Construcción de Query**
La función `loadPropertiesWithFilters()` construye el objeto de filtros:

```typescript
const filters: PropertyFilters = {
  ...advancedFilters,
  search: searchQuery || undefined,
  page: 1,
  limit: 20,
};

// Solo agregar propertyType si hay tipos seleccionados
if (activePropertyTypes.length > 0 && 
    activePropertyTypes.length < propertyTypes.length) {
  filters.propertyType = activePropertyTypes[0];
}
```

### 5. **Llamada al Backend**
Se envía la petición GET con todos los filtros como query params.

### 6. **Actualización de Propiedades**
El backend devuelve las propiedades filtradas → Se actualiza el estado → La UI se re-renderiza.

---

## 🎯 Búsqueda en Tiempo Real

La búsqueda de texto utiliza **debounce** para evitar llamadas excesivas al backend:

```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (searchQuery) {
      loadPropertiesWithFilters();
    }
  }, 500); // Esperar 500ms después de que el usuario deje de escribir
  
  return () => clearTimeout(timeoutId);
}, [searchQuery]);
```

---

## 💡 Optimizaciones Implementadas

### 1. **Memoización**
- Las propiedades filtradas localmente usan `useMemo`
- Los callbacks usan `useCallback`
- Componentes envueltos en `React.memo`

### 2. **Filtrado Híbrido**
- **Backend**: Filtros principales (tipo, precio, habitaciones, etc.)
- **Frontend**: Búsqueda de texto local (para reducir llamadas al servidor)

### 3. **Secciones Colapsables**
Solo las secciones expandidas renderizan su contenido → Mejora el rendimiento del modal.

### 4. **Debounce en Búsqueda**
Evita llamadas al backend en cada tecla presionada.

---

## 📱 Diseño Responsive

### Mobile (width ≤ 768px)
- Modal ocupa 90% de la altura de pantalla
- Botones más compactos
- Chips de filtros activos en fila con wrap

### Desktop/Tablet (width > 768px)
- Modal centrado con ancho máximo de 600px
- Botones más grandes con íconos
- Mejor espaciado visual

---

## 🎨 Paleta de Colores

```typescript
// Colores principales
Primary Blue:     #5585b5  // Botones principales
Light Blue:       #79c2d0  // Accents
Cyan:             #53a8b6  // Secondary

// Estados
Selected:         #5585b5  // Elemento seleccionado
Hover:            #e0f2fe  // Fondo de hover
Border:           #e5e7eb  // Bordes neutros

// Texto
Dark:             #1f2937  // Texto principal
Gray:             #64748b  // Texto secundario
Light Gray:       #94a3b8  // Placeholders
```

---

## 🔄 Sincronización Backend-Frontend

### Backend DTO (FilterPropertyDto)
```typescript
enum PropertyType { HOUSE, APARTMENT, OFFICE, LAND, ... }
enum OperationType { SALE, RENT_TEMPORARY, RENT_PERMANENT, ANTICRETICO }
enum Currency { BOB, USD, ARS, PEN, CLP, MXN, COP }

class FilterPropertyDto {
  propertyType?: PropertyType;
  operationType?: OperationType;
  currency?: Currency;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### Frontend Interface (PropertyFilters)
```typescript
interface PropertyFilters {
  propertyType?: string;
  operationType?: 'SALE' | 'RENT_TEMPORARY' | 'RENT_PERMANENT' | 'ANTICRETICO';
  currency?: 'BOB' | 'USD' | 'ARS' | 'PEN' | 'CLP' | 'MXN' | 'COP';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

**✅ Total compatibilidad**: Los enums del backend se mapean directamente a los tipos del frontend.

---

## 🧪 Casos de Uso

### Caso 1: Buscar Departamento en Venta
```
1. Abrir modal de filtros
2. En "Tipo de Propiedad", seleccionar solo "Departamento"
3. En "Tipo de Operación", seleccionar "Venta"
4. Presionar "Aplicar Filtros"

Query resultante:
GET /api/properties?propertyType=APARTMENT&operationType=SALE
```

### Caso 2: Buscar Casa con 3+ Habitaciones bajo $100,000
```
1. Abrir modal de filtros
2. Seleccionar "Casa"
3. En "Rango de Precios", seleccionar moneda "USD"
4. Ingresar Max Price: 100000
5. En "Habitaciones", seleccionar "3+"
6. Presionar "Aplicar Filtros"

Query resultante:
GET /api/properties?propertyType=HOUSE&currency=USD&maxPrice=100000&bedrooms=3
```

### Caso 3: Buscar Propiedades más Baratas en Cochabamba
```
1. Abrir modal de filtros
2. En "Ubicación", escribir "Cochabamba"
3. En "Ordenar por", seleccionar "Precio: Menor a Mayor"
4. Presionar "Aplicar Filtros"

Query resultante:
GET /api/properties?city=Cochabamba&sortBy=price&sortOrder=asc
```

---

## 🛠️ Mantenimiento Futuro

### Agregar Nuevo Filtro

1. **Actualizar Backend DTO** (`filter-property.dto.ts`)
2. **Actualizar Frontend Interface** (`use-properties.ts`)
3. **Agregar al API Service** (`api.ts`)
4. **Agregar al Estado** (`home.tsx`)
5. **Agregar Sección al Modal** (nuevo collapsible)
6. **Agregar Estilos** (si es necesario)

### Ejemplo: Agregar Filtro "Mascotas Permitidas"

```typescript
// 1. Backend DTO
@IsBoolean()
@IsOptional()
petsAllowed?: boolean;

// 2. Frontend Interface
petsAllowed?: boolean;

// 3. API Service
if (filters?.petsAllowed !== undefined) {
  params.append('petsAllowed', filters.petsAllowed.toString());
}

// 4. Estado
const [advancedFilters, setAdvancedFilters] = useState({
  // ...
  petsAllowed: undefined,
});

// 5. Modal UI
<TouchableOpacity
  style={styles.filterChip}
  onPress={() => setAdvancedFilters(prev => ({
    ...prev,
    petsAllowed: !prev.petsAllowed,
  }))}
>
  <Text>Mascotas Permitidas</Text>
</TouchableOpacity>
```

---

## 📊 Métricas de Filtros

Para analítica, se pueden trackear:
- Filtros más utilizados
- Combinaciones de filtros frecuentes
- Tiempo promedio de búsqueda
- Tasa de conversión por filtro

---

## ✅ Checklist de Testing

- [ ] Modal se abre y cierra correctamente
- [ ] Secciones se expanden/contraen
- [ ] Selección de múltiples tipos de propiedad funciona
- [ ] Selección única de operationType funciona
- [ ] Inputs de precio aceptan solo números
- [ ] Botones de habitaciones/baños togglean correctamente
- [ ] Ordenamiento cambia el orden de las propiedades
- [ ] Chips de filtros activos se pueden remover
- [ ] Badge muestra el número correcto de filtros activos
- [ ] Búsqueda con debounce funciona
- [ ] Responsive en mobile y desktop
- [ ] Backend recibe los filtros correctamente
- [ ] Limpiar filtros resetea todo el estado

---

## 🎓 Conclusión

Este sistema de filtros avanzados proporciona:

✅ **Flexibilidad**: Múltiples criterios de búsqueda combinables
✅ **Usabilidad**: Interfaz intuitiva con secciones colapsables
✅ **Rendimiento**: Optimizado con memoización y debounce
✅ **Escalabilidad**: Fácil agregar nuevos filtros
✅ **Mantenibilidad**: Código bien estructurado y documentado
✅ **Compatibilidad**: Total sincronización backend-frontend

---

**Desarrollado con ❤️ para Homi - Real Estate Platform**
