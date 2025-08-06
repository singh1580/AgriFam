import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Language = 'english' | 'hindi' | 'bengali' | 'tamil' | 'telugu' | 'marathi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  english: {
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'products': 'Products',
    'orders': 'Orders',
    'profile': 'Profile',
    'logout': 'Logout',
    'settings': 'Settings',
    'notifications': 'Notifications',
    'search': 'Search',
    'filter': 'Filter',
    'save': 'Save',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'edit': 'Edit',
    'delete': 'Delete',
    'add': 'Add',
    'view': 'View',
    'upload': 'Upload',
    'download': 'Download',
    'success': 'Success',
    'error': 'Error',
    'loading': 'Loading',
    'no_data': 'No data available',
    'total': 'Total',
    'pending': 'Pending',
    'completed': 'Completed',
    'failed': 'Failed',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'active': 'Active',
    'inactive': 'Inactive',
    'name': 'Name',
    'email': 'Email',
    'phone': 'Phone',
    'address': 'Address',
    'description': 'Description',
    'price': 'Price',
    'quantity': 'Quantity',
    'category': 'Category',
    'status': 'Status',
    'date': 'Date',
    'time': 'Time',
    'created': 'Created',
    'updated': 'Updated',
    'navigation.analytics': 'Analytics',
    'navigation.collections': 'Collections',
    'navigation.communications': 'Communications',
    'navigation.notifications': 'Notifications',
    'navigation.settings': 'Settings',
    'navigation.overview': 'Overview',
    'navigation.products': 'Products',
    'navigation.orders': 'Orders',
    'navigation.payments': 'Payments',
    'navigation.users': 'Users',
    'navigation.feedback': 'Feedback',
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
    'farmer.quick_actions': 'Quick Actions',
    'farmer.recent_products': 'Recent Products',
    'farmer.earnings': 'Earnings',
    'farmer.collections': 'Collections',
    'farmer.stats': 'Statistics',
    'farmer.submit_product': 'Submit Product',
    'farmer.manage_products': 'Manage Products',
    'farmer.view_earnings': 'View Earnings',
    'farmer.collection_schedule': 'Collection Schedule',
    'farmer.product_status': 'Product Status',
    'farmer.payment_history': 'Payment History',
    'buyer.marketplace': 'Marketplace',
    'buyer.my_orders': 'My Orders',
    'buyer.order_history': 'Order History',
    'buyer.browse_products': 'Browse Products',
    'buyer.product_catalog': 'Product Catalog',
    'buyer.order_tracking': 'Order Tracking',
    'buyer.payment_methods': 'Payment Methods',
    'buyer.delivery_address': 'Delivery Address',
    'admin.user_management': 'User Management',
    'admin.payment_management': 'Payment Management',
    'admin.product_approvals': 'Product Approvals',
    'admin.system_health': 'System Health',
    'common.sign_in': 'Sign In',
    'common.sign_up': 'Sign Up',
    'common.sign_out': 'Sign Out',
    'common.home': 'Home',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.continue': 'Continue',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.open': 'Open',
    'messages.welcome_back': 'Welcome back!',
    'messages.goodbye': 'Thanks for using our platform',
    'messages.loading_data': 'Loading your data...',
    'messages.no_results': 'No results found',
    'messages.try_again': 'Please try again',
    'placeholders.search_products': 'Search products...',
    'placeholders.enter_email': 'Enter your email',
    'placeholders.enter_password': 'Enter your password',
    'placeholders.enter_name': 'Enter your name',
    'buttons.sign_in': 'Sign In',
    'buttons.sign_up': 'Sign Up',
    'buttons.sign_out': 'Sign Out',
    'buttons.get_started': 'Get Started',
    'buttons.learn_more': 'Learn More',
    'buttons.contact_us': 'Contact Us',
    'forms.product_name': 'Product Name',
    'forms.category': 'Category',
    'forms.quantity': 'Quantity',
    'forms.price_per_unit': 'Price per Unit',
    'forms.harvest_date': 'Harvest Date',
    'forms.location': 'Location',
    'forms.description': 'Description',
    'forms.upload_images': 'Upload Images',
    'status.pending_review': 'Pending Review',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.scheduled_collection': 'Scheduled for Collection',
    'status.collected': 'Collected',
    'order_status.pending': 'Pending',
    'order_status.confirmed': 'Confirmed',
    'order_status.in_transit': 'In Transit',
    'order_status.delivered': 'Delivered',
    'order_status.cancelled': 'Cancelled',
  },
  hindi: {
    'welcome': 'स्वागत है',
    'dashboard': 'डैशबोर्ड',
    'products': 'उत्पाद',
    'orders': 'ऑर्डर',
    'profile': 'प्रोफाइल',
    'logout': 'लॉग आउट',
    'settings': 'सेटिंग्स',
    'notifications': 'सूचनाएं',
    'search': 'खोजें',
    'filter': 'फिल्टर',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'submit': 'सबमिट करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'add': 'जोड़ें',
    'view': 'देखें',
    'upload': 'अपलोड करें',
    'download': 'डाउनलोड करें',
    'success': 'सफलता',
    'error': 'त्रुटि',
    'loading': 'लोड हो रहा है',
    'no_data': 'कोई डेटा उपलब्ध नहीं',
    'total': 'कुल',
    'pending': 'लंबित',
    'completed': 'पूर्ण',
    'failed': 'असफल',
    'approved': 'अनुमोदित',
    'rejected': 'अस्वीकृत',
    'active': 'सक्रिय',
    'inactive': 'निष्क्रिय',
    'name': 'नाम',
    'email': 'ईमेल',
    'phone': 'फोन',
    'address': 'पता',
    'description': 'विवरण',
    'price': 'मूल्य',
    'quantity': 'मात्रा',
    'category': 'श्रेणी',
    'status': 'स्थिति',
    'date': 'तारीख',
    'time': 'समय',
    'created': 'बनाया गया',
    'updated': 'अपडेट किया गया',
    'common.home': 'होम',
    'common.back': 'वापस',
  },
  bengali: {
    'welcome': 'স্বাগতম',
    'dashboard': 'ড্যাশবোর্ড',
    'products': 'পণ্য',
    'orders': 'অর্ডার',
    'profile': 'প্রোফাইল',
    'logout': 'লগ আউট',
    'settings': 'সেটিংস',
    'notifications': 'বিজ্ঞপ্তি',
    'search': 'অনুসন্ধান',
    'filter': 'ফিল্টার',
    'save': 'সংরক্ষণ',
    'cancel': 'বাতিল',
    'submit': 'জমা দিন',
    'edit': 'সম্পাদনা',
    'delete': 'মুছুন',
    'add': 'যোগ করুন',
    'view': 'দেখুন',
    'upload': 'আপলোড',
    'download': 'ডাউনলোড',
    'success': 'সফল',
    'error': 'ত্রুটি',
    'loading': 'লোড হচ্ছে',
    'no_data': 'কোন তথ্য পাওয়া যায়নি',
    'total': 'মোট',
    'pending': 'মুলতুবি',
    'completed': 'সম্পন্ন',
    'failed': 'ব্যর্থ',
    'approved': 'অনুমোদিত',
    'rejected': 'প্রত্যাখ্যাত',
    'active': 'সক্রিয়',
    'inactive': 'নিষ্ক্রিয়',
    'name': 'নাম',
    'email': 'ইমেইল',
    'phone': 'ফোন',
    'address': 'ঠিকানা',
    'description': 'বর্ণনা',
    'price': 'মূল্য',
    'quantity': 'পরিমাণ',
    'category': 'বিভাগ',
    'status': 'অবস্থা',
    'date': 'তারিখ',
    'time': 'সময়',
    'created': 'তৈরি',
    'updated': 'আপডেট',
    'common.home': 'হোম',
    'common.back': 'পিছনে',
  },
  tamil: {
    'welcome': 'வரவேற்கின்றோம்',
    'dashboard': 'டாஷ்போர்டு',
    'products': 'தயாரிப்புகள்',
    'orders': 'ஆர்டர்கள்',
    'profile': 'சுயவிவரம்',
    'logout': 'வெளியேறு',
    'settings': 'அமைப்புகள்',
    'notifications': 'அறிவிப்புகள்',
    'search': 'தேடு',
    'filter': 'வடிகட்டு',
    'save': 'சேமி',
    'cancel': 'ரத்து செய்',
    'submit': 'சமர்ப்பி',
    'edit': 'திருத்து',
    'delete': 'நீக்கு',
    'add': 'சேர்',
    'view': 'பார்',
    'upload': 'பதிவேற்று',
    'download': 'பதிவிறக்கு',
    'success': 'வெற்றி',
    'error': 'பிழை',
    'loading': 'ஏற்றுகிறது',
    'no_data': 'தரவு இல்லை',
    'total': 'மொத்தம்',
    'pending': 'நிலுவையில்',
    'completed': 'முடிந்தது',
    'failed': 'தோல்வி',
    'approved': 'அங்கீகரிக்கப்பட்டது',
    'rejected': 'நிராகரிக்கப்பட்டது',
    'active': 'செயலில்',
    'inactive': 'செயலில் இல்லை',
    'name': 'பெயர்',
    'email': 'மின்னஞ்சல்',
    'phone': 'தொலைபேசி',
    'address': 'முகவரி',
    'description': 'விளக்கம்',
    'price': 'விலை',
    'quantity': 'அளவு',
    'category': 'வகை',
    'status': 'நிலை',
    'date': 'தேதி',
    'time': 'நேரம்',
    'created': 'உருவாக்கப்பட்டது',
    'updated': 'புதுப்பிக்கப்பட்டது',
    'common.home': 'முகப்பு',
    'common.back': 'பின்',
  },
  telugu: {
    'welcome': 'స్వాగతం',
    'dashboard': 'డాష్‌బోర్డ్',
    'products': 'ఉత్పత్తులు',
    'orders': 'ఆర్డర్లు',
    'profile': 'ప్రొఫైల్',
    'logout': 'లాగ్ అవుట్',
    'settings': 'సెట్టింగ్స్',
    'notifications': 'నోటిఫికేషన్స్',
    'search': 'వెతుకు',
    'filter': 'ఫిల్టర్',
    'save': 'సేవ్',
    'cancel': 'రద్దు',
    'submit': 'సమర్పించు',
    'edit': 'ఎడిట్',
    'delete': 'తొలగించు',
    'add': 'జోడించు',
    'view': 'చూడు',
    'upload': 'అప్‌లోడ్',
    'download': 'డౌన్‌లోడ్',
    'success': 'విజయం',
    'error': 'లోపం',
    'loading': 'లోడ్ అవుతోంది',
    'no_data': 'డేటా లేదు',
    'total': 'మొత్తం',
    'pending': 'పెండింగ్',
    'completed': 'పూర్తయింది',
    'failed': 'విఫలమైంది',
    'approved': 'అనుమతించబడింది',
    'rejected': 'తిరస్కరించబడింది',
    'active': 'యాక్టివ్',
    'inactive': 'ఇనాక్టివ్',
    'name': 'పేరు',
    'email': 'ఇమెయిల్',
    'phone': 'ఫోన్',
    'address': 'చిరునామా',
    'description': 'వివరణ',
    'price': 'ధర',
    'quantity': 'పరిమాణం',
    'category': 'వర్గం',
    'status': 'స్థితి',
    'date': 'తేదీ',
    'time': 'సమయం',
    'created': 'సృష్టించబడింది',
    'updated': 'అప్‌డేట్ చేయబడింది',
    'common.home': 'హోమ్',
    'common.back': 'వెనుక',
  },
  marathi: {
    'welcome': 'स्वागत आहे',
    'dashboard': 'डॅशबोर्ड',
    'products': 'उत्पादने',
    'orders': 'ऑर्डर',
    'profile': 'प्रोफाइल',
    'logout': 'लॉग आउट',
    'settings': 'सेटिंग्ज',
    'notifications': 'सूचना',
    'search': 'शोधा',
    'filter': 'फिल्टर',
    'save': 'सेव्ह करा',
    'cancel': 'रद्द करा',
    'submit': 'सबमिट करा',
    'edit': 'संपादित करा',
    'delete': 'हटवा',
    'add': 'जोडा',
    'view': 'पहा',
    'upload': 'अपलोड करा',
    'download': 'डाउनलोड करा',
    'success': 'यशस्वी',
    'error': 'त्रुटी',
    'loading': 'लोड होत आहे',
    'no_data': 'डेटा उपलब्ध नाही',
    'total': 'एकूण',
    'pending': 'प्रलंबित',
    'completed': 'पूर्ण',
    'failed': 'अयशस्वी',
    'approved': 'मंजूर',
    'rejected': 'नाकारले',
    'active': 'सक्रिय',
    'inactive': 'निष्क्रिय',
    'name': 'नाव',
    'email': 'ईमेल',
    'phone': 'फोन',
    'address': 'पत्ता',
    'description': 'वर्णन',
    'price': 'किंमत',
    'quantity': 'प्रमाण',
    'category': 'श्रेणी',
    'status': 'स्थिती',
    'date': 'तारीख',
    'time': 'वेळ',
    'created': 'तयार केले',
    'updated': 'अपडेट केले',
    'common.home': 'होम',
    'common.back': 'मागे',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('english');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load language from user profile in Supabase
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('language')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading user language:', error);
            setIsLoading(false);
            return;
          }

          if (profile?.language && translations[profile.language as Language]) {
            setLanguageState(profile.language as Language);
          }
        } catch (error) {
          console.error('Error loading user language:', error);
        }
      }
      setIsLoading(false);
    };

    loadUserLanguage();
  }, [user]);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ language: lang })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving language preference:', error);
          toast.error('Failed to save language preference');
        } else {
          toast.success('Language preference saved');
        }
      } catch (error) {
        console.error('Error saving language preference:', error);
        toast.error('Failed to save language preference');
      }
    }
  }, [user]);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  }, [language]);

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