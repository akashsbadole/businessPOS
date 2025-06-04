import React from "react";
import {
  Select,
  SelectItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { I18n, supportedLanguages, Language } from "../../utils/i18n";

interface LanguageSelectorProps {
  variant?: "select" | "dropdown";
  size?: "sm" | "md" | "lg";
  showFlag?: boolean;
  showNativeName?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "dropdown",
  size = "md",
  showFlag = true,
  showNativeName = true,
}) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>(
    I18n.getCurrentLanguage()
  );

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    I18n.setLanguage(language);
    
    // Trigger a re-render of the entire app
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  };

  const getCurrentLanguageConfig = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  if (variant === "select") {
    return (
      <Select
        size={size}
        selectedKeys={[currentLanguage]}
        onSelectionChange={(keys) => {
          const selectedLanguage = Array.from(keys)[0] as Language;
          handleLanguageChange(selectedLanguage);
        }}
        className="min-w-[150px]"
        startContent={
          showFlag ? (
            <span className="text-lg">{getCurrentLanguageConfig().flag}</span>
          ) : (
            <Icon icon="lucide:globe" />
          )
        }
      >
        {supportedLanguages.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            startContent={showFlag ? <span className="text-lg">{language.flag}</span> : null}
          >
            {showNativeName ? language.nativeName : language.name}
          </SelectItem>
        ))}
      </Select>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="flat"
          size={size}
          startContent={
            showFlag ? (
              <span className="text-lg">{getCurrentLanguageConfig().flag}</span>
            ) : (
              <Icon icon="lucide:globe" />
            )
          }
          endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
        >
          {showNativeName 
            ? getCurrentLanguageConfig().nativeName 
            : getCurrentLanguageConfig().name
          }
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={(key) => handleLanguageChange(key as Language)}
      >
        {supportedLanguages.map((language) => (
          <DropdownItem
            key={language.code}
            startContent={showFlag ? <span className="text-lg">{language.flag}</span> : null}
            className={currentLanguage === language.code ? "bg-primary/10" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {showNativeName ? language.nativeName : language.name}
              </span>
              {showNativeName && language.nativeName !== language.name && (
                <span className="text-xs text-gray-500">{language.name}</span>
              )}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

// Hook for using translations in components
export const useTranslation = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate();
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  return {
    t: I18n.translate,
    currentLanguage: I18n.getCurrentLanguage(),
    setLanguage: I18n.setLanguage,
    formatNumber: I18n.formatNumber,
    formatCurrency: I18n.formatCurrency,
    formatDate: I18n.formatDate,
  };
};
