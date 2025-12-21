export const TRABZON_LOCATIONS = [
  "Trabzon, Ortahisar", "Trabzon, Akçaabat", "Trabzon, Yomra", "Trabzon, Arsin", 
  "Trabzon, Araklı", "Trabzon, Sürmene", "Trabzon, Of", "Trabzon, Vakfıkebir", 
  "Trabzon, Beşikdüzü", "Trabzon, Çarşıbaşı", "Trabzon, Maçka", "Trabzon, Tonya",
  "Trabzon, Düzköy", "Trabzon, Şalpazarı", "Trabzon, Köprübaşı", "Trabzon, Dernekpazarı", 
  "Trabzon, Hayrat", "Trabzon, Çaykara",
  "Trabzon, Ortahisar, Çukurçayır", "Trabzon, Ortahisar, Pelitli", "Trabzon, Ortahisar, Konaklar",
  "Trabzon, Ortahisar, Kalkınma", "Trabzon, Ortahisar, Bostancı", "Trabzon, Ortahisar, Üniversite",
  "Trabzon, Ortahisar, 1 Nolu Beşirli", "Trabzon, Ortahisar, 2 Nolu Beşirli", "Trabzon, Ortahisar, Toklu",
  "Trabzon, Ortahisar, Soğuksu", "Trabzon, Ortahisar, Bahçecik", "Trabzon, Ortahisar, Aydınlıkevler",
  "Trabzon, Ortahisar, Yeşiltepe", "Trabzon, Ortahisar, Boztepe", "Trabzon, Ortahisar, Yenicuma",
  "Trabzon, Ortahisar, Erdoğdu", "Trabzon, Ortahisar, Karşıyaka",
  "Trabzon, Akçaabat, Söğütlü", "Trabzon, Akçaabat, Yıldızlı", "Trabzon, Akçaabat, Yaylacık",
  "Trabzon, Akçaabat, Darıca", "Trabzon, Akçaabat, Mersin", "Trabzon, Akçaabat, Akçakale",
  "Trabzon, Yomra, Kaşüstü", "Trabzon, Yomra, Sancak", "Trabzon, Yomra, Gürsel", "Trabzon, Yomra, Namıkkemal"
];

export const PROPERTY_CATEGORIES: Record<string, Record<string, string[]>> = {
  "Konut": {
    "Satılık": ["Daire", "Rezidans", "Müstakil Ev", "Villa", "Çiftlik Evi", "Köşk & Konak", "Yalı", "Yalı Dairesi", "Yazlık", "Kooperatif", "Konut Projeleri"],
    "Kiralık": ["Daire", "Rezidans", "Müstakil Ev", "Villa", "Çiftlik Evi", "Köşk & Konak", "Yalı", "Yalı Dairesi", "Yazlık"],
    "Turistik Günlük Kiralık": ["Daire", "Rezidans", "Müstakil Ev", "Villa", "Devre Mülk", "Apart & Pansiyon"],
    "Devren Satılık Konut": ["Daire", "Villa"]
  },
  "İş Yeri": {
    "Satılık": ["Akaryakıt İstasyonu", "Apartman Dairesi", "Atölye", "AVM", "Büfe", "Büro & Ofis", "Çiftlik", "Depo & Antrepo", "Düğün Salonu", "Dükkan & Mağaza", "Enerji Santrali", "Fabrika & Üretim Tesisi"],
    "Kiralık": ["Akaryakıt İstasyonu", "Atölye", "AVM", "Büro & Ofis", "Depo & Antrepo", "Dükkan & Mağaza", "Fabrika & Üretim Tesisi", "Plaza", "Plaza Katı"],
    "Devren Satılık": ["Akaryakıt İstasyonu", "Büfe", "Dükkan & Mağaza", "Restoran & Lokanta", "Kafe & Bar"],
    "Devren Kiralık": ["Büfe", "Dükkan & Mağaza", "Restoran & Lokanta"]
  },
  "Arsa": {
    "Satılık": ["Konut İmarlı", "Ticari İmarlı", "Sanayi İmarlı", "Tarla", "Zeytinlik", "Bağ & Bahçe", "Turistik İmarlı", "Depo İmarlı"],
    "Kiralık": ["Tarla", "Zeytinlik", "Bağ & Bahçe", "Depo Arazisi"]
  },
  "Konut Projeleri": {
      "Satılık": ["Daire", "Villa", "Rezidans", "Ofis"]
  },
  "Bina": {
    "Satılık": ["Komple Bina", "Yurt", "Otel"],
    "Kiralık": ["Komple Bina", "Yurt"]
  },
  "Devre Mülk": {
    "Satılık": ["Apart", "Daire", "Villa"],
    "Kiralık": ["Apart", "Daire", "Villa"]
  },
  "Turistik Tesis": {
    "Satılık": ["Otel", "Apart Otel", "Butik Otel", "Tatil Köyü", "Pansiyon", "Kamp Yeri"],
    "Kiralık": ["Otel", "Apart Otel", "Butik Otel", "Pansiyon"]
  }
}
