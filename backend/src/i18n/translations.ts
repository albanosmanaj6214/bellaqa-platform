export type Lang = 'de' | 'sq' | 'en' | 'tr' | 'fr';

export const translations: Record<string, Record<Lang, string>> = {
  order_accepted: {
    de: 'Ihre Bestellung wurde akzeptiert',
    sq: 'Porosia juaj u pranua',
    en: 'Your order has been accepted',
    tr: 'Siparişiniz kabul edildi',
    fr: 'Votre commande a été acceptée',
  },
  order_picking: {
    de: 'Ihre Bestellung wird kommissioniert',
    sq: 'Porosia juaj po grumbullohet',
    en: 'Your order is being picked',
    tr: 'Siparişiniz hazırlanıyor',
    fr: 'Votre commande est en cours de préparation',
  },
  order_shipped: {
    de: 'Ihre Bestellung ist unterwegs',
    sq: 'Porosia juaj është dërguar',
    en: 'Your order has been shipped',
    tr: 'Siparişiniz kargoya verildi',
    fr: 'Votre commande a été expédiée',
  },
  order_delivered: {
    de: 'Ihre Bestellung wurde geliefert',
    sq: 'Porosia juaj është dorëzuar',
    en: 'Your order has been delivered',
    tr: 'Siparişiniz teslim edildi',
    fr: 'Votre commande a été livrée',
  },
  invoice_due: {
    de: 'Rechnung fällig',
    sq: 'Fatura e duhur',
    en: 'Invoice due',
    tr: 'Fatura vadesi geldi',
    fr: 'Facture due',
  },
  welcome: {
    de: 'Willkommen bei BELLAQA',
    sq: 'Mirë se vini në BELLAQA',
    en: 'Welcome to BELLAQA',
    tr: "BELLAQA'ya Hoş Geldiniz",
    fr: 'Bienvenue chez BELLAQA',
  },
  vat_label_food: {
    de: 'MwSt. 7% (Lebensmittel)',
    sq: 'TVSH 7% (Ushqim)',
    en: 'VAT 7% (Food)',
    tr: 'KDV %7 (Gıda)',
    fr: 'TVA 7% (Alimentation)',
  },
  vat_label_beverage: {
    de: 'MwSt. 19% (Getränke)',
    sq: 'TVSH 19% (Pije)',
    en: 'VAT 19% (Beverages)',
    tr: 'KDV %19 (İçecekler)',
    fr: 'TVA 19% (Boissons)',
  },
  pfand_label: {
    de: 'Pfand (Mehrwegpfand)',
    sq: 'Depozitë (Kaution)',
    en: 'Deposit (Pfand)',
    tr: 'Depozito (Pfand)',
    fr: 'Consigne (Pfand)',
  },
};

export function t(key: string, lang: Lang = 'de'): string {
  return translations[key]?.[lang] ?? translations[key]?.['de'] ?? key;
}
