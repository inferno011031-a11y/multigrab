export type SupportedLocale = 'en' | 'es' | 'pt' | 'hi' | 'fr' | 'de' | 'ar' | 'id';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export interface UiTranslations {
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubhead: string;
  inputPlaceholder: string;
  downloadButton: string;
  extractingButton: string;
  pasteButton: string;
  shareTool: string;
  shareCopied: string;
  tabAll: string;
  tabVideo: string;
  tabAudio: string;
  optionsCount: string;
  videoSectionTitle: string;
  audioSectionTitle: string;
  downloadVideoBtn: string;
  downloadAudioBtn: string;
  historyTitle: string;
  clearHistory: string;
  noHistory: string;
  howToTitle: string;
  featuresTitle: string;
  faqTitle: string;
  allPlatforms: string;
  navTools: string;
  navPlatforms: string;
  navFeatures: string;
  navHistory: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
}

export const UI_DICTIONARY: Record<SupportedLocale, UiTranslations> = {
  en: {
    heroBadge: 'Universal Video & Audio Downloader',
    heroHeadline1: 'Paste a link.',
    heroHeadline2: 'Download the file.',
    heroSubhead:
      'Download videos and audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in top quality. Free, fast, and no software required.',
    inputPlaceholder: 'Paste link (YouTube, Spotify, TikTok, Instagram, X, etc.)...',
    downloadButton: 'Download',
    extractingButton: 'Extracting...',
    pasteButton: 'Paste',
    shareTool: 'Share MultiGrab',
    shareCopied: 'Link Copied!',
    tabAll: 'All',
    tabVideo: 'Video',
    tabAudio: 'Audio',
    optionsCount: 'options',
    videoSectionTitle: 'Video Downloads',
    audioSectionTitle: 'Audio Downloads',
    downloadVideoBtn: 'Download Video',
    downloadAudioBtn: 'Download Audio',
    historyTitle: 'Download History',
    clearHistory: 'Clear',
    noHistory: 'No downloads yet',
    howToTitle: 'How to Download',
    featuresTitle: 'Why Use MultiGrab?',
    faqTitle: 'Frequently Asked Questions',
    allPlatforms: 'All Platforms',
    navTools: 'Tools',
    navPlatforms: 'Platforms',
    navFeatures: 'Features',
    navHistory: 'History',
    step1Title: 'Copy URL Link',
    step1Desc: 'Copy the link of the video, song, or reel you want to download.',
    step2Title: 'Paste in MultiGrab',
    step2Desc: 'Paste the URL into the search bar above and click Download.',
    step3Title: 'Save to Device',
    step3Desc: 'Choose your preferred video resolution or MP3 audio track.',
  },
  es: {
    heroBadge: 'Descargador Universal de Video y Audio',
    heroHeadline1: 'Pega un enlace.',
    heroHeadline2: 'Descarga el archivo.',
    heroSubhead:
      'Descarga videos y música de YouTube, Spotify, TikTok, Instagram, X, Facebook y Reddit en máxima calidad. Gratis, rápido y sin instalar programas.',
    inputPlaceholder: 'Pega el enlace (YouTube, Spotify, TikTok, Instagram, X...)...',
    downloadButton: 'Descargar',
    extractingButton: 'Extrayendo...',
    pasteButton: 'Pegar',
    shareTool: 'Compartir MultiGrab',
    shareCopied: '¡Enlace Copiado!',
    tabAll: 'Todo',
    tabVideo: 'Video',
    tabAudio: 'Audio',
    optionsCount: 'opciones',
    videoSectionTitle: 'Descargas de Video',
    audioSectionTitle: 'Descargas de Audio',
    downloadVideoBtn: 'Descargar Video',
    downloadAudioBtn: 'Descargar Audio',
    historyTitle: 'Historial de Descargas',
    clearHistory: 'Borrar',
    noHistory: 'Sin descargas aún',
    howToTitle: 'Cómo Descargar',
    featuresTitle: '¿Por qué usar MultiGrab?',
    faqTitle: 'Preguntas Frecuentes',
    allPlatforms: 'Todas las Plataformas',
    navTools: 'Herramientas',
    navPlatforms: 'Plataformas',
    navFeatures: 'Características',
    navHistory: 'Historial',
    step1Title: 'Copiar Enlace',
    step1Desc: 'Copia el enlace del video, canción o reel que deseas guardar.',
    step2Title: 'Pegar en MultiGrab',
    step2Desc: 'Pega la URL en la barra de búsqueda y pulsa Descargar.',
    step3Title: 'Guardar Archivo',
    step3Desc: 'Elige la resolución de video (4K, 1080p) o audio MP3.',
  },
  pt: {
    heroBadge: 'Baixador Universal de Vídeo e Áudio',
    heroHeadline1: 'Cole o link.',
    heroHeadline2: 'Baixe o arquivo.',
    heroSubhead:
      'Baixe vídeos e músicas do YouTube, Spotify, TikTok, Instagram, Twitter, Facebook e Reddit em alta qualidade. Grátis, rápido e sem instalar nada.',
    inputPlaceholder: 'Cole o link (YouTube, Spotify, TikTok, Instagram, X...)...',
    downloadButton: 'Baixar',
    extractingButton: 'Processando...',
    pasteButton: 'Colar',
    shareTool: 'Compartilhar MultiGrab',
    shareCopied: 'Link Copiado!',
    tabAll: 'Todos',
    tabVideo: 'Vídeo',
    tabAudio: 'Áudio',
    optionsCount: 'opções',
    videoSectionTitle: 'Downloads de Vídeo',
    audioSectionTitle: 'Downloads de Áudio',
    downloadVideoBtn: 'Baixar Vídeo',
    downloadAudioBtn: 'Baixar Áudio',
    historyTitle: 'Histórico de Downloads',
    clearHistory: 'Limpar',
    noHistory: 'Nenhum download ainda',
    howToTitle: 'Como Baixar',
    featuresTitle: 'Por que usar o MultiGrab?',
    faqTitle: 'Perguntas Frequentes',
    allPlatforms: 'Todas as Plataformas',
    navTools: 'Ferramentas',
    navPlatforms: 'Plataformas',
    navFeatures: 'Recursos',
    navHistory: 'Histórico',
    step1Title: 'Copiar Link',
    step1Desc: 'Copie o link do vídeo, música ou reel que você deseja salvar.',
    step2Title: 'Colar no MultiGrab',
    step2Desc: 'Cole a URL na barra de busca e clique em Baixar.',
    step3Title: 'Salvar no Celular ou PC',
    step3Desc: 'Escolha a resolução do vídeo (1080p, 4K) ou áudio MP3.',
  },
  hi: {
    heroBadge: 'मुफ़्त वीडियो और ऑडियो डाउनलोडर',
    heroHeadline1: 'लिंक पेस्ट करें।',
    heroHeadline2: 'फ़ाइल डाउनलोड करें।',
    heroSubhead:
      'YouTube, Spotify, TikTok, Instagram, Facebook और Reddit से वीडियो और MP3 गाने उच्च गुणवत्ता में डाउनलोड करें। 100% मुफ़्त और तेज़।',
    inputPlaceholder: 'वीडियो या गाने का लिंक पेस्ट करें...',
    downloadButton: 'डाउनलोड',
    extractingButton: 'प्रोसेसिंग...',
    pasteButton: 'पेस्ट',
    shareTool: 'शेयर करें',
    shareCopied: 'लिंक कॉपी हो गया!',
    tabAll: 'सभी',
    tabVideo: 'वीडियो',
    tabAudio: 'ऑडियो',
    optionsCount: 'विकल्प',
    videoSectionTitle: 'वीडियो डाउनलोड',
    audioSectionTitle: 'ऑडियो MP3 डाउनलोड',
    downloadVideoBtn: 'वीडियो डाउनलोड करें',
    downloadAudioBtn: 'ऑडियो डाउनलोड करें',
    historyTitle: 'डाउनलोड इतिहास',
    clearHistory: 'हटाएं',
    noHistory: 'अभी कोई डाउनलोड नहीं',
    howToTitle: 'डाउनलोड कैसे करें',
    featuresTitle: 'MultiGrab क्यों चुनें?',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    allPlatforms: 'सभी प्लेटफ़ॉर्म',
    navTools: 'टूल्स',
    navPlatforms: 'प्लेटफ़ॉर्म',
    navFeatures: 'विशेषताएं',
    navHistory: 'इतिहास',
    step1Title: 'लिंक कॉपी करें',
    step1Desc: 'उस वीडियो या गाने का लिंक कॉपी करें जिसे आप डाउनलोड करना चाहते हैं।',
    step2Title: 'MultiGrab पर पेस्ट करें',
    step2Desc: 'सर्च बार में लिंक पेस्ट करें और डाउनलोड बटन दबाएं।',
    step3Title: 'फ़ाइल सेव करें',
    step3Desc: 'अपनी पसंद का वीडियो रिज़ॉल्यूशन या MP3 ऑडियो चुनें।',
  },
  fr: {
    heroBadge: 'Téléchargeur Universel Vidéo & Audio',
    heroHeadline1: 'Collez un lien.',
    heroHeadline2: 'Téléchargez le fichier.',
    heroSubhead:
      'Téléchargez des vidéos et de la musique depuis YouTube, Spotify, TikTok, Instagram, Twitter et Reddit en haute qualité. Gratuit, rapide et sans logiciel.',
    inputPlaceholder: 'Collez le lien (YouTube, Spotify, TikTok, Instagram...)...',
    downloadButton: 'Télécharger',
    extractingButton: 'Extraction...',
    pasteButton: 'Coller',
    shareTool: 'Partager MultiGrab',
    shareCopied: 'Lien Copié !',
    tabAll: 'Tous',
    tabVideo: 'Vidéo',
    tabAudio: 'Audio',
    optionsCount: 'options',
    videoSectionTitle: 'Téléchargements Vidéo',
    audioSectionTitle: 'Téléchargements Audio',
    downloadVideoBtn: 'Télécharger Vidéo',
    downloadAudioBtn: 'Télécharger Audio',
    historyTitle: 'Historique des Téléchargements',
    clearHistory: 'Effacer',
    noHistory: 'Aucun téléchargement',
    howToTitle: 'Comment Télécharger',
    featuresTitle: 'Pourquoi choisir MultiGrab ?',
    faqTitle: 'Foire Aux Questions',
    allPlatforms: 'Toutes les Plateformes',
    navTools: 'Outils',
    navPlatforms: 'Plateformes',
    navFeatures: 'Fonctionnalités',
    navHistory: 'Historique',
    step1Title: 'Copier le Lien',
    step1Desc: 'Copiez le lien de la vidéo ou du morceau que vous souhaitez enregistrer.',
    step2Title: 'Coller dans MultiGrab',
    step2Desc: 'Collez le lien dans la barre de recherche et cliquez sur Télécharger.',
    step3Title: 'Enregistrer le Fichier',
    step3Desc: 'Sélectionnez la résolution vidéo (4K, 1080p) ou la piste audio MP3.',
  },
  de: {
    heroBadge: 'Kostenloser Video & Audio Downloader',
    heroHeadline1: 'Link einfügen.',
    heroHeadline2: 'Datei herunterladen.',
    heroSubhead:
      'Lade Videos und Musik von YouTube, Spotify, TikTok, Instagram, X, Facebook und Reddit in bester Qualität herunter. Kostenlos, schnell und ohne Software.',
    inputPlaceholder: 'Link einfügen (YouTube, Spotify, TikTok, Instagram...)...',
    downloadButton: 'Herunterladen',
    extractingButton: 'Verarbeite...',
    pasteButton: 'Einfügen',
    shareTool: 'MultiGrab teilen',
    shareCopied: 'Link kopiert!',
    tabAll: 'Alle',
    tabVideo: 'Video',
    tabAudio: 'Audio',
    optionsCount: 'Optionen',
    videoSectionTitle: 'Video Downloads',
    audioSectionTitle: 'Audio Downloads',
    downloadVideoBtn: 'Video herunterladen',
    downloadAudioBtn: 'Audio herunterladen',
    historyTitle: 'Download-Verlauf',
    clearHistory: 'Löschen',
    noHistory: 'Noch keine Downloads',
    howToTitle: 'So funktioniert es',
    featuresTitle: 'Warum MultiGrab?',
    faqTitle: 'Häufig gestellte Fragen',
    allPlatforms: 'Alle Plattformen',
    navTools: 'Tools',
    navPlatforms: 'Plattformen',
    navFeatures: 'Funktionen',
    navHistory: 'Verlauf',
    step1Title: 'Link kopieren',
    step1Desc: 'Kopiere den Link des Videos oder Songs, den du speichern möchtest.',
    step2Title: 'Bei MultiGrab einfügen',
    step2Desc: 'Füge die URL in das Suchfeld ein und klicke auf Herunterladen.',
    step3Title: 'Datei speichern',
    step3Desc: 'Wähle deine gewünschte Videoauflösung oder MP3-Audiodatei.',
  },
  ar: {
    heroBadge: 'أداة تحميل الفيديو والصوت الشاملة',
    heroHeadline1: 'الصق الرابط.',
    heroHeadline2: 'حمّل الملف فوراً.',
    heroSubhead:
      'حمّل مقاطع الفيديو والموسيقى من يوتيوب، سبوتيفاي، تيك توك، إنستغرام، وتويتر بأعلى جودة مجاناً وبدون برامج.',
    inputPlaceholder: 'الصق رابط الفيديو أو الموسيقى هنا...',
    downloadButton: 'تحميل',
    extractingButton: 'جاري الاستخراج...',
    pasteButton: 'لصق',
    shareTool: 'مشاركة الأداة',
    shareCopied: 'تم نسخ الرابط!',
    tabAll: 'الكل',
    tabVideo: 'فيديو',
    tabAudio: 'صوت',
    optionsCount: 'خيارات',
    videoSectionTitle: 'تحميل الفيديو',
    audioSectionTitle: 'تحميل الصوت MP3',
    downloadVideoBtn: 'تحميل الفيديو',
    downloadAudioBtn: 'تحميل الصوت',
    historyTitle: 'سجل التحميلات',
    clearHistory: 'مسح',
    noHistory: 'لا توجد تحميلات حتى الآن',
    howToTitle: 'كيفية التحميل',
    featuresTitle: 'لماذا تختار MultiGrab؟',
    faqTitle: 'الأسئلة الشائعة',
    allPlatforms: 'جميع المنصات',
    navTools: 'الأدوات',
    navPlatforms: 'المنصات',
    navFeatures: 'المميزات',
    navHistory: 'السجل',
    step1Title: 'نسخ الرابط',
    step1Desc: 'انسخ رابط الفيديو أو الأغنية التي تريد تحميلها.',
    step2Title: 'لصق في MultiGrab',
    step2Desc: 'الصق الرابط في مربع البحث واضغط على زر التحميل.',
    step3Title: 'حفظ الملف',
    step3Desc: 'اختر دقة الفيديو المطلوبة (4K, 1080p) أو ملف الصوت MP3.',
  },
  id: {
    heroBadge: 'Pengunduh Video & Audio Gratis',
    heroHeadline1: 'Tempel tautan.',
    heroHeadline2: 'Unduh berkas.',
    heroSubhead:
      'Unduh video dan musik dari YouTube, Spotify, TikTok tanpa watermark, Instagram Reels, dan Twitter dengan kualitas terbaik. Gratis dan cepat.',
    inputPlaceholder: 'Tempel tautan (YouTube, Spotify, TikTok, Instagram...)...',
    downloadButton: 'Unduh',
    extractingButton: 'Memproses...',
    pasteButton: 'Tempel',
    shareTool: 'Bagikan MultiGrab',
    shareCopied: 'Tautan Disalin!',
    tabAll: 'Semua',
    tabVideo: 'Video',
    tabAudio: 'Audio',
    optionsCount: 'pilihan',
    videoSectionTitle: 'Unduhan Video',
    audioSectionTitle: 'Unduhan Audio',
    downloadVideoBtn: 'Unduh Video',
    downloadAudioBtn: 'Unduh Audio',
    historyTitle: 'Riwayat Unduhan',
    clearHistory: 'Hapus',
    noHistory: 'Belum ada unduhan',
    howToTitle: 'Cara Mengunduh',
    featuresTitle: 'Mengapa Memilih MultiGrab?',
    faqTitle: 'Pertanyaan Umum (FAQ)',
    allPlatforms: 'Semua Platform',
    navTools: 'Alat',
    navPlatforms: 'Platform',
    navFeatures: 'Fitur',
    navHistory: 'Riwayat',
    step1Title: 'Salin Tautan',
    step1Desc: 'Salin tautan video, musik, atau reel yang ingin Anda unduh.',
    step2Title: 'Tempel di MultiGrab',
    step2Desc: 'Tempelkan URL di kolom pencarian lalu klik Unduh.',
    step3Title: 'Simpan ke Perangkat',
    step3Desc: 'Pilih resolusi video (1080p, 4K) atau audio MP3.',
  },
};

/**
 * Returns localized platform landing page metadata with translations for the 8 languages.
 */
export function getLocalizedPlatformData(
  platformSlug: string,
  locale: SupportedLocale = 'en'
) {
  const dictionary = UI_DICTIONARY[locale] || UI_DICTIONARY.en;
  return { dictionary, locale };
}
