import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';

const languages = [
  { value: 'english', label: 'English', flag: '🇺🇸' },
  { value: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
  { value: 'bengali', label: 'বাংলা', flag: '🇧🇩' },
  { value: 'tamil', label: 'தமிழ்', flag: '🇮🇳' },
  { value: 'telugu', label: 'తెలుగు', flag: '🇮🇳' },
  { value: 'marathi', label: 'मराठी', flag: '🇮🇳' },
];

const LanguageSelector = () => {
  const { language, setLanguage, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
    );
  }

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto min-w-[120px] bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:bg-white/90 transition-all duration-200">
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-gray-600" />
          <SelectValue>
            <span className="text-sm font-medium">
              {languages.find(lang => lang.value === language)?.flag} {languages.find(lang => lang.value === language)?.label}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            className="flex items-center space-x-2 hover:bg-crop-green/10 focus:bg-crop-green/10 cursor-pointer"
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="font-medium">{lang.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;