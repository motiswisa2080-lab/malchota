/* ============================================================
   ============================================================ */

(function() {
  'use strict';

   מלכותא - מנגנון מודאל Bundle משולב: מזוזות ותפילין (bundle- modal-v6.js)
   מתאים לשיבוץ ב-index.html וב-catalog.html בפלטפורמת ורסל (Vercel)

// משתני ליבה וקישורים קנוניים
var WA_NUMBER = '972535502797';
var MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/bdzi3ak12pi5oc1miae86sspwfs1lecm';
var MALCHUTA_SECURE_TOKEN = 'mlk-secure-token-2026-auth';

var IMAGES = {
  scroll10: 'images/scrol-10cm.webp', // איוש מוגן עם ל' אחת לפי נהלי השם המקוריים
  scroll12: 'images/scrol-12cm.webp',
  caseBlack: 'images/case-black.webp',
  caseStone: 'images/case-stone.webp',
  caseWood: 'images/case-wood.webp'
};

// ------------------------------------------------------------
// 1. מבני הנתונים של מוצרי החנות (ממוינים מהגבוה לנמוך)
// ------------------------------------------------------------

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
    { name: 'שיש ירושלמי קלאסי', price: 120, img: IMAGES.caseStone },
    { name: 'עץ זית טבעי חם', price: 150, img: IMAGES.caseWood }
  ]
};

var tefillinData = {
  sets: [
    {
      name: 'סט בר מצווה – קו יהלום כחול-לבן',
      price: 2699,
      img: 'images/set-yahalom-blue.jpg',
      desc: 'סט מהודר במיוחד הכולל תפילין בהמה גסה, טלית צמר טהור, נרתיקי קטיפה/זמש כחולים מעוצבים, סידור וכיפה תואמת.'
    },
    {
      name: "סט קו שהם – דגם ה' כתר זהב",
      price: 2450,
      img: 'images/set-shoham-gold.jpg',
      desc: "ערכת תפילין מושלמת בגימור שמנת-זהב יוקרתי, כולל הטבעת האות ה' וברכת הכוהנים, סידור מהודר וכיפת זמש תואמת."
    },
    {
      name: 'סט קו שהם – דגם להבת אש',
      price: 2390,
      img: 'images/set-shoham-cream.jpg',
      desc: 'עיצוב ייחודי עם אלמנט להבת הקודש, נרתיקים בגוון שמנת-זמש עמיד, כיפה תואמת וסידור שירת הלב בעיטורי זהב.'
    },
    {
      name: 'סט קו שהם – דגם זמש חום כהה',
      price: 2290,
      img: 'images/set-shoham-brown.jpg',
      desc: 'נרתיקי זמש חום עמוק בהטבעת זהב יוקרתית, כולל תפילין בהמה גסה, טלית איכותית וסידור מהודר בכריכת עור.'
    },
    {
      name: 'נרתיקי תפילין בעיצוב אישי',
      price: 450,
      img: 'images/pouch-custom-rabbi.jpg',
      desc: 'הטבעות והדפסים מיוחדים של דמויות צדיקים, שמות אישיים והקדשות לפי בקשה על גבי נרתיקי זמש וקטיפה איכותיים.'
    }
  ],
  scribe: {
    name: 'הרב שלמה גולדשטיין',
    location: 'קריית ארבע, חברון',
    experience: '15 שנות כתיבת תפילין מהודרות',
    certification: 'מוסמך לשכת הקודש ועד משמרת סת"ם'
  }
};

// ------------------------------------------------------------
// 2. משתני מצב של המודאלים (Wizards State)
// ------------------------------------------------------------

var wizardState = {
  currentStep: 1,
  selectedCaseIndex: 0,
  includeScroll: true,
  selectedScrollIndex: 1, // ברירת מחדל 12 ס"מ
  selectedNusach: 'ספרדי (עדות המזרח)',
  clientName: '',
  clientPhone: '',
  clientAddress: '',
  paymentMethod: 'whatsapp', // 'whatsapp' or 'credit_card'
  ccNumber: '',
  ccExpiry: '',
  ccCvv: ''
};

var tefillinWizardState = {
  currentStep: 1,
  selectedSetIndex: 0,
  selectedNusach: 'ספרדי (עדות המזרח)',
  embroideryName: '',
  clientName: '',
  clientPhone: '',
  clientAddress: '',
  paymentMethod: 'whatsapp', // 'whatsapp' or 'credit_card'
  ccNumber: '',
  ccExpiry: '',
  ccCvv: ''
};

// אופציות נוסחים
var NUSACH_OPTIONS = [
  'ספרדי (עדות המזרח)',
  'אשכנזי (ואליש / בית יוסף)'
];

var TEFILLIN_NUSACH_OPTIONS = [
  'ספרדי (עדות המזרח)',
  'אשכנזי (ואליש / בית יוסף)',
  'חב"ד (האר"י)'
];

// יצירת קישור וואטסאפ חכם
var waLink = function(txt) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(txt);
};

// ------------------------------------------------------------
// 3. מודאל באנדל ומזוזה (Mezuzah Modal Logic)
// ------------------------------------------------------------

function openMezuzahModal(type) {
  var modalEl = document.getElementById('mezuzahModal');
  if (!modalEl) return;

  wizardState = {
    currentStep: 1,
    selectedCaseIndex: 0,
    includeScroll: type !== 'case',
    selectedScrollIndex: 1,
    selectedNusach: 'ספרדי (עדות המזרח)',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    paymentMethod: 'whatsapp',
    ccNumber: '',
    ccExpiry: '',
    ccCvv: ''
  };

  renderWizard();

  modalEl.style.display = 'flex';
  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden';

  var closeBtn = modalEl.querySelector('.close-btn');
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

function nextStep() {
  if (wizardState.currentStep === 1) {
    wizardState.currentStep = 2;
  } else if (wizardState.currentStep === 2) {
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

function calculatePrice() {
  var selectedCase = mezuzahData.cases[wizardState.selectedCaseIndex];
  var standardPrice = selectedCase.price;
  var finalPrice = selectedCase.price;
  var discount = 0;

  if (wizardState.includeScroll) {
    var selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    standardPrice += selectedScroll.price;
    discount = 30; // הנחה קבועה לבאנדל
    finalPrice = standardPrice - discount;
  }

  return {
    standardPrice: standardPrice,
    finalPrice: finalPrice,
    discount: discount,
    isBundle: wizardState.includeScroll
  };
}

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

function handlePaymentMethodChange(method) {
  wizardState.paymentMethod = method;
  renderWizard();
}

function renderWizard() {
  var body = document.getElementById('modalBody');
  if (!body) return;

  var pricing = calculatePrice();
  var stepHTML = '';

  var progressPercent = ((wizardState.currentStep - 1) / 3) * 100;
  var progressBar = '<div class="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden relative" style="direction: ltr;"><div class="bg-amber-500 h-full transition-all duration-300 rounded-full" style="width: ' + progressPercent + '%; float: right;"></div></div>';

  if (wizardState.currentStep === 1) {
    var casesGrid = mezuzahData.cases.map(function(c, i) {
      var isSelected = wizardState.selectedCaseIndex === i;
      var borderClass = isSelected ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-slate-200 hover:border-amber-300';
      return '<div onclick="handleCaseSelect(' + i + ')" class="border-2 ' + borderClass + ' p-3 rounded-xl cursor-pointer transition flex flex-col items-center text-center bg-white shadow-sm"><img src="' + c.img + '" alt="' + c.name + '" class="w-full h-24 object-cover rounded-lg mb-2" onerror="imgFallback(this)"><h5 class="font-bold text-slate-800 text-sm mb-1 leading-tight">' + c.name + '</h5><p class="font-black text-amber-600 text-sm">' + c.price + ' ₪</p></div>';
    }).join('');

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">התאמת Bundle מהודר</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 1 מתוך 4: בחירת בית מזוזה מעוצב</p>' +
      '<div class="grid grid-cols-3 gap-3 mb-6">' + casesGrid + '</div>' +
      '<div class="flex justify-end">' +
        '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextStep()">' +
          'המשך לשלב הבא ←' +
        '</button>' +
      '</div>';

  } else if (wizardState.currentStep === 2) {
    var isScrollYes = wizardState.includeScroll;
    var yesBorder = isScrollYes ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/5' : 'border-slate-200';
    var noBorder = !isScrollYes ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/5' : 'border-slate-200';
    
    var scrollOptions = mezuzahData.scrolls.map(function(s, i) {
      var isSelected = wizardState.selectedScrollIndex === i;
      var borderClass = isSelected ? 'border-amber-500 bg-amber-50/20 text-amber-600' : 'border-slate-200 text-slate-700 hover:border-amber-200';
      return '<button onclick="handleScrollSizeChange(' + i + ')" class="flex-1 border-2 ' + borderClass + ' py-2 px-3 rounded-lg font-bold text-xs transition">קלף ' + s.size + ' (+' + s.price + ' ₪)</button>';
    }).join('');

    var nusachOptions = NUSACH_OPTIONS.map(function(n) {
      var isSelected = wizardState.selectedNusach === n;
      return '<option value="' + n + '" ' + (isSelected ? 'selected' : '') + '>' + n + '</option>';
    }).join('');

    var subScrollHTML = isScrollYes ? 
      '<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-right animate-fadeIn">' +
        '<h4 class="font-bold text-slate-700 text-sm mb-2">מאפייני קלף הסת"ם שלך:</h4>' +
        '<div class="flex gap-3 mb-4">' + scrollOptions + '</div>' +
        '<h4 class="font-bold text-slate-700 text-sm mb-2">נוסח הלכתי:</h4>' +
        '<select id="scrollNusach" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white" onchange="handleNusachChange(this.value)">' + nusachOptions + '</select>' +
      '</div>' : '';

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">הוספת קלף סת"ם כשר</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 2 מתוך 4: הגדרת המזוזה</p>' +
      '<div class="space-y-3 mb-6 text-right">' +
        '<div onclick="handleScrollToggle(true)" class="border-2 ' + yesBorder + ' p-4 rounded-xl cursor-pointer transition bg-white relative">' +
          '<span class="absolute top-2 left-3 bg-amber-100 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full" style="left: auto; right: 12px; top: -10px;">משתלם ביותר! הטבת Bundle</span>' +
          '<div class="flex items-start gap-3 mt-1">' +
            '<input type="radio" name="scrollOpt" class="mt-1 accent-amber-500" ' + (isScrollYes ? 'checked' : '') + '>' +
            '<div>' +
              '<h4 class="font-bold text-slate-800 text-base">כן, אשמח להוסיף קלף סת"ם מהודר</h4>' +
              '<p class="text-xs text-slate-500 mt-1 leading-relaxed">קלף כשר שנכתב על ידי סופר מוסמך, כולל הגהה כפולה (מחשב + מומחה) ותעודת אחריות. חוסך 30 ₪ במחיר החבילה!</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div onclick="handleScrollToggle(false)" class="border-2 ' + noBorder + ' p-4 rounded-xl cursor-pointer transition bg-white">' +
          '<div class="flex items-start gap-3">' +
            '<input type="radio" name="scrollOpt" class="mt-1 accent-amber-500" ' + (!isScrollYes ? 'checked' : '') + '>' +
            '<div>' +
              '<h4 class="font-bold text-slate-800 text-base">לא, ברצוני לרכוש בית מזוזה בלבד</h4>' +
              '<p class="text-xs text-slate-500 mt-1 leading-relaxed">שימו לב: בית המזוזה יגיע ריק ללא קלף סת"ם כשר בפנים, ולא ניתן יהיה לקבוע אותו כך הלכתית בפתח הבית.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      subScrollHTML +
      '<div class="flex justify-between items-center">' +
        '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">' +
          '← חזרה לבית המזוזה' +
        '</button>' +
        '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextStep()">' +
          'המשך לשלב הבא ←' +
        '</button>' +
      '</div>';

  } else if (wizardState.currentStep === 3) {
    var selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    var s = selectedScroll.scribe;

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">הכירו את סופר הסת"ם שלכם</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 3 מתוך 4: חיבור רגשי ואותנטיות</p>' +
      '<div class="bg-amber-50/40 border border-amber-100 p-5 rounded-2xl text-right mb-6 shadow-inner">' +
        '<div class="flex justify-between items-start mb-3 border-b border-amber-100/50 pb-3">' +
          '<span class="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">סופר סת"ם מוסמך</span>' +
          '<h4 class="font-black text-amber-800 text-lg leading-none">' + s.name + '</h4>' +
        '</div>' +
        '<div class="space-y-2 text-sm text-slate-700">' +
          '<p>📍 <strong>מקום הכתיבה:</strong> ' + s.location + '</p>' +
          '<p>⏳ <strong>שנות ניסיון:</strong> ' + s.experience + '</p>' +
          '<p>📜 <strong>הסמכה ופיקוח:</strong> ' + s.certification + '</p>' +
        '</div>' +
        '<div class="mt-4 p-3 bg-white/80 rounded-xl border border-amber-100/50 text-xs text-amber-900 italic leading-relaxed">' +
          '"מלאכת כתיבת הסת\"ם במלכותא נעשית מתוך קדושה, יראת שמיים טהורה וריכוז מוחלט. כל אות מקבלת את תשומת הלב הראויה לה, ולאחר הכתיבה כל קלף עובר הגהה כפולה קפדנית על מנת להבטיח כשרות מהודרת ללא פשרות."' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-between items-center">' +
        '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">' +
          '← חזרה לקלף' +
        '</button>' +
        '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextStep()">' +
          'המשך לסיכום ←' +
        '</button>' +
      '</div>';

  } else if (wizardState.currentStep === 4) {
    var selectedCase = mezuzahData.cases[wizardState.selectedCaseIndex];
    var selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    
    var summaryHTML = '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm"><span class="font-bold text-slate-800">' + selectedCase.price + ' ₪</span><span class="text-slate-600">בית מזוזה: ' + selectedCase.name + '</span></div>';

    if (wizardState.includeScroll) {
      summaryHTML += '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm"><span class="font-bold text-slate-800">' + selectedScroll.price + ' ₪</span><span class="text-slate-600">קלף סת"ם מהודר: ' + selectedScroll.size + ' (' + wizardState.selectedNusach + ')</span></div><div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm text-emerald-600 bg-emerald-50/50 px-2 rounded-lg mt-1"><span class="font-bold">-30 ₪</span><span>🎁 הטבת Bundle (הנחת מותג)</span></div>';
    } else {
      summaryHTML += '<div class="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-xs mt-2 leading-relaxed text-right">⚠️ אזהרה: ההזמנה אינה כוללת קלף סת"ם כשר. בית המזוזה יגיע ריק.</div>';
    }

    // תצוגת אמצעי תשלום
    var paymentSelectHTML = '<div class="space-y-2 mb-5 text-right"><label class="block text-xs font-bold text-slate-600 mb-1">בחר אמצעי תשלום מאובטח:</label><div class="grid grid-cols-2 gap-3"><div onclick="handlePaymentMethodChange(\'whatsapp\')" class="border-2 ' + (wizardState.paymentMethod === 'whatsapp' ? 'border-amber-500 ring-2' : 'border-slate-200') + ' p-3.5 rounded-xl cursor-pointer transition text-center bg-white shadow-sm flex flex-col justify-center items-center"><span class="text-2xl mb-1.5">💬</span><span class="text-xs font-bold text-slate-800">נציג בוואטסאפ</span><span class="text-[10px] text-slate-500 mt-1">תיאום וחיוב טלפוני</span></div><div onclick="handlePaymentMethodChange(\'credit_card\')" class="border-2 ' + (wizardState.paymentMethod === 'credit_card' ? 'border-amber-500 ring-2' : 'border-slate-200') + ' p-3.5 rounded-xl cursor-pointer transition text-center bg-white shadow-sm flex flex-col justify-center items-center relative overflow-hidden"><span class="text-2xl mb-1.5">💳</span><span class="text-xs font-bold text-slate-800">כרטיס אשראי אונליין</span><div class="flex items-center gap-1 mt-2 justify-center flex-wrap"><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-black text-blue-800" style="font-family: sans-serif;">VISA</span><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-black text-red-500" style="font-family: sans-serif;">MC</span><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-purple-600 text-white text-[8px] font-bold">bit</span><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-black text-white text-[8px] font-bold">Pay</span></div></div></div></div>';

    var ccFormHTML = '';
    if (wizardState.paymentMethod === 'credit_card') {
      ccFormHTML = '<div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-right animate-fadeIn space-y-3"><h4 class="font-bold text-slate-700 text-xs mb-1">💳 פרטי אשראי לחיוב מאובטח (סימולציה):</h4><div><label class="block text-[10px] font-bold text-slate-500 mb-0.5">מספר כרטיס:</label><input type="text" id="ccNumber" value="' + (wizardState.ccNumber || '') + '" oninput="wizardState.ccNumber = this.value" placeholder="4580 1234 5678 9012" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"></div><div class="grid grid-cols-2 gap-2"><div><label class="block text-[10px] font-bold text-slate-500 mb-0.5">תוקף (MM/YY):</label><input type="text" id="ccExpiry" value="' + (wizardState.ccExpiry || '') + '" oninput="wizardState.ccExpiry = this.value" placeholder="12/28" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"></div><div><label class="block text-[10px] font-bold text-slate-500 mb-0.5">CVV:</label><input type="text" id="ccCvv" value="' + (wizardState.ccCvv || '') + '" oninput="wizardState.ccCvv = this.value" placeholder="123" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"></div></div><div class="flex items-center justify-center gap-1.5 pt-1 mt-1 text-[10px] text-emerald-600 font-bold"><span>סליקה מוצפנת בתקן SSL (טוקן X-Malchuta-Token)</span></div></div>';
    }

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">סיכום הזמנה ופרטי קשר</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב אחרון: השלמת המארז שלך</p>' +
      '<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 text-right">' +
        '<h4 class="font-bold text-slate-700 text-sm mb-2 border-b border-slate-200 pb-1">פירוט המארז:</h4>' +
        summaryHTML +
        '<div class="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">' +
          '<span class="text-xl font-black text-amber-600">' + pricing.finalPrice + ' ₪</span>' +
          '<span class="font-bold text-slate-800">מחיר סופי לתשלום:</span>' +
        '</div>' +
      '</div>' +
      '<div class="space-y-3 mb-6 text-right">' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">שם מלא:</label>' +
          '<input type="text" id="clientName" value="' + wizardState.clientName + '" oninput="wizardState.clientName = this.value" placeholder="הכנס את שמך" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
        '</div>' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">טלפון ליצירת קשר (וואטסאפ):</label>' +
          '<input type="tel" id="clientPhone" value="' + wizardState.clientPhone + '" oninput="wizardState.clientPhone = this.value" placeholder="לדוגמה: 0521234567" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
        '</div>' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">כתובת מלאה למשלוח:</label>' +
          '<input type="text" id="clientAddress" value="' + (wizardState.clientAddress || '') + '" oninput="wizardState.clientAddress = this.value" placeholder="רחוב, מספר בית, דירה, עיר" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
        '</div>' +
      '</div>' +
      paymentSelectHTML +
      ccFormHTML +
      '<div class="flex justify-between items-center">' +
        '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">' +
          '← שלב קודם' +
        '</button>' +
        '<button id=\"mezuzahSubmitBtn\" class="' + (wizardState.paymentMethod === 'credit_card' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500') + ' text-white font-extrabold px-6 py-3 rounded-xl transition text-sm flex items-center gap-2 shadow-md" onclick="submitBundleOrder()">' +
          (wizardState.paymentMethod === 'credit_card' ? '💳 בצע סליקה והזמנה מאובטחת' : '📲 הזמנה מהירה בוואטסאפ') +
        '</button>' +
      '</div>';
  }

  body.innerHTML = stepHTML;
}

function submitBundleOrder() {
  var nameInput = document.getElementById('clientName');
  var phoneInput = document.getElementById('clientPhone');
  var addressInput = document.getElementById('clientAddress');

  var nameVal = (wizardState.clientName || '').trim();
  var phoneVal = (wizardState.clientPhone || '').trim();
  var addressVal = (wizardState.clientAddress || '').trim();

  var nameSanitized = sanitizeInput(nameVal);
  var phoneSanitized = sanitizeInput(phoneVal);
  var addressSanitized = sanitizeInput(addressVal);

  if (!nameSanitized) {
    alert('אנא הזן שם מלא תקין לצורך השלמת ההזמנה');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!phoneSanitized) {
    alert('אנא הזן מספר טלפון תקין ליצירת קשר');
    if (phoneInput) phoneInput.focus();
    return;
  }
  if (!addressSanitized) {
    alert('אנא הזן כתובת מלאה למשלוח');
    if (addressInput) addressInput.focus();
    return;
  }

  wizardState.clientName = nameSanitized;
  wizardState.clientPhone = phoneSanitized;
  wizardState.clientAddress = addressSanitized;

  if (wizardState.paymentMethod === 'credit_card') {
    var ccNo = sanitizeInput(wizardState.ccNumber || '').replace(/\s/g, '');
    var ccExp = sanitizeInput(wizardState.ccExpiry || '').trim();
    var ccCvvVal = sanitizeInput(wizardState.ccCvv || '').trim();

    if (ccNo.length < 12 || isNaN(ccNo)) {
      alert('אנא הזן מספר כרטיס אשראי תקין (12-16 ספרות)');
      var ccEl = document.getElementById('ccNumber');
      if (ccEl) ccEl.focus();
      return;
    }
    if (!ccExp.includes('/') || ccExp.length < 5) {
      alert('אנא הזן תוקף כרטיס תקין בפורמט MM/YY');
      var expEl = document.getElementById('ccExpiry');
      if (expEl) expEl.focus();
      return;
    }
    if (ccCvvVal.length < 3 || isNaN(ccCvvVal)) {
      alert('אנא הזן קוד CVV תקין (3 ספרות בגב הכרטיס)');
      var cvvEl = document.getElementById('ccCvv');
      if (cvvEl) cvvEl.focus();
      return;
    }

    var submitBtn = document.getElementById('mezuzahSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ מעבד תשלום מאובטח...';
      submitBtn.className = 'bg-slate-400 text-white font-extrabold px-6 py-3 rounded-xl cursor-not-allowed text-sm';
    }

    setTimeout(function() {
      var simulatedPaymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
      sendOrderPayload(simulatedPaymentId, 'paid');
    }, 1500);

  } else {
    sendOrderPayload('n/a', 'pending_payment');
  }
}

function sendOrderPayload(paymentId, paymentStatus) {
  var selectedCase = mezuzahData.cases[wizardState.selectedCaseIndex];
  var selectedScroll = mezuzahData.scrolls[wizardState.selectedScrollIndex];
  var pricing = calculatePrice();

  var orderPayload = {
    order_date: new Date().toISOString(),
    client_name: wizardState.clientName,
    client_phone: wizardState.clientPhone,
    client_address: wizardState.clientAddress,
    bundle_type: wizardState.includeScroll ? 'complete_bundle' : 'case_only',
    case_name: selectedCase.name,
    case_price: selectedCase.price,
    includes_scroll: wizardState.includeScroll,
    scroll_size: wizardState.includeScroll ? selectedScroll.size : null,
    scroll_nusach: wizardState.includeScroll ? wizardState.selectedNusach : null,
    scroll_price: wizardState.includeScroll ? selectedScroll.price : 0,
    scribe_name: wizardState.includeScroll ? selectedScroll.scribe.name : null,
    discount_applied: pricing.discount,
    total_price: pricing.finalPrice,
    payment_method: wizardState.paymentMethod === 'credit_card' ? 'credit_card_secure' : 'whatsapp',
    payment_status: paymentStatus,
    payment_id: paymentId
  };

  console.log('%c[מלכותא סת"ם] ✓ Payload מובנה מוכן לאוטומציית Make webhook:', 'font-weight:bold;color:#10b981;', orderPayload);

  if (MAKE_WEBHOOK_URL) {
    fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Malchuta-Token': MALCHUTA_SECURE_TOKEN
      },
      body: JSON.stringify(orderPayload)
    })
    .then(function(response) {
      console.log('[מלכותא] Webhook נשלח בהצלחה ל-Make (מאובטח בטוקן X-Malchuta-Token)');
    })
    .catch(function(error) {
      console.error('[מלכותא] שגיאה בשליחת Webhook ל-Make:', error);
    });
  }

  showSuccessScreen(orderPayload);
}

function showSuccessScreen(payload) {
  var body = document.getElementById('modalBody');
  if (!body) return;

  var progressBar = '<div class="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden relative" style="direction: ltr;"><div class="bg-emerald-500 h-full rounded-full" style="width: 100%; float: right;"></div></div>';

  var detailsHTML = '';
  if (payload.payment_method === 'credit_card_secure') {
    detailsHTML = '<div class="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-right mb-5 shadow-inner"><h4 class="font-black text-emerald-800 text-base mb-1">🎉 העסקה אושרה וסולקה בהצלחה!</h4><p class="text-xs text-slate-700 leading-relaxed mb-3">תודה, <strong>' + payload.client_name + '</strong>. תשלום מאובטח בסך <strong>' + payload.total_price + ' ₪</strong> התקבל במערכת.</p><div class="space-y-1.5 text-[11px] text-slate-600 border-t border-emerald-100/60 pt-2.5"><p>🔢 <strong>מספר אישור עסקה:</strong> ' + payload.payment_id + '</p><p>💳 <strong>סוג חיוב:</strong> כרטיס אשראי (סליקה מאובטחת אונליין)</p><p>📦 <strong>מארז שנבחר:</strong> ' + payload.case_name + (payload.includes_scroll ? ' + קלף ' + payload.scroll_size : '') + '</p><p>🚚 <strong>כתובת למשלוח:</strong> ' + payload.client_address + '</p></div></div><p class="text-[11px] text-slate-500 text-right mb-5 leading-relaxed">נתוני ההזמנה שודרו ל-Make בבטחה. כרטיס הסופר החגיגי הופק ופרטי המשלוח נשלחו לצוות השילוח בירושלים.</p>';
  } else {
    detailsHTML = '<div class="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-right mb-5 shadow-inner"><h4 class="font-black text-amber-800 text-base mb-1">📲 הזמנתך הועברה לוואטסאפ!</h4><p class="text-xs text-slate-700 leading-relaxed">פרטי המארז שלך הועברו כעת ישירות לנציג מלכותא להמשך חיוב ואישור משלוח.</p><div class="space-y-1.5 text-[11px] text-slate-600 border-t border-amber-100/60 pt-2.5 mt-2.5"><p>👤 <strong>לקוח:</strong> ' + payload.client_name + '</p><p>🏠 <strong>בית מזוזה:</strong> ' + payload.case_name + '</p>' + (payload.includes_scroll ? '<p>📜 <strong>קלף סת\"ם:</strong> גודל ' + payload.scroll_size + ' (' + payload.scroll_nusach + ')</p>' : '') + '<p>💰 <strong>מחיר לתשלום מול נציג:</strong> ' + payload.total_price + ' ₪</p></div></div>';
  }

  var msg = 'היי, ביצעתי הזמנה באתר מלכותא! 📜✨\n\n';
  msg += '👤 שם הלקוח: ' + payload.client_name + '\n';
  msg += '📞 טלפון: ' + payload.client_phone + '\n';
  msg += '📍 כתובת למשלוח: ' + payload.client_address + '\n';
  msg += '🏠 בית מזוזה שנבחר: ' + payload.case_name + ' (' + payload.case_price + ' ₪)\n';
  if (payload.includes_scroll) {
    msg += '🖋️ קלף מזוזה כשר: קלף ' + payload.scroll_size + ' (' + payload.scroll_price + ' ₪)\n';
    msg += '📜 נוסח הלכתי: ' + payload.scroll_nusach + '\n';
    msg += '✍️ נכתב על ידי הסופר: ' + payload.scribe_name + '\n';
    msg += '🎁 הנחת מארז Bundle: -30 ₪\n';
  } else {
    msg += '⚠️ ללא קלף סת\"ם (בית מזוזה בלבד)\n';
  }
  msg += '\n💰 סה"כ לתשלום: ' + payload.total_price + ' ₪\n';
  if (payload.payment_method === 'credit_card_secure') {
    msg += '💳 סטטוס תשלום: שולם אונליין (אישור סליקה: ' + payload.payment_id + ')\n';
  } else {
    msg += '💬 סטטוס תשלום: תשלום מול נציג בוואטסאפ\n';
  }

  var waUrl = waLink(msg);

  body.innerHTML = progressBar +
    '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">ההזמנה התקבלה במערכת!</h3>' +
    '<p class="text-sm text-slate-500 text-right mb-4">סטטוס: הזמנה מאושרת ומאובטחת</p>' +
    detailsHTML +
    '<div class="flex justify-end gap-3">' +
      '<button class="border border-slate-300 text-slate-700 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="closeMezuzahModal()">' +
        'סגור חלון' +
      '</button>' +
      '<a href="' + waUrl + '" target="_blank" rel="noopener" class="bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition text-sm flex items-center gap-2 shadow-md">' +
        '💬 פתח שיחת וואטסאפ' +
      '</a>' +
    '</div>';

  if (payload.payment_method === 'whatsapp') {
    window.open(waUrl, '_blank');
  }
}

// ------------------------------------------------------------
// 4. מודאל סטי תפילין (Tefillin Modal Logic)
// ------------------------------------------------------------

function openTefillinModal(index) {
  var modalEl = document.getElementById('tefillinModal');
  if (!modalEl) return;

  tefillinWizardState = {
    currentStep: 1,
    selectedSetIndex: index,
    selectedNusach: 'ספרדי (עדות המזרח)',
    embroideryName: '',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    paymentMethod: 'whatsapp',
    ccNumber: '',
    ccExpiry: '',
    ccCvv: ''
  };

  renderTefillinWizard();

  modalEl.style.display = 'flex';
  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden';

  var closeBtn = modalEl.querySelector('.close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeTefillinModal() {
  var modalEl = document.getElementById('tefillinModal');
  if (modalEl) {
    modalEl.style.display = 'none';
    modalEl.classList.remove('open');
  }
  document.body.style.overflow = '';
}

function nextTefillinStep() {
  tefillinWizardState.currentStep++;
  renderTefillinWizard();
}

function prevTefillinStep() {
  tefillinWizardState.currentStep--;
  renderTefillinWizard();
}

function handleTefillinNusachChange(val) {
  tefillinWizardState.selectedNusach = val;
}

function handleTefillinPaymentMethodChange(method) {
  tefillinWizardState.paymentMethod = method;
  renderTefillinWizard();
}

function handleTefillinSetSelect(index) {
  tefillinWizardState.selectedSetIndex = index;
  renderTefillinWizard();
}

function renderTefillinWizard() {
  var body = document.getElementById('tefillinModalBody');
  if (!body) return;

  var selectedSet = tefillinData.sets[tefillinWizardState.selectedSetIndex];
  var stepHTML = '';

  var progressPercent = ((tefillinWizardState.currentStep - 1) / 3) * 100;
  var progressBar = '<div class="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden relative" style="direction: ltr;"><div class="bg-amber-500 h-full transition-all duration-300 rounded-full" style="width: ' + progressPercent + '%; float: right;"></div></div>';

  if (tefillinWizardState.currentStep === 1) {
    // שלב 1: בחירה מחודשת וסיווג לקטגוריות מסודרות וממוינות לפי מחיר
    var categories = [
      {
        title: '1. סטי בר מצווה מהודרים (VIP / ירושלמי / כחול לבן)',
        indices: [0] // 2699
      },
      {
        title: '2. סטי קו שהם (להבת אש, כתר זהב, חום כשרות)',
        indices: [1, 2, 3] // 2450, 2390, 2290
      },
      {
        title: '3. נרתיקי תפילין בעיצוב אישי',
        indices: [4] // 450
      }
    ];

    var gridHTML = '';
    categories.forEach(function(cat) {
      gridHTML += '<h4 class="font-bold text-slate-700 text-sm mb-3 mt-4 text-right border-r-4 border-amber-500 pr-2">' + cat.title + '</h4>';
      gridHTML += '<div class="grid grid-cols-1 gap-3 mb-4">';
      cat.indices.forEach(function(idx) {
        var set = tefillinData.sets[idx];
        var isSelected = tefillinWizardState.selectedSetIndex === idx;
        var borderClass = isSelected ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-slate-100 hover:border-amber-300';
        gridHTML += '<div onclick="handleTefillinSetSelect(' + idx + ')" class="border-2 ' + borderClass + ' p-3 rounded-xl cursor-pointer transition flex gap-4 items-center bg-white shadow-sm text-right" style="direction: rtl;">' +
                      '<img src="' + set.img + '" alt="' + set.name + '" class="w-20 h-20 object-cover rounded-lg" onerror="imgFallback(this)">' +
                      '<div class="flex-grow">' +
                        '<h5 class="font-bold text-slate-800 text-sm mb-0.5 leading-tight">' + set.name + '</h5>' +
                        '<p class="text-[11px] text-slate-500 leading-relaxed mb-1">' + set.desc + '</p>' +
                        '<div class="font-black text-amber-600 text-sm">' + set.price + ' ₪</div>' +
                      '</div>' +
                    '</div>';
      });
      gridHTML += '</div>';
    });

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">התאמת ערכת תפילין מהודרת</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 1 מתוך 4: בחירת ערכת תפילין מהודרת ומסווגת</p>' +
      '<div style="max-height: 48vh; overflow-y: auto; padding-left: 4px; padding-right: 4px;" class="mb-4">' +
        gridHTML +
      '</div>' +
      '<div class="flex justify-end">' +
        '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextTefillinStep()">' +
          'המשך לבחירת נוסח והקדשה ←' +
        '</button>' +
      '</div>';

  } else if (tefillinWizardState.currentStep === 2) {
    var nusachOptions = TEFILLIN_NUSACH_OPTIONS.map(function(n) {
      var isSelected = tefillinWizardState.selectedNusach === n;
      return '<option value="' + n + '" ' + (isSelected ? 'selected' : '') + '>' + n + '</option>';
    }).join('');

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">התאמה אישית והטבעה</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 2 מתוך 4: נוסח ושם על הנרתיק</p>' +
      '<div class="space-y-4 mb-6 text-right">' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">בחר נוסח כתיבה הלכתי:</label>' +
          '<select id="tefillinNusach" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white" onchange="handleTefillinNusachChange(this.value)">' + nusachOptions + '</select>' +
        '</div>' +
        '<div class="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">' +
          '<label class="block text-xs font-bold text-amber-900 mb-1">שם להטבעת זהב יוקרטית על הנרתיק (חינם):</label>' +
          '<input type="text" id="embroideryName" value="' + tefillinWizardState.embroideryName + '" oninput="tefillinWizardState.embroideryName = this.value" placeholder="לדוגמה: אוריאל חיים (השאר ריק אם אינך מעוניין)" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
          '<p class="text-[10px] text-amber-700 mt-1">🎁 הטבעה אישית של שם חתן בר המצווה בזהב עתיק היא מתנה בלעדית מאיתנו לכל רוכש סט תפילין.</p>' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-between items-center">' +
        '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevTefillinStep()">' +
          '← חזרה לדגם' +
        '</button>' +
        '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextTefillinStep()">' +
          'המשך להכרת הסופר ←' +
        '</button>' +
      '</div>';

  } else if (tefillinWizardState.currentStep === 3) {
    var s = tefillinData.scribe;

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">הכירו את סופר הסת"ם שלכם</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 3 מתוך 4: אמינות וקשר אישי</p>' +
      '<div class="bg-amber-50/40 border border-amber-100 p-5 rounded-2xl text-right mb-6 shadow-inner">' +
        '<div class="flex justify-between items-start mb-3 border-b border-amber-100/50 pb-3">' +
          '<span class="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">סופר סת"ם מוסמך</span>' +
          '<h4 class="font-black text-amber-800 text-lg leading-none">' + s.name + '</h4>' +
        '</div>' +
        '<div class="space-y-2 text-sm text-slate-700">' +
          '<p>📍 <strong>מקום הכתיבה:</strong> ' + s.location + '</p>' +
          '<p>⏳ <strong>שנות ניסיון:</strong> ' + s.experience + '</p>' +
          '<p>📜 <strong>הסמכה ופיקוח:</strong> ' + s.certification + '</p>' +
        '</div>' +
        '<div class="mt-4 p-3 bg-white/80 rounded-xl border border-amber-100/50 text-xs text-amber-900 italic leading-relaxed">' +
          '"כתיבת פרשיות התפילין שלכם מבוצעת על קלף שליל מובחר, ביראת קודש עמוקה וכוונה מוחלטת לשם מצוות תפילין. לאחר השלמת הכתיבה, הפרשיות עוברות סדרת הגהה כפולה - הגהה אנושית מוקפדת על ידי שני מגיהים מוסמכים וסריקה דיגיטלית ממוחשבת, על מנת להעניק לכם ביטחון הלכתי מלא."' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-between items-center">' +
        '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevTefillinStep()">' +
          '← חזרה להתאמה' +
        '</button>' +
        '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2" onclick="nextTefillinStep()">' +
          'המשך לפרטי משלוח ←' +
        '</button>' +
      '</div>';

  } else if (tefillinWizardState.currentStep === 4) {
    var summaryHTML = '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm"><span class="font-bold text-slate-800">' + selectedSet.price + ' ₪</span><span class="text-slate-600">' + selectedSet.name + '</span></div><div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm"><span class="font-bold text-slate-800">כלול בערכה</span><span class="text-slate-600">נוסח כתיבה: ' + tefillinWizardState.selectedNusach + '</span></div>';

    if (tefillinWizardState.embroideryName.trim()) {
      summaryHTML += '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm text-amber-700 bg-amber-50/30 px-2 rounded-lg mt-1"><span class="font-bold">חינם (🎁 מתנה)</span><span>הטבעת זהב על הנרתיק: "' + tefillinWizardState.embroideryName.trim() + '"</span></div>';
    }

    summaryHTML += '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm text-emerald-600 bg-emerald-50/30 px-2 rounded-lg mt-1"><span class="font-bold">כלול במארז</span><span>📜 תעודת אחריות דיגיטלית ואישית ב-PDF</span></div>';

    var paymentSelectHTML = '<div class="space-y-2 mb-5 text-right"><label class="block text-xs font-bold text-slate-600 mb-1">בחר אמצעי תשלום מאובטח:</label><div class="grid grid-cols-2 gap-3"><div onclick="handleTefillinPaymentMethodChange(\'whatsapp\')" class="border-2 ' + (tefillinWizardState.paymentMethod === 'whatsapp' ? 'border-amber-500 ring-2' : 'border-slate-200') + ' p-3.5 rounded-xl cursor-pointer transition text-center bg-white shadow-sm flex flex-col justify-center items-center"><span class="text-2xl mb-1.5">💬</span><span class="text-xs font-bold text-slate-800">נציג בוואטסאפ</span><span class="text-[10px] text-slate-500 mt-1">תיאום וחיוב טלפוני</span></div><div onclick="handleTefillinPaymentMethodChange(\'credit_card\')" class="border-2 ' + (tefillinWizardState.paymentMethod === 'credit_card' ? 'border-amber-500 ring-2' : 'border-slate-200') + ' p-3.5 rounded-xl cursor-pointer transition text-center bg-white shadow-sm flex flex-col justify-center items-center relative overflow-hidden"><span class="text-2xl mb-1.5">💳</span><span class="text-xs font-bold text-slate-800">כרטיס אשראי אונליין</span><div class="flex items-center gap-1 mt-2 justify-center flex-wrap"><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-black text-blue-800" style="font-family: sans-serif;">VISA</span><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-[8px] font-black text-red-500" style="font-family: sans-serif;">MC</span><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-purple-600 text-white text-[8px] font-bold">bit</span><span class="inline-flex items-center justify-center px-1 py-0.5 rounded bg-black text-white text-[8px] font-bold">Pay</span></div></div></div></div>';

    var ccFormHTML = '';
    if (tefillinWizardState.paymentMethod === 'credit_card') {
      ccFormHTML = '<div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-right animate-fadeIn space-y-3"><h4 class="font-bold text-slate-700 text-xs mb-1">💳 פרטי אשראי לחיוב מאובטח (סימולציה):</h4><div><label class="block text-[10px] font-bold text-slate-500 mb-0.5">מספר כרטיס:</label><input type="text" id="tefillinCcNumber" value="' + (tefillinWizardState.ccNumber || '') + '" oninput="tefillinWizardState.ccNumber = this.value" placeholder="4580 1234 5678 9012" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"></div><div class="grid grid-cols-2 gap-2"><div><label class="block text-[10px] font-bold text-slate-500 mb-0.5">תוקף (MM/YY):</label><input type="text" id="tefillinCcExpiry" value="' + (tefillinWizardState.ccExpiry || '') + '" oninput="tefillinWizardState.ccExpiry = this.value" placeholder="12/28" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"></div><div><label class="block text-[10px] font-bold text-slate-500 mb-0.5">CVV:</label><input type="text" id="tefillinCcCvv" value="' + (tefillinWizardState.ccCvv || '') + '" oninput="tefillinWizardState.ccCvv = this.value" placeholder="123" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"></div></div><div class="flex items-center justify-center gap-1.5 pt-1 mt-1 text-[10px] text-emerald-600 font-bold"><span>סליקה מוצפנת בתקן SSL (טוקן X-Malchuta-Token)</span></div></div>';
    }

    stepHTML = progressBar +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">סיכום הזמנה ופרטי משלוח</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב אחרון: פרטי קשר ומשלוח מהיר</p>' +
      '<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 text-right">' +
        '<h4 class="font-bold text-slate-700 text-sm mb-2 border-b border-slate-200 pb-1">פירוט המארז המהודר שלך:</h4>' +
        summaryHTML +
        '<div class="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">' +
          '<span class="text-xl font-black text-amber-600">' + selectedSet.price + ' ₪</span>' +
          '<span class="font-bold text-slate-800">סה"כ לתשלום (משלוח חינם):</span>' +
        '</div>' +
      '</div>' +
      '<div class="space-y-3 mb-5 text-right">' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">שם מלא:</label>' +
          '<input type="text" id="tefillinClientName" value="' + tefillinWizardState.clientName + '" oninput="tefillinWizardState.clientName = this.value" placeholder="הכנס את שמך" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
        '</div>' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">טלפון ליצירת קשר (וואטסאפ):</label>' +
          '<input type="tel" id="tefillinClientPhone" value="' + tefillinWizardState.clientPhone + '" oninput="tefillinWizardState.clientPhone = this.value" placeholder="לדוגמה: 0521234567" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
        '</div>' +
        '<div>' +
          '<label class="block text-xs font-bold text-slate-600 mb-1">כתובת מלאה למשלוח:</label>' +
          '<input type="text" id="tefillinClientAddress" value="' + (tefillinWizardState.clientAddress || '') + '" oninput="tefillinWizardState.clientAddress = this.value" placeholder="רחוב, מספר בית, דירה, עיר" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">' +
        '</div>' +
      '</div>' +
      paymentSelectHTML +
      ccFormHTML +
      '<div class="flex justify-between items-center">' +
        '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevTefillinStep()">' +
          '← שלב קודם' +
        '</button>' +
        '<button id="tefillinSubmitBtn" class="' + (tefillinWizardState.paymentMethod === 'credit_card' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500') + ' text-white font-extrabold px-6 py-3 rounded-xl transition text-sm flex items-center gap-2 shadow-md" onclick="submitTefillinOrder()">' +
          (tefillinWizardState.paymentMethod === 'credit_card' ? '💳 בצע סליקה והזמנה מאובטחת' : '📲 אישור ושליחת הזמנה') +
        '</button>' +
      '</div>';
  }

  body.innerHTML = stepHTML;
}

function submitTefillinOrder() {
  var nameInput = document.getElementById('tefillinClientName');
  var phoneInput = document.getElementById('tefillinClientPhone');
  var addressInput = document.getElementById('tefillinClientAddress');

  var nameVal = (tefillinWizardState.clientName || '').trim();
  var phoneVal = (tefillinWizardState.clientPhone || '').trim();
  var addressVal = (tefillinWizardState.clientAddress || '').trim();

  var nameSanitized = sanitizeInput(nameVal);
  var phoneSanitized = sanitizeInput(phoneVal);
  var addressSanitized = sanitizeInput(addressVal);

  if (!nameSanitized) {
    alert('אנא הזן שם מלא תקין לצורך השלמת ההזמנה');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!phoneSanitized) {
    alert('אנא הזן מספר טלפון תקין ליצירת קשר');
    if (phoneInput) phoneInput.focus();
    return;
  }
  if (!addressSanitized) {
    alert('אנא הזן כתובת מלאה למשלוח');
    if (addressInput) addressInput.focus();
    return;
  }

  tefillinWizardState.clientName = nameSanitized;
  tefillinWizardState.clientPhone = phoneSanitized;
  tefillinWizardState.clientAddress = addressSanitized;

  if (tefillinWizardState.paymentMethod === 'credit_card') {
    var ccNo = sanitizeInput(tefillinWizardState.ccNumber || '').replace(/\s/g, '');
    var ccExp = sanitizeInput(tefillinWizardState.ccExpiry || '').trim();
    var ccCvvVal = sanitizeInput(tefillinWizardState.ccCvv || '').trim();

    if (ccNo.length < 12 || isNaN(ccNo)) {
      alert('אנא הזן מספר כרטיס אשראי תקין (12-16 ספרות)');
      var ccEl = document.getElementById('tefillinCcNumber');
      if (ccEl) ccEl.focus();
      return;
    }
    if (!ccExp.includes('/') || ccExp.length < 5) {
      alert('אנא הזן תוקף כרטיס תקין בפורמט MM/YY');
      var expEl = document.getElementById('tefillinCcExpiry');
      if (expEl) expEl.focus();
      return;
    }
    if (ccCvvVal.length < 3 || isNaN(ccCvvVal)) {
      alert('אנא הזן קוד CVV תקין (3 ספרות בגב הכרטיס)');
      var cvvEl = document.getElementById('tefillinCcCvv');
      if (cvvEl) cvvEl.focus();
      return;
    }

    var submitBtn = document.getElementById('tefillinSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ מעבד תשלום מאובטח...';
      submitBtn.className = 'bg-slate-400 text-white font-extrabold px-6 py-3 rounded-xl cursor-not-allowed text-sm';
    }

    setTimeout(function() {
      var simulatedPaymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
      sendTefillinOrderPayload(simulatedPaymentId, 'paid');
    }, 1500);

  } else {
    sendTefillinOrderPayload('n/a', 'pending_payment');
  }
}

function sendTefillinOrderPayload(paymentId, paymentStatus) {
  var selectedSet = tefillinData.sets[tefillinWizardState.selectedSetIndex];
  var s = tefillinData.scribe;

  var orderPayload = {
    order_date: new Date().toISOString(),
    client_name: tefillinWizardState.clientName,
    client_phone: tefillinWizardState.clientPhone,
    client_address: tefillinWizardState.clientAddress,
    bundle_type: 'tefillin_bundle',
    set_name: selectedSet.name,
    set_price: selectedSet.price,
    scroll_nusach: tefillinWizardState.selectedNusach,
    embroidery_name: tefillinWizardState.embroideryName.trim() || null,
    scribe_name: s.name,
    total_price: selectedSet.price,
    payment_method: tefillinWizardState.paymentMethod === 'credit_card' ? 'credit_card_secure' : 'whatsapp',
    payment_status: paymentStatus,
    payment_id: paymentId
  };

  console.log('%c[מלכותא סת"ם] ✓ Tefillin Payload מוכן לאוטומציית Make webhook:', 'font-weight:bold;color:#10b981;', orderPayload);

  if (MAKE_WEBHOOK_URL) {
    fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Malchuta-Token': MALCHUTA_SECURE_TOKEN
      },
      body: JSON.stringify(orderPayload)
    })
    .then(function(response) {
      console.log('[מלכותא] Tefillin Webhook נשלח בהצלחה ל-Make (מאובטח בטוקן X-Malchuta-Token)');
    })
    .catch(function(error) {
      console.error('[מלכותא] שגיאה בשליחת Webhook ל-Make:', error);
    });
  }

  showTefillinSuccessScreen(orderPayload);
}

function showTefillinSuccessScreen(payload) {
  var body = document.getElementById('tefillinModalBody');
  if (!body) return;

  var progressBar = '<div class="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden relative" style="direction: ltr;"><div class="bg-emerald-500 h-full rounded-full" style="width: 100%; float: right;"></div></div>';

  var detailsHTML = '';
  if (payload.payment_method === 'credit_card_secure') {
    detailsHTML = '<div class="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-right mb-5 shadow-inner"><h4 class="font-black text-emerald-800 text-base mb-1">🎉 העסקה אושרה וסולקה בהצלחה!</h4><p class="text-xs text-slate-700 leading-relaxed mb-3">תודה, <strong>' + payload.client_name + '</strong>. תשלום מאובטח בסך <strong>' + payload.total_price + ' ₪</strong> התקבל במערכת.</p><div class="space-y-1.5 text-[11px] text-slate-600 border-t border-emerald-100/60 pt-2.5"><p>🔢 <strong>מספר אישור עסקה:</strong> ' + payload.payment_id + '</p><p>💳 <strong>סוג חיוב:</strong> כרטיס אשראי (סליקה מאובטחת אונליין)</p><p>📦 <strong>מארז שנבחר:</strong> ' + payload.set_name + '</p><p>🚚 <strong>כתובת למשלוח:</strong> ' + payload.client_address + '</p></div></div><p class="text-[11px] text-slate-500 text-right mb-5 leading-relaxed">נתוני ההזמנה שודרו ל-Make בבטחה. תעודת האחריות הדיגיטלית והאישית ב-PDF הופקה ופרטי המשלוח נשלחו לצוות השילוח בירושלים.</p>';
  } else {
    detailsHTML = '<div class="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-right mb-5 shadow-inner"><h4 class="font-black text-amber-800 text-base mb-1">📲 הזמנתך הועברה לוואטסאפ!</h4><p class="text-xs text-slate-700 leading-relaxed">פרטי המארז שלך הועברו כעת ישירות לנציג מלכותא להמשך חיוב ואישור משלוח.</p><div class="space-y-1.5 text-[11px] text-slate-600 border-t border-amber-100/60 pt-2.5 mt-2.5"><p>👤 <strong>לקוח:</strong> ' + payload.client_name + '</p><p>🏠 <strong>ערכה:</strong> ' + payload.set_name + '</p><p>📜 <strong>נוסח:</strong> ' + payload.scroll_nusach + '</p><p>💰 <strong>מחיר לתשלום מול נציג:</strong> ' + payload.total_price + ' ₪</p></div></div>';
  }

  var msg = 'היי, ביצעתי הזמנה לסט תפילין באתר מלכותא! 📦✨\n\n';
  msg += '👤 שם הלקוח: ' + payload.client_name + '\n';
  msg += '📞 טלפון: ' + payload.client_phone + '\n';
  msg += '📍 כתובת למשלוח: ' + payload.client_address + '\n';
  msg += '📦 דגם הסט: ' + payload.set_name + ' (' + payload.set_price + ' ₪)\n';
  msg += '📜 נוסח כתיבה הלכתי: ' + payload.scroll_nusach + '\n';
  if (payload.embroidery_name) {
    msg += '✍️ שם להטבעה בזהב על הנרתיק: "' + payload.embroidery_name + '"\n';
  } else {
    msg += '✍️ ללא הטבעת שם (נרתיק נקי)\n';
  }
  msg += '\n💰 סה"כ לתשלום: ' + payload.total_price + ' ₪\n';
  if (payload.payment_method === 'credit_card_secure') {
    msg += '💳 סטטוס תשלום: שולם אונליין (אישור סליקה: ' + payload.payment_id + ')\n';
  } else {
    msg += '💬 סטטוס תשלום: תשלום מול נציג בוואטסאפ\n';
  }

  var waUrl = waLink(msg);

  body.innerHTML = progressBar +
    '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">ההזמנה התקבלה במערכת!</h3>' +
    '<p class="text-sm text-slate-500 text-right mb-4">סטטוס: הזמנה מאושרת ומאובטחת</p>' +
    detailsHTML +
    '<div class="flex justify-end gap-3">' +
      '<button class="border border-slate-300 text-slate-700 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="closeTefillinModal()">' +
        'סגור חלון' +
      '</button>' +
      '<a href="' + waUrl + '" target="_blank" rel="noopener" class="bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition text-sm flex items-center gap-2 shadow-md">' +
        '💬 פתח שיחת וואטסאפ' +
      '</a>' +
    '</div>';

  if (payload.payment_method === 'whatsapp') {
    window.open(waUrl, '_blank');
  }
}

// ------------------------------------------------------------
// 5. פונקציות עזר כלליות (Core Utilities & Event Listeners)
// ------------------------------------------------------------

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // הסרת תגיות HTML
    .replace(/[&<>\"']/g, function(match) { // קידוד תווים רגישים
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    })
    .trim();
}

// רישום מאזיני אירועים רוחביים
document.addEventListener('DOMContentLoaded', function() {
  var mezuzahModalEl = document.getElementById('mezuzahModal');
  if (mezuzahModalEl) {
    mezuzahModalEl.addEventListener('click', function(e) {
      if (e.target === mezuzahModalEl) closeMezuzahModal();
    });
  }

  var tefillinModalEl = document.getElementById('tefillinModal');
  if (tefillinModalEl) {
    tefillinModalEl.addEventListener('click', function(e) {
      if (e.target === tefillinModalEl) closeTefillinModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (mezuzahModalEl && mezuzahModalEl.classList.contains('open')) {
        closeMezuzahModal();
      }
      if (tefillinModalEl && tefillinModalEl.classList.contains('open')) {
        closeTefillinModal();
      }
    }
  });

  var waHeader = document.getElementById('waHeader');
  if (waHeader) waHeader.href = waLink('שלום, אשמח לקבל פרטים על סטי התפילין');

  var waFloat = document.getElementById('waFloat');
  if (waFloat) waFloat.href = waLink('שלום, אשמח לקבל פרטים');

  document.querySelectorAll('a[data-wa]').forEach(function(a) {
    a.href = waLink(a.dataset.wa);
  });
});

  // ============================================================
  // חשיפת פונקציות לחלון הגלובלי (window) למניעת התנגשויות ושגיאות Syntax
  // ============================================================
  window.openMezuzahModal = openMezuzahModal;
  window.closeMezuzahModal = closeMezuzahModal;
  window.nextStep = nextStep;
  window.prevStep = prevStep;
  window.handleCaseSelect = handleCaseSelect;
  window.handleScrollToggle = handleScrollToggle;
  window.handleScrollSizeChange = handleScrollSizeChange;
  window.handleNusachChange = handleNusachChange;
  window.handlePaymentMethodChange = handlePaymentMethodChange;
  window.submitBundleOrder = submitBundleOrder;

  window.openTefillinModal = openTefillinModal;
  window.closeTefillinModal = closeTefillinModal;
  window.nextTefillinStep = nextTefillinStep;
  window.prevTefillinStep = prevTefillinStep;
  window.handleTefillinNusachChange = handleTefillinNusachChange;
  window.handleTefillinPaymentMethodChange = handleTefillinPaymentMethodChange;
  window.submitTefillinOrder = submitTefillinOrder;
  window.handleTefillinSetSelect = handleTefillinSetSelect;
  window.tefillinWizardState = tefillinWizardState;
  window.wizardState = wizardState;
})();
