import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, CheckCheck } from 'lucide-react';
import { getBotReply } from '../utils/simpleBot';

/**
 * Static live chat mock page to mirror the provided UI concept.
 * Focuses purely on layout/visuals - no real-time behaviour is implemented yet.
 */
type LiveChatProps = { embedded?: boolean };
const LiveChat: React.FC<LiveChatProps> = ({ embedded = false }) => {
  const agent = {
    name: 'Chris',
    role: 'Customer Support',
    status: 'Online'
  };
  const baseUrl = (import.meta as any).env?.BASE_URL ?? '/';
  const avatarSrc = `${baseUrl}chris.png`;
  const [avatarOk, setAvatarOk] = useState(true);

  type Msg = {
    id: string;
    author: string;
    text: string;
    direction: 'inbound' | 'outbound';
    meta?: string;
  };

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initial bot greeting only
    setMessages([
      { id: 'm0', author: agent.name, text: 'What can I help for you ?', direction: 'inbound', meta: 'Chris' }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change.
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  useEffect(() => {
    // Auto-grow textarea height up to a maximum
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, 120);
    el.style.height = next + 'px';
  }, [input]);

  const canSend = useMemo(() => input.trim().length > 0 && !isBotTyping, [input, isBotTyping]);

  function sendMessage() {
    if (!canSend) return;
    const text = input.trim();
    const userMsg: Msg = {
      id: 'u-' + Date.now(),
      author: 'You',
      text,
      direction: 'outbound',
      meta: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate bot reply.
    setIsBotTyping(true);
    const reply = getBotReply(text);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'b-' + Date.now(),
          author: agent.name,
          text: reply.text ,
          direction: 'inbound',
          meta: 'Chris reply'
        }
      ]);
      setIsBotTyping(false);
    }, 700);
  }

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div style={{ padding: embedded ? 0 : 'var(--spacing-2xl) 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: embedded ? 'flex-start' : 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: embedded ? '100%' : '420px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              padding: 'var(--spacing-lg)',
              paddingBottom: 'var(--spacing-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.35)'
                }}
              >
                {/* Bot avatar image with fallback */}
                {avatarOk ? (
                  <img
                    src={avatarSrc}
                    alt={agent.name}
                    onError={() => setAvatarOk(false)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <span style={{ fontSize: '22px' }}>🤖</span>
                )}
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{agent.name}</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '9999px',
                      backgroundColor: '#22c55e'
                    }}
                  />
                  {agent.status}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
              height: '60vh',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                alignSelf: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              {todayLabel}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {messages.map((message) => {
                const isOutbound = message.direction === 'outbound';
                return (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOutbound ? 'flex-end' : 'flex-start',
                      gap: '0.25rem'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isOutbound ? '#2563eb' : 'var(--bg-primary)',
                        color: isOutbound ? '#fff' : 'var(--text-primary)',
                        padding: '0.75rem 1rem',
                        borderRadius: isOutbound ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                        maxWidth: '80%',
                        boxShadow: 'var(--shadow-sm)',
                        border: isOutbound ? 'none' : '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                        {message.author}
                      </div>
                      <div style={{ fontSize: '0.875rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{message.text}</div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {message.meta}
                      {isOutbound && <CheckCheck size={12} style={{ color: '#60a5fa' }} />}
                    </div>
                  </div>
                );
              })}
              {isBotTyping && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{agent.name} is typing...</div>
              )}
              <div ref={scrollRef} />
            </div>

            <div
              style={{
                marginTop: 'auto',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: 'var(--spacing-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-end' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  style={{ flex: 1 }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={1}
                    placeholder="Type your message..."
                    style={{
                      width: '100%',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      resize: 'none',
                      lineHeight: 1.4,
                      maxHeight: '120px',
                      overflowY: 'auto'
                    }}
                  />
                </form>
                </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '0 var(--spacing-sm)'
                }}
              >
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!canSend}
                  style={{
                    backgroundColor: canSend ? '#2563eb' : 'var(--bg-tertiary)',
                    color: canSend ? '#fff' : 'var(--text-muted)',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Send
                  <Send size={16} />
                </button>
              </div>
            </div>

            <div
              style={{
                alignSelf: 'flex-end',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}
            >
              We run on crisp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
