import React, { useState, useEffect } from 'react';

/**
 * Visual Configurator for Custom Tefillin - Malchuta
 * RTL Complete Hebrew Interactive UI for Boutique STAM Website
 */

// --- Static Data & Options ---

const HOUSES_DATA = {
  dakkot: {
    label: 'בתים דקות',
    description: 'בתים העשויים מעורות דקים (כבש או עז), קלים ופשוטים יותר.',
    options: [
      { id: 'dak-regular', name: 'דקות רגיל', price: 120, badge: 'כשר לכתחילה', img: 'images/config-house-dak-regular.jpg' },
      { id: 'dak-eisenbach', name: 'דקות מהודר איזנבאך', price: 180, badge: 'מהודר', img: 'images/config-house-dak-eisenbach.jpg' }
    ]
  },
  gassot: {
    label: 'בתים גסות',
    description: 'בתים מעור שור מובחר (בהמה גסה), עמידים לשנים רבות ובעלי ריבוע מדויק.',
    options: [
      { id: 'gas-stern', name: 'גסות - פרוד מלא הרב שטרן', price: 550, badge: 'הידור VIP', img: 'images/config-house-gas-stern.jpg' },
      { id: 'gas-klein', name: 'גסות - הרב קליין', price: 650, badge: 'מהודר ביותר', img: 'images/config-house-gas-klein.jpg' },
      { id: 'gas-moalem', name: 'גסות - הרב מועלם', price: 700, badge: 'מהודר ביותר', img: 'images/config-house-gas-moalem.jpg' },
      { id: 'gas-moalem-shapira', name: 'גסות - מכוונות ריבוע רגל מועלם ושפירא', price: 850, badge: 'הידור מקסימלי', img: 'images/config-house-gas-shapira.jpg' },
      { id: 'gas-size28', name: 'גסות - גודל 28 קומפקטי', price: 1000, badge: 'קומפקטי מיוחד', img: 'images/config-house-gas-size28.jpg' },
      { id: 'gas-pitzponim', name: 'גסות - פצפונים לרש"י ור"ת', price: 1200, badge: 'מיקרו-הידור', img: 'images/config-house-gas-pitzponim.jpg' },
      { id: 'gas-4x4', name: 'גסות - גסות גדולות 4x4', price: 1400, badge: 'מהדורת ענק', img: 'images/config-house-gas-4x4.jpg' }
    ]
  }
};

const SCROLL_OPTIONS = {
  // קלף עבור בתים דקות
  dakkot: [
    { id: 'scroll-dak-kosher', name: 'קלף כשר - כתיבה ברורה', price: 750, badge: 'כשר לכתחילה', desc: 'נכתב ע"י סופר מוסמך, מוגה פעמיים.' },
    { id: 'scroll-dak-mehudar', name: 'קלף מהודר - כתב אסתטי', price: 1000, badge: 'מהודר', desc: 'כתב אסתטי, אחיד ויפה במיוחד.' }
  ],
  // קלף עבור בתים גסות רגילים (stern, klein, moalem, shapira)
  gassot_regular: [
    { id: 'scroll-gas-kosher', name: 'קלף כשר - כתיבת סופר מוסמך', price: 750, badge: 'כשר', desc: 'הגהה כפולה אנושית וממוחשבת.' },
    { id: 'scroll-gas-mehudar', name: 'קלף מהודר - כתיבה מיוחסת', price: 1000, badge: 'מהודר', desc: 'רמת כתיבה גבוהה ואחידות מושלמת באותיות.' },
    { id: 'scroll-gas-superb', name: 'קלף מהודר ביותר - כתיבת סופר מומחה', price: 1500, badge: 'מהודר ביותר', desc: 'פרשיות מובחרות שנכתבו בקדושה וביופי יוצא דופן.' }
  ],
  // קלף עבור גודל 28 קומפקטי
  gas_size28: [
    { id: 'scroll-28-kosher', name: 'קלף כשר מותאם לגודל 28', price: 1200, badge: 'כשר', desc: 'כתיבה זעירה ומדויקת על קלף שליל מובחר.' },
    { id: 'scroll-28-mehudar', name: 'קלף מהודר מותאם לגודל 28', price: 1500, badge: 'מהודר', desc: 'כתב יפהפה ומיושר במיוחד ברזולוציה זעירה.' },
    { id: 'scroll-28-superb', name: 'קלף מהודר ביותר מותאם לגודל 28', price: 1800, badge: 'מהודר ביותר', desc: 'יצירת אמנות זעירה, חדות הלכתית מוחלטת.' }
  ],
  // קלף עבור פצפונים לרש"י ור"ת
  gas_pitzponim: [
    { id: 'scroll-pitz-mehudar', name: 'קלף מהודר מותאם לפצפונים', price: 2000, badge: 'מהודר', desc: 'כתיבה מיקרוסקופית קשה במיוחד הדורשת ריכוז ומומחיות נדירה.' },
    { id: 'scroll-pitz-superb', name: 'קלף מהודר ביותר מותאם לפצפונים', price: 2600, badge: 'מהודר ביותר', desc: 'פסגת כתיבת הסת"ם הזעירה, מיועד לבעלי דרישות הידור מחמירות ביותר.' }
  ],
  // קלף עבור 4x4 גדולות
  gas_4x4: [
    { id: 'scroll-4x4-kosher', name: 'קלף כשר מותאם לגודל 4x4', price: 1500, badge: 'כשר', desc: 'קלף רחב המאפשר כתיבה גדולה, קריאה ומאירת עיניים.' },
    { id: 'scroll-4x4-mehudar', name: 'קלף מהודר מותאם לגודל 4x4', price: 1900, badge: 'מהודר', desc: 'אותיות מרובעות ומיושרות כראוי להנחת תפילין מהודרת במיוחד.' }
  ]
};

const STRAPS_DATA = {
  machine: {
    label: 'עבודת מכונה',
    description: 'רצועות עור איכותיות שנחתכו ונצבעו באופן תעשייתי מפוקח.',
    options: [
      { id: 'strap-mach-1side', name: 'עבודת מכונה - שחור צד אחד', price: 35, badge: 'כשר', img: 'images/config-strap-mach-1.jpg' },
      { id: 'strap-mach-2side', name: 'עבודת מכונה - שחור שני צדדים', price: 35, badge: 'כשר', img: 'images/config-strap-mach-2.jpg' }
    ]
  },
  hand: {
    label: 'עבודת יד לשמה',
    description: 'רצועות עור עגל עבודת יד מלאה מהשלבים הראשונים, לשם מצוות תפילין.',
    options: [
      { id: 'strap-hand-1side', name: 'עבודת יד לשמה - שחור צד אחד', price: 50, badge: 'מהודר', img: 'images/config-strap-hand-1.jpg' },
      { id: 'strap-hand-2side', name: 'עבודת יד לשמה - שחור שני צדדים', price: 50, badge: 'מהודר', img: 'images/config-strap-hand-2.jpg' }
    ]
  }
};

const BOX_UPGRADE_OPTIONS = [
  { id: 'box-basic', name: 'קופסת פלסטיק בסיסית מאווררת', price: 0, badge: 'כלול', desc: 'שמירה בסיסית על ריבוע הבתים עם פתחי אוורור.', img: 'images/config-box-basic.jpg' },
  { id: 'box-hard', name: 'מארז פלסטיק קשיח מהודר ומגן', price: 45, badge: 'מהודר', desc: 'מגן קשיח מחוזק, בולם זעזועים ושומר על פינות הבתים.', img: 'images/config-box-hard.jpg' },
  { id: 'box-leather', name: 'נרתיק עור יוקרתי בעיצוב אישי ורקמה', price: 120, badge: 'יוקרתי VIP', desc: 'עור אמיתי בגימור קטיפה, כולל רקמת שם חתן בר המצווה בזהב עתיק.', img: 'images/config-box-leather.jpg' },
  { id: 'box-wood-velvet', name: 'מארז עץ וקטיפה מלכותי VIP', price: 250, badge: 'מהדורת אספנים', desc: 'מארז עץ אגוז מגולף, פנים קטיפה אדומה בעיצוב מלכותי עוצר נשימה.', img: 'images/config-box-wood.jpg' }
];

export default function TefillinConfigurator() {
  // --- States ---
  const [activeDrawer, setActiveDrawer] = useState(null); // 'house' | 'scroll' | 'straps' | 'finish' | null
  
  // Selection States
  const [selectedHouse, setSelectedHouse] = useState(HOUSES_DATA.gassot.options[0]); // Default: Rav Stern
  const [selectedScribeType, setSelectedScribeType] = useState('כיפה סרוגה'); // Default for regular Gassot
  const [selectedScroll, setSelectedScroll] = useState(null);
  const [selectedStraps, setSelectedStraps] = useState(STRAPS_DATA.hand.options[1]); // Default: Hand black 2 sides
  const [selectedBox, setSelectedBox] = useState(BOX_UPGRADE_OPTIONS[0]); // Default: Basic
  const [embroideryName, setEmbroideryName] = useState('');

  // Auto-resolve compatible Scroll and Box prices on House change
  useEffect(() => {
    // 1. Resolve scrolls compatible with the selected house
    const scrolls = getCompatibleScrollOptions();
    // Default to the first available option for this house type
    if (scrolls && scrolls.length > 0) {
      setSelectedScroll(scrolls[0]);
    }
    
    // 2. Reset scribe type if changing to Dakkot (since scribe connection is only for Gassot regular)
    if (isHouseDak()) {
      setSelectedScribeType(null);
    } else if (!selectedScribeType) {
      setSelectedScribeType('כיפה סרוגה');
    }
  }, [selectedHouse]);

  // --- Helper Functions ---

  const isHouseDak = () => {
    return selectedHouse.id.startsWith('dak');
  };

  const getCompatibleScrollOptions = () => {
    if (!selectedHouse) return [];
    
    if (isHouseDak()) {
      return SCROLL_OPTIONS.dakkot;
    }
    if (selectedHouse.id === 'gas-size28') {
      return SCROLL_OPTIONS.gas_size28;
    }
    if (selectedHouse.id === 'gas-pitzponim') {
      return SCROLL_OPTIONS.gas_pitzponim;
    }
    if (selectedHouse.id === 'gas-4x4') {
      return SCROLL_OPTIONS.gas_4x4;
    }
    // Default regular Gassot
    return SCROLL_OPTIONS.gassot_regular;
  };

  // Pricing Helpers
  const getBaseBoxPrice = () => {
    return isHouseDak() ? 12 : 15;
  };

  const calculateTotalPrice = () => {
    const housePrice = selectedHouse ? selectedHouse.price : 0;
    const scrollPrice = selectedScroll ? selectedScroll.price : 0;
    const strapsPrice = selectedStraps ? selectedStraps.price : 0;
    const finishingPrice = 150; // Fixed sewing, closing, and painting
    const boxPrice = getBaseBoxPrice() + (selectedBox ? selectedBox.price : 0);

    return housePrice + scrollPrice + strapsPrice + finishingPrice + boxPrice;
  };

  const handleHouseSelect = (house) => {
    setSelectedHouse(house);
  };

  const handleScrollSelect = (scroll) => {
    setSelectedScroll(scroll);
  };

  const handleStrapsSelect = (strap) => {
    setSelectedStraps(strap);
  };

  const handleBoxSelect = (box) => {
    setSelectedBox(box);
  };

  const handleOrderSubmit = () => {
    const totalPrice = calculateTotalPrice();
    let msg = `שלום, אשמח להזמין תפילין בהתאמה אישית מאתר מלכותא! 👑✨\n\n`;
    msg += `🏠 בית התפילין: ${selectedHouse.name} (${selectedHouse.price} ₪)\n`;
    msg += `📜 קלף ופרשיות: ${selectedScroll ? selectedScroll.name : 'לא נבחר'} (${selectedScroll ? selectedScroll.price : 0} ₪)\n`;
    if (selectedScribeType) {
      msg += `✍️ רקע סופר הסת"ם: ${selectedScribeType}\n`;
    }
    msg += `🎗️ רצועות עור: ${selectedStraps.name} (${selectedStraps.price} ₪)\n`;
    msg += `🪡 גימור ותפירה: קבוע וחובה (150 ₪)\n`;
    msg += `📦 קופסת מגן: ${selectedBox.name} (${getBaseBoxPrice() + selectedBox.price} ₪)\n`;
    if (embroideryName.trim()) {
      msg += `🎁 רקמת שם אישית על הנרתיק: "${embroideryName.trim()}"\n`;
    }
    msg += `\n💰 סה"כ לתשלום שקוף: ${totalPrice} ₪\n`;
    msg += `אשמח שיחזור אליי נציג לאישור ההזמנה ופרטי משלוח. תודה!`;

    const waUrl = `https://wa.me/972535502797?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[#fdfbf7] py-12 px-4 md:px-8 text-right font-sans" style={{ direction: 'rtl' }}>
      
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-[#c59b27] uppercase">בית היוצר מלכותא</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mt-2 mb-4 font-serif">
          Visual Configurator <span className="text-[#c59b27]">אינטראקטיבי</span>
        </h1>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          הרכיבו את התפילין המהודרות שלכם שלב אחר שלב בשקיפות הלכתית ותקציבית מלאה. בחרו את הבתים, הפרשיות, הרצועות והמארז שיעניקו לכם חיבור רגשי ורוחני עמוק.
        </p>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
        
        {/* RIGHT SIDE: 4 COMPONENT CARDS (OVERVIEW VIEW) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2 border-b pb-2 border-slate-200/60">
            מרכיבי התפילין שלך:
          </h2>
          
          {/* Card 1: בית התפילין */}
          <div 
            onClick={() => setActiveDrawer('house')}
            className="bg-white border border-slate-100 hover:border-[#c59b27]/40 rounded-2xl p-5 flex items-center gap-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
              <img src={selectedHouse.img} alt={selectedHouse.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="flex-grow">
              <span className="text-[10px] font-black text-[#c59b27] tracking-widest uppercase">רכיב 1</span>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">בית התפילין</h3>
              <p className="text-slate-500 text-xs mt-1">נבחר כעת: <strong className="text-slate-700">{selectedHouse.name}</strong></p>
              <span className="inline-block bg-[#c59b27]/10 text-[#c59b27] font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-2">
                {selectedHouse.badge}
              </span>
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-[#0f172a]">{selectedHouse.price} ₪</div>
              <span className="text-[10px] text-slate-400 block mt-1 hover:text-[#c59b27] transition">לשינוי והתאמה ←</span>
            </div>
          </div>

          {/* Card 2: קלף ופרשיות */}
          <div 
            onClick={() => setActiveDrawer('scroll')}
            className="bg-white border border-slate-100 hover:border-[#c59b27]/40 rounded-2xl p-5 flex items-center gap-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center">
              <span className="text-3xl">📜</span>
            </div>
            <div className="flex-grow">
              <span className="text-[10px] font-black text-[#c59b27] tracking-widest uppercase">רכיב 2</span>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">קלף ופרשיות</h3>
              <p className="text-slate-500 text-xs mt-1">נבחר כעת: <strong className="text-slate-700">{selectedScroll ? selectedScroll.name : 'טוען...'}</strong></p>
              {selectedScribeType && (
                <p className="text-emerald-600 text-[10px] font-bold mt-1">✍️ סופר מיועד: {selectedScribeType}</p>
              )}
              <span className="inline-block bg-[#c59b27]/10 text-[#c59b27] font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-2">
                {selectedScroll ? selectedScroll.badge : 'כשר'}
              </span>
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-[#0f172a]">{selectedScroll ? selectedScroll.price : 0} ₪</div>
              <span className="text-[10px] text-slate-400 block mt-1 hover:text-[#c59b27] transition">לשינוי והתאמה ←</span>
            </div>
          </div>

          {/* Card 3: רצועות עור */}
          <div 
            onClick={() => setActiveDrawer('straps')}
            className="bg-white border border-slate-100 hover:border-[#c59b27]/40 rounded-2xl p-5 flex items-center gap-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
              <img src={selectedStraps.img} alt={selectedStraps.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="flex-grow">
              <span className="text-[10px] font-black text-[#c59b27] tracking-widest uppercase">רכיב 3</span>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">רצועות עור</h3>
              <p className="text-slate-500 text-xs mt-1">נבחר כעת: <strong className="text-slate-700">{selectedStraps.name}</strong></p>
              <span className="inline-block bg-[#c59b27]/10 text-[#c59b27] font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-2">
                {selectedStraps.badge}
              </span>
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-[#0f172a]">{selectedStraps.price} ₪</div>
              <span className="text-[10px] text-slate-400 block mt-1 hover:text-[#c59b27] transition">לשינוי והתאמה ←</span>
            </div>
          </div>

          {/* Card 4: תפירה, גימור וקופסה */}
          <div 
            onClick={() => setActiveDrawer('finish')}
            className="bg-white border border-slate-100 hover:border-[#c59b27]/40 rounded-2xl p-5 flex items-center gap-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
              <img src={selectedBox.img} alt={selectedBox.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="flex-grow">
              <span className="text-[10px] font-black text-[#c59b27] tracking-widest uppercase">רכיב 4</span>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">תפירה, גימור וקופסה</h3>
              <p className="text-slate-500 text-xs mt-1">נבחר כעת: <strong className="text-slate-700">{selectedBox.name}</strong></p>
              <p className="text-slate-400 text-[10px] mt-1">כולל מלאכת תפירה וסגירה קבועה (+150 ₪)</p>
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-[#0f172a]">
                {150 + getBaseBoxPrice() + selectedBox.price} ₪
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 hover:text-[#c59b27] transition">לשינוי והתאמה ←</span>
            </div>
          </div>
        </div>

        {/* LEFT SIDE: LIVE TRANSPARENCY SUMMARY (FLOATING PANEL) */}
        <div className="lg:col-span-1 lg:sticky lg:top-8 bg-white border border-slate-100 p-6 rounded-3xl shadow-lg">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">שקיפות תמחור ומחשבון חי</h3>
            <p className="text-slate-400 text-xs mt-1">פירוט שקוף וגלוי של ההרכבה שלך</p>
          </div>

          <div className="space-y-3.5 my-6 text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span>בתים ({isHouseDak() ? 'דקות' : 'גסות'}):</span>
              <span className="font-bold text-slate-800">{selectedHouse.price} ₪</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>פרשיות וקלף סת"ם:</span>
              <span className="font-bold text-slate-800">{selectedScroll ? selectedScroll.price : 0} ₪</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>רצועות עור:</span>
              <span className="font-bold text-slate-800">{selectedStraps.price} ₪</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>מלאכת תפירה וסגירה:</span>
              <span className="font-bold text-slate-800">150 ₪</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>קופסת מגן ({isHouseDak() ? '12 ₪' : '15 ₪'}):</span>
              <span className="font-bold text-slate-800">
                {getBaseBoxPrice() + (selectedBox ? selectedBox.price : 0)} ₪
              </span>
            </div>
            
            {/* רקמת שם אישית כרכיב משלים */}
            {selectedBox.id === 'box-leather' && (
              <div className="bg-[#fef08a]/20 border border-[#fef08a]/40 p-3 rounded-xl mt-4 space-y-2">
                <label className="block text-xs font-bold text-[#c59b27] mb-1">
                  הקדשה לרקמת זהב על נרתיק העור (חינם):
                </label>
                <input 
                  type="text" 
                  value={embroideryName} 
                  onChange={(e) => setEmbroideryName(e.target.value)}
                  placeholder="הקלד שם לרקמה (לדוגמה: אברהם יצחק)" 
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-[#c59b27] text-right"
                />
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-base font-extrabold text-slate-800">סה"כ לתשלום:</span>
              <span className="text-3xl font-black text-[#c59b27]">{calculateTotalPrice()} ₪</span>
            </div>

            <button 
              onClick={handleOrderSubmit}
              className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <span>📲 שליחת הזמנת מפרט לוואטסאפ</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2.5 leading-relaxed">
              ההרכבה תישלח כמפרט מילולי מסודר לתיאום, מדידה והזמנה מול סופרי מלכותא בוואטסאפ.
            </p>
          </div>
        </div>

      </div>

      {/* --- EXPANDED SELECTION DRAWERS / MODALS --- */}
      
      {/* DRAWER 1: בית התפילין */}
      {activeDrawer === 'house' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto text-right">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-2xl font-black text-slate-900 font-serif">בחירת בתים והידור הלכתי</h3>
              <button 
                onClick={() => setActiveDrawer(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* קבוצה א': דקות */}
            <div className="mb-8">
              <div className="border-r-4 border-[#c59b27] pr-3 mb-4">
                <h4 className="text-lg font-extrabold text-slate-800">{HOUSES_DATA.dakkot.label}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{HOUSES_DATA.dakkot.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HOUSES_DATA.dakkot.options.map((option) => {
                  const isSelected = selectedHouse.id === option.id;
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleHouseSelect(option)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 relative group flex gap-4 bg-white ${
                        isSelected ? 'border-[#c59b27] bg-[#c59b27]/5 ring-2 ring-[#c59b27]/20' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                        <div className="w-full h-full bg-slate-200" /> {/* Placeholder Image */}
                      </div>
                      <div className="flex-grow">
                        <span className="text-[9px] font-black text-[#c59b27] uppercase">{option.badge}</span>
                        <h5 className="font-extrabold text-slate-800 mt-0.5 text-sm">{option.name}</h5>
                        <p className="text-[#c59b27] font-black text-sm mt-2">{option.price} ₪</p>
                      </div>
                      <input 
                        type="radio" 
                        name="houseSelect" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        className="accent-[#c59b27] self-start mt-1" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* קבוצה ב': גסות */}
            <div className="mb-6">
              <div className="border-r-4 border-[#0f172a] pr-3 mb-4">
                <h4 className="text-lg font-extrabold text-slate-800">{HOUSES_DATA.gassot.label}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{HOUSES_DATA.gassot.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HOUSES_DATA.gassot.options.map((option) => {
                  const isSelected = selectedHouse.id === option.id;
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleHouseSelect(option)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 relative group flex gap-4 bg-white ${
                        isSelected ? 'border-[#c59b27] bg-[#c59b27]/5 ring-2 ring-[#c59b27]/20' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                        <div className="w-full h-full bg-slate-200" /> {/* Placeholder Image */}
                      </div>
                      <div className="flex-grow">
                        <span className="text-[9px] font-black text-[#c59b27] uppercase">{option.badge}</span>
                        <h5 className="font-extrabold text-slate-800 mt-0.5 text-sm">{option.name}</h5>
                        <p className="text-[#c59b27] font-black text-sm mt-2">{option.price} ₪</p>
                      </div>
                      <input 
                        type="radio" 
                        name="houseSelect" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        className="accent-[#c59b27] self-start mt-1" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 mt-6">
              <button 
                onClick={() => setActiveDrawer(null)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-xl transition duration-200 text-sm"
              >
                אישור והמשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 2: קלף ופרשיות */}
      {activeDrawer === 'scroll' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto text-right">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">בחירת קלף ורמת הידור</h3>
                <p className="text-slate-400 text-xs mt-1">מפרט הקלפים מותאם אוטומטית לבית שנבחר: <strong className="text-slate-600">{selectedHouse.name}</strong></p>
              </div>
              <button 
                onClick={() => setActiveDrawer(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* בחירת סופר - מופיע רק אם נבחר בית גס קלאסי / רגיל */}
            {!isHouseDak() && selectedHouse.id !== 'gas-size28' && selectedHouse.id !== 'gas-pitzponim' && selectedHouse.id !== 'gas-4x4' && (
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl mb-6 text-right">
                <label className="block text-xs font-black text-slate-700 mb-2">✍️ בחר סגנון/קהילת סופר הסת"ם:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedScribeType('כיפה סרוגה')}
                    className={`p-3 rounded-xl border-2 text-sm font-extrabold transition duration-200 ${
                      selectedScribeType === 'כיפה סרוגה' ? 'border-[#c59b27] bg-[#c59b27]/5 text-[#c59b27]' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    💂‍♂️ בוגר צבא (כיפה סרוגה)
                  </button>
                  <button 
                    onClick={() => setSelectedScribeType('אברך חרדי')}
                    className={`p-3 rounded-xl border-2 text-sm font-extrabold transition duration-200 ${
                      selectedScribeType === 'אברך חרדי' ? 'border-[#c59b27] bg-[#c59b27]/5 text-[#c59b27]' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    🕍 אברך חרדי לשמה
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">הכתיבה מבוצעת בדקדוק הלכתי, ביראת שמיים ובפיקוח מלא של משמרת סת"ם.</p>
              </div>
            )}

            {/* רשימת קלפים תואמים */}
            <div className="space-y-4">
              {getCompatibleScrollOptions().map((option) => {
                const isSelected = selectedScroll && selectedScroll.id === option.id;
                return (
                  <div 
                    key={option.id}
                    onClick={() => handleScrollSelect(option)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 relative group flex items-center justify-between bg-white ${
                      isSelected ? 'border-[#c59b27] bg-[#c59b27]/5 ring-2 ring-[#c59b27]/20' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-lg">
                        📜
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-[#c59b27] uppercase">{option.badge}</span>
                        <h5 className="font-extrabold text-slate-800 mt-0.5 text-sm">{option.name}</h5>
                        <p className="text-slate-500 text-xs mt-1">{option.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-[#0f172a]">{option.price} ₪</span>
                      <input 
                        type="radio" 
                        name="scrollSelect" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        className="accent-[#c59b27]" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 mt-6">
              <button 
                onClick={() => setActiveDrawer(null)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-xl transition duration-200 text-sm"
              >
                אישור והמשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 3: רצועות עור */}
      {activeDrawer === 'straps' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto text-right">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-2xl font-black text-slate-900 font-serif">בחירת רצועות עור</h3>
              <button 
                onClick={() => setActiveDrawer(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* עבודת מכונה */}
            <div className="mb-8">
              <div className="border-r-4 border-slate-400 pr-3 mb-4">
                <h4 className="text-lg font-extrabold text-slate-800">{STRAPS_DATA.machine.label}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{STRAPS_DATA.machine.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STRAPS_DATA.machine.options.map((option) => {
                  const isSelected = selectedStraps.id === option.id;
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleStrapsSelect(option)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 relative group flex gap-4 bg-white ${
                        isSelected ? 'border-[#c59b27] bg-[#c59b27]/5 ring-2 ring-[#c59b27]/20' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                        <div className="w-full h-full bg-slate-200" /> {/* Placeholder */}
                      </div>
                      <div className="flex-grow">
                        <span className="text-[9px] font-black text-slate-500 uppercase">{option.badge}</span>
                        <h5 className="font-extrabold text-slate-800 mt-0.5 text-sm">{option.name}</h5>
                        <p className="text-[#c59b27] font-black text-sm mt-2">{option.price} ₪</p>
                      </div>
                      <input 
                        type="radio" 
                        name="strapsSelect" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        className="accent-[#c59b27] self-start mt-1" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* עבודת יד */}
            <div className="mb-6">
              <div className="border-r-4 border-[#c59b27] pr-3 mb-4">
                <h4 className="text-lg font-extrabold text-slate-800">{STRAPS_DATA.hand.label}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{STRAPS_DATA.hand.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STRAPS_DATA.hand.options.map((option) => {
                  const isSelected = selectedStraps.id === option.id;
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleStrapsSelect(option)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 relative group flex gap-4 bg-white ${
                        isSelected ? 'border-[#c59b27] bg-[#c59b27]/5 ring-2 ring-[#c59b27]/20' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                        <div className="w-full h-full bg-slate-200" /> {/* Placeholder */}
                      </div>
                      <div className="flex-grow">
                        <span className="text-[9px] font-black text-[#c59b27] uppercase">{option.badge}</span>
                        <h5 className="font-extrabold text-slate-800 mt-0.5 text-sm">{option.name}</h5>
                        <p className="text-[#c59b27] font-black text-sm mt-2">{option.price} ₪</p>
                      </div>
                      <input 
                        type="radio" 
                        name="strapsSelect" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        className="accent-[#c59b27] self-start mt-1" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 mt-6">
              <button 
                onClick={() => setActiveDrawer(null)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-xl transition duration-200 text-sm"
              >
                אישור והמשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 4: תפירה, גימור וקופסה */}
      {activeDrawer === 'finish' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto text-right">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">תפירה, גימור ושדרוג המארז</h3>
                <p className="text-slate-400 text-xs mt-1">
                  קופסת בסיס מתומחרת אוטומטית בהתאם לבית: <strong className="text-slate-600">{isHouseDak() ? '12 ₪ (דקות)' : '15 ₪ (גסות)'}</strong>
                </p>
              </div>
              <button 
                onClick={() => setActiveDrawer(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* מלאכת גימור חובה (רכיב קבוע) */}
            <div className="bg-[#0f172a]/5 border border-[#0f172a]/10 p-5 rounded-2xl mb-6 flex gap-4 items-center">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-lg">
                🪡
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">מלאכת גימור, תפירה וצביעה קדושה לשמה</h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  תפירת גידים לשמה, העברת רצועות, מתיחה, סגירה קפדנית, וצביעת הבתים השחורים בשלוש שכבות צבע מהודר.
                </p>
              </div>
              <div className="mr-auto text-left font-black text-slate-900 text-base">
                150 ₪ <span className="text-[10px] text-emerald-600 block font-bold">קבוע וחובה</span>
              </div>
            </div>

            {/* שדרוג קופסה ומארז */}
            <h4 className="text-base font-black text-slate-800 mb-4 border-r-4 border-[#c59b27] pr-3">מארזים וקופסאות מגן לבחירה:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOX_UPGRADE_OPTIONS.map((option) => {
                const isSelected = selectedBox.id === option.id;
                return (
                  <div 
                    key={option.id}
                    onClick={() => handleBoxSelect(option)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 relative group flex gap-4 bg-white ${
                      isSelected ? 'border-[#c59b27] bg-[#c59b27]/5 ring-2 ring-[#c59b27]/20' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                      <div className="w-full h-full bg-slate-200" /> {/* Placeholder */}
                    </div>
                    <div className="flex-grow">
                      <span className="text-[9px] font-black text-[#c59b27] uppercase">{option.badge}</span>
                      <h5 className="font-extrabold text-slate-800 mt-0.5 text-sm">{option.name}</h5>
                      <p className="text-slate-500 text-xs mt-1">{option.desc}</p>
                      <p className="text-[#c59b27] font-black text-sm mt-2">
                        {option.price === 0 ? 'ללא תוספת' : `+${option.price} ₪`}
                      </p>
                    </div>
                    <input 
                      type="radio" 
                      name="boxSelect" 
                      checked={isSelected} 
                      onChange={() => {}} 
                      className="accent-[#c59b27] self-start mt-1" 
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 mt-6">
              <button 
                onClick={() => setActiveDrawer(null)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-xl transition duration-200 text-sm"
              >
                אישור והמשך
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}