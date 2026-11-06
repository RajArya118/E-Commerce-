import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { aiAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

export default function AIDrawer() {
  const { isAiOpen, setIsAiOpen } = useUI();
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Greetings. I am **NOVA AI Concierge** — your intelligent shopping guide. How may I assist your exploration today? You can ask for recommendations under a specific budget, audio comparisons, or technical hardware specifications.',
      suggested_products: [],
      quick_actions: [
        'Find headphones under ₹40,000',
        'Show me the best smart chronograph',
        'Recommend top trending innovations',
        'Levitating speakers comparison'
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiOpen) {
      scrollToBottom();
    }
  }, [messages, isAiOpen]);

  if (!isAiOpen) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiAPI.chat({
        message: text,
        conversation_history: historyPayload,
      });

      if (res.data && res.data.data) {
        const aiData = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: aiData.reply,
            suggested_products: aiData.suggested_products || [],
            quick_actions: aiData.quick_actions || [],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'My telemetry link encountered a brief fluctuation. Please try asking your question again.',
          suggested_products: [],
          quick_actions: ['Retry inquiry', 'Show trending products'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsAiOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-secondary-bg/95 backdrop-blur-2xl border-l border-border flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-card/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan p-[1.5px]">
                <div className="w-full h-full bg-secondary-bg rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-cyan animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  NOVA AI Concierge
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Grounded
                  </span>
                </h2>
                <p className="text-xs text-secondary">Natural-language catalog exploration</p>
              </div>
            </div>
            <button
              onClick={() => setIsAiOpen(false)}
              className="p-2 text-secondary hover:text-white rounded-lg hover:bg-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-accent-cyan" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-3`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-accent-purple to-accent-cyan/80 text-black font-medium'
                        : 'bg-card border border-border text-white/90 glass-card'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>

                  {/* AI Suggested Products Cards */}
                  {msg.suggested_products && msg.suggested_products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan">
                        Matched Catalog Recommendations
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.suggested_products.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3 group hover:border-accent-purple/50 transition-all"
                          >
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-card shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${prod.slug}`}
                                onClick={() => setIsAiOpen(false)}
                                className="font-heading font-semibold text-xs text-white hover:text-accent-cyan truncate block"
                              >
                                {prod.name}
                              </Link>
                              <p className="text-xs font-bold text-gradient mt-0.5">
                                ₹{(prod.discount_price || prod.price).toLocaleString('en-IN')}
                              </p>
                              {prod.reason && (
                                <p className="text-[10px] text-secondary truncate mt-0.5">{prod.reason}</p>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart(prod.id, 1)}
                              className="p-2 rounded-lg bg-card hover:bg-accent-purple text-white border border-border transition-all shrink-0"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-accent-cyan" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Chips */}
                  {msg.quick_actions && msg.quick_actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quick_actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => handleSend(act)}
                          className="px-3 py-1 rounded-full bg-secondary-bg hover:bg-accent-purple/20 border border-border text-[11px] text-secondary hover:text-white transition-all"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-secondary text-xs">
                <div className="w-7 h-7 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent-cyan" />
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-card border border-border">
                  <div className="w-2 h-2 rounded-full bg-accent-purple animate-ping" />
                  <span>Synthesizing luxury catalog intelligence...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-border bg-card/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Ask NOVA AI (e.g. 'Show me headphones under 40000')..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-xs sm:text-sm text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple pr-12 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-accent-purple to-accent-cyan text-black rounded-lg flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-secondary/60 text-center mt-2">
              All recommendations are grounded directly in live verified inventory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
