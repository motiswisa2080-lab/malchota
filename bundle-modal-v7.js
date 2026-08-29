/* ============================================================================
   מלכותא — bundle-modal-v7.js
   מודאל הזמנות: מזוזות ותפילין
   ────────────────────────────────────────────────────────────────────────────
   מה השתנה מ-v6:

   1. הוסרה סימולציית הסליקה במלואה.
      v6 אספה מספר כרטיס אשראי, תוקף ו-CVV, המתינה 1.5 שניות, הגרילה
      מספר אקראי והציגה "🎉 העסקה אושרה וסולקה בהצלחה". איש לא חויב.
      במקומה: הצהרת העדפת תשלום. אין שדות אשראי בשום מקום.

   2. מסך הסיום אומר את האמת: "ממתין לאישור הסופר".
      אין יותר "הזמנה מאושרת ומאובטחת" לפני שיעקב ראה אותה.

   3. מספר הזמנה אמיתי (MLK-YYMMDD-XXXX) במקום ה-PAY- המזויף.

   4. כל המחירים מגיעים מ-pricing.js. אין מספר קשיח בקובץ הזה.

   5. WA_NUMBER מגיע מ-config.js. אין מספר טלפון קשיח בקובץ הזה.

   6. הוסרו שלושה סופרים בדויים עם שמות והסמכות. הסופר מגיע מ-config.js,
      והשלב מדולג אם הפרטים לא מולאו.

   7. הוסרו הודעות על מסמכים שלא נוצרו (תעודת PDF, כרטיס סופר)
      ועל "צוות שילוח" שאינו קיים. המודל הוא מסירה אישית של הסופר.

   8. הנחת ה-30 ₪ על קלף המזוזה כבויה כברירת מחדל — קלף הוא סת"ם,
      וההנחות שלנו חלות על אביזרים בלבד. דגל ב-config.js.

   תלויות:  config.js  ·  pricing.js
   ============================================================================ */

(function () {
  'use strict';

  /* ==========================================================================
     0. תצורה — הכול מגיע מבחוץ
     ========================================================================== */

  var CFG = window.MALCHUTA_CONFIG || {};
  var MP = window.MALCHUTA_PRICING || null;

  if (!CFG.WA_NUMBER) console.error('[מלכותא] config.js לא נטען — מספר וואטסאפ חסר.');
  if (!MP) console.error('[מלכותא] pricing.js לא נטען — לא יוצגו מחירים.');

  var WA_NUMBER = CFG.WA_NUMBER || '';
  var SCRIBE = CFG.SCRIBE || {};
  var PROMISES = CFG.PROMISES || {};

  var IMAGES = {
    scroll10: 'images/scrol-10cm.webp',
    scroll12: 'images/scrol-12cm.webp',
    caseBlack: 'images/case-black.webp',
    caseStone: 'images/case-stone.webp',
    caseWood: 'images/case-wood.webp'
  };

  /* ==========================================================================
     1. עזרי מחיר — הגשר ל-pricing.js
     ========================================================================== */

  function priceVal(key) { return MP ? MP.value(key) : null; }
  function priceTxt(key) { return MP ? MP.display(key) : 'בתיאום אישי'; }
  function fmt(n) { return MP ? MP.format(n) : n + ' ₪'; }

  var PENDING = 'בתיאום אישי';

  /* ==========================================================================
     2. נתוני המוצרים — מפתחות בלבד, בלי מספרים
     ========================================================================== */

  var mezuzahData = {
    scrolls: [
      { size: '10 ס"מ', key: 'mezuzah.klaf.10', img: IMAGES.scroll10 },
      { size: '12 ס"מ', key: 'mezuzah.klaf.12', img: IMAGES.scroll12 }
    ],
    cases: [
      { name: 'בטון שחור MODERN', key: 'mezuzah.case.concrete', img: IMAGES.caseBlack },
      { name: 'שיש ירושלמי קלאסי', key: 'mezuzah.case.stone', img: IMAGES.caseStone },
      { name: 'עץ זית טבעי חם', key: 'mezuzah.case.olive', img: IMAGES.caseWood }
    ]
  };

  var tefillinData = {
    sets: [
      { name: 'סט בר מצווה – קו יהלום כחול-לבן', key: 'set.yahalom.blue',
        img: 'images/set-yahalom-blue.jpg',
        desc: 'סט מהודר הכולל תפילין בהמה גסה, טלית צמר טהור, נרתיקי קטיפה/זמש כחולים, סידור וכיפה תואמת.' },
      { name: "סט קו שהם – דגם ה' כתר זהב", key: 'set.shoham.gold',
        img: 'images/set-shoham-gold.jpg',
        desc: "ערכת תפילין בגימור שמנת-זהב, כולל הטבעת האות ה' וברכת הכוהנים, סידור מהודר וכיפת זמש תואמת." },
      { name: 'סט קו שהם – דגם להבת אש', key: 'set.shoham.flame',
        img: 'images/set-shoham-cream.jpg',
        desc: 'עיצוב עם אלמנט להבת הקודש, נרתיקים בגוון שמנת-זמש עמיד, כיפה תואמת וסידור בעיטורי זהב.' },
      { name: 'סט קו שהם – דגם זמש חום כהה', key: 'set.shoham.brown',
        img: 'images/set-shoham-brown.jpg',
        desc: 'נרתיקי זמש חום עמוק בהטבעת זהב, כולל תפילין בהמה גסה, טלית איכותית וסידור בכריכת עור.' },
      { name: 'נרתיקי תפילין בעיצוב אישי', key: 'accessory.case.custom',
        img: 'images/pouch-custom-rabbi.jpg',
        desc: 'הטבעות והדפסים של דמויות צדיקים, שמות אישיים והקדשות על נרתיקי זמש וקטיפה.' }
    ]
  };

  var NUSACH_OPTIONS = ['ספרדי (עדות המזרח)', 'אשכנזי (ואליש / בית יוסף)'];
  var TEFILLIN_NUSACH_OPTIONS = ['ספרדי (עדות המזרח)', 'אשכנזי (ואליש / בית יוסף)', 'חב"ד (האר"י)'];

  var ZONES = CFG.ZONES || ['דרום', 'מרכז', 'צפון'];

  /* העדפת תשלום — הצהרה בלבד. שום חיוב לא מתבצע באתר. */
  var PAYMENT_PREFS = [
    { id: 'delivery', icon: '🤝', label: 'תשלום במעמד המסירה',
      note: 'משלמים כשהסופר מגיע' },
    { id: 'deposit', icon: '📗', label: 'מקדמה והשלמה במסירה',
      note: 'חלק מראש, היתרה בבית' },
    { id: 'upfront', icon: '✅', label: 'תשלום מלא מראש',
      note: 'קישור תשלום יישלח לאחר האישור' }
  ];

  function prefLabel(id) {
    for (var i = 0; i < PAYMENT_PREFS.length; i++) {
      if (PAYMENT_PREFS[i].id === id) return PAYMENT_PREFS[i].label;
    }
    return id;
  }

  /* ==========================================================================
     3. מצב האשפים
     ========================================================================== */

  function blankClient() {
    return {
      clientName: '', clientPhone: '', clientAddress: '',
      zone: ZONES[0], paymentPref: 'delivery', notes: ''
    };
  }

  var wizardState = {};
  var tefillinWizardState = {};

  function resetMezuzahState(type) {
    wizardState = {
      currentStep: 1, selectedCaseIndex: 0,
      includeScroll: type !== 'case', selectedScrollIndex: 1,
      selectedNusach: NUSACH_OPTIONS[0]
    };
    var c = blankClient();
    for (var k in c) wizardState[k] = c[k];
    window.wizardState = wizardState;
  }

  function resetTefillinState(index) {
    tefillinWizardState = {
      currentStep: 1, selectedSetIndex: index || 0,
      selectedNusach: TEFILLIN_NUSACH_OPTIONS[0], embroideryName: ''
    };
    var c = blankClient();
    for (var k in c) tefillinWizardState[k] = c[k];
    window.tefillinWizardState = tefillinWizardState;
  }

  /* ==========================================================================
     4. עזרים כלליים
     ========================================================================== */

  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '')
      .replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      }).trim();
  }

  function waLink(txt) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(txt);
  }

  /** מספר הזמנה אמיתי: MLK-260829-A7K2 */
  function makeOrderId() {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var stamp = String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', rnd = '';
    for (var i = 0; i < 4; i++) rnd += chars[Math.floor(Math.random() * chars.length)];
    return 'MLK-' + stamp + '-' + rnd;
  }

  function hasScribeInfo() { return !!(SCRIBE && SCRIBE.name); }

  function esc(s) { return sanitizeInput(String(s || '')); }

  /* ==========================================================================
     5. רכיבי UI משותפים
     ========================================================================== */

  function progressBarHTML(step, total, done) {
    var pct = done ? 100 : ((step - 1) / (total - 1)) * 100;
    var color = done ? 'bg-emerald-500' : 'bg-amber-500';
    return '<div class="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden" style="direction:ltr">' +
      '<div class="' + color + ' h-full transition-all duration-300 rounded-full" style="width:' +
      pct + '%;float:right"></div></div>';
  }

  /** בלוק פרטי לקוח — משותף לשני האשפים */
  function clientFieldsHTML(state, prefix) {
    var zoneOpts = ZONES.map(function (z) {
      return '<option value="' + z + '"' + (state.zone === z ? ' selected' : '') + '>' + z + '</option>';
    }).join('');

    return '<div class="space-y-3 mb-5 text-right">' +
      '<div><label class="block text-xs font-bold text-slate-600 mb-1">שם מלא:</label>' +
      '<input type="text" id="' + prefix + 'Name" value="' + esc(state.clientName) +
      '" oninput="MALCHUTA_ORDER.setField(\'' + prefix + '\',\'clientName\',this.value)" ' +
      'placeholder="הכנס את שמך" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500"></div>' +

      '<div><label class="block text-xs font-bold text-slate-600 mb-1">טלפון (וואטסאפ):</label>' +
      '<input type="tel" id="' + prefix + 'Phone" value="' + esc(state.clientPhone) +
      '" oninput="MALCHUTA_ORDER.setField(\'' + prefix + '\',\'clientPhone\',this.value)" ' +
      'placeholder="לדוגמה: 0521234567" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500"></div>' +

      '<div><label class="block text-xs font-bold text-slate-600 mb-1">כתובת למסירה:</label>' +
      '<input type="text" id="' + prefix + 'Address" value="' + esc(state.clientAddress) +
      '" oninput="MALCHUTA_ORDER.setField(\'' + prefix + '\',\'clientAddress\',this.value)" ' +
      'placeholder="רחוב, מספר בית, דירה, עיר" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500"></div>' +

      '<div><label class="block text-xs font-bold text-slate-600 mb-1">גזרת מסירה:</label>' +
      '<select class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white" ' +
      'onchange="MALCHUTA_ORDER.setField(\'' + prefix + '\',\'zone\',this.value)">' + zoneOpts + '</select></div>' +

      '<div><label class="block text-xs font-bold text-slate-600 mb-1">הערות לסופר (לא חובה):</label>' +
      '<textarea rows="2" oninput="MALCHUTA_ORDER.setField(\'' + prefix + '\',\'notes\',this.value)" ' +
      'placeholder="תאריך האירוע, בקשות מיוחדות" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500">' +
      esc(state.notes) + '</textarea></div>' +
      '</div>';
  }

  /**
   * בלוק העדפת תשלום.
   * זה מה שהחליף את טופס האשראי. אין כאן שדות כרטיס, אין סליקה,
   * ואין שום טקסט שמרמז שהתשלום בוצע.
   */
  function paymentPrefHTML(state, prefix) {
    var cards = PAYMENT_PREFS.map(function (p) {
      var sel = state.paymentPref === p.id;
      var cls = sel ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20' : 'border-slate-200 hover:border-amber-300';
      return '<div onclick="MALCHUTA_ORDER.setPref(\'' + prefix + '\',\'' + p.id + '\')" ' +
        'class="border-2 ' + cls + ' p-3 rounded-xl cursor-pointer transition text-center bg-white flex flex-col items-center justify-center">' +
        '<span class="text-xl mb-1">' + p.icon + '</span>' +
        '<span class="text-[11px] font-bold text-slate-800 leading-tight">' + p.label + '</span>' +
        '<span class="text-[10px] text-slate-500 mt-1">' + p.note + '</span></div>';
    }).join('');

    return '<div class="mb-5 text-right">' +
      '<label class="block text-xs font-bold text-slate-600 mb-2">איך נוח לך לשלם?</label>' +
      '<div class="grid grid-cols-3 gap-2">' + cards + '</div>' +
      '<p class="text-[11px] text-slate-500 mt-2 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-2.5">' +
      'זו הצהרת העדפה בלבד — לא מתבצע חיוב באתר. ' +
      'הסופר יבדוק את ההזמנה, ייצור איתך קשר לאישור סופי, ורק אז יסוכם התשלום.' +
      '</p></div>';
  }

  /* ==========================================================================
     6. תמחור
     ========================================================================== */

  function calcMezuzah() {
    var c = mezuzahData.cases[wizardState.selectedCaseIndex];
    var lines = [], total = 0, unknown = false;

    var cv = priceVal(c.key);
    lines.push({ label: 'בית מזוזה: ' + c.name, value: cv });
    if (cv === null) unknown = true; else total += cv;

    var discount = 0;
    if (wizardState.includeScroll) {
      var s = mezuzahData.scrolls[wizardState.selectedScrollIndex];
      var sv = priceVal(s.key);
      lines.push({ label: 'קלף סת"ם: ' + s.size + ' (' + wizardState.selectedNusach + ')', value: sv });
      if (sv === null) unknown = true; else total += sv;

      // ⚠️ קלף הוא מוצר סת"ם. ההנחה כבויה עד להכרעת יעקב.
      if (CFG.APPLY_KLAF_BUNDLE_DISCOUNT) {
        discount = CFG.KLAF_BUNDLE_DISCOUNT || 0;
        total -= discount;
      }
    }

    return { lines: lines, total: total, discount: discount, unknown: unknown };
  }

  function calcTefillin() {
    var set = tefillinData.sets[tefillinWizardState.selectedSetIndex];
    var v = priceVal(set.key);
    return {
      lines: [{ label: set.name, value: v }],
      total: v === null ? 0 : v,
      discount: 0,
      unknown: v === null
    };
  }

  function totalText(calc) {
    return calc.unknown ? PENDING : fmt(calc.total);
  }

  function summaryLinesHTML(calc) {
    var html = calc.lines.map(function (l) {
      return '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm">' +
        '<span class="font-bold text-slate-800">' + (l.value === null ? PENDING : fmt(l.value)) + '</span>' +
        '<span class="text-slate-600">' + l.label + '</span></div>';
    }).join('');

    if (calc.discount > 0) {
      html += '<div class="flex justify-between items-center py-2 text-sm text-emerald-600 bg-emerald-50/50 px-2 rounded-lg mt-1">' +
        '<span class="font-bold">-' + fmt(calc.discount) + '</span><span>🎁 הטבת מארז</span></div>';
    }
    if (calc.unknown) {
      html += '<div class="p-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-[11px] mt-2 text-right leading-relaxed">' +
        'חלק מהמחירים נקבעים בתיאום אישי. הסופר ימסור לך מחיר מדויק בשיחת האישור.</div>';
    }
    return html;
  }

  /**
   * שורות "כלול בהזמנה" — מונעות מ-CFG.PROMISES.
   * הניסוח תמיד מתאר מה כלול, לא מה כבר בוצע.
   * דגל כבוי = השורה פשוט לא מופיעה, בלי טקסט חלופי.
   */
  function inclusionsHTML(includeWarranty) {
    var rows = '';
    var row = function (label) {
      return '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm text-emerald-700 bg-emerald-50/30 px-2 rounded-lg mt-1">' +
        '<span class="font-bold">כלול</span><span>' + label + '</span></div>';
    };
    if (PROMISES.freeDelivery) rows += row('🚗 מסירה אישית עד הבית — ללא עלות');
    if (includeWarranty && PROMISES.warrantyPdf) rows += row('📜 תעודת אחריות');
    return rows;
  }

  /* ==========================================================================
     7. מודאל מזוזה
     ========================================================================== */

  function openMezuzahModal(type) {
    var el = document.getElementById('mezuzahModal');
    if (!el) return;
    resetMezuzahState(type);
    renderWizard();
    el.style.display = 'flex';
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    var b = el.querySelector('.close-btn'); if (b) b.focus();
  }

  function closeMezuzahModal() {
    var el = document.getElementById('mezuzahModal');
    if (el) { el.style.display = 'none'; el.classList.remove('open'); }
    document.body.style.overflow = '';
  }

  function nextStep() {
    var s = wizardState.currentStep;
    if (s === 1) wizardState.currentStep = 2;
    else if (s === 2) wizardState.currentStep = (wizardState.includeScroll && hasScribeInfo()) ? 3 : 4;
    else if (s === 3) wizardState.currentStep = 4;
    renderWizard();
  }

  function prevStep() {
    var s = wizardState.currentStep;
    if (s === 4) wizardState.currentStep = (wizardState.includeScroll && hasScribeInfo()) ? 3 : 2;
    else wizardState.currentStep = s - 1;
    renderWizard();
  }

  function handleCaseSelect(i) { wizardState.selectedCaseIndex = i; renderWizard(); }
  function handleScrollToggle(v) { wizardState.includeScroll = v; renderWizard(); }
  function handleScrollSizeChange(i) { wizardState.selectedScrollIndex = i; renderWizard(); }
  function handleNusachChange(v) { wizardState.selectedNusach = v; }

  function renderWizard() {
    var body = document.getElementById('modalBody');
    if (!body) return;
    var step = wizardState.currentStep;
    var bar = progressBarHTML(step, 4, false);
    var html = '';

    if (step === 1) {
      var grid = mezuzahData.cases.map(function (c, i) {
        var sel = wizardState.selectedCaseIndex === i;
        var cls = sel ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-slate-200 hover:border-amber-300';
        return '<div onclick="handleCaseSelect(' + i + ')" class="border-2 ' + cls +
          ' p-3 rounded-xl cursor-pointer transition flex flex-col items-center text-center bg-white shadow-sm">' +
          '<img src="' + c.img + '" alt="' + c.name + '" class="w-full h-24 object-cover rounded-lg mb-2" onerror="imgFallback(this)">' +
          '<h5 class="font-bold text-slate-800 text-sm mb-1 leading-tight">' + c.name + '</h5>' +
          '<p class="font-black text-amber-600 text-sm">' + priceTxt(c.key) + '</p></div>';
      }).join('');

      html = bar +
        '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">בחירת בית מזוזה</h3>' +
        '<p class="text-sm text-slate-500 text-right mb-4">שלב 1 מתוך 4</p>' +
        '<div class="grid grid-cols-3 gap-3 mb-6">' + grid + '</div>' +
        '<div class="flex justify-end"><button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm" onclick="nextStep()">המשך ←</button></div>';

    } else if (step === 2) {
      var yes = wizardState.includeScroll;
      var yb = yes ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/5' : 'border-slate-200';
      var nb = !yes ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/5' : 'border-slate-200';

      var sizes = mezuzahData.scrolls.map(function (s, i) {
        var sel = wizardState.selectedScrollIndex === i;
        var cls = sel ? 'border-amber-500 bg-amber-50/20 text-amber-600' : 'border-slate-200 text-slate-700 hover:border-amber-200';
        var pv = priceVal(s.key);
        return '<button onclick="handleScrollSizeChange(' + i + ')" class="flex-1 border-2 ' + cls +
          ' py-2 px-3 rounded-lg font-bold text-xs transition">קלף ' + s.size +
          (pv === null ? '' : ' (+' + fmt(pv) + ')') + '</button>';
      }).join('');

      var nus = NUSACH_OPTIONS.map(function (n) {
        return '<option value="' + n + '"' + (wizardState.selectedNusach === n ? ' selected' : '') + '>' + n + '</option>';
      }).join('');

      var sub = yes ? '<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-right">' +
        '<h4 class="font-bold text-slate-700 text-sm mb-2">גודל הקלף:</h4>' +
        '<div class="flex gap-3 mb-4">' + sizes + '</div>' +
        '<h4 class="font-bold text-slate-700 text-sm mb-2">נוסח הלכתי:</h4>' +
        '<select class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white" onchange="handleNusachChange(this.value)">' + nus + '</select></div>' : '';

      html = bar +
        '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">קלף סת"ם כשר</h3>' +
        '<p class="text-sm text-slate-500 text-right mb-4">שלב 2 מתוך 4</p>' +
        '<div class="space-y-3 mb-6 text-right">' +
          '<div onclick="handleScrollToggle(true)" class="border-2 ' + yb + ' p-4 rounded-xl cursor-pointer transition bg-white">' +
            '<div class="flex items-start gap-3"><input type="radio" name="scrollOpt" class="mt-1 accent-amber-500"' + (yes ? ' checked' : '') + '>' +
            '<div><h4 class="font-bold text-slate-800 text-base">כן, עם קלף סת"ם</h4>' +
            '<p class="text-xs text-slate-500 mt-1 leading-relaxed">קלף כשר בכתב יד, כולל הגהה כפולה — אנושית וממוחשבת.</p></div></div></div>' +
          '<div onclick="handleScrollToggle(false)" class="border-2 ' + nb + ' p-4 rounded-xl cursor-pointer transition bg-white">' +
            '<div class="flex items-start gap-3"><input type="radio" name="scrollOpt" class="mt-1 accent-amber-500"' + (!yes ? ' checked' : '') + '>' +
            '<div><h4 class="font-bold text-slate-800 text-base">בית מזוזה בלבד</h4>' +
            '<p class="text-xs text-slate-500 mt-1 leading-relaxed">שימו לב: הבית יגיע ריק. לא ניתן לקבוע אותו כך בפתח הבית.</p></div></div></div>' +
        '</div>' + sub +
        '<div class="flex justify-between items-center">' +
          '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">← חזרה</button>' +
          '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm" onclick="nextStep()">המשך ←</button></div>';

    } else if (step === 3) {
      html = bar + scribeBlockHTML() +
        '<div class="flex justify-between items-center">' +
          '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">← חזרה</button>' +
          '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm" onclick="nextStep()">המשך לסיכום ←</button></div>';

    } else {
      var calc = calcMezuzah();
      html = bar +
        '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">סיכום ופרטי מסירה</h3>' +
        '<p class="text-sm text-slate-500 text-right mb-4">שלב אחרון</p>' +
        '<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 text-right">' +
          '<h4 class="font-bold text-slate-700 text-sm mb-2 border-b border-slate-200 pb-1">פירוט ההזמנה:</h4>' +
          summaryLinesHTML(calc) +
          inclusionsHTML(false) +
          '<div class="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">' +
            '<span class="text-xl font-black text-amber-600">' + totalText(calc) + '</span>' +
            '<span class="font-bold text-slate-800">סה"כ משוער:</span></div>' +
        '</div>' +
        clientFieldsHTML(wizardState, 'mez') +
        paymentPrefHTML(wizardState, 'mez') +
        '<div class="flex justify-between items-center">' +
          '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevStep()">← שלב קודם</button>' +
          '<button id="mezuzahSubmitBtn" class="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl transition text-sm shadow-md" onclick="submitBundleOrder()">📲 שליחת ההזמנה לסופר</button></div>';
    }

    body.innerHTML = html;
  }

  /* ==========================================================================
     8. בלוק הסופר — מוצג רק אם יש פרטים אמיתיים ב-config.js
     ========================================================================== */

  function scribeBlockHTML() {
    if (!hasScribeInfo()) return '';
    var rows = '';
    if (SCRIBE.location) rows += '<p>📍 <strong>מקום הכתיבה:</strong> ' + esc(SCRIBE.location) + '</p>';
    if (SCRIBE.experience) rows += '<p>⏳ <strong>ניסיון:</strong> ' + esc(SCRIBE.experience) + '</p>';
    if (SCRIBE.certification) rows += '<p>📜 <strong>הסמכה:</strong> ' + esc(SCRIBE.certification) + '</p>';
    var bio = SCRIBE.bio ? '<p class="text-sm text-slate-700 mt-3 leading-relaxed">' + esc(SCRIBE.bio) + '</p>' : '';
    var quote = SCRIBE.quote ? '<div class="mt-4 p-3 bg-white/80 rounded-xl border border-amber-100/50 text-xs text-amber-900 italic leading-relaxed">' + esc(SCRIBE.quote) + '</div>' : '';

    return '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">הסופר שכותב עבורך</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">שלב 3 מתוך 4</p>' +
      '<div class="bg-amber-50/40 border border-amber-100 p-5 rounded-2xl text-right mb-6 shadow-inner">' +
        '<div class="flex justify-between items-start mb-3 border-b border-amber-100/50 pb-3">' +
          '<span class="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">סופר סת"ם מוסמך</span>' +
          '<h4 class="font-black text-amber-800 text-lg leading-none">' + esc(SCRIBE.name) + '</h4></div>' +
        '<div class="space-y-2 text-sm text-slate-700">' + rows + '</div>' + bio + quote + '</div>';
  }

  /* ==========================================================================
     9. שליחה — מזוזה
     ========================================================================== */

  function validateClient(state, prefix) {
    var name = sanitizeInput(state.clientName || '');
    var phone = sanitizeInput(state.clientPhone || '');
    var addr = sanitizeInput(state.clientAddress || '');

    if (!name) { alert('אנא הזן שם מלא'); focusEl(prefix + 'Name'); return false; }
    if (phone.replace(/\D/g, '').length < 9) { alert('אנא הזן מספר טלפון תקין'); focusEl(prefix + 'Phone'); return false; }
    if (!addr) { alert('אנא הזן כתובת למסירה'); focusEl(prefix + 'Address'); return false; }

    state.clientName = name; state.clientPhone = phone; state.clientAddress = addr;
    state.notes = sanitizeInput(state.notes || '');
    return true;
  }

  function focusEl(id) { var e = document.getElementById(id); if (e) e.focus(); }

  function submitBundleOrder() {
    if (!validateClient(wizardState, 'mez')) return;

    var btn = document.getElementById('mezuzahSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = 'שולח...'; btn.className = 'bg-slate-400 text-white font-extrabold px-6 py-3 rounded-xl cursor-not-allowed text-sm'; }

    var c = mezuzahData.cases[wizardState.selectedCaseIndex];
    var s = mezuzahData.scrolls[wizardState.selectedScrollIndex];
    var calc = calcMezuzah();

    var payload = {
      order_id: makeOrderId(),
      order_date: new Date().toISOString(),
      order_status: 'pending_scribe_approval',   // ← אין יותר 'paid'
      product_type: 'mezuzah',
      client_name: wizardState.clientName,
      client_phone: wizardState.clientPhone,
      client_address: wizardState.clientAddress,
      zone: wizardState.zone,
      notes: wizardState.notes || null,
      case_name: c.name,
      case_price: priceVal(c.key),
      includes_scroll: wizardState.includeScroll,
      scroll_size: wizardState.includeScroll ? s.size : null,
      scroll_nusach: wizardState.includeScroll ? wizardState.selectedNusach : null,
      scroll_price: wizardState.includeScroll ? priceVal(s.key) : null,
      discount_applied: calc.discount,
      estimated_total: calc.unknown ? null : calc.total,
      price_pending: calc.unknown,
      payment_preference: wizardState.paymentPref,
      payment_status: 'not_charged'              // ← תמיד. אין סליקה באתר.
    };

    sendToMake(payload);
    showApprovalScreen('modalBody', payload, buildMezuzahMessage(payload, calc), closeMezuzahModal);
  }

  function buildMezuzahMessage(p, calc) {
    var m = '👑 *הזמנה חדשה — מלכותא*\n';
    m += '🔢 מספר הזמנה: ' + p.order_id + '\n\n';
    m += '📜 *מזוזה*\n';
    m += '🏠 בית מזוזה: ' + p.case_name + '\n';
    if (p.includes_scroll) {
      m += '🖋️ קלף: ' + p.scroll_size + '\n';
      m += '📖 נוסח: ' + p.scroll_nusach + '\n';
    } else {
      m += '⚠️ ללא קלף — בית בלבד\n';
    }
    m += '\n💰 סכום משוער: ' + totalText(calc) + '\n';
    m += '💳 העדפת תשלום: ' + prefLabel(p.payment_preference) + '\n\n';
    m += '👤 ' + p.client_name + ' | ' + p.client_phone + '\n';
    m += '📍 ' + p.client_address + '\n';
    m += '🗺️ גזרה: ' + p.zone + '\n';
    if (p.notes) m += '📝 הערות: ' + p.notes + '\n';
    m += '\n_ההזמנה ממתינה לאישור הסופר_';
    return m;
  }

  /* ==========================================================================
     10. מודאל תפילין
     ========================================================================== */

  function openTefillinModal(index) {
    var el = document.getElementById('tefillinModal');
    if (!el) return;
    resetTefillinState(index);
    renderTefillinWizard();
    el.style.display = 'flex';
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    var b = el.querySelector('.close-btn'); if (b) b.focus();
  }

  function closeTefillinModal() {
    var el = document.getElementById('tefillinModal');
    if (el) { el.style.display = 'none'; el.classList.remove('open'); }
    document.body.style.overflow = '';
  }

  function nextTefillinStep() {
    var s = tefillinWizardState.currentStep;
    if (s === 2 && !hasScribeInfo()) tefillinWizardState.currentStep = 4;
    else tefillinWizardState.currentStep = s + 1;
    renderTefillinWizard();
  }

  function prevTefillinStep() {
    var s = tefillinWizardState.currentStep;
    if (s === 4 && !hasScribeInfo()) tefillinWizardState.currentStep = 2;
    else tefillinWizardState.currentStep = s - 1;
    renderTefillinWizard();
  }

  function handleTefillinNusachChange(v) { tefillinWizardState.selectedNusach = v; }
  function handleTefillinSetSelect(i) { tefillinWizardState.selectedSetIndex = i; renderTefillinWizard(); }

  function renderTefillinWizard() {
    var body = document.getElementById('tefillinModalBody');
    if (!body) return;
    var step = tefillinWizardState.currentStep;
    var bar = progressBarHTML(step, 4, false);
    var html = '';

    if (step === 1) {
      var groups = [
        { title: 'קו יהלום — בתים גסות מכוונות', idx: [0] },
        { title: 'קו שהם — בתים דקים', idx: [1, 2, 3] },
        { title: 'נרתיקים בעיצוב אישי', idx: [4] }
      ];
      var grid = '';
      groups.forEach(function (g) {
        grid += '<h4 class="font-bold text-slate-700 text-sm mb-3 mt-4 text-right border-r-4 border-amber-500 pr-2">' + g.title + '</h4>';
        grid += '<div class="grid grid-cols-1 gap-3 mb-4">';
        g.idx.forEach(function (i) {
          var set = tefillinData.sets[i];
          var sel = tefillinWizardState.selectedSetIndex === i;
          var cls = sel ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-slate-100 hover:border-amber-300';
          grid += '<div onclick="handleTefillinSetSelect(' + i + ')" class="border-2 ' + cls +
            ' p-3 rounded-xl cursor-pointer transition flex gap-4 items-center bg-white shadow-sm text-right" style="direction:rtl">' +
            '<img src="' + set.img + '" alt="' + set.name + '" class="w-20 h-20 object-cover rounded-lg" onerror="imgFallback(this)">' +
            '<div class="flex-grow"><h5 class="font-bold text-slate-800 text-sm mb-0.5 leading-tight">' + set.name + '</h5>' +
            '<p class="text-[11px] text-slate-500 leading-relaxed mb-1">' + set.desc + '</p>' +
            '<div class="font-black text-amber-600 text-sm">' + priceTxt(set.key) + '</div></div></div>';
        });
        grid += '</div>';
      });

      html = bar +
        '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">בחירת ערכת תפילין</h3>' +
        '<p class="text-sm text-slate-500 text-right mb-4">שלב 1 מתוך 4</p>' +
        '<div style="max-height:48vh;overflow-y:auto;padding:0 4px" class="mb-4">' + grid + '</div>' +
        '<div class="flex justify-end"><button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm" onclick="nextTefillinStep()">המשך ←</button></div>';

    } else if (step === 2) {
      var nus = TEFILLIN_NUSACH_OPTIONS.map(function (n) {
        return '<option value="' + n + '"' + (tefillinWizardState.selectedNusach === n ? ' selected' : '') + '>' + n + '</option>';
      }).join('');

      // ⚠️ ההטבעה מוצגת כ"חינם" רק אם הדגל ב-config.js דלוק.
      var embossNote = PROMISES.goldEmbossing
        ? '🎁 הטבעת שם בזהב — כלולה ללא תוספת תשלום.'
        : 'עלות ההטבעה תימסר בשיחת האישור עם הסופר.';

      html = bar +
        '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">התאמה אישית</h3>' +
        '<p class="text-sm text-slate-500 text-right mb-4">שלב 2 מתוך 4</p>' +
        '<div class="space-y-4 mb-6 text-right">' +
          '<div><label class="block text-xs font-bold text-slate-600 mb-1">נוסח כתיבה:</label>' +
          '<select class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white" onchange="handleTefillinNusachChange(this.value)">' + nus + '</select></div>' +
          '<div class="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">' +
            '<label class="block text-xs font-bold text-amber-900 mb-1">שם להטבעה על הנרתיק:</label>' +
            '<input type="text" value="' + esc(tefillinWizardState.embroideryName) +
            '" oninput="MALCHUTA_ORDER.setField(\'tef\',\'embroideryName\',this.value)" ' +
            'placeholder="לדוגמה: אוריאל חיים (אפשר להשאיר ריק)" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500">' +
            '<p class="text-[10px] text-amber-700 mt-1">' + embossNote + '</p></div>' +
        '</div>' +
        '<div class="flex justify-between items-center">' +
          '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevTefillinStep()">← חזרה</button>' +
          '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm" onclick="nextTefillinStep()">המשך ←</button></div>';

    } else if (step === 3) {
      html = bar + scribeBlockHTML() +
        '<div class="flex justify-between items-center">' +
          '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevTefillinStep()">← חזרה</button>' +
          '<button class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm" onclick="nextTefillinStep()">המשך לסיכום ←</button></div>';

    } else {
      var calc = calcTefillin();
      var extra = '';
      if (tefillinWizardState.embroideryName.trim()) {
        extra = '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm">' +
          '<span class="font-bold text-slate-800">' + (PROMISES.goldEmbossing ? 'כלול' : 'בתיאום') + '</span>' +
          '<span class="text-slate-600">הטבעה: "' + esc(tefillinWizardState.embroideryName.trim()) + '"</span></div>';
      }

      html = bar +
        '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">סיכום ופרטי מסירה</h3>' +
        '<p class="text-sm text-slate-500 text-right mb-4">שלב אחרון</p>' +
        '<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 text-right">' +
          '<h4 class="font-bold text-slate-700 text-sm mb-2 border-b border-slate-200 pb-1">פירוט ההזמנה:</h4>' +
          summaryLinesHTML(calc) +
          '<div class="flex justify-between items-center py-2 border-b border-slate-100 text-sm">' +
            '<span class="font-bold text-slate-800">כלול</span><span class="text-slate-600">נוסח: ' + tefillinWizardState.selectedNusach + '</span></div>' +
          extra +
          inclusionsHTML(true) +
          '<div class="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">' +
            '<span class="text-xl font-black text-amber-600">' + totalText(calc) + '</span>' +
            '<span class="font-bold text-slate-800">סה"כ משוער:</span></div>' +
        '</div>' +
        clientFieldsHTML(tefillinWizardState, 'tef') +
        paymentPrefHTML(tefillinWizardState, 'tef') +
        '<div class="flex justify-between items-center">' +
          '<button class="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="prevTefillinStep()">← שלב קודם</button>' +
          '<button id="tefillinSubmitBtn" class="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl transition text-sm shadow-md" onclick="submitTefillinOrder()">📲 שליחת ההזמנה לסופר</button></div>';
    }

    body.innerHTML = html;
  }

  function submitTefillinOrder() {
    if (!validateClient(tefillinWizardState, 'tef')) return;

    var btn = document.getElementById('tefillinSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = 'שולח...'; btn.className = 'bg-slate-400 text-white font-extrabold px-6 py-3 rounded-xl cursor-not-allowed text-sm'; }

    var set = tefillinData.sets[tefillinWizardState.selectedSetIndex];
    var calc = calcTefillin();

    var payload = {
      order_id: makeOrderId(),
      order_date: new Date().toISOString(),
      order_status: 'pending_scribe_approval',
      product_type: 'tefillin',
      client_name: tefillinWizardState.clientName,
      client_phone: tefillinWizardState.clientPhone,
      client_address: tefillinWizardState.clientAddress,
      zone: tefillinWizardState.zone,
      notes: tefillinWizardState.notes || null,
      set_name: set.name,
      set_price: priceVal(set.key),
      nusach: tefillinWizardState.selectedNusach,
      embossing_name: tefillinWizardState.embroideryName.trim() || null,
      estimated_total: calc.unknown ? null : calc.total,
      price_pending: calc.unknown,
      payment_preference: tefillinWizardState.paymentPref,
      payment_status: 'not_charged'
    };

    sendToMake(payload);
    showApprovalScreen('tefillinModalBody', payload, buildTefillinMessage(payload, calc), closeTefillinModal);
  }

  function buildTefillinMessage(p, calc) {
    var m = '👑 *הזמנה חדשה — מלכותא*\n';
    m += '🔢 מספר הזמנה: ' + p.order_id + '\n\n';
    m += '📦 *תפילין*\n';
    m += '🎁 דגם: ' + p.set_name + '\n';
    m += '📖 נוסח: ' + p.nusach + '\n';
    if (p.embossing_name) m += '✍️ הטבעה: "' + p.embossing_name + '"\n';
    m += '\n💰 סכום משוער: ' + totalText(calc) + '\n';
    m += '💳 העדפת תשלום: ' + prefLabel(p.payment_preference) + '\n\n';
    m += '👤 ' + p.client_name + ' | ' + p.client_phone + '\n';
    m += '📍 ' + p.client_address + '\n';
    m += '🗺️ גזרה: ' + p.zone + '\n';
    if (p.notes) m += '📝 הערות: ' + p.notes + '\n';
    m += '\n_ההזמנה ממתינה לאישור הסופר_';
    return m;
  }

  /* ==========================================================================
     11. שליחה ל-Make
     ========================================================================== */

  function sendToMake(payload) {
    if (!CFG.MAKE_WEBHOOK_URL) return;
    var headers = { 'Content-Type': 'application/json' };
    if (CFG.MAKE_TOKEN) headers['X-Malchuta-Token'] = CFG.MAKE_TOKEN;

    fetch(CFG.MAKE_WEBHOOK_URL, {
      method: 'POST', headers: headers, body: JSON.stringify(payload)
    }).catch(function (err) {
      // ההזמנה עדיין נשלחת בוואטסאפ, אז כישלון כאן אינו קריטי ללקוח.
      console.error('[מלכותא] שליחת webhook נכשלה:', err);
    });
  }

  /* ==========================================================================
     12. מסך הסיום
     ────────────────────────────────────────────────────────────────────────
     מה שהיה כאן ב-v6: "🎉 העסקה אושרה וסולקה בהצלחה" + מספר אישור סליקה
     מזויף + הודעה על תעודת PDF שלא הופקה + "צוות שילוח" שלא קיים.
     מה שיש כאן עכשיו: מה שבאמת קרה.
     ========================================================================== */

  function showApprovalScreen(bodyId, payload, waMessage, closeFn) {
    var body = document.getElementById(bodyId);
    if (!body) return;

    var waUrl = waLink(waMessage);
    var closeName = (closeFn === closeMezuzahModal) ? 'closeMezuzahModal' : 'closeTefillinModal';

    body.innerHTML = progressBarHTML(4, 4, true) +
      '<h3 class="text-xl font-bold text-slate-900 text-right mb-1">ההזמנה נשלחה</h3>' +
      '<p class="text-sm text-slate-500 text-right mb-4">סטטוס: ממתינה לאישור הסופר</p>' +

      '<div class="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-right mb-4 shadow-inner">' +
        '<h4 class="font-black text-amber-900 text-base mb-1">תודה, ' + esc(payload.client_name) + '</h4>' +
        '<p class="text-xs text-slate-700 leading-relaxed mb-3">' +
          'ההזמנה שלך התקבלה ועברה לסופר. <strong>עדיין לא בוצע חיוב</strong> — ' +
          'התשלום יסוכם מולך רק אחרי שהסופר יאשר את ההזמנה.</p>' +
        '<div class="space-y-1.5 text-[11px] text-slate-600 border-t border-amber-100/60 pt-2.5">' +
          '<p>🔢 <strong>מספר הזמנה:</strong> ' + payload.order_id + '</p>' +
          '<p>💰 <strong>סכום משוער:</strong> ' +
            (payload.estimated_total === null ? PENDING : fmt(payload.estimated_total)) + '</p>' +
          '<p>💳 <strong>העדפת תשלום:</strong> ' + prefLabel(payload.payment_preference) + '</p>' +
          '<p>📍 <strong>כתובת למסירה:</strong> ' + esc(payload.client_address) + '</p>' +
        '</div></div>' +

      '<div class="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-right mb-5">' +
        '<h5 class="font-bold text-slate-800 text-sm mb-2">מה קורה עכשיו?</h5>' +
        '<ol class="text-[12px] text-slate-600 space-y-1.5 leading-relaxed list-decimal pr-4">' +
          '<li>הסופר בודק את ההזמנה ואת הזמינות.</li>' +
          '<li>יוצרים איתך קשר בוואטסאפ לאישור הפרטים והמחיר הסופי.</li>' +
          '<li>רק לאחר האישור מתחילה הכתיבה, ומתואמת מסירה אישית בביתך.</li>' +
        '</ol></div>' +

      '<p class="text-[11px] text-slate-500 text-right mb-4">' +
        'שמור את מספר ההזמנה. אם השיחה בוואטסאפ לא נפתחה אוטומטית, לחץ על הכפתור.</p>' +

      '<div class="flex justify-end gap-3">' +
        '<button class="border border-slate-300 text-slate-700 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm" onclick="' + closeName + '()">סגור</button>' +
        '<a href="' + waUrl + '" target="_blank" rel="noopener" class="bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition text-sm shadow-md">💬 פתח וואטסאפ</a>' +
      '</div>';

    window.open(waUrl, '_blank');
  }

  /* ==========================================================================
     13. גשר לשדות טופס
     ========================================================================== */

  window.MALCHUTA_ORDER = {
    setField: function (prefix, field, val) {
      var st = prefix === 'mez' ? wizardState : tefillinWizardState;
      st[field] = val;
    },
    setPref: function (prefix, val) {
      var st = prefix === 'mez' ? wizardState : tefillinWizardState;
      st.paymentPref = val;
      if (prefix === 'mez') renderWizard(); else renderTefillinWizard();
    },
    version: 'v7'
  };

  /* ==========================================================================
     14. מאזינים וחשיפה
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    var mez = document.getElementById('mezuzahModal');
    if (mez) mez.addEventListener('click', function (e) { if (e.target === mez) closeMezuzahModal(); });

    var tef = document.getElementById('tefillinModal');
    if (tef) tef.addEventListener('click', function (e) { if (e.target === tef) closeTefillinModal(); });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (mez && mez.classList.contains('open')) closeMezuzahModal();
      if (tef && tef.classList.contains('open')) closeTefillinModal();
    });

    var h = document.getElementById('waHeader');
    if (h) h.href = waLink('שלום, אשמח לקבל פרטים על סטי התפילין');
    var f = document.getElementById('waFloat');
    if (f) f.href = waLink('שלום, אשמח לקבל פרטים');
    document.querySelectorAll('a[data-wa]').forEach(function (a) { a.href = waLink(a.dataset.wa); });
  });

  window.openMezuzahModal = openMezuzahModal;
  window.closeMezuzahModal = closeMezuzahModal;
  window.nextStep = nextStep;
  window.prevStep = prevStep;
  window.handleCaseSelect = handleCaseSelect;
  window.handleScrollToggle = handleScrollToggle;
  window.handleScrollSizeChange = handleScrollSizeChange;
  window.handleNusachChange = handleNusachChange;
  window.submitBundleOrder = submitBundleOrder;

  window.openTefillinModal = openTefillinModal;
  window.openTefillinSetModal = openTefillinModal;   // תאימות לאחור עם catalog.html
  window.closeTefillinModal = closeTefillinModal;
  window.nextTefillinStep = nextTefillinStep;
  window.prevTefillinStep = prevTefillinStep;
  window.handleTefillinNusachChange = handleTefillinNusachChange;
  window.handleTefillinSetSelect = handleTefillinSetSelect;
  window.submitTefillinOrder = submitTefillinOrder;

  // הוסרו: handlePaymentMethodChange, handleTefillinPaymentMethodChange
  // (היו שייכים לסימולציית הסליקה)

  resetMezuzahState('bundle');
  resetTefillinState(0);

})();
