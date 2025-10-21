import React, { useState } from 'react';
import { Search, MessageCircle, HelpCircle } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  count: number;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  topicId: string;
}

const FAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'chat'>('faq');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data 
  
  const questions: Question[] = [
    {
      id: '1',
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and viewing order history.',
      topicId: 'orders'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, debit cards, PayPal, Google Pay, and Apple Pay.',
      topicId: 'payment'
    },
    {
      id: '3',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions.',
      topicId: 'account'
    },
    {
      id: '4',
      question: 'Do you offer free delivery?',
      answer: 'Yes, we offer free delivery on orders over $50.',
      topicId: 'orders'
    },
    {
      id: '5',
      question: 'How can I cancel my order?',
      answer: 'You can cancel your order within 1 hour of placing it from your order history.',
      topicId: 'orders'
    },
    {
      id: '6',
      question: 'Are products fresh?',
      answer: 'Yes, we guarantee the freshness of all our products with quality checks.',
      topicId: 'products'
    },
    {
    id: '7',
    question: 'Can I track my order status?',
    answer: 'Yes, you can view the status of your recent orders in your account\'s \'Order History\' section after logging in.',
    topicId: 'orders'
  },
  {
    id: '8',
    question: 'Can I view my profile information?',
    answer: 'Yes, once logged in, you can access your \'Profile\' page to view your personal information.',
    topicId: 'account'
  },
  {
    id: '9',
    question: 'How do I update my profile?',
    answer: "You can update your personal details by visiting the 'Edit Profile' page, which is accessible from your main profile.",
    topicId: 'account'
  },
  {
    id: '10',
    question: 'Can I see more details about a product?',
    answer: 'Yes, simply click on any product from the catalogue to view its detailed description, price, and other information.',
    topicId: 'products'
  },
  {
    id: '11',
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods. All available options will be clearly listed on the checkout page.',
    topicId: 'cart'
  },
  {
    id: '12',
    question: 'What if I forget my password?',
    answer: 'Please check the login page for a "Forgot Password" or "Reset Password" link to reset your password.',
    topicId: 'account'
  },
  {
    id: '13',
    question: 'How does delivery work?',
    answer: 'We have a dedicated delivery system. You can see the live status and progress of your delivery after your order is confirmed.',
    topicId: 'orders'
  },
  {
    id: '14',
    question: 'Can I see my order history?',
    answer: 'Yes, all your past orders are saved and can be viewed by logging into your account and visiting the orders section.',
    topicId: 'orders'
  },
  {
    id: '15',
    question: 'How do I filter products?',
    answer: 'The product catalogue includes filtering options, allowing you to sort and find products based on specific criteria.',
    topicId: 'products'
  }
  ];

const topics: Topic[] = [
    { id: 'all', name: 'All Topics', count: questions.length },
    { 
      id: 'orders', 
      name: 'Orders & Delivery', 
      count: questions.filter(q => q.topicId === 'orders').length 
    },
    { 
      id: 'products', 
      name: 'Products', 
      count: questions.filter(q => q.topicId === 'products').length 
    },
    { 
      id: 'account', 
      name: 'Account & Login', 
      count: questions.filter(q => q.topicId === 'account').length 
    },
    { 
      id: 'payment', 
      name: 'Payment & Pricing', 
      count: questions.filter(q => q.topicId === 'payment').length 
    },
    
    { 
      id: 'cart', 
      name: 'Cart & Checkout', 
      count: questions.filter(q => q.topicId === 'cart').length 
    },
  ];







  const filteredQuestions = questions.filter(q => {
    const matchesTopic = selectedTopic === 'all' || q.topicId === selectedTopic;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--spacing-2xl) 0'
    }}>
      <div className="container">
        {/* Header with Tabs */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <button
              onClick={() => setActiveTab('faq')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: activeTab === 'faq' ? 'var(--primary-blue)' : 'var(--bg-tertiary)',
                color: activeTab === 'faq' ? 'white' : 'var(--text-primary)',
                boxShadow: activeTab === 'faq' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <HelpCircle size={20} />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: activeTab === 'chat' ? 'var(--primary-blue)' : 'var(--bg-tertiary)',
                color: activeTab === 'chat' ? 'white' : 'var(--text-primary)',
                boxShadow: activeTab === 'chat' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <MessageCircle size={20} />
              Live Chat
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: 'var(--spacing-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              width: '20px',
              height: '20px',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Search our help library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-md) 3rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-blue)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-blue-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'faq' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: 'var(--spacing-2xl)',
            alignItems: 'start'
          }}>
            {/* Topics Sidebar */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
              position: 'sticky',
              top: 'var(--spacing-lg)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-lg)',
                margin: 0
              }}>
                All Help Topics
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
              }}>
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--spacing-md)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedTopic === topic.id ? 'var(--primary-blue-light)' : 'transparent',
                      color: selectedTopic === topic.id ? 'var(--primary-blue-dark)' : 'var(--text-primary)',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTopic !== topic.id) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTopic !== topic.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{topic.name}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedTopic === topic.id ? 'var(--primary-blue)' : 'var(--bg-tertiary)',
                      color: selectedTopic === topic.id ? 'white' : 'var(--text-secondary)'
                    }}>
                      {topic.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Grid */}
            <div>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-lg)',
                margin: '0 0 var(--spacing-lg) 0'
              }}>
                {selectedTopic === 'all' ? 'All Questions' : topics.find(t => t.id === selectedTopic)?.name}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)'
              }}>
                {filteredQuestions.map(q => (
                  <div
                    key={q.id}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--spacing-lg)',
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--border-light)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.borderColor = 'var(--primary-blue-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.borderColor = 'var(--border-light)';
                    }}
                  >
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)',
                      margin: '0 0 var(--spacing-sm) 0'
                    }}>
                      {q.question}
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      {q.answer}
                    </p>
                  </div>
                ))}
              </div>
              {filteredQuestions.length === 0 && (
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-2xl)',
                  textAlign: 'center',
                  border: '1px solid var(--border-light)'
                }}>
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-muted)',
                    margin: 0
                  }}>
                    No questions found. Try adjusting your search or topic filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Live Chat Placeholder
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <MessageCircle style={{
              width: '64px',
              height: '64px',
              color: 'var(--primary-blue)',
              margin: '0 auto var(--spacing-lg)'
            }} />
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
              margin: '0 0 var(--spacing-md) 0'
            }}>
              Live Chat Support
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-lg)',
              margin: '0 0 var(--spacing-lg) 0'
            }}>
              Connect with our support team for real-time assistance.
            </p>
            <button style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;