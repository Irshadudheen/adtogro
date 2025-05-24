import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const supportedLanguages = [
  'fr', 'sp', 'ar', 'ge', 'ja', 'vi', 'si', 'hi', 'be', 'te', 'mara',
  'ta', 'gu', 'ur', 'kan', 'odi', 'pun', 'mal', 'assam', 'mai',
  'konk', 'dogr', 'kash', 'sant', 'manip', 'bodo', 'mandarin'
];
const LanguageWrapper = ({ children }) => {
  const navigate = useNavigate()
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }else{
      navigate('*', { replace: true });
    }
  }, [lang, i18n]);

  return children;
};

export default LanguageWrapper;