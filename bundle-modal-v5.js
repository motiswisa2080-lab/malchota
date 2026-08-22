/* ============================================================
   מלכותא - מנגנון מודאל Bundle אינטראקטיבי מעודכן (bundle-modal.js)
   מתאים לשיבוץ ב-index.html וב-catalog.html
   ============================================================ */

const WA_NUMBER = '972535502797';
const MAKE_WEBHOOK_URL = ''; // ניתן להזנה לצורך אוטומציית Make

var IMAGES = {
  scroll10: 'images/scrol-10cm.webp',
  scroll12: 'images/scrol-12cm.webp',
  caseBlack: 'images/case-black.webp',
  caseStone: 'images/case-stone.webp', // פלייסהולדר/תמונה של שיש
  caseWood: 'images/case-wood.webp'    // פלייסהולדר/תמונה של עץ
};

var mezuzahData = {
  scrolls: [
    { 
      size: '10 ס"מ', 
      price: 250, 
      img: IMAGES.scroll10,
      scribe: {
        name: 'יוחנן לבבי',
        location: 'העיר העתיקה, ירושלים',
        experience: '12 שנות כתיבה מהודרת',
        certification: 'מוסמך ועד משמרת סת"ם'
      }
    },
    { 
      size: '12 ס"מ', 
      price: 280, 
      img: IMAGES.scroll12,
      scribe: {
        name: 'הרב דוד חסון',
        location: 'חריש',
        experience: '20 שנות ניסיון והוראת סת"ם',
        certification: 'בית הוראה - מלאכת הקודש'
      }
    }
  ],
  cases: [
    { name: 'בטון שחור MODERN', price: 90, img: IMAGES.caseBlack },
    { name: 'שיש ירושלמי קלאסי', price: 120, img: IMAGES.caseStone || 'images/case-black.webp' },
    { name: 'עץ זית טבעי חם', price: 150, img: IMAGES.caseWood || 'images/case-black.webp' }
  ]
};

// משתני מצב של המודאל
let wizardState = {
  currentStep: 1,
  selectedCaseIndex: 0,
  includeScroll: true,
  selectedScrollIndex: 1, // ברירת מחדל 12 ס"מ
  selectedNusach: 'ספרדי (עדות המזרח)',
  clientName: '',
  clientPhone: ''
};

// מילון נוסחים קבוע לקלף
const NUSACH_OPTIONS = [
  'ספרדי (עדות המזרח)',
  'אשכנזי (ואליש / בית יוסף)'
];

var waLink = txt => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`;

// פונקציית פתיחת המודאל - תומכת בכל סוג קריאה (מותאמת לאחור)
function openMezuzahModal(type) {
  var modalEl = document.getElementById('mezuzahModal');
  if (!modalEl) return;

  // אתחול מצב לערכי ברירת מחדל
  wizardState = {
    currentStep: 1,
    selectedCaseIndex: 0,
    includeScroll: type !== 'case', // אם לחצו על בית, נתחיל עם סיכוי לא להוסיף, אך נאפשר לו קומפיגורציה מלאה
    selectedScrollIndex: 1,
    selectedNusach: 'ספרדי (עדות המזרח)',
    clientName: '',
    clientPhone: ''
  };

  renderWizard();

  // פתיחת המודאל
  modalEl.style.display = 'flex';
  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden';

  // פוקוס על כפתור הסגירה לנגישות
  const closeBtn = modalEl.querySelector('.close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeMezuzahModal() {
  var modalEl = document.getElementById('mezuzahModal');
  if (modalEl) {
    modalEl.style.display = 'none';
    modalEl.classList.remove('open');
  }
  document.body.style.overflow = '';
}

// ניווט בין שלבים
function nextStep() {
  if (wizardState.currentStep === 1) {
    wizardState.currentStep = 2;
  } else if (wizardState.currentStep === 2) {
    // אם לא כולל קלף, נדלג על שלב 3 (הסופר) ישירות לשלב 4 (פרטים וסיכום)
    if (!wizardState.includeScroll) {
      wizardState.currentStep = 4;
    } else {
      wizardState.currentStep = 3;
    }
  } else if (wizardState.currentStep === 3) {
    wizardState.currentStep = 4;
  }
  renderWizard();
}

function prevStep() {
  if (wizardState.currentStep === 4 && !wizardState.includeScroll) {
    wizardState.currentStep = 2;
  } else {
    wizardState.currentStep--;
  }
  renderWizard();
}

// חישוב מחירים ודירוגים
function calculatePrice() {
  const selectedCase = mezuzahData.cases[wizardState.selectedCaseIndex];
  let standardPrice = selectedCase.price;
  let finalPrice = selectedCase.price;
  let discount = 0;

  if (wizardState.includeScroll) {
    const selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    standardPrice += selectedScroll.price;
    discount = 30; // הנחת Bundle קבועה של 30 ש"ח
    finalPrice = standardPrice - discount;
  }

  return {
    standardPrice,
    finalPrice,
    discount,
    isBundle: wizardState.includeScroll
  };
}

// רישום ועדכון בחירות המשתמש מהאינפוטים
function handleCaseSelect(index) {
  wizardState.selectedCaseIndex = index;
  renderWizard();
}

function handleScrollToggle(include) {
  wizardState.includeScroll = include;
  renderWizard();
}

function handleScrollSizeChange(index) {
  wizardState.selectedScrollIndex = index;
  renderWizard();
}

function handleNusachChange(val) {
  wizardState.selectedNusach = val;
}

// רינדור דינמי של הויזארד לפי השלב הנוכחי
function renderWizard() {
  const body = document.getElementById('modalBody');
  if (!body) return;

  const pricing = calculatePrice();
  let stepHTML = '';

  // סרגל התקדמות ויזואלי מהמם (התאמה לקו העיצובי של מלכותא)
  const progressPercent = ((wizardState.currentStep - 1) / 3) * 100;
  const progressBar = `
    <div class="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden relative" style="direction: ltr;">
      <div class="bg-amber-500 h-full transition-all duration-300 rounded-full" style="width: ${progressPercent}%; float: right;"></div>
    </div>
  `;

  if (wizardState.currentStep === 1) {
    // שלב 1: בחירת בית מזוזה
    const casesGrid = mezuzahData.cases.map((c, i) => {
      const isSelected = wizardState.selectedCaseIndex === i;
      const borderClass = isSelected ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-slate-200 hover:border-amber-300';
      return `
        <div onclick="handleCaseSelect(${i})" class="border-2 ${borderClass} p-3 rounded-xl cursor-pointer transition flex flex-col items-center text-center bg-white shadow-sm">
          <img src="${c.img}" alt="${c.name}" class="w-full h-24 object-cover rounded-lg mb-2" onerror="imgFallback(this)">
          <h5 class="font-bold text-slate-800 text-sm mb-1 leading-tight">${c.name}</h5>
          <p class="font-black text-amber-600 text-sm">${c.price} ₪</p>
        </div>
      `;
    }).join('');

    stepHTML = `
      ${progressBar}
      <h3 class="text-xl font-bold text-slate-900 text-right mb-1">התאמת Bundle מהודר</h3>
      <p class="text-sm text-slate-500 text-right mb-4">שלב 1 מתוך 4: בחירת בית מזוזה מעוצב</p>
      
      <div class="grid grid-cols-3 gap-3 mb-6">
        ${casesGrid}
      </div>

      <div class="flex justify-end">
        <button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextStep()">
          המשך לשלב הבא ←
        </button>
      </div>
    `;

  } else if (wizardState.currentStep === 2) {
    // שלב 2: הוספת קלף
    const isScrollYes = wizardState.includeScroll;
    const yesBorder = isScrollYes ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/5' : 'border-slate-200';
    const noBorder = !isScrollYes ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/5' : 'border-slate-200';
    
    // אופציות גודל קלף
    const scrollOptions = mezuzahData.scrolls.map((s, i) => {
      const isSelected = wizardState.selectedScrollIndex === i;
      const borderClass = isSelected ? 'border-amber-500 bg-amber-50/20 text-amber-600' : 'border-slate-200 text-slate-700 hover:border-amber-200';
      return `
        <button onclick="handleScrollSizeChange(${i})" class="flex-1 border-2 ${borderClass} py-2 px-3 rounded-lg font-bold text-xs transition">
          קלף ${s.size} (+${s.price} ₪)
        </button>
      `;
    }).join('');

    // אופציות נוסח
    const nusachOptions = NUSACH_OPTIONS.map(n => {
      const isSelected = wizardState.selectedNusach === n;
      return `<option value="${n}" ${isSelected ? 'selected' : ''}>${n}</option>`;
    }).join('');

    stepHTML = `
      ${progressBar}
      <h3 class="text-xl font-bold text-slate-900 text-right mb-1">הוספת קלף סת"ם כשר</h3>
      <p class="text-sm text-slate-500 text-right mb-4">שלב 2 מתוך 4: הגדרת המזוזה</p>

      <div class="space-y-3 mb-6 text-right">
        <!-- אפשרות א: עם קלף (ההמלצה) -->
        <div onclick="handleScrollToggle(true)" class="border-2 ${yesBorder} p-4 rounded-xl cursor-pointer transition bg-white relative">
          <span class="absolute top-2 left-3 bg-amber-100 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full" style="left: auto; right: 12px; top: -10px;">משתלם ביותר! הטבת Bundle</span>
          <div class="flex items-start gap-3 mt-1">
            <input type="radio" name="scrollOpt" class="mt-1 accent-amber-500" ${isScrollYes ? 'checked' : ''}>
            <div>
              <h4 class="font-bold text-slate-800 text-base">כן, אשמח להוסיף קלף סת"ם מהודר</h4>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">קלף כשר שנכתב על ידי סופר מוסמך, כולל הגהה כפולה (מחשב + מומחה) ותעודת אחריות. חוסך 30 ₪ במחיר החבילה!</p>
            </div>
          </div>
        </div>

        <!-- אפשרות ב: ללא קלף -->
        <div onclick="handleScrollToggle(false)" class="border-2 ${noBorder} p-4 rounded-xl cursor-pointer transition bg-white">
          <div class="flex items-start gap-3">
            <input type="radio" name="scrollOpt" class="mt-1 accent-amber-500" ${!isScrollYes ? 'checked' : ''}>
            <div>
              <h4 class="font-bold text-slate-800 text-base">לא, ברצוני לרכוש בית מזוזה בלבד</h4>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">שימו לב: בית המזוזה יגיע ריק ללא קלף סת"ם כשר בפנים, ולא ניתן יהיה לקבוע אותו כך הלכתית בפתח הבית.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- הגדרות קלף מורחבות (מופיע רק אם נבחר קלף) -->
      ${isScrollYes ? `
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-right animate-fadeIn">
          <h4 class="font-bold text-slate-700 text-sm mb-2">מאפייני קלף הסת"ם שלך:</h4>
          <div class="flex gap-3 mb-4">
            ${scrollOptions}
          </div>
          <h4 class="font-bold text-slate-700 text-sm mb-2">נוסח הלכתי:</h4>
          <select id="scrollNusach" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white" onchange="handleNusachChange(this.value)">
            ${nusachOptions}
          </select>
        </div>
      ` : ''}

      <div class="flex justify-between items-center">
        <button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">
          ← חזרה לבית המזוזה
        </button>
        <button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextStep()">
          המשך לשלב הבא ←
        </button>
      </div>
    `;

  } else if (wizardState.currentStep === 3) {
    // שלב 3: חשיפת הסופר (רק אם נבחר קלף)
    const selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    const s = selectedScroll.scribe;

    stepHTML = `
      ${progressBar}
      <h3 class="text-xl font-bold text-slate-900 text-right mb-1">הכירו את סופר הסת"ם שלכם</h3>
      <p class="text-sm text-slate-500 text-right mb-4">שלב 3 מתוך 4: חיבור רגשי ואותנטיות</p>

      <div class="bg-amber-50/40 border border-amber-100 p-5 rounded-2xl text-right mb-6 shadow-inner">
        <div class="flex justify-between items-start mb-3 border-b border-amber-100/50 pb-3">
          <span class="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">סופר סת"ם מוסמך</span>
          <h4 class="font-black text-amber-800 text-lg leading-none">${s.name}</h4>
        </div>
        
        <div class="space-y-2 text-sm text-slate-700">
          <p>📍 <strong>מקום הכתיבה:</strong> ${s.location}</p>
          <p>⏳ <strong>שנות ניסיון:</strong> ${s.experience}</p>
          <p>📜 <strong>הסמכה ופיקוח:</strong> ${s.certification}</p>
        </div>

        <div class="mt-4 p-3 bg-white/80 rounded-xl border border-amber-100/50 text-xs text-amber-900 italic leading-relaxed">
          "מלאכת כתיבת הסת\"ם במלכותא נעשית מתוך קדושה, יראת שמיים טהורה וריכוז מוחלט. כל אות מקבלת את תשומת הלב הראויה לה, ולאחר הכתיבה כל קלף עובר הגהה כפולה קפדנית על מנת להבטיח כשרות מהודרת ללא פשרות."
        </div>
      </div>

      <div class="flex justify-between items-center">
        <button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">
          ← חזרה לקלף
        </button>
        <button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextStep()">
          המשך לסיכום ←
        </button>
      </div>
    `;

  } else if (wizardState.currentStep === 4) {
    // שלב 4: פרטי קשר, סיכום והזמנה
    const selectedCase = mezuzahData.cases[wizardState.selectedCaseIndex];
    const selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    
    let summaryHTML = `
      <div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
        <span class="font-bold text-slate-800">${selectedCase.price} ₪</span>
        <span class="text-slate-600">בית מזוזה: ${selectedCase.name}</span>
      </div>
    `;

    if (wizardState.includeScroll) {
      summaryHTML += `
        <div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
          <span class="font-bold text-slate-800">${selectedScroll.price} ₪</span>
          <span class="text-slate-600">קלף סת"ם מהודר: ${selectedScroll.size} (${wizardState.selectedNusach})</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm text-emerald-600 bg-emerald-50/50 px-2 rounded-lg mt-1">
          <span class="font-bold">-30 ₪</span>
          <span>🎁 הטבת Bundle (הנחת מותג)</span>
        </div>
      `;
    } else {
      summaryHTML += `
        <div class="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-xs mt-2 leading-relaxed text-right">
          ⚠️ אזהרה: ההזמנה אינה כוללת קלף סת"ם כשר. בית המזוזה יגיע ריק.
        </div>
      `;
    }

    stepHTML = `
      ${progressBar}
      <h3 class="text-xl font-bold text-slate-900 text-right mb-1">סיכום הזמנה ופרטי קשר</h3>
      <p class="text-sm text-slate-500 text-right mb-4">שלב אחרון: השלמת המארז שלך</p>

      <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 text-right">
        <h4 class="font-bold text-slate-700 text-sm mb-2 border-b border-slate-200 pb-1">פירוט המארז:</h4>
        ${summaryHTML}
        
        <div class="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">
          <span class="text-xl font-black text-amber-600">${pricing.finalPrice} ₪</span>
          <span class="font-bold text-slate-800">מחיר סופי לתשלום:</span>
        </div>
      </div>

      <!-- טופס פרטי הלקוח -->
      <div class="space-y-3 mb-6 text-right">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">שם מלא:</label>
          <input type="text" id="clientName" value="${wizardState.clientName}" oninput="wizardState.clientName = this.value" placeholder="הכנס את שמך" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">טלפון ליצירת קשר (וואטסאפ):</label>
          <input type="tel" id="clientPhone" value="${wizardState.clientPhone}" oninput="wizardState.clientPhone = this.value" placeholder="לדוגמה: 0521234567" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
        </div>
      </div>

      <div class="flex justify-between items-center">
        <button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">
          ← שלב קודם
        </button>
        <button class="bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl hover:bg-emerald-500 transition text-sm flex items-center gap-2 shadow-md" onclick="submitBundleOrder()">
          📲 הזמנה מהירה בוואטסאפ
        </button>
      </div>
    `;
  }

  body.innerHTML = stepHTML;
}

// שליחת ההזמנה - משלבת סגירת וואטסאפ מילולית וסימולציה של Webhook
function submitBundleOrder() {
  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');

  if (!wizardState.clientName.trim()) {
    alert('אנא הזן שם מלא לצורך השלמת ההזמנה');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!wizardState.clientPhone.trim()) {
    alert('אנא הזן מספר טלפון ליצירת קשר');
    if (phoneInput) phoneInput.focus();
    return;
  }

  const selectedCase = mezuzahData.cases[wizardState.selectedCaseIndex];
  const selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
  const pricing = calculatePrice();

  // 1. הרכבת נתוני JSON מובנים (Payload) עבור בקרת האוטומציה ב-Make
  const orderPayload = {
    order_date: new Date().toISOString(),
    client_name: wizardState.clientName,
    client_phone: wizardState.clientPhone,
    bundle_type: wizardState.includeScroll ? 'complete_bundle' : 'case_only',
    case_name: selectedCase.name,
    case_price: selectedCase.price,
    includes_scroll: wizardState.includeScroll,
    scroll_size: wizardState.includeScroll ? selectedScroll.size : null,
    scroll_nusach: wizardState.includeScroll ? wizardState.selectedNusach : null,
    scroll_price: wizardState.includeScroll ? selectedScroll.price : 0,
    scribe_name: wizardState.includeScroll ? selectedScroll.scribe.name : null,
    discount_applied: pricing.discount,
    total_price: pricing.finalPrice
  };

  // הדפסת ה-Payload ל-Console כהוכחה הנדסית וכבדיקת תקינות של ה-Data-Integrity
  console.log('%c[מלכותא סת"ם] ✓ Payload מובנה מוכן לאוטומציית Make webhook:', 'font-weight:bold;color:#10b981;', orderPayload);

  // במידה וקיים Webhook URL מוגדר - נשלח את הנתונים ברקע (הכנה לפיתוח עתידי)
  if (MAKE_WEBHOOK_URL) {
    fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    })
    .then(response => console.log('[מלכותא] Webhook נשלח בהצלחה ל-Make'))
    .catch(error => console.error('[מלכותא] שגיאה בשליחת Webhook:', error));
  }

  // 2. בניית הודעת וואטסאפ מילולית אינטראקטיבית וחגיגית בהתאם לאסטרטגיית ה-Bundle
  let msg = `היי, אשמח להזמין את ה-Bundle המהודר של מלכותא! 📜✨\n\n`;
  msg += `👤 שם הלקוח: ${wizardState.clientName}\n`;
  msg += `📞 טלפון: ${wizardState.clientPhone}\n`;
  msg += `🏠 בית מזוזה שנבחר: ${selectedCase.name} (${selectedCase.price} ₪)\n`;
  
  if (wizardState.includeScroll) {
    msg += `🖋️ קלף מזוזה כשר: קלף ${selectedScroll.size} (${selectedScroll.price} ₪)\n`;
    msg += `📜 נוסח הלכתי: ${wizardState.selectedNusach}\n`;
    msg += `✍️ נכתב על ידי הסופר: ${selectedScroll.scribe.name}\n`;
    msg += `🎁 הנחת מארז Bundle: -30 ₪\n\n`;
  } else {
    msg += `⚠️ ללא קלף סת"ם (בית מזוזה בלבד)\n\n`;
  }
  
  msg += `💰 סה"כ לתשלום: ${pricing.finalPrice} ₪\n\n`;
  msg += `אשמח אם תחזרו אליי לאישור ההזמנה ופרטי משלוח! תודה.`;

  // 3. פתיחת חלון וואטסאפ וסגירת המודאל
  window.open(waLink(msg), '_blank');
  closeMezuzahModal();
}

// הגדרת מאזיני אירועים רוחביים למקלדת (Esc) וללחיצה מחוץ למודאל
document.addEventListener('DOMContentLoaded', () => {
  var modalEl = document.getElementById('mezuzahModal');
  if (modalEl) {
    // סגירה בלחיצה על הרקע הכהה
    modalEl.addEventListener('click', e => {
      if (e.target === modalEl) closeMezuzahModal();
    });

    // מאזין למקש Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalEl.classList.contains('open')) {
        closeMezuzahModal();
      }
    });
  }

  // יישור קישורי וואטסאפ בראש ובחלק התחתון של הדף למספר האחד
  const waHeader = document.getElementById('waHeader');
  if (waHeader) waHeader.href = waLink('שלום, אשמח לקבל פרטים על סטי התפילין');

  const waFloat = document.getElementById('waFloat');
  if (waFloat) waFloat.href = waLink('שלום, אשמח לקבל פרטים');

  document.querySelectorAll('a[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
  });
});
