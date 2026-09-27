/**
 * Roti Bank Bettiah - Native Autonomous AI Knowledge Engine
 * 
 * Fully self-contained, client-side intelligent AI assistant that answers all questions
 * about Roti Bank Bettiah without requiring any external Gemini API key or server proxy.
 * 
 * Supports English, Hindi, and Hinglish with typo-tolerant semantic matching,
 * contextual suggestions, rich markdown bolding, and interactive triggers (like [SHOW_QR]).
 */

export interface KnowledgeItem {
  id: string;
  category: string;
  keywords: string[];
  patterns: RegExp[];
  response: string;
  followUps?: string[];
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // 1. Section 80G Tax Exemption (High Priority - specific intent)
  {
    id: 'tax_80g',
    category: 'Tax & Legal',
    keywords: [
      '80g', 'tax', 'tax exemption', 'tax benefit', 'receipt', 'deduction', 
      'income tax', 'pan', 'pan card', 'form 10bd', 'certificate', 'tax exempt', 'deductible'
    ],
    patterns: [
      /\b(80\s*g|80-g|tax\s*deductible|tax\s*deduction|tax\s*benefit|tax\s*exempt(ion)?|income\s*tax|form\s*10bd|pan\s*card)\b/i,
      /\b(tax|receipt)\b/i,
    ],
    response: `Yes! All donations to **Roti Bank Bettiah Trust** are eligible for **50% tax deduction under Section 80G** of the Income Tax Act, 1961.

**How to receive your Section 80G Receipt:**
• When donating online via our portal, simply enter your **PAN Card Number** and donor address.
• Your official **80G Tax Exemption Receipt** with Trust registration details is instantly issued.
• Our Trust electronically files **Form 10BD** with the Income Tax Department so your 80G deduction automatically appears in your **Annual Information Statement (AIS / Form 26AS)**.
• If you donate via direct bank transfer or UPI QR, kindly WhatsApp your payment screenshot and PAN to **+91 9473228888** or email **rotibankbettiah@gmail.com**.`,
    followUps: ['How can I donate?', 'View Bank Account Details', 'How much does 1 meal cost?'],
  },

  // 2. Specific Bank Account Details (High Priority - explicit khata / account query)
  {
    id: 'bank_details',
    category: 'Donation',
    keywords: [
      'bank account', 'account number', 'ifsc', 'pnb', 'punjab national bank', 
      'khata number', 'bank details', 'branch', 'transfer', 'neft', 'rtgs', 'imps'
    ],
    patterns: [
      /\b(bank\s*account|account\s*number|ifsc(\s*code)?|pnb\s*account|khata\s*(no|number)?|bank\s*details|bank\s*transfer|neft|rtgs|imps)\b/i,
      /\b(punjab\s*national\s*bank)\b/i,
    ],
    response: `Here are the official verified bank account details of **Roti Bank Bettiah Trust**:

• **Bank Name**: Punjab National Bank (PNB)
• **Account Holder**: **ROTI BANK BETTIAH**
• **Account Number**: **1919202100001486**
• **IFSC Code**: **PUNB0191920**
• **UPI ID**: **rotibankbettiah@pnb**
• **Account Type**: Current / Trust Account
• **Branch**: Bettiah, West Champaran, Bihar

Please include your mobile number in the payment remarks so our trust can issue your **Section 80G tax receipt**.

[SHOW_QR]`,
    followUps: ['How to get 80G tax receipt?', 'Can I pay via UPI QR?', 'How to donate?'],
  },

  // 3. Founder & About Roti Bank Bettiah (High Priority)
  {
    id: 'about',
    category: 'About',
    keywords: [
      'about', 'founder', 'who founded', 'who started', 'abishek giri', 'abhishek giri', 
      'owner', 'trust', 'ngo', 'history', 'registration', 'reg no', 'since', '2018', 'background'
    ],
    patterns: [
      /\b(who\s*started|who\s*founded|founder|abishek(\s*giri)?|abhishek(\s*giri)?|started\s*by|history\s*of)\b/i,
      /\b(about\s*roti\s*bank|charitable\s*trust|registration\s*no)\b/i,
    ],
    response: `**Roti Bank Bettiah Trust** is a registered charitable food welfare organization founded in **2018** by social visionary **Abishek Giri** with the pledge that no one in Bettiah sleeps hungry.

**Key Highlights:**
• **Founder**: **Abishek Giri** (started ground food seva in Bettiah in **2018**).
• **Registration**: Registered Charitable Trust under Indian Law with Registration No. **5071/2023**.
• **Mission**: Eradicating hunger through daily hot, dignified meals for hospital patients, daily-wage laborers, and destitute persons.
• **Impact**: Over **50,000+ meals** served through our dedicated volunteer force.
• **Legal Standing**: Registered with 80G & 12A tax exemption approvals.`,
    followUps: ['Where and when do you distribute food?', 'How to donate?', 'How to volunteer?'],
  },

  // 4. Surplus / Leftover Food from Weddings & Events
  {
    id: 'event_food',
    category: 'Operations',
    keywords: [
      'wedding', 'party', 'event', 'leftover', 'extra food', 'shaadi', 'bhoj', 
      'surplus', 'waste', 'cooked food', 'function', 'banquet'
    ],
    patterns: [
      /\b(wedding|shaadi|party|leftover|extra\s*food|surplus\s*(food)?|bhoj)\b/i,
      /\b(catering\s*food|excess\s*food|food\s*waste)\b/i,
    ],
    response: `Yes! If you have surplus untouched food from a **wedding, birthday celebration, religious function, or catering event**, please contact us immediately!

**Surplus Food Collection Guidelines:**
• Call our emergency helpline at **+91 9473228888** as early as possible (preferably before 8:00 PM).
• Food must be **freshly cooked, untouched, and hygienically stored** to maintain maximum freshness and quality.
• Our volunteer team will inspect freshness and quality, arrange quick transport, and distribute the food respectfully to needy families that very night.

Together, we turn food surplus into life-saving nourishment!`,
    followUps: ['Call Helpline: +91 9473228888', 'Where is the kitchen?', 'How to Donate Money'],
  },

  // 5. Food Distribution Locations & Timings
  {
    id: 'locations',
    category: 'Operations',
    keywords: [
      'where', 'location', 'locations', 'center', 'centers', 'address', 'branch', 
      'branches', 'hospital', 'station', 'timing', 'time', 'kaha', 'kahan', 'pata', 
      'distribute', 'distribution', 'kab milta', 'mjk'
    ],
    patterns: [
      /\b(where|location|locations|center|centers|branches|pata|kaha|kahan)\b/i,
      /\b(timing|time|kab\s*milta|hospital|station|mjk|distribution\s*point)\b/i,
    ],
    response: `**Roti Bank Bettiah** provides fresh, hot, and hygienic meals every single day across Bettiah:

**Daily Distribution Locations:**
1. **MJK Government Hospital**: Serving daily meals to patients in emergency/general wards and their family attendants.
2. **Bettiah Junction Railway Station**: Feeding daily-wage laborers, rickshaw pullers, and travelers in need.
3. **Lalbazar Chowk**: Community evening food distribution.
4. **Kalibag Chowk Central Kitchen**: Our meal preparation and dry ration packing hub.

**Service Timings:**
Meal distribution takes place daily from **6:30 PM to 8:30 PM** without exception.`,
    followUps: ['How to donate a meal?', 'How to volunteer?', 'Contact Phone Number'],
  },

  // 6. Student Internship Program
  {
    id: 'internship',
    category: 'Internship',
    keywords: [
      'intern', 'internship', 'student', 'college', 'certificate', 'university', 
      'social work', 'nss', 'recommendation letter', 'internship form'
    ],
    patterns: [
      /\b(intern|internship|college\s*project|social\s*work\s*internship)\b/i,
      /\b(internship\s*letter|recommendation\s*letter|student\s*intern)\b/i,
    ],
    response: `Yes! **Roti Bank Bettiah Trust** conducts verified **Social Work Internships** for school, college, and university students.

**Internship Features:**
• **Duration**: Flexible 2-week, 4-week, or 8-week community programs.
• **Learning Scope**: Non-profit ground management, food supply chain, public community relations, and humanitarian seva.
• **Official Certification**: You will receive a recognized **Certificate of Appreciation** and official **Internship Letter** / Recommendation Letter based on verified participation.

**How to Apply:**
Click on the **Apply as Intern** button in the Internship section of our website or email your resume/student ID to **rotibankbettiah@gmail.com**.`,
    followUps: ['How to Volunteer?', 'Where is the main center?', 'Contact Team'],
  },

  // 7. Volunteering
  {
    id: 'volunteer',
    category: 'Volunteering',
    keywords: [
      'volunteer', 'volunteering', 'volantiar', 'volatiar', 'volunteer form', 'fill form',
      'join', 'help', 'swayamsevak', 'seva', 'member', 'membership', 'kaise jude', 
      'how can i help', 'madad kaise kare'
    ],
    patterns: [
      /\b(volunteer|volunteering|volantiar|volatiar|volunteer\s*form|fill\s*form|swayamsevak|seva|kaise\s*jude|join\s*us|madad\s*kaise)\b/i,
      /\b(how\s*can\s*i\s*help|want\s*to\s*join|participate)\b/i,
    ],
    response: `We warmly invite you to join our dedicated **Volunteering** team! Volunteers are the driving force of **Roti Bank Bettiah**.

**How Volunteers Contribute:**
• **Meal Packaging**: Packing fresh, warm rotis, sabzi, and khichdi in clean, food-grade boxes at Kalibag Hub.
• **Evening Distribution**: Serving food between **6:30 PM - 8:30 PM** at MJK Hospital and Bettiah Station.
• **Special Drives**: Blanket and warm clothes distribution during winter, ration kit packing.
• **Recognition**: Active volunteers receive an official **Certificate of Appreciation** and community recommendation letters.

**How to Join:**
1. Fill out the official **Volunteer Registration Form** right here on our website in the **Volunteer** section.
2. Or call / WhatsApp us directly at **+91 9473228888**.
3. No prior experience or fee is required. Even dedicating 2 hours a week makes a lasting impact!

[OPEN_VOLUNTEER_FORM]`,
    followUps: ['Fill Volunteer Form', 'Student Internship Info', 'Where is food served?'],
  },


  // 8. Sponsoring on Birthdays, Anniversaries & Memorials
  {
    id: 'occasions',
    category: 'Donation',
    keywords: [
      'birthday', 'anniversary', 'memorial', 'memory', 'celebrate', 'occasion', 
      'sponsor a day', 'janamdin', 'punyatithi', 'special day'
    ],
    patterns: [
      /\b(birthday|anniversary|memorial|memory|celebrate|occasion|sponsor\s*a\s*day)\b/i,
      /\b(janamdin|punyatithi|shraadh)\b/i,
    ],
    response: `Celebrate your milestone by sharing joy with those who need it most!

**Special Occasion Seva:**
• **Sponsor a Day's Feeding**: Sponsoring a 150-meal evening drive costs just **₹1,500**.
• **Personal Participation**: You and your family are warmly invited to come to **MJK Hospital** or our distribution center to personally distribute food.
• **Dedication**: We can display your family's name and celebration message on that day's meal drive.

To book your date, please call or WhatsApp **+91 9473228888** at least 24 hours in advance.

[SHOW_QR]`,
    followUps: ['How much does 1 meal cost?', 'Bank Account Details', 'How to donate online?'],
  },

  // 9. Cost of Meals & Meal Tiers
  {
    id: 'meal_costs',
    category: 'Donation',
    keywords: [
      'cost', 'price', 'kitna', 'kitne', 'how much', 'tier', 'amount', '10', 
      '100', '500', 'rate', 'meal cost'
    ],
    patterns: [
      /\b(cost|price|how\s*much|kitna|kitne\s*rupaye|meal\s*cost)\b/i,
      /\b(tier|package|amount\s*per\s*meal)\b/i,
    ],
    response: `At **Roti Bank Bettiah**, every single rupee is utilized with maximum efficiency:

• **₹10**: Feeds **1 person** a hot, nutritious meal (fresh wheat rotis, dal, seasonal sabzi).
• **₹100**: Feeds **10 people**.
• **₹500**: Provides a complete **Family Weekly Nutrition Kit**.
• **₹1,500**: Sponsors an entire **Daily Distribution Drive (150 meals)**.
• **₹3,000**: Sponsors a **Mega Food Relief Drive (300 meals)**.

Even a modest donation of ₹10 guarantees a fresh meal for someone fighting hunger today.

[SHOW_QR]`,
    followUps: ['How to Donate Online?', 'View Bank Account Details', 'Is donation tax exempt?'],
  },

  // 10. General Donation & Ways to Donate
  {
    id: 'donation_guide',
    category: 'Donation',
    keywords: [
      'donate', 'donation', 'contribute', 'contribution', 'give money', 'paise', 
      'send money', 'help with money', 'dan', 'daan', 'how to donate', 'payment', 
      'fund', 'support', 'upi', 'gpay', 'phonepe', 'paytm'
    ],
    patterns: [
      /\b(how\s*to\s*donate|how\s*can\s*i\s*donate|donate|donation|contribute|contribution|giving\s*money|payment)\b/i,
      /\b(paise\s*kaise|daan\s*kaise|dan\s*dena|money\s*transfer)\b/i,
      /\b(upi|gpay|google\s*pay|phonepe|paytm|bhim)\b/i,
    ],
    response: `Thank you for your generous heart! Every single rupee directly provides hot, dignified meals to patients and needy families in Bettiah.

**Ways You Can Donate:**

1. **Online Instant Gateway (Cards / UPI / NetBanking)**:
Click the **Donate Now** button on our portal to donate securely via our official **Razorpay** payment gateway.

2. **Direct Bank Transfer (NEFT / RTGS / IMPS)**:
• Bank: **Punjab National Bank (PNB)**
• Account Name: **ROTI BANK BETTIAH**
• Account Number: **1919202100001486**
• IFSC Code: **PUNB0191920**
• UPI ID: **rotibankbettiah@pnb**
• Branch: **Bettiah**

3. **UPI QR Code**:
Scan our verified QR code below with any UPI app (**Google Pay, PhonePe, Paytm, BHIM**).

All donations are eligible for **80G Tax Exemption** with immediate digital receipts.

[SHOW_QR]`,
    followUps: ['View Bank Account Details', 'How to get 80G tax receipt?', 'How much does 1 meal cost?'],
  },

  // 11. Contact Details & Office Address
  {
    id: 'contact',
    category: 'Contact',
    keywords: [
      'contact', 'phone', 'mobile', 'call', 'number', 'email', 'address', 
      'office', 'headquarters', 'pata', 'sampark', 'whatsapp', 'helpline'
    ],
    patterns: [
      /\b(contact|phone|mobile|call\s*number|email|office\s*address|sampark|whatsapp)\b/i,
      /\b(helpline|reach\s*out|customer\s*care)\b/i,
    ],
    response: `Here are the official contact channels for **Roti Bank Bettiah Trust**:

• **Helpline & WhatsApp**: **+91 9473228888**
• **Official Email**: **rotibankbettiah@gmail.com**
• **Central Office Address**: Kalibag Chowk, Near Kali Bagh Mandir, Ward No. 3, Kali Bagh Colony, Bettiah, Bihar - 845438
• **Official Portal**: **https://rotibankbettiah.org/**

Our support team and volunteers are available daily from **9:00 AM to 9:00 PM** to assist you.`,
    followUps: ['How to Donate?', 'Where is food served?', 'Volunteer info'],
  },

  // 12. Financial Transparency & Audit
  {
    id: 'transparency',
    category: 'About',
    keywords: [
      'transparency', 'transparent', 'fund', 'audit', 'where does money go', 
      'breakdown', 'utilization', 'honest', 'proof'
    ],
    patterns: [
      /\b(transparency|transparent|audit|where\s*does\s*(my|the)?\s*money\s*go)\b/i,
      /\b(fund\s*utilization|financials)\b/i,
    ],
    response: `**100% Financial Transparency** is our foundational pledge to every donor:

• **85% Food & Cooking**: Direct purchase of whole-wheat flour, lentils, fresh vegetables, cooking oil, and food-grade packaging.
• **10% Logistics & Distribution**: Fuel for transport vans, LPG cylinders, and clean serving utensils.
• **5% Administration & Technology**: Bank gateway charges, domain hosting, and statutory audit compliance.

All trust finances are audited by certified Chartered Accountants in compliance with Indian NGO regulations.`,
    followUps: ['How to get 80G tax receipt?', 'How to Donate?', 'View Bank Account Details'],
  },

  // 13. What Food is Served & Hygiene Standards
  {
    id: 'food_quality',
    category: 'Operations',
    keywords: [
      'food', 'menu', 'roti', 'sabzi', 'hygiene', 'quality', 'clean', 'pure', 
      'veg', 'vegetarian', 'khana'
    ],
    patterns: [
      /\b(food\s*quality|hygiene|menu|what\s*food|veg|vegetarian|clean\s*food)\b/i,
      /\b(roti\s*sabzi|khana\s*kaisa)\b/i,
    ],
    response: `We take immense pride in the quality and hygiene of the food we prepare:

• **100% Pure Vegetarian**: Prepared daily in our clean central kitchen at Kalibag Chowk.
• **Standard Daily Menu**: Soft whole-wheat rotis, protein-rich lentils (dal), fresh seasonal vegetable sabzi, and pickle/salad.
• **Hygiene Protocols**: Volunteers wear clean hairnets and gloves; meals are packed in eco-friendly, food-grade containers immediately after cooking.
• **Dignity First**: Food is always served warm, fresh, and with unconditional love and respect.`,
    followUps: ['Where are meals distributed?', 'How to sponsor a meal?', 'How to volunteer?'],
  },

  // 14. Gratitude & Courtesy
  {
    id: 'gratitude',
    category: 'General',
    keywords: [
      'thank you', 'thanks', 'dhanyawad', 'shukriya', 'great', 'awesome', 
      'good job', 'god bless', 'bless you'
    ],
    patterns: [
      /\b(thank\s*you|thanks|dhanyawad|shukriya|god\s*bless|great\s*work)\b/i,
    ],
    response: `You are most welcome! Your support, prayers, and kindness empower us to keep serving every single day.

If you ever need anything else or wish to visit our daily distribution at **MJK Hospital**, please reach out anytime at **+91 9473228888**.

**Jai Hind!**`,
    followUps: ['How to Donate?', 'How to Volunteer?', 'Our Impact'],
  },

  // 15. Greetings
  {
    id: 'greeting',
    category: 'General',
    keywords: [
      'hi', 'hello', 'hey', 'namaste', 'pranam', 'pranaam', 'good morning', 
      'good afternoon', 'good evening', 'kaise ho', 'kya haal', 'ram ram', 'jai hind'
    ],
    patterns: [
      /\b(hi|hello|hey|namaste|pranam|namaskar|good\s*(morning|afternoon|evening))\b/i,
      /\b(kaise\s*ho|kya\s*haal|kem\s*cho)\b/i,
    ],
    response: `**Namaste!** I am your **Roti Bank AI Assistant**.

I am here to help you with everything about **Roti Bank Bettiah Trust**—including how to donate meals, volunteer, check our distribution locations, or obtain your **Section 80G tax receipt**.

How may I assist you today?`,
    followUps: ['How to donate?', 'Where is food served?', 'How to volunteer?', 'Bank account details'],
  },

  // 16. Bot Identity
  {
    id: 'identity',
    category: 'General',
    keywords: [
      'who are you', 'what are you', 'aap kaun ho', 'bot', 'assistant', 'ai'
    ],
    patterns: [
      /\b(who\s*are\s*you|what\s*are\s*you|aap\s*kaun\s*ho)\b/i,
      /\b(are\s*you\s*(a\s*)?bot|are\s*you\s*ai)\b/i,
    ],
    response: `I am the **Roti Bank AI Assistant**, an autonomous intelligence system built directly for **Roti Bank Bettiah Trust**.

I am trained on all operations, policies, donation workflows, and distribution locations of our Trust to provide you with fast, accurate, and helpful answers 24/7—without delays or server downtime!

Feel free to ask me anything about our mission.`,
    followUps: ['How to Donate?', 'Where is food served?', 'How to Volunteer?'],
  },
];

export class RotiBankAiEngine {
  /**
   * Processes a user question and returns a well-structured, authoritative answer.
   */
  public generateResponse(userInput: string): string {
    const query = userInput.trim().toLowerCase();
    if (!query) {
      return "How can I help you today? Ask me about donations, volunteering, meal centers, or tax exemptions.";
    }

    // 1. Direct Regex Pattern Matching (Ordered by intent specificity)
    for (const item of KNOWLEDGE_BASE) {
      for (const pattern of item.patterns) {
        if (pattern.test(query)) {
          return item.response;
        }
      }
    }

    // 2. Keyword & Token Weighting (Semantic Scoring with stopword filtering)
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'roti', 'bank', 'bettiah', 'and', 'a', 'an', 'to', 'in', 'of', 'for', 'it', 'me', 'you', 'do']);
    const words = query
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopWords.has(w));

    let bestItem: KnowledgeItem | null = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const word of words) {
        for (const kw of item.keywords) {
          if (word === kw) {
            score += 3;
          } else if (kw.includes(word) && word.length > 3) {
            score += 1.5;
          } else if (word.includes(kw) && kw.length > 3) {
            score += 1.5;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestItem = item;
      }
    }

    if (bestItem && highestScore >= 3) {
      return bestItem.response;
    }

    // 3. Fallback: Intelligent Comprehensive Response
    return `Thank you for your question regarding **Roti Bank Bettiah Trust**!

Here is how we can best assist you:

• **To Donate Online / UPI**: Click the **Donate Now** button on our website, or transfer directly to our **Punjab National Bank** account (**A/C: 1919202100001486, IFSC: PUNB0191920**). All donations are **Section 80G Tax-Exempt**.
• **To Volunteer or Intern**: Fill out the volunteer application on our portal or call our coordinator.
• **Food Distribution**: Meals are served daily from **6:30 PM - 8:30 PM** at **MJK Hospital** and **Bettiah Junction**.
• **Emergency Food Pickup / Help**: Call our helpline directly at **+91 9473228888** or email **rotibankbettiah@gmail.com**.

Would you like more details on any of these topics?

[SHOW_QR]`;
  }

  /**
   * Returns follow-up suggestions for a given input or intent.
   */
  public getFollowUpSuggestions(userInput: string): string[] {
    const query = userInput.trim().toLowerCase();
    for (const item of KNOWLEDGE_BASE) {
      for (const pattern of item.patterns) {
        if (pattern.test(query)) {
          return item.followUps || ['How to donate?', 'How to volunteer?', 'Where is food served?'];
        }
      }
    }
    return ['How to donate?', 'Where is food served?', 'How to volunteer?', 'Bank account details'];
  }
}

export const aiKnowledgeEngine = new RotiBankAiEngine();

