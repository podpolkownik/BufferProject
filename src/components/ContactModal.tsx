import React, { useState } from 'react';
import { X, MessageCircle, Mail, Phone, Instagram, Send, CheckCircle, ChevronDown, Star, TrendingUp, Zap, Gift } from 'lucide-react';
import { sendTelegramNotification } from '../utils/telegram';
import { useButtonTracker } from '../hooks/useButtonTracker';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'free-trial' | 'vip-access' | 'support' | 'start-earning' | 'get-started' | 'default';
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, context = 'default' }) => {
  const [formData, setFormData] = useState({
    messenger: 'whatsapp',
    contact: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { markAsConverted } = useButtonTracker();

  const messengers = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, placeholder: '+1234567890', color: 'from-green-500 to-green-600' },
    { id: 'telegram', name: 'Telegram', icon: Send, placeholder: '@username or +1234567890', color: 'from-blue-500 to-blue-600' },
    { id: 'email', name: 'Email', icon: Mail, placeholder: 'your@email.com', color: 'from-purple-500 to-purple-600' },
    { id: 'phone', name: 'Phone', icon: Phone, placeholder: '+1234567890', color: 'from-orange-500 to-orange-600' }
  ];

  const socialLinks = [
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      url: 'https://wa.me/+46722600461?text=GET%20FREE%20PREDICTION',
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Telegram', 
      icon: Send, 
      url: 'https://t.me/Bet_Signal_Vip_bot',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/bet.signal/',
      color: 'from-pink-500 to-purple-600'
    }
  ];

  // Dynamic content based on context
  const getContextContent = () => {
    switch (context) {
      case 'free-trial':
        return {
          icon: Gift,
          iconColor: 'from-emerald-500 to-blue-600',
          title: 'Start Your',
          subtitle: '3-Day Free Trial!',
          description: 'Get 3 premium predictions absolutely free and see why our clients earn consistently',
          buttonText: 'Activate Free Trial 🎁',
          footerText: 'Your free predictions will arrive within 5 minutes!'
        };
      
      case 'vip-access':
        return {
          icon: Star,
          iconColor: 'from-yellow-500 to-orange-600',
          title: 'Get Instant',
          subtitle: 'VIP Access!',
          description: 'Join our exclusive VIP community and start earning with premium AI predictions',
          buttonText: 'Get VIP Access ⭐',
          footerText: 'VIP access activated immediately after contact!'
        };
      
      case 'support':
        return {
          icon: MessageCircle,
          iconColor: 'from-blue-500 to-purple-600',
          title: 'Contact Our',
          subtitle: 'Support Team',
          description: 'Get help from our 24/7 support team - we\'re here to assist you',
          buttonText: 'Contact Support 💬',
          footerText: 'Our support team will respond within 15 minutes!'
        };
      
      case 'start-earning':
        return {
          icon: TrendingUp,
          iconColor: 'from-emerald-500 to-green-600',
          title: 'Start Earning',
          subtitle: 'Today!',
          description: 'Join thousands of successful bettors and begin your profitable journey',
          buttonText: 'Start Earning 💰',
          footerText: 'Your first profitable prediction is just minutes away!'
        };
      
      case 'get-started':
        return {
          icon: Zap,
          iconColor: 'from-purple-500 to-pink-600',
          title: 'Get Started',
          subtitle: 'Right Now!',
          description: 'Take the first step towards consistent betting profits with our AI predictions',
          buttonText: 'Get Started ⚡',
          footerText: 'Setup takes less than 2 minutes!'
        };
      
      default:
        return {
          icon: MessageCircle,
          iconColor: 'from-emerald-500 to-blue-600',
          title: 'Get Access in',
          subtitle: '3 Seconds!',
          description: 'Choose your contact method and get your first prediction for free',
          buttonText: 'Send & Start Earning 🚀',
          footerText: 'Your prediction will arrive in 5 minutes via your chosen messenger!'
        };
    }
  };

  const contextContent = getContextContent();
  const IconComponent = contextContent.icon;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    } else {
      // Basic validation based on messenger type
      if (formData.messenger === 'email' && !formData.contact.includes('@')) {
        newErrors.contact = 'Please enter a valid email address';
      }
      if ((formData.messenger === 'whatsapp' || formData.messenger === 'phone') && 
          !formData.contact.match(/^\+?[\d\s\-\(\)]+$/)) {
        newErrors.contact = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Отмечаем лид как конвертированный ПЕРЕД отправкой
        markAsConverted();
        
        // Send Telegram notification
        const telegramSuccess = await sendTelegramNotification({
          messenger: formData.messenger,
          contact: formData.contact,
          context: context
        });

        if (telegramSuccess) {
          console.log('✅ Form submitted and Telegram notification sent:', { ...formData, context });
        } else {
          console.log('⚠️ Form submitted but Telegram notification failed:', { ...formData, context });
        }

        setIsSubmitted(true);
        
      } catch (error) {
        console.error('❌ Error submitting form:', error);
        // Still show success to user even if notification fails
        setIsSubmitted(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMessengerSelect = (messengerId: string) => {
    setFormData(prev => ({ ...prev, messenger: messengerId }));
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    // Reset form state when closing
    setIsSubmitted(false);
    setFormData({ messenger: 'whatsapp', contact: '' });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const selectedMessenger = messengers.find(m => m.id === formData.messenger);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal - Reduced size by 8% */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto" style={{ maxWidth: '368px' }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {!isSubmitted ? (
          // Form Content
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className={`w-12 h-12 bg-gradient-to-r ${contextContent.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                {contextContent.title}
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {contextContent.subtitle}
                </span>
              </h2>
              <p className="text-gray-600 text-sm">
                {contextContent.description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Messenger Selection - Compact Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Method *
                </label>
                
                {/* Custom Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-emerald-300 focus:border-emerald-500 focus:outline-none transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${selectedMessenger?.color} rounded-lg flex items-center justify-center shadow-md`}>
                        {selectedMessenger && <selectedMessenger.icon className="w-4 h-4 text-white" />}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 text-sm">{selectedMessenger?.name}</div>
                        <div className="text-xs text-gray-500">Click to change</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                      {messengers.map((messenger) => {
                        const IconComponent = messenger.icon;
                        return (
                          <button
                            key={messenger.id}
                            type="button"
                            onClick={() => handleMessengerSelect(messenger.id)}
                            className={`w-full flex items-center space-x-2 p-3 hover:bg-gray-50 transition-colors duration-200 ${
                              formData.messenger === messenger.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 bg-gradient-to-r ${messenger.color} rounded-lg flex items-center justify-center shadow-md`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900 text-sm">{messenger.name}</div>
                              <div className="text-xs text-gray-500">{messenger.placeholder}</div>
                            </div>
                            {formData.messenger === messenger.id && (
                              <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Input - Clean without icons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your {selectedMessenger?.name} *
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder={selectedMessenger?.placeholder}
                  className={`w-full px-3 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.contact 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-emerald-500'
                  }`}
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r ${contextContent.iconColor} text-white py-3 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </span>
                ) : (
                  contextContent.buttonText
                )}
              </button>

              {/* Footer Text */}
              <p className="text-center text-xs text-gray-500 leading-relaxed">
                {contextContent.footerText}
              </p>
            </form>
          </div>
        ) : (
          // Success Content - Modal stays open until user closes manually
          <div className="p-6 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Excellent! Request Submitted 🎉
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              {context === 'free-trial' ? 'Your free trial is being activated!' :
               context === 'vip-access' ? 'Your VIP access is being processed!' :
               context === 'support' ? 'Our support team has been notified!' :
               'Your request is being processed!'}<br />
              Expect a message within 5 minutes.
            </p>

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Follow us on social media for exclusive content:
              </p>
              <div className="flex justify-center space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Get exclusive predictions and expert analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;