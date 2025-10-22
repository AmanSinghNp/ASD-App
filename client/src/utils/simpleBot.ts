export type BotReply = {
  text: string;
  suggested?: string[];
};

type QA = { q: string; a: string; keywords: string[] };

// Lightweight, dependency-free keyword matcher for FAQ-like replies.
const knowledgeBase: QA[] = [
  {
    q: 'Track my order',
    a: 'You can track your order from your account under Order History. If you need a link, go to Profile -> Orders.',
    keywords: ['track', 'order', 'status', 'delivery']
  },
  {
    q: 'Payment methods',
    a: 'We accept credit/debit cards, PayPal, Google Pay, and Apple Pay.',
    keywords: ['pay', 'payment', 'card', 'paypal', 'apple', 'google']
  },
  {
    q: 'Reset password',
    a: 'Click "Forgot Password" on the login page and follow the email instructions to reset it.',
    keywords: ['password', 'reset', 'forgot', 'recover']
  },
  {
    q: 'Free delivery',
    a: 'Orders over $50 qualify for free delivery. Shipping fees apply otherwise.',
    keywords: ['free', 'delivery', 'shipping', 'fee']
  },
  {
    q: 'Update profile',
    a: 'Open your Profile and choose "Edit Profile" to update your information.',
    keywords: ['profile', 'update', 'edit', 'details']
  },
  {
    q: 'Product details',
    a: 'Open any product in the catalogue to see detailed description, price and more.',
    keywords: ['product', 'details', 'info', 'information']
  }
];

function score(text: string, qa: QA): number {
  const t = text.toLowerCase();
  let s = 0;
  for (const k of qa.keywords) {
    if (t.includes(k)) s += 1;
  }
  return s;
}

export function getBotReply(userText: string): BotReply {
  const best = knowledgeBase
    .map((qa) => ({ qa, s: score(userText, qa) }))
    .sort((a, b) => b.s - a.s)[0];

  if (best && best.s > 0) {
    // Provide the best answer and a couple of nearby suggestions.
    const suggestions = knowledgeBase
      .filter((x) => x !== best.qa)
      .slice(0, 3)
      .map((x) => x.q);
    return { text: best.qa.a, suggested: suggestions };
  }

  return {
    text:
      "I didn't quite catch that. You can ask about: order tracking, payments, password reset, delivery, profile updates, or product details.",
    suggested: ['Track my order', 'Payment methods', 'Reset password']
  };
}

