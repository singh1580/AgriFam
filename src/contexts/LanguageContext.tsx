import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'english' | 'hindi' | 'bengali' | 'tamil' | 'telugu' | 'marathi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  english: {
    'dashboard.title': 'Dashboard',
    'dashboard.farmer': 'Farmer Dashboard',
    'dashboard.buyer': 'Buyer Dashboard',
    'dashboard.admin': 'Admin Dashboard',
    'navigation.home': 'Home',
    'navigation.products': 'Products',
    'navigation.orders': 'Orders',
    'navigation.notifications': 'Notifications',
    'navigation.feedback': 'Feedback',
    'navigation.browse': 'Browse',
    'navigation.history': 'History',
    'settings.theme': 'Theme Preference',
    'settings.language': 'Language',
    'settings.save': 'Save Settings',
    'settings.cancel': 'Cancel',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'feedback.title': 'Feedback & Support',
    'feedback.submit': 'Submit Feedback',
    'feedback.rate': 'Rate Your Experience',
  },
  hindi: {
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.farmer': 'किसान डैशबोर्ड',
    'dashboard.buyer': 'खरीदार डैशबोर्ड',
    'dashboard.admin': 'प्रशासक डैशबोर्ड',
    'navigation.home': 'होम',
    'navigation.products': 'उत्पाद',
    'navigation.orders': 'ऑर्डर',
    'navigation.notifications': 'सूचनाएं',
    'navigation.feedback': 'फीडबैक',
    'navigation.browse': 'ब्राउज़',
    'navigation.history': 'इतिहास',
    'settings.theme': 'थीम वरीयता',
    'settings.language': 'भाषा',
    'settings.save': 'सेटिंग्स सेव करें',
    'settings.cancel': 'रद्द करें',
    'theme.light': 'लाइट',
    'theme.dark': 'डार्क',
    'theme.system': 'सिस्टम',
    'feedback.title': 'फीडबैक और सहायता',
    'feedback.submit': 'फीडबैक भेजें',
    'feedback.rate': 'अपना अनुभव रेट करें',
  },
  bengali: {
    'dashboard.title': 'ড্যাশবোর্ড',
    'dashboard.farmer': 'কৃষক ড্যাশবোর্ড',
    'dashboard.buyer': 'ক্রেতা ড্যাশবোর্ড',
    'dashboard.admin': 'প্রশাসক ড্যাশবোর্ড',
    'navigation.home': 'হোম',
    'navigation.products': 'পণ্য',
    'navigation.orders': 'অর্ডার',
    'navigation.notifications': 'বিজ্ঞপ্তি',
    'navigation.feedback': 'মতামত',
    'navigation.browse': 'ব্রাউজ',
    'navigation.history': 'ইতিহাস',
    'settings.theme': 'থিম পছন্দ',
    'settings.language': 'ভাষা',
    'settings.save': 'সেটিংস সেভ করুন',
    'settings.cancel': 'বাতিল',
    'theme.light': 'হালকা',
    'theme.dark': 'গাঢ়',
    'theme.system': 'সিস্টেম',
    'feedback.title': 'মতামত ও সহায়তা',
    'feedback.submit': 'মতামত পাঠান',
    'feedback.rate': 'আপনার অভিজ্ঞতা রেট করুন',
  },
  tamil: {
    'dashboard.title': 'டேஷ்போர்டு',
    'dashboard.farmer': 'விவசாயி டேஷ்போர்டு',
    'dashboard.buyer': 'வாங்குபவர் டேஷ்போர்டு',
    'dashboard.admin': 'நிர்வாகி டேஷ்போர்டு',
    'navigation.home': 'முகப்பு',
    'navigation.products': 'தயாரிப்புகள்',
    'navigation.orders': 'ஆர்டர்கள்',
    'navigation.notifications': 'அறிவிப்புகள்',
    'navigation.feedback': 'கருத்து',
    'navigation.browse': 'உலாவு',
    'navigation.history': 'வரலாறு',
    'settings.theme': 'தீம் விருப்பம்',
    'settings.language': 'மொழி',
    'settings.save': 'அமைப்புகளை சேமி',
    'settings.cancel': 'ரத்து செய்',
    'theme.light': 'வெளிச்சம்',
    'theme.dark': 'இருள்',
    'theme.system': 'அமைப்பு',
    'feedback.title': 'கருத்து மற்றும் ஆதரவு',
    'feedback.submit': 'கருத்து அனுப்பு',
    'feedback.rate': 'உங்கள் அனுபவத்தை மதிப்பிடு',
  },
  telugu: {
    'dashboard.title': 'డాష్‌బోర్డ్',
    'dashboard.farmer': 'రైతు డాష్‌బోర్డ్',
    'dashboard.buyer': 'కొనుగోలుదారు డాష్‌బోర్డ్',
    'dashboard.admin': 'నిర్వాహకుడు డాష్‌బోర్డ్',
    'navigation.home': 'హోమ్',
    'navigation.products': 'ఉత్పత్తులు',
    'navigation.orders': 'ఆర్డర్లు',
    'navigation.notifications': 'నోటిఫికేషన్లు',
    'navigation.feedback': 'ఫీడ్‌బ్యాక్',
    'navigation.browse': 'బ్రౌజ్',
    'navigation.history': 'చరిత్ర',
    'settings.theme': 'థీమ్ ప్రాధాన్యత',
    'settings.language': 'భాష',
    'settings.save': 'సెట్టింగులను సేవ్ చేయండి',
    'settings.cancel': 'రద్దు చేయండి',
    'theme.light': 'లైట్',
    'theme.dark': 'డార్క్',
    'theme.system': 'సిస్టమ్',
    'feedback.title': 'ఫీడ్‌బ్యాక్ మరియు మద్దతు',
    'feedback.submit': 'ఫీడ్‌బ్యాక్ పంపండి',
    'feedback.rate': 'మీ అనుభవాన్ని రేట్ చేయండి',
  },
  marathi: {
    'dashboard.title': 'डॅशबोर्ड',
    'dashboard.farmer': 'शेतकरी डॅशबोर्ड',
    'dashboard.buyer': 'खरेदीदार डॅशबोर्ड',
    'dashboard.admin': 'प्रशासक डॅशबोर्ड',
    'navigation.home': 'होम',
    'navigation.products': 'उत्पादने',
    'navigation.orders': 'ऑर्डर',
    'navigation.notifications': 'सूचना',
    'navigation.feedback': 'फीडबॅक',
    'navigation.browse': 'ब्राउझ',
    'navigation.history': 'इतिहास',
    'settings.theme': 'थीम प्राधान्य',
    'settings.language': 'भाषा',
    'settings.save': 'सेटिंग्ज सेव्ह करा',
    'settings.cancel': 'रद्द करा',
    'theme.light': 'हलका',
    'theme.dark': 'गडद',
    'theme.system': 'सिस्टम',
    'feedback.title': 'फीडबॅक आणि सहाय्य',
    'feedback.submit': 'फीडबॅक पाठवा',
    'feedback.rate': 'तुमचा अनुभव रेट करा',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}