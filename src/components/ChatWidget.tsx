'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Phone, Mail, MessageSquare, Headset, LogOut, ChevronDown, Check, MapPin, ArrowRight, Home, Bed, Bath, Maximize } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'admin';
  senderName?: string;
  createdAt: string;
}

const COUNTRIES = [
  { code: '+90', country: 'TR', name: 'Türkiye', maxLength: 10 },
  { code: '+1', country: 'US', name: 'USA', maxLength: 10 },
  { code: '+44', country: 'GB', name: 'UK', maxLength: 11 },
  { code: '+49', country: 'DE', name: 'Germany', maxLength: 11 },
  { code: '+33', country: 'FR', name: 'France', maxLength: 9 },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', maxLength: 9 },
  { code: '+971', country: 'AE', name: 'UAE', maxLength: 9 },
];

export default function ChatWidget() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ChatWidget');
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<string>('bot');
  const [adminTyping, setAdminTyping] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, adminTyping]);

  // Eğer session varsa ve sayfa yenilendiyse, localStorage'dan alabiliriz (İsteğe bağlı)
  // Şimdilik basit tutalım

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullPhone = `${selectedCountry.code}${formData.phone}`;
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phone: fullPhone, locale })
      });

      if (!res.ok) throw new Error('Sohbet başlatılamadı');

      const data = await res.json();
      setSessionId(data.id);
      setMessages(data.messages);
      setStep('chat');
    } catch (error) {
      console.error(error);
      alert(t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndChat = async () => {
    if (!sessionId) return;
    
    try {
      await fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      
      setSessionStatus('bot');
      // İsteğe bağlı: Kullanıcıya bildirim veya mesaj eklenebilir
    } catch (error) {
      console.error('Error ending chat:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId) return;

    // Optimistic update
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: content,
      sender: 'user',
      createdAt: new Date().toISOString()
    }]);

    try {
      // Sadece bot modundaysak loading göster (bot cevabı bekleniyor)
      // Canlı destek modundaysak, admin yazana kadar loading gösterme (adminTyping ile gösterilecek)
      if (sessionStatus === 'bot') {
        setIsLoading(true);
      }
      
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: content,
          locale
        })
      });

      const data = await res.json();
      
      if (data.status === 'sent_to_live') {
        // Admin'e iletildi, cevap bekleniyor mesajı zaten eklenmiş olabilir veya ekleyebiliriz
        // Şimdilik bir şey yapmaya gerek yok, admin cevap verince polling ile gelecek (Basit versiyon)
      } else {
        setMessages(prev => [...prev, data]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    await sendMessage(userMsg);
  };

  // Basit polling mekanizması (Canlı destek cevaplarını kontrol etmek için)
  // Gerçek projede WebSocket veya Server Sent Events kullanılmalı
  useEffect(() => {
    if (step !== 'chat' || !sessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/history?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          
          if (data.status) setSessionStatus(data.status);
          setAdminTyping(!!data.adminTyping);

          if (data.messages) {
            // Mevcut mesaj sayısından farklıysa güncelle
            // Bu basit bir kontrol, daha gelişmiş bir diff yapılabilir
            setMessages(prev => {
              if (prev.length !== data.messages.length) {
                return data.messages;
              }
              return prev;
            });
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    // İlk yükleme
    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [step, sessionId]);

  // Admin panelinde chat widget'ı gizle
  if (pathname?.startsWith('/admin')) return null;

  const renderMessageContent = (content: string) => {
    const propertyMatch = content.match(/\[PROPERTY_DATA\]([\s\S]*?)\[\/PROPERTY_DATA\]/);
    
    if (propertyMatch) {
      const propertyJson = propertyMatch[1];
      const textPart = content.replace(propertyMatch[0], '').trim();
      
      try {
        const property = JSON.parse(propertyJson);
        return (
          <div className="flex flex-col gap-2 w-full">
            {textPart && <p className="whitespace-pre-wrap">{textPart}</p>}
            <div className="mt-2 bg-[#262626] border border-white/10 rounded-xl overflow-hidden shadow-xl w-full max-w-[280px] self-center group">
              {/* Image Section */}
              <div className="relative h-40 bg-white/5 overflow-hidden">
                {property.image ? (
                  <Image 
                    src={property.image} 
                    alt={property.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Home size={32} />
                  </div>
                )}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-2 left-2 bg-primary-gold text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  Satılık
                </div>
                
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                  <span className="text-white font-bold text-lg drop-shadow-md">{property.price}</span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-3 space-y-3">
                <div>
                  <h4 className="font-semibold text-white text-sm truncate leading-tight mb-1" title={property.title}>
                    {property.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <MapPin size={10} className="flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-white/5 border-b">
                   <div className="flex flex-col items-center justify-center p-1.5 bg-white/5 rounded-lg gap-1">
                      <Bed size={14} className="text-primary-gold" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-white text-xs leading-none">{property.rooms}</span>
                        <span className="text-[9px] text-white/40 leading-none mt-0.5">Oda</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-center justify-center p-1.5 bg-white/5 rounded-lg gap-1">
                      <Bath size={14} className="text-primary-gold" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-white text-xs leading-none">{property.bathrooms}</span>
                        <span className="text-[9px] text-white/40 leading-none mt-0.5">Banyo</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-center justify-center p-1.5 bg-white/5 rounded-lg gap-1">
                      <Maximize size={14} className="text-primary-gold" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-white text-xs leading-none">{property.area}</span>
                        <span className="text-[9px] text-white/40 leading-none mt-0.5">m²</span>
                      </div>
                   </div>
                </div>
                
                {/* Action Button */}
                <a 
                  href={`/${locale}/properties/${property.id}`} 
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-primary-gold hover:text-black text-white py-2.5 rounded-lg text-xs font-bold transition-all duration-300 group-hover:bg-primary-gold group-hover:text-black"
                >
                   {t('viewDetails')} <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        );
      } catch (e) {
        console.error("Error parsing property card:", e);
        return <p className="whitespace-pre-wrap">{content}</p>;
      }
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-primary-gold to-primary-gold-dark rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-primary-gold/50 transition-shadow"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gray-900 to-black border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center border border-primary-gold/30">
                  <Headset className="text-primary-gold w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t('title')}</h3>
                  <p className="text-xs text-white/50">{t('subtitle')}</p>
                </div>
              </div>
              
              {(sessionStatus === 'live_active' || sessionStatus === 'live_waiting') && (
                <button 
                  onClick={handleEndChat}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title={t('endChat')}
                >
                  <LogOut size={16} />
                  {t('endChat')}
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#0f0f0f] relative">
              {step === 'form' ? (
                <div className="p-6 flex flex-col h-full justify-center">
                  <div className="text-center mb-8">
                    <h4 className="text-xl text-white font-bold mb-2">{t('welcomeTitle')}</h4>
                    <p className="text-white/60 text-sm">{t('welcomeDesc')}</p>
                  </div>

                  <form onSubmit={handleStartChat} className="space-y-4">
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-primary-gold transition-colors" />
                      <input
                        type="text"
                        placeholder={t('namePlaceholder')}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 transition-all"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-primary-gold transition-colors" />
                      <input
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 transition-all"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="relative group flex gap-2">
                      {/* Country Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="h-full bg-white/5 border border-white/10 rounded-xl px-3 flex items-center gap-2 text-white hover:bg-white/10 transition-colors min-w-[80px]"
                        >
                          <span className="text-sm font-medium">{selectedCountry.code}</span>
                          <ChevronDown size={16} className={`text-white/50 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isCountryDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto"
                            >
                              {COUNTRIES.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setIsCountryDropdownOpen(false);
                                    setFormData({ ...formData, phone: '' });
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center justify-between group"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-white text-sm font-medium">{country.name}</span>
                                    <span className="text-white/50 text-xs">{country.code}</span>
                                  </div>
                                  {selectedCountry.code === country.code && <Check size={14} className="text-primary-gold" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Phone Input */}
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-primary-gold transition-colors" />
                        <input
                          type="tel"
                          placeholder={t('phonePlaceholder')}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 transition-all"
                          value={formData.phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= selectedCountry.maxLength) {
                              setFormData({ ...formData, phone: val });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-gold hover:bg-primary-gold-dark text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          {t('startChatButton')} <MessageSquare size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-4 space-y-4 min-h-full">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {msg.sender !== 'user' && (
                        <span className="text-[10px] text-white/50 mb-1 ml-1">
                          {msg.senderName || (msg.sender === 'bot' ? t('botName') : t('agentName'))}
                          {msg.sender === 'admin' && ` (${t('adminRole')})`}
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender === 'user'
                            ? 'bg-primary-gold text-black rounded-tr-none'
                            : 'bg-white/10 text-white rounded-tl-none'
                        }`}
                      >
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {(isLoading || adminTyping) && (
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-white/50 mb-1 ml-1">
                        {isLoading ? t('botName') : t('adminRole')}
                      </span>
                      <div className="bg-white/10 text-white rounded-tl-none p-4 rounded-2xl flex items-center gap-1">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        {adminTyping && <span className="text-xs ml-2 text-white/70">{t('adminTyping')}</span>}
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Footer (Input) */}
            {step === 'chat' && (
              <div className="p-4 bg-[#1a1a1a] border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const msg = t('findBestHome');
                    sendMessage(msg);
                  }}
                  className="mb-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2 flex items-center justify-center gap-2 text-white/80 text-xs transition-colors"
                >
                  <Home size={14} className="text-primary-gold" />
                  {t('findBestHome')}
                </button>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('inputPlaceholder')}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 text-sm"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="bg-primary-gold hover:bg-primary-gold-dark text-black p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}        