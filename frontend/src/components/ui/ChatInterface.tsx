'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
  remainingMessages?: number;
  limitReached?: boolean;
}

// Memoized MessageBubble component to prevent unnecessary re-renders
const MessageBubble = React.memo(({ message }: { message: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${message.type === 'user' 
          ? 'bg-gradient-to-r from-space-500 to-nebula-500' 
          : 'bg-gradient-to-r from-cosmic-500 to-pink-500'
        }
      `}>
        {message.type === 'user' ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`
        px-4 py-3 rounded-2xl backdrop-blur-sm
        ${message.type === 'user'
          ? 'bg-gradient-to-r from-space-500/20 to-nebula-500/20 border border-space-400/30'
          : 'bg-white/10 border border-white/20'
        }
      `}>
        {message.isTyping ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-space-400" />
            <span className="text-gray-400 text-sm">AI is analyzing...</span>
          </div>
        ) : (
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  </motion.div>
));

MessageBubble.displayName = 'MessageBubble';

const ChatInterface: React.FC<ChatInterfaceProps> = React.memo(({
  onSendMessage,
  messages,
  isLoading = false,
  remainingMessages = 3,
  limitReached = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  // Memoize suggested questions to prevent re-creation
  const suggestedQuestions = useMemo(() => [
    "What does the transit depth tell us?",
    "How confident is this detection?",
    "What are the key factors?",
    "Explain the feature importance"
  ], []);

  const handleSuggestedQuestion = useCallback((question: string) => {
    onSendMessage(question);
  }, [onSendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-space-500/10 to-nebula-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">NASA AI Assistant</h3>
              <p className="text-xs text-gray-400">
                {limitReached 
                  ? 'Limit reached - Contact for enterprise services' 
                  : messages.length === 0 
                    ? 'Ask me about exoplanet detection' 
                    : `${remainingMessages}/3 questions remaining`
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {/* Welcome message when no messages */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Hi! I&apos;m your NASA AI assistant. I can help explain the analysis results and answer questions about exoplanet detection.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQuestions.map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-500 to-pink-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-space-400" />
                        <span className="text-gray-400 text-sm">Analyzing your data...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              {limitReached ? (
                <div className="text-center py-4">
                  <div className="px-4 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-300 text-sm font-medium mb-2">
                      You've reached the 3-message limit for this session.
                    </p>
                    <p className="text-gray-400 text-xs">
                      Please contact us for enterprise services for more AI answers.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about the analysis results..."
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg 
                               focus:border-space-400 focus:ring-2 focus:ring-space-400/20 
                               transition-all duration-200 text-white placeholder-gray-400
                               backdrop-blur-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-space-500 to-nebula-500 
                             text-white rounded-lg shadow-lg
                             hover:from-space-600 hover:to-nebula-600
                             focus:ring-4 focus:ring-space-400/20
                             transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;

