// Telegram Bot API configuration
const TELEGRAM_BOT_TOKEN = '8199183576:AAGz2Sm9UQc9xXP09EK746uU2URs2ShRuh0';
const TELEGRAM_CHAT_ID = '619623004'; // Aleksey's chat ID

interface ContactFormData {
  messenger: string;
  contact: string;
  context: string;
}

interface AbandonedLeadData {
  context: string;
  timestamp: string;
  timeSpent: number; // в секундах
  userAgent: string;
  pageUrl: string;
  sessionId?: string;
}

// Function to get context emoji and title
const getContextInfo = (context: string) => {
  // Проверяем, есть ли информация о кнопке в контексте
  if (context.includes('button:')) {
    const [mainContext, buttonInfo] = context.split(' (button: ');
    const buttonName = buttonInfo?.replace(')', '') || '';
    
    const baseInfo = getBaseContextInfo(mainContext);
    return {
      ...baseInfo,
      title: `${baseInfo.title} (${buttonName})`
    };
  }
  
  return getBaseContextInfo(context);
};

const getBaseContextInfo = (context: string) => {
  switch (context) {
    case 'free-trial':
      return { emoji: '🎁', title: 'FREE TRIAL REQUEST' };
    case 'vip-access':
      return { emoji: '⭐', title: 'VIP ACCESS REQUEST' };
    case 'support':
      return { emoji: '💬', title: 'SUPPORT REQUEST' };
    case 'start-earning':
      return { emoji: '💰', title: 'START EARNING REQUEST' };
    case 'get-started':
      return { emoji: '⚡', title: 'GET STARTED REQUEST' };
    default:
      return { emoji: '🚀', title: 'NEW CONTACT REQUEST' };
  }
};

// Function to get messenger emoji
const getMessengerEmoji = (messenger: string) => {
  switch (messenger) {
    case 'whatsapp':
      return '📱';
    case 'telegram':
      return '✈️';
    case 'email':
      return '📧';
    case 'phone':
      return '📞';
    default:
      return '💬';
  }
};

// Function to get device info from user agent
const getDeviceInfo = (userAgent: string) => {
  console.log('🔍 Analyzing user agent:', userAgent);
  
  // iPhone models
  if (userAgent.includes('iPhone')) {
    if (userAgent.includes('iPhone15')) return '📱 iPhone 15';
    if (userAgent.includes('iPhone14')) return '📱 iPhone 14';
    if (userAgent.includes('iPhone13')) return '📱 iPhone 13';
    if (userAgent.includes('iPhone12')) return '📱 iPhone 12';
    if (userAgent.includes('iPhone11')) return '📱 iPhone 11';
    if (userAgent.includes('iPhoneX')) return '📱 iPhone X';
    return '📱 iPhone';
  }
  
  // iPad
  if (userAgent.includes('iPad')) {
    return '📱 iPad';
  }
  
  // Android devices
  if (userAgent.includes('Android')) {
    if (userAgent.includes('Samsung')) return '📱 Samsung';
    if (userAgent.includes('Huawei')) return '📱 Huawei';
    if (userAgent.includes('Xiaomi')) return '📱 Xiaomi';
    if (userAgent.includes('OnePlus')) return '📱 OnePlus';
    return '📱 Android';
  }
  
  // Desktop
  if (userAgent.includes('Windows')) return '💻 Windows';
  if (userAgent.includes('Mac')) return '💻 Mac';
  if (userAgent.includes('Linux')) return '💻 Linux';
  
  return '🖥️ Неизвестно';
};

// Function to get user's location by IP
const getUserLocation = async (): Promise<string> => {
  try {
    console.log('🌍 Getting user location...');
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    console.log('📍 Location data:', data);
    
    if (data.country_name && data.city) {
      const flag = getCountryFlag(data.country_code);
      return `${flag} ${data.city}, ${data.country_name}`;
    }
    
    return '🌍 Неизвестно';
  } catch (error) {
    console.error('❌ Failed to get location:', error);
    return '🌍 Неизвестно';
  }
};

// Function to get country flag emoji
const getCountryFlag = (countryCode: string): string => {
  const flags: { [key: string]: string } = {
    'US': '🇺🇸', 'RU': '🇷🇺', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'IT': '🇮🇹', 'ES': '🇪🇸', 'CA': '🇨🇦', 'AU': '🇦🇺', 'JP': '🇯🇵',
    'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷',
    'KR': '🇰🇷', 'TR': '🇹🇷', 'SA': '🇸🇦', 'AE': '🇦🇪', 'IL': '🇮🇱',
    'PL': '🇵🇱', 'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
    'FI': '🇫🇮', 'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'CZ': '🇨🇿',
    'UA': '🇺🇦', 'BY': '🇧🇾', 'KZ': '🇰🇿', 'UZ': '🇺🇿', 'TH': '🇹🇭',
    'VN': '🇻🇳', 'ID': '🇮🇩', 'MY': '🇲🇾', 'SG': '🇸🇬', 'PH': '🇵🇭'
  };
  
  return flags[countryCode] || '🌍';
};

// Function to format the message beautifully
const formatTelegramMessage = (data: ContactFormData) => {
  const contextInfo = getContextInfo(data.context);
  const messengerEmoji = getMessengerEmoji(data.messenger);
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
🔥 <b>${contextInfo.title}</b> ${contextInfo.emoji}

👤 <b>НОВЫЙ КЛИЕНТ:</b>
${messengerEmoji} <b>${data.messenger.toUpperCase()}:</b> <code>${data.contact}</code>

📊 <b>КОНТЕКСТ:</b> ${data.context}

⏰ <b>ВРЕМЯ:</b> ${timestamp}

🎯 <b>ДЕЙСТВИЕ:</b> Свяжитесь с клиентом в течение 5 минут!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 <b>BetSignal AI</b> - Новая заявка получена!
  `.trim();
};

// Function to format abandoned lead message (simplified)
const formatAbandonedLeadMessage = async (data: AbandonedLeadData) => {
  console.log('📝 Formatting abandoned lead message for:', data);
  
  const contextInfo = getContextInfo(data.context);
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const timeSpentMinutes = Math.floor(data.timeSpent / 60);
  const timeSpentSeconds = data.timeSpent % 60;
  const timeSpentText = timeSpentMinutes > 0 
    ? `${timeSpentMinutes}м ${timeSpentSeconds}с`
    : `${timeSpentSeconds}с`;

  const deviceInfo = getDeviceInfo(data.userAgent);
  const location = await getUserLocation();

  const message = `
🚨 <b>ПОЛЬЗОВАТЕЛЬ УШЕЛ БЕЗ ЗАЯВКИ!</b>

📋 <b>ДЕТАЛИ:</b>
${contextInfo.emoji} <b>Контекст:</b> ${data.context}
⏱️ <b>Время в модалке:</b> ${timeSpentText}
🕐 <b>Время ухода:</b> ${timestamp}
${deviceInfo}
📍 <b>Локация:</b> ${location}
  `.trim();

  console.log('📤 Formatted message:', message);
  return message;
};

// Function to send message to Telegram
export const sendTelegramNotification = async (formData: ContactFormData): Promise<boolean> => {
  try {
    console.log('📤 Sending Telegram notification for form data:', formData);
    
    const message = formatTelegramMessage(formData);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }

    console.log('✅ Telegram notification sent successfully to Aleksey');
    return true;
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error);
    return false;
  }
};

// Function to send abandoned lead notification
export const sendAbandonedLeadNotification = async (leadData: AbandonedLeadData): Promise<boolean> => {
  try {
    console.log('📤 Sending abandoned lead notification for:', leadData);
    console.log('🔧 Using bot token:', TELEGRAM_BOT_TOKEN);
    console.log('🔧 Using chat ID:', TELEGRAM_CHAT_ID);
    
    const message = await formatAbandonedLeadMessage(leadData);
    
    console.log('🚀 Making request to Telegram API...');
    
    const requestBody = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };
    
    console.log('📦 Request body:', requestBody);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Telegram API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Telegram API error response:', errorText);
      throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('📨 Telegram API result:', result);
    
    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }

    console.log('✅ Abandoned lead notification sent successfully to Aleksey');
    return true;
  } catch (error) {
    console.error('❌ Failed to send abandoned lead notification:', error);
    return false;
  }
};

// Function to get your chat ID (helper function)
export const getChatId = async (): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      // Get the most recent message's chat ID
      const lastMessage = data.result[data.result.length - 1];
      return lastMessage.message?.chat?.id?.toString() || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting chat ID:', error);
    return null;
  }
};

// Export types
export type { ContactFormData, AbandonedLeadData };