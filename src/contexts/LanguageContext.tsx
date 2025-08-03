import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.orders': 'Orders',
    'nav.notifications': 'Notifications',
    'nav.feedback': 'Feedback',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Dashboard sections
    'dashboard.farmer.title': 'Farmer Dashboard',
    'dashboard.buyer.title': 'Buyer Dashboard', 
    'dashboard.admin.title': 'Admin Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.analytics': 'Analytics',
    'dashboard.settings': 'Settings',
    
    // Products
    'products.title': 'Products',
    'products.myProducts': 'My Products',
    'products.addProduct': 'Add Product',
    'products.editProduct': 'Edit Product',
    'products.deleteProduct': 'Delete Product',
    'products.name': 'Product Name',
    'products.category': 'Category',
    'products.quantity': 'Quantity',
    'products.price': 'Price',
    'products.quality': 'Quality',
    'products.status': 'Status',
    'products.submitted': 'Submitted',
    'products.approved': 'Approved',
    'products.rejected': 'Rejected',
    'products.pending': 'Pending Review',
    'products.expectedPayment': 'Expected Payment',
    'products.collectionDate': 'Collection Date',
    'products.adminNotes': 'Admin Notes',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.clear': 'Clear',
    'common.submit': 'Submit',
    'common.close': 'Close',
    
    // Feedback
    'feedback.title': 'Feedback',
    'feedback.submit': 'Submit Feedback',
    'feedback.rate': 'Rate Experience',
    
    // Legacy keys for compatibility
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'products': 'Products',
    'orders': 'Orders',
    'profile': 'Profile',
    'logout': 'Logout',
    'settings': 'Settings',
    'notifications': 'Notifications',
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड', 
    'nav.products': 'उत्पाद',
    'nav.orders': 'ऑर्डर',
    'nav.notifications': 'सूचनाएं',
    'nav.feedback': 'फीडबैक',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉगआउट',
    
    // Dashboard sections
    'dashboard.farmer.title': 'किसान डैशबोर्ड',
    'dashboard.buyer.title': 'खरीदार डैशबोर्ड',
    'dashboard.admin.title': 'एडमिन डैशबोर्ड',
    'dashboard.overview': 'समीक्षा',
    'dashboard.analytics': 'एनालिटिक्स',
    'dashboard.settings': 'सेटिंग्स',
    
    // Products
    'products.title': 'उत्पाद',
    'products.myProducts': 'मेरे उत्पाद',
    'products.name': 'उत्पाद का नाम',
    'products.category': 'श्रेणी',
    'products.quantity': 'मात्रा',
    'products.price': 'मूल्य',
    'products.quality': 'गुणवत्ता',
    'products.status': 'स्थिति',
    'products.submitted': 'जमा किया गया',
    'products.approved': 'अनुमोदित',
    'products.rejected': 'अस्वीकृत',
    'products.pending': 'समीक्षा में',
    'products.expectedPayment': 'अपेक्षित भुगतान',
    'products.collectionDate': 'संग्रह दिनांक',
    'products.adminNotes': 'एडमिन नोट्स',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.view': 'देखें',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.clear': 'साफ़ करें',
    'common.submit': 'जमा करें',
    'common.close': 'बंद करें',
    
    // Feedback
    'feedback.title': 'फीडबैक',
    'feedback.submit': 'फीडबैक भेजें',
    'feedback.rate': 'अनुभव रेट करें',
    
    // Legacy keys
    'welcome': 'स्वागत है',
    'dashboard': 'डैशबोर्ड',
    'products': 'उत्पाद',
    'orders': 'ऑर्डर',
    'profile': 'प्रोफाइल',
    'logout': 'लॉग आउट',
    'settings': 'सेटिंग्स',
    'notifications': 'सूचनाएं',
  },
  
  bn: {
    'nav.home': 'হোম',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'dashboard.farmer.title': 'কৃষক ড্যাশবোর্ড',
    'common.loading': 'লোড হচ্ছে...',
    'feedback.title': 'মতামত',
    'feedback.submit': 'মতামত জমা দিন',
    'feedback.rate': 'অভিজ্ঞতা রেট করুন',
    'welcome': 'স্বাগতম',
    'dashboard': 'ড্যাশবোর্ড',
    'products': 'পণ্য',
    'orders': 'অর্ডার',
    'profile': 'প্রোফাইল',
    'logout': 'লগ আউট',
    'settings': 'সেটিংস',
    'notifications': 'বিজ্ঞপ্তি',
  },
  
  te: {
    'nav.home': 'హోమ్',
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'dashboard.farmer.title': 'రైతు డ్యాష్‌బోర్డ్',
    'common.loading': 'లోడ్ అవుతోంది...',
    'feedback.title': 'ఫీడ్‌బ్యాక్',
    'feedback.submit': 'ఫీడ్‌బ్యాక్ సమర్పించండి',
    'feedback.rate': 'అనుభవాన్ని రేట్ చేయండి',
    'welcome': 'స్వాగతం',
    'dashboard': 'డ్యాష్‌బోర్డ్',
    'products': 'ఉత్పత్తులు',
    'orders': 'ఆర్డర్లు',
    'profile': 'ప్రొఫైల్',
    'logout': 'లాగ్ అవుట్',
    'settings': 'సెట్టింగ్లు',
    'notifications': 'నోటిఫికేషన్లు',
  },
  
  ta: {
    'nav.home': 'வீடு',
    'nav.dashboard': 'டாஷ்போர்ட்',
    'dashboard.farmer.title': 'விவசாயி டாஷ்போர்ட்',
    'common.loading': 'ஏற்றுகிறது...',
    'feedback.title': 'கருத்து',
    'feedback.submit': 'கருத்தை சமர்ப்பிக்கவும்',
    'feedback.rate': 'அனுபவத்தை மதிப்பிடுங்கள்',
    'welcome': 'வரவேற்கின்றோம்',
    'dashboard': 'டாஷ்போர்டு',
    'products': 'தயாரிப்புகள்',
    'orders': 'ஆர்டர்கள்',
    'profile': 'சுயவிவரம்',
    'logout': 'வெளியேறு',
    'settings': 'அமைப்புகள்',
    'notifications': 'அறிவிப்புகள்',
  },
  
  ur: {
    'nav.home': 'گھر',
    'nav.dashboard': 'ڈیش بورڈ',
    'dashboard.farmer.title': 'کسان ڈیش بورڈ',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'feedback.title': 'رائے',
    'feedback.submit': 'رائے جمع کریں',
    'feedback.rate': 'تجربے کی درجہ بندی کریں',
    'welcome': 'خوش آمدید',
    'dashboard': 'ڈیش بورڈ',
    'products': 'مصنوعات',
    'orders': 'آرڈرز',
    'profile': 'پروفائل',
    'logout': 'لاگ آؤٹ',
    'settings': 'ترتیبات',
    'notifications': 'اطلاعات',
  }
};

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load language from user profile on component mount
  useEffect(() => {
    const loadLanguageFromProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading language preference:', error);
          setIsLoading(false);
          return;
        }

        if (profile?.language) {
          const mappedLanguage = mapLanguageCode(profile.language);
          setLanguageState(mappedLanguage);
        }
      } catch (error) {
        console.error('Error in language loading:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguageFromProfile();
  }, [user]);

  // Helper function to map database language codes to our type
  const mapLanguageCode = (dbLanguage: string): Language => {
    const languageMap: Record<string, Language> = {
      'english': 'en',
      'hindi': 'hi',
      'bengali': 'bn',
      'tamil': 'ta',
      'telugu': 'te',
      'urdu': 'ur',
      'en': 'en',
      'hi': 'hi',
      'bn': 'bn',
      'ta': 'ta',
      'te': 'te',
      'ur': 'ur'
    };
    return languageMap[dbLanguage] || 'en';
  };

  // Helper function to map our language codes to database format
  const mapToDbLanguage = (lang: Language): string => {
    const dbMap: Record<Language, string> = {
      'en': 'english',
      'hi': 'hindi',
      'bn': 'bengali',
      'ta': 'tamil',
      'te': 'telugu',
      'ur': 'urdu'
    };
    return dbMap[lang] || 'english';
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ language: mapToDbLanguage(newLanguage) })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving language preference:', error);
          toast.error('Failed to save language preference');
        } else {
          toast.success('Language preference saved');
        }
      } catch (error) {
        console.error('Error in language update:', error);
        toast.error('Failed to save language preference');
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key itself if not found in English either
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LanguageProvider };