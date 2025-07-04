import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ContactModal from './ContactModal';
import { useButtonTracker } from '../hooks/useButtonTracker';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<'free-trial' | 'vip-access' | 'default'>('default');
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  const { trackButtonClick } = useButtonTracker();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Persistent countdown timer
  useEffect(() => {
    // Get stored end time or create new one
    const getEndTime = () => {
      const stored = localStorage.getItem('betSignalTimerEnd');
      if (stored) {
        const endTime = parseInt(stored);
        if (endTime > Date.now()) {
          return endTime;
        }
      }
      // Create new 2-hour timer
      const newEndTime = Date.now() + (2 * 60 * 60 * 1000);
      localStorage.setItem('betSignalTimerEnd', newEndTime.toString());
      return newEndTime;
    };

    const endTime = getEndTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        // Timer expired, reset to 2 hours
        const newEndTime = Date.now() + (2 * 60 * 60 * 1000);
        localStorage.setItem('betSignalTimerEnd', newEndTime.toString());
        setTimeLeft({ hours: 2, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const handleButtonClick = (context: 'free-trial' | 'vip-access', buttonText: string) => {
    // Отслеживаем клик по кнопке
    trackButtonClick(buttonText, context);
    
    setModalContext(context);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8 sm:pt-12">
        {/* Premium Background with enhanced animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10" />
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-96 sm:h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[1000px] sm:h-[1000px] bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-spin-slow" />
          
          {/* Enhanced floating elements */}
          <div className="absolute top-20 sm:top-32 right-16 sm:right-32 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 sm:bottom-32 left-16 sm:left-32 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl sm:rounded-2xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg sm:rounded-xl opacity-30 animate-bounce-gentle" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="text-center">
            {/* Enhanced Golden Frame with Luxury Design */}
            <div className={`mb-4 sm:mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="relative inline-block group">
                {/* Outer glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
                
                {/* Main golden frame with enhanced styling */}
                <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl px-6 py-3 sm:px-8 sm:py-4 shadow-2xl border-2 border-yellow-300 overflow-hidden">
                  {/* Inner shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  {/* Decorative corner elements */}
                  <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-80"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-bl from-yellow-200 to-yellow-400 rounded-full opacity-80"></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 bg-gradient-to-tr from-yellow-200 to-yellow-400 rounded-full opacity-80"></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-gradient-to-tl from-yellow-200 to-yellow-400 rounded-full opacity-80"></div>
                  
                  {/* Text with enhanced styling */}
                  <p className="relative z-10 text-gray-900 text-sm sm:text-base lg:text-lg font-bold tracking-wide" style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    Turn <span className="font-black text-lg sm:text-xl lg:text-2xl" style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>$99</span> Into <span className="font-black text-lg sm:text-xl lg:text-2xl" style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>$5,000+</span>
                  </p>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
                </div>
                
                {/* Floating sparkle effects */}
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-2 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-1 -left-3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>

            {/* Main CTA Block */}
            <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8">
                    🏆 AI SPORTS
                    <span className="block">PREDICTIONS</span>
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                    Join the <span className="font-black text-yellow-300">AI Revolution</span> in sports betting. Our neural network has generated <span className="font-black text-yellow-300">$2.5M+ profits</span> for 10,000+ smart bettors
                  </p>
                  
                  {/* Buttons - Swapped positions */}
                  <div className="flex flex-col space-y-4 sm:space-y-6 items-center mb-8 sm:mb-12">
                    {/* Start 3 Days FREE Button - Now first */}
                    <button 
                      onClick={() => handleButtonClick('free-trial', 'Start 3 Days FREE')}
                      className="bg-white text-gray-900 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl text-lg sm:text-xl font-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl w-full sm:w-auto max-w-md"
                    >
                      🚀 Start 3 Days FREE
                    </button>
                    
                    {/* GET VIP Access Button - Now second */}
                    <button 
                      onClick={() => handleButtonClick('vip-access', 'GET VIP Access')}
                      className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl text-xl sm:text-2xl font-black hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-xl w-full sm:w-auto max-w-md"
                    >
                      GET VIP Access ✅
                    </button>
                  </div>

                  {/* Urgency Text with Inline Timer - Same font style */}
                  <div className="flex items-center justify-center space-x-3 text-sm sm:text-base text-blue-200">
                    <span>⏰ Limited spots available</span>
                    <span className="text-blue-200 font-mono">
                      {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yellow Chevron Scroll Arrow with Downward Animation - Moved higher */}
            <div className={`mt-8 sm:mt-12 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex flex-col items-center space-y-2">
                {/* Yellow Chevron with downward movement animation - 10% bigger and more yellow */}
                <div className="relative cursor-pointer hover:scale-110 transition-all duration-300">
                  <ChevronDown className="w-9 h-9 sm:w-11 sm:h-11 text-yellow-400 animate-bounce-down" />
                </div>
                
                {/* Scroll text - white color */}
                <span className="text-xs sm:text-sm text-white font-medium animate-pulse">
                  Scroll to explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        context={modalContext}
      />
    </>
  );
};

export default Hero;