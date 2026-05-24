import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getTranslation, type Lang } from "@/translations";

const STORAGE_KEY = "roadintel_lang";
const DEFAULT_LANG: Lang = "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key: string) => key,
});

function loadLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === "en" || saved === "hi" || saved === "mr") return saved;
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((key: string) => getTranslation(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
