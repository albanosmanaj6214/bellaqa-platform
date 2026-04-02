export type Lang = 'de' | 'sq' | 'en' | 'tr' | 'fr';

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const UI_STRINGS: Record<string, Record<Lang, string>> = {
  dashboard: { de: 'Dashboard', sq: 'Paneli', en: 'Dashboard', tr: 'Panel', fr: 'Tableau de bord' },
  products: { de: 'Produkte', sq: 'Produktet', en: 'Products', tr: 'Ürünler', fr: 'Produits' },
  orders: { de: 'Bestellungen', sq: 'Porositë', en: 'Orders', tr: 'Siparişler', fr: 'Commandes' },
  invoices: { de: 'Rechnungen', sq: 'Faturat', en: 'Invoices', tr: 'Faturalar', fr: 'Factures' },
  customers: { de: 'Kunden', sq: 'Klientët', en: 'Customers', tr: 'Müşteriler', fr: 'Clients' },
  analytics: { de: 'Analytik', sq: 'Analitika', en: 'Analytics', tr: 'Analitik', fr: 'Analytique' },
  logout: { de: 'Abmelden', sq: 'Dilni', en: 'Logout', tr: 'Çıkış', fr: 'Déconnexion' },
  b2b_portal: { de: 'B2B Portal', sq: 'Portali B2B', en: 'B2B Portal', tr: 'B2B Portalı', fr: 'Portail B2B' },
  b2c_shop: { de: 'B2C Shop', sq: 'Dyqani B2C', en: 'B2C Shop', tr: 'B2C Mağaza', fr: 'Boutique B2C' },
  total_revenue: { de: 'Gesamtumsatz', sq: 'Të ardhura totale', en: 'Total Revenue', tr: 'Toplam Gelir', fr: 'Revenu Total' },
  net_price: { de: 'Nettopreis', sq: 'Çmimi neto', en: 'Net Price', tr: 'Net Fiyat', fr: 'Prix Net' },
  gross_price: { de: 'Bruttopreis', sq: 'Çmimi bruto', en: 'Gross Price', tr: 'Brüt Fiyat', fr: 'Prix Brut' },
  accepted: { de: 'Akzeptiert', sq: 'Pranuar', en: 'Accepted', tr: 'Kabul Edildi', fr: 'Accepté' },
  picking: { de: 'Kommissionierung', sq: 'Grumbullim', en: 'Picking', tr: 'Hazırlanıyor', fr: 'Préparation' },
  delivered: { de: 'Geliefert', sq: 'Dorëzuar', en: 'Delivered', tr: 'Teslim Edildi', fr: 'Livré' },
  pending: { de: 'Ausstehend', sq: 'Në pritje', en: 'Pending', tr: 'Bekliyor', fr: 'En attente' },
  cancelled: { de: 'Storniert', sq: 'Anuluar', en: 'Cancelled', tr: 'İptal', fr: 'Annulé' },
};

export function t(key: string, lang: Lang = 'de'): string {
  return UI_STRINGS[key]?.[lang] ?? UI_STRINGS[key]?.['de'] ?? key;
}

export function useLanguage(): Lang {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('bellaqa_lang') as Lang) || 'de';
  }
  return 'de';
}
