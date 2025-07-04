import { useEffect, useRef, useCallback } from 'react';
import { sendAbandonedLeadNotification, AbandonedLeadData } from '../utils/telegram';

interface UseAbandonedLeadTrackerProps {
  isModalOpen: boolean;
  context: string;
  timeoutDuration?: number; // в миллисекундах, по умолчанию 60 секунд
}

interface AbandonedLeadTracker {
  startTracking: () => void;
  stopTracking: () => void;
  markAsConverted: () => void;
}

export const useAbandonedLeadTracker = ({
  isModalOpen,
  context,
  timeoutDuration = 60000 // 1 минута
}: UseAbandonedLeadTrackerProps): AbandonedLeadTracker => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isConvertedRef = useRef<boolean>(false);
  const hasNotifiedRef = useRef<boolean>(false);
  const sessionIdRef = useRef<string | null>(null);

  // Генерируем уникальный ID сессии для предотвращения дублирования
  const generateSessionId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Функция для отправки уведомления о неудавшемся лиде
  const sendAbandonedNotification = useCallback(async () => {
    console.log('🔍 Checking if should send abandoned notification...');
    console.log('hasNotifiedRef.current:', hasNotifiedRef.current);
    console.log('isConvertedRef.current:', isConvertedRef.current);
    console.log('sessionIdRef.current:', sessionIdRef.current);

    if (hasNotifiedRef.current || isConvertedRef.current) {
      console.log('🚫 Notification already sent or user converted, skipping');
      return;
    }

    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      console.log('🚫 No session ID, skipping notification');
      return;
    }

    // Проверяем, не отправляли ли уже уведомление для этой сессии
    const sentNotifications = JSON.parse(localStorage.getItem('betsignal_sent_notifications') || '[]');
    if (sentNotifications.includes(sessionId)) {
      console.log('🚫 Notification already sent for this session, skipping');
      return;
    }

    const timeSpent = startTimeRef.current 
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 60; // fallback

    console.log('📤 Sending abandoned lead notification...');
    console.log('Context:', context);
    console.log('Time spent:', timeSpent, 'seconds');
    console.log('Session ID:', sessionId);

    const leadData: AbandonedLeadData = {
      context,
      timestamp: new Date().toISOString(),
      timeSpent,
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
      sessionId
    };

    try {
      const success = await sendAbandonedLeadNotification(leadData);
      if (success) {
        hasNotifiedRef.current = true;
        
        // Сохраняем ID сессии как отправленную
        sentNotifications.push(sessionId);
        // Храним только последние 50 записей
        if (sentNotifications.length > 50) {
          sentNotifications.splice(0, sentNotifications.length - 50);
        }
        localStorage.setItem('betsignal_sent_notifications', JSON.stringify(sentNotifications));
        
        console.log('✅ Abandoned lead notification sent for session:', sessionId);
      } else {
        console.log('❌ Failed to send abandoned lead notification');
      }
    } catch (error) {
      console.error('❌ Error sending abandoned lead notification:', error);
    }
  }, [context]);

  // Запуск отслеживания
  const startTracking = useCallback(() => {
    console.log('🚀 Starting tracking for context:', context);
    
    if (timeoutRef.current) {
      console.log('⏹️ Clearing existing timeout');
      clearTimeout(timeoutRef.current);
    }

    // Генерируем новый ID сессии
    sessionIdRef.current = generateSessionId();
    startTimeRef.current = Date.now();
    isConvertedRef.current = false;
    hasNotifiedRef.current = false;

    console.log(`⏱️ Started tracking abandoned lead for context: ${context}, session: ${sessionIdRef.current}`);
    console.log(`⏰ Will trigger notification in ${timeoutDuration}ms (${timeoutDuration/1000} seconds)`);

    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Timeout reached (1 minute), attempting to send notification...');
      sendAbandonedNotification();
    }, timeoutDuration);
  }, [context, timeoutDuration, sendAbandonedNotification, generateSessionId]);

  // Остановка отслеживания
  const stopTracking = useCallback(() => {
    console.log('⏹️ Stopping tracking for context:', context);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log('✅ Timeout cleared');
    }
    
    // Не сбрасываем sessionId, чтобы предотвратить повторные отправки
    startTimeRef.current = null;
  }, [context]);

  // Отметка о конверсии
  const markAsConverted = useCallback(() => {
    console.log('✅ Marking as converted for context:', context, 'session:', sessionIdRef.current);
    
    isConvertedRef.current = true;
    stopTracking();
    
    // Добавляем сессию в список конвертированных
    if (sessionIdRef.current) {
      const convertedSessions = JSON.parse(localStorage.getItem('betsignal_converted_sessions') || '[]');
      convertedSessions.push(sessionIdRef.current);
      // Храним только последние 50 записей
      if (convertedSessions.length > 50) {
        convertedSessions.splice(0, convertedSessions.length - 50);
      }
      localStorage.setItem('betsignal_converted_sessions', JSON.stringify(convertedSessions));
    }
  }, [context, stopTracking]);

  // Эффект для управления отслеживанием при открытии/закрытии модального окна
  useEffect(() => {
    console.log('📊 Modal state changed:', { isModalOpen, context });
    
    if (isModalOpen) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isModalOpen, startTracking, stopTracking]);

  return {
    startTracking,
    stopTracking,
    markAsConverted
  };
};

export default useAbandonedLeadTracker;