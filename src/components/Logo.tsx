import React from 'react';
import { TrendingUp, Zap, Target, Brain } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'hero';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  animated = true, 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    small: {
      container: 'w-8 h-8 sm:w-10 sm:h-10',
      icon: 'w-4 h-4 sm:w-5 sm:h-5',
      text: 'text-lg sm:text-xl',
      subtext: 'text-xs',
      spacing: 'space-x-2'
    },
    medium: {
      container: 'w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16',
      icon: 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8',
      text: 'text-xl sm:text-2xl lg:text-3xl',
      subtext: 'text-sm lg:text-base',
      spacing: 'space-x-3'
    },
    large: {
      container: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
      icon: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12',
      text: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl',
      subtext: 'text-base lg:text-lg',
      spacing: 'space-x-3 lg:space-x-4'
    },
    hero: {
      container: 'w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32',
      icon: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16',
      text: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl',
      subtext: 'text-lg sm:text-xl lg:text-2xl',
      spacing: 'space-x-4 lg:space-x-6'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.spacing} group ${className}`}>
      {/* Enhanced Logo Container with Multiple Visual Elements */}
      <div className="relative">
        {/* Main Logo Background with Gradient and Glow */}
        <div className={`${currentSize.container} bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden ${
          animated ? 'group-hover:scale-110 transition-all duration-500' : ''
        }`}>
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          
          {/* Main Icon - TrendingUp with enhanced styling */}
          <TrendingUp className={`${currentSize.icon} text-white relative z-10 ${
            animated ? 'group-hover:rotate-12 transition-transform duration-300' : ''
          }`} />
          
          {/* AI Circuit Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" opacity="0.3"/>
                  <circle cx="18" cy="18" r="1" fill="white" opacity="0.3"/>
                  <line x1="2" y1="2" x2="18" y2="18" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#circuit)"/>
            </svg>
          </div>
        </div>

        {/* Floating AI Indicators */}
        <div className="absolute -top-1 -right-1 flex space-x-1">
          {/* AI Brain Indicator */}
          <div className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ${
            animated ? 'animate-pulse' : ''
          }`}>
            <Brain className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
        </div>

        {/* Target Accuracy Indicator */}
        <div className="absolute -bottom-1 -left-1">
          <div className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg ${
            animated ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '1s' }}>
            <Target className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
        </div>

        {/* Lightning Speed Indicator */}
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg ${
            animated ? 'animate-ping' : ''
          }`} style={{ animationDelay: '2s' }}>
            <Zap className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
          </div>
        </div>

        {/* Glow Effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10 scale-110"></div>
        )}
      </div>

      {/* Enhanced Text */}
      {showText && (
        <div className="flex flex-col">
          {/* Main Brand Name with Enhanced Gradient */}
          <span className={`${currentSize.text} font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative ${
            animated ? 'group-hover:from-emerald-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300' : ''
          }`}>
            BetSignal
            {/* Text Glow Effect */}
            {animated && (
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300">
                BetSignal
              </span>
            )}
          </span>
          
          {/* AI POWERED Subtitle with Animation */}
          <span className={`${currentSize.subtext} text-emerald-400 font-bold -mt-1 relative overflow-hidden ${
            animated ? 'group-hover:text-emerald-300 transition-colors duration-300' : ''
          }`}>
            <span className="relative z-10">AI POWERED</span>
            {/* Animated Underline */}
            {animated && (
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 group-hover:w-full transition-all duration-500"></div>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;