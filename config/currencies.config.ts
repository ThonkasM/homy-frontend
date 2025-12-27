/**
 * Configuración de monedas disponibles
 * Sincronizado con backend/enum Currency
 */

export enum Currency {
    BOB = 'BOB', // Bolivianos
    USD = 'USD', // Dólares estadounidenses
    ARS = 'ARS', // Pesos argentinos
    PEN = 'PEN', // Soles peruanos
    CLP = 'CLP', // Pesos chilenos
    MXN = 'MXN', // Pesos mexicanos
    COP = 'COP', // Pesos colombianos
}

export interface CurrencyOption {
    label: string;
    value: Currency;
    symbol: string;
    country: string;
}

export const CURRENCIES: CurrencyOption[] = [
    {
        label: 'Bolivianos (BOB)',
        value: Currency.BOB,
        symbol: 'Bs.',
        country: '🇧🇴 Bolivia',
    },
    {
        label: 'Dólares USD',
        value: Currency.USD,
        symbol: '$',
        country: '🇺🇸 USA',
    },
    {
        label: 'Pesos Argentinos (ARS)',
        value: Currency.ARS,
        symbol: '$',
        country: '🇦🇷 Argentina',
    },
    {
        label: 'Soles (PEN)',
        value: Currency.PEN,
        symbol: 'S/',
        country: '🇵🇪 Perú',
    },
    {
        label: 'Pesos Chilenos (CLP)',
        value: Currency.CLP,
        symbol: '$',
        country: '🇨🇱 Chile',
    },
    {
        label: 'Pesos Mexicanos (MXN)',
        value: Currency.MXN,
        symbol: '$',
        country: '🇲🇽 México',
    },
    {
        label: 'Pesos Colombianos (COP)',
        value: Currency.COP,
        symbol: '$',
        country: '🇨🇴 Colombia',
    },
];

/**
 * Obtener símbolo de moneda
 */
export function getCurrencySymbol(currency: Currency | string): string {
    const currencyOption = CURRENCIES.find((c) => c.value === currency);
    return currencyOption?.symbol || '$';
}

/**
 * Obtener label completo de moneda
 */
export function getCurrencyLabel(currency: Currency | string): string {
    const currencyOption = CURRENCIES.find((c) => c.value === currency);
    return currencyOption?.label || 'Moneda desconocida';
}

/**
 * Formatear precio con símbolo de moneda y separador de miles
 */
export function formatPriceWithCurrency(price: number | string, currency: Currency | string): string {
    // Convertir a número si es string
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;

    // Si es NaN, retornar vacío
    if (isNaN(numPrice)) return '';

    // Obtener símbolo de moneda
    const symbol = getCurrencySymbol(currency);

    // Formatear número con separador de miles
    const formattedNumber = numPrice.toLocaleString();

    return `${symbol} ${formattedNumber}`;
}
