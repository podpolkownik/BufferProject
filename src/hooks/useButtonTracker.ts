import { useEffect, useCallback } from 'react';
import { sendAbandonedLeadNotification, AbandonedLeadData } from '../utils/telegram';

interface ButtonTrackingData {
  buttonText: string;
  context: string;
  timestamp: number;
  sessionId: string;
  pageUrl: string;
  userAgent: string;
}

export const useButtonTracker = () => {
  // Генерируем уникальный ID сессии
  const generateSessionId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Функция для отслеживания клика по кнопке
  const trackButtonClick = useCallback((buttonText: string, context: string) => {
    console.log('🎯 Button clicked:', buttonText, 'Context:', context);
    
    const sessionId = generateSessionId();
    const trackingData: ButtonTrackingData = {
      buttonText,
      context,
      timestamp: Date.now(),
      sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    };

    // Сохраняем данные о клике в localStorage
    const pendingClicks = JSON.parse(localStorage.getItem('betsignal_pending_clicks') || '[]');
    pendingClicks.push(trackingData);
    
    // Храним только последние 20 кликов
    if (pendingClicks.length > 20) {
      pendingClicks.splice(0, pendingClicks.length - 20);
    }
    
    localStorage.setItem('betsignal_pending_clicks', JSON.stringify(pendingClicks));
    
    console.log('💾 Button click saved to localStorage:', trackingData);
    
    // Устанавливаем таймер на 1 минуту
    setTimeout(() => {
      checkAndSendAbandonedNotification(sessionId, trackingData);
    }, 60000); // 1 минута
    
  }, [generateSessionId]);

  // Функция для отметки конверсии (когда форма отправлена)
  const markAsConverted = useCallback((sessionId?: string) => {
    console.log('✅ Marking as converted, session:', sessionId);
    
    if (sessionId) {
      // Отмечаем конкретную сессию как конвертированную
      const convertedSessions = JSON.parse(localStorage.getItem('betsignal_converted_sessions') || '[]');
      convertedSessions.push(sessionId);
      localStorage.setItem('betsignal_converted_sessions', JSON.stringify(convertedSessions));
    } else {
      // Отмечаем все последние клики как конвертированные
      const pendingClicks = JSON.parse(localStorage.getItem('betsignal_pending_clicks') || '[]');
      const convertedSessions = JSON.parse(localStorage.getItem('betsignal_converted_sessions') || '[]');
      
      // Берем последние 5 кликов и отмечаем их как конвертированные
      const recentClicks = pendingClicks.slice(-5);
      recentClicks.forEach((click: ButtonTrackingData) => {
        convertedSessions.push(click.sessionId);
      });
      
      localStorage.setItem('betsignal_converted_sessions', JSON.stringify(convertedSessions));
    }
    
    console.log('✅ Conversion marked successfully');
  }, []);

  // Функция для проверки и отправки уведомления о неудавшемся лиде
  const checkAndSendAbandonedNotification = useCallback(async (sessionId: string, trackingData: ButtonTrackingData) => {
    console.log('🔍 Checking abandoned lead for session:', sessionId);
    
    // Проверяем, не конвертировался ли пользователь
    const convertedSessions = JSON.parse(localStorage.getItem('betsignal_converted_sessions') || '[]');
    if (convertedSessions.includes(sessionId)) {
      console.log('✅ User converted, skipping abandoned notification');
      return;
    }
    
    // Проверяем, не отправляли ли уже уведомление для этой сессии
    const sentNotifications = JSON.parse(localStorage.getItem('betsignal_sent_notifications') || '[]');
    if (sentNotifications.includes(sessionId)) {
      console.log('🚫 Notification already sent for this session');
      return;
    }
    
    // Вычисляем время, прошедшее с клика
    const timeSpent = Math.floor((Date.now() - trackingData.timestamp) / 1000);
    
    console.log('📤 Sending abandoned lead notification...');
    console.log('Button:', trackingData.buttonText);
    console.log('Context:', trackingData.context);
    console.log('Time since click:', timeSpent, 'seconds');
    
    const leadData: AbandonedLeadData = {
      context: `${trackingData.context} (button: ${trackingData.buttonText})`,
      timestamp: new Date().toISOString(),
      timeSpent,
      userAgent: trackingData.userAgent,
      pageUrl: trackingData.pageUrl,
      sessionId
    };

    try {
      const success = await sendAbandonedLeadNotification(leadData);
      if (success) {
        // Отмечаем как отправленное
        sentNotifications.push(sessionId);
        localStorage.setItem('betsignal_sent_notifications', JSON.stringify(sentNotifications));
        
        console.log('✅ Abandoned lead notification sent successfully');
      }
    } catch (error) {
      console.error('❌ Failed to send abandoned lead notification:', error);
    }
  }, []);

  // Функция для обработки отложенных уведомлений при загрузке страницы
  const processPendingNotifications = useCallback(async () => {
    const pendingClicks = JSON.parse(localStorage.getItem('betsignal_pending_clicks') || '[]');
    
    if (pendingClicks.length === 0) return;
    
    console.log(`📤 Processing ${pendingClicks.length} pending clicks...`);
    
    const convertedSessions = JSON.parse(localStorage.getItem('betsignal_converted_sessions') || '[]');
    const sentNotifications = JSON.parse(localStorage.getItem('betsignal_sent_notifications') || '[]');
    const now = Date.now();
    
    for (const click of pendingClicks) {
      // Пропускаем клики младше 1 минуты
      if (now - click.timestamp < 60000) {
        continue;
      }
      
      // Пропускаем старые клики (старше 24 часов)
      if (now - click.timestamp > 24 * 60 * 60 * 1000) {
        continue;
      }
      
      // Пропускаем конвертированные сессии
      if (convertedSessions.includes(click.sessionId)) {
        continue;
      }
      
      // Пропускаем уже отправленные
      if (sentNotifications.includes(click.sessionId)) {
        continue;
      }
      
      await checkAndSendAbandonedNotification(click.sessionId, click);
      
      // Небольшая задержка между отправками
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Очищаем старые клики (старше 24 часов)
    const filteredClicks = pendingClicks.filter((click: ButtonTrackingData) => 
      now - click.timestamp < 24 * 60 * 60 * 1000
    );
    localStorage.setItem('betsignal_pending_clicks', JSON.stringify(filteredClicks));
    
  }, [checkAndSendAbandonedNotification]);

  // Обрабатываем отложенные уведомления при загрузке
  useEffect(() => {
    processPendingNotifications();
  }, [processPendingNotifications]);

  return {
    trackButtonClick,
    markAsConverted
  };
};

export default useButtonTracker;