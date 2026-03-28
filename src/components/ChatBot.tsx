import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  studentData?: any;
  userType: 'student' | 'admin' | 'canteen' | null;
}

export const ChatBot: React.FC<ChatBotProps> = ({ studentData, userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const systemInstruction = `
        You are the Shahwilayat Public School AI Assistant. 
        Your goal is to help students, parents, and staff with their queries.
        
        Context:
        - Current User Type: ${userType || 'Guest'}
        ${studentData ? `- Logged in Student: ${studentData.name} (Roll No: ${studentData.roll_no})` : ''}
        ${studentData ? `- Current Balance: Rs. ${studentData.balance}` : ''}
        ${studentData ? `- Attendance: ${studentData.attendance_percentage}%` : ''}
        ${studentData ? `- Grade: ${studentData.grade}, Class: ${studentData.class}, Section: ${studentData.section}` : ''}
        
        Guidelines:
        - Be professional, helpful, and polite.
        - If asked about balance or attendance, use the provided context.
        - If asked about school policies, provide general helpful information.
        - If you don't know something, suggest contacting the school administration.
        - Keep responses concise and clear.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `System Instruction: ${systemInstruction}\n\nUser: ${userMessage}` }] }
        ],
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error('ChatBot Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '500px',
              width: '380px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SPS Assistant</h3>
                  <p className="text-[10px] text-white/70">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Bot size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Hello! How can I help you today?</p>
                      <p className="text-xs text-gray-500 mt-1">Ask me about your balance, attendance, or school info.</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-primary shadow-sm'
                        }`}>
                          {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                        <Loader2 size={16} className="animate-spin text-primary" />
                        <span className="text-xs text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`p-4 bg-primary text-white rounded-full shadow-2xl hover:bg-accent transition-all flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
        <span className="font-bold pr-2">Chat with SPS</span>
      </motion.button>
    </div>
  );
};
