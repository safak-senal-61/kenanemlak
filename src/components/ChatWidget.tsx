'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Phone, Mail, MessageSquare, Headset } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'admin';
  senderName?: string;
  createdAt: string;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
  }, [messages, isOpen]);

  // Admin panelinde chat widget'ı gizle
  if (pathname?.startsWith('/admin')) return null;

  // Eğer session varsa ve sayfa yenilendiyse, localStorage'dan alabiliriz (İsteğe bağlı)
  // Şimdilik basit tutalım

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Sohbet başlatılamadı');

      const data = await res.json();
      setSessionId(data.id);
      setMessages(data.messages);
      setStep('chat');
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !sessionId) return;

    const userMsg = inputMessage;
    setInputMessage('');
    
    // Optimistic update
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: userMsg,
      sender: 'user',
      createdAt: new Date().toISOString()
    }]);

    try {
      setIsLoading(true);
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMsg
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

  // Basit polling mekanizması (Canlı destek cevaplarını kontrol etmek için)
  // Gerçek projede WebSocket veya Server Sent Events kullanılmalı
  useEffect(() => {
    if (step !== 'chat' || !sessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/history?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
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

    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [step, sessionId]);

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
            <div className="p-4 bg-gradient-to-r from-gray-900 to-black border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center border border-primary-gold/30">
                <Headset className="text-primary-gold w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Kenan Emlak Asistanı</h3>
                <p className="text-xs text-white/50">7/24 Canlı Destek</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#0f0f0f] relative">
              {step === 'form' ? (
                <div className="p-6 flex flex-col h-full justify-center">
                  <div className="text-center mb-8">
                    <h4 className="text-xl text-white font-bold mb-2">Hoş Geldiniz!</h4>
                    <p className="text-white/60 text-sm">Size daha iyi yardımcı olabilmemiz için lütfen bilgilerinizi giriniz.</p>
                  </div>

                  <form onSubmit={handleStartChat} className="space-y-4">
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-primary-gold transition-colors" />
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız"
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
                        placeholder="E-posta Adresiniz"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 transition-all"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-primary-gold transition-colors" />
                      <input
                        type="tel"
                        placeholder="Telefon Numaranız"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold/50 transition-all"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
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
                          Sohbeti Başlat <MessageSquare size={18} />
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
                          {msg.senderName || (msg.sender === 'bot' ? 'Kenan Emlak Asistanı' : 'Yetkili')}
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender === 'user'
                            ? 'bg-primary-gold text-black rounded-tr-none'
                            : 'bg-white/10 text-white rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-white/50 mb-1 ml-1">Kenan Emlak Asistanı</span>
                      <div className="bg-white/10 text-white rounded-tl-none p-4 rounded-2xl flex items-center gap-1">
                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mesajınızı yazın..."
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