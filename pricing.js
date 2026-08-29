/* ============================================================================
   מלכותא — pricing.js
   ────────────────────────────────────────────────────────────────────────────
   מקור האמת היחיד לכל מחיר באתר.

   כלל ברזל: אין מחיר קשיח בשום קובץ HTML אחר. אף פעם.
   כל מחיר מוצג דרך  <span data-price="KEY"></span>  והקובץ הזה ממלא אותו.

   סדר טעינה בכל דף (pricing.js תמיד ראשון):
     <script src="pricing.js"></script>
     <script src="products-data.js"></script>
     <script src="bundle-modal-v6.js" defer></script>

   שכבות המחיר, לפי סדר עדיפות:
     1. CSV מגוגל שיטס (הלשונית המפורסמת — מחירים סופיים בלבד)
     2. price  שבקובץ הזה
     3. legacy שבקובץ הזה — רק אם config.fallbackToLegacy === true

   ⚠️ המכפיל הסיטונאי (×2.0) חי אך ורק בלשונית הפרטית בגוגל שיטס.
      הוא לא מופיע כאן, לא נשלח לדפדפן, ולא ניתן לחילוץ מהקוד הזה.

   מצבי דיבאג (הוסף לכתובת):
     ?pricecheck=1   סימון ויזואלי של כל מחיר שאינו מאומת + דוח בקונסול
     ?nocsv=1        דילוג על CSV, שימוש בערכים המקומיים בלבד
   ============================================================================ */

(function () {
  'use strict';

  var MP = {};

  /* ==========================================================================
     1. תצורה
     ========================================================================== */

  MP.meta = {
    version: '1.0.0',
    updatedAt: '2026-08-29',
    // כל המחירים ממתינים לאישור יעקב. אין ולו מחיר אחד מאומת בשלב זה.
    verifiedCount: 0
  };

  MP.config = {
    currency: '₪',

    // כשמחיר אמיתי (price) חסר — האם להציג את המספר הישן מהאתר?
    // true  = האתר נראה כרגיל, אך המספרים אינם מאומתים (מצב נוכחי)
    // false = מוצג pendingLabel במקום. להעביר ל-false ברגע שיש מחירון מיעקב.
    fallbackToLegacy: true,

    pendingLabel: 'בתיאום אישי',
    fromPrefix: 'החל מ-',

    // CSV מהלשונית המפורסמת. ריק = לא נטען CSV, עובדים מקומית בלבד.
    csvUrl: '',
    csvTimeoutMs: 4000
  };

  /* ==========================================================================
     2. מאגר המחירים
     ────────────────────────────────────────────────────────────────────────
     price   — המחיר האמיתי. null = טרם התקבל מיעקב.
     legacy  — המספר שמופיע היום באתר. לעיון והשוואה בלבד, לא מאומת.
     status  — 'pending' (ממתין) | 'verified' (אושר) | 'quote' (הצעת מחיר בלבד)
     note    — למה יש פער, או מה צריך לברר
     ========================================================================== */

  function P(label, legacy, note) {
    return { label: label, price: null, legacy: legacy, status: 'pending', note: note || '' };
  }

  MP.items = {

    /* ---- תפילין · קו שהם (דקים) ---------------------------------------- */
    'tefillin.shoham.batim.kashrut': P('בתים כשרות', 1250),
    'tefillin.shoham.batim.vip': P('בתים VIP — עור לבן', 1499),
    'tefillin.shoham.batim.jerusalem': P('בתים דגם ירושלים', 1499),
    'tefillin.shoham.batim.gold': P('בתים כתר זהב', 2350,
      'סתירה: 2,350 ב-index/order מול 2,450 בקטלוג/bundle-modal. יעקב לקבוע.'),

    /* ---- תפילין · קו יהלום (גסות מכוונות) ------------------------------ */
    'tefillin.yahalom.batim.bw': P('בתים מהודרות שחור-לבן', 2699),
    'tefillin.yahalom.batim.silver': P('בתים מהודרות כסף', 2699),
    'tefillin.yahalom.batim.blue': P('בתים מהודרות כחול-לבן', 2699,
      'index מכריז "מחיר אחיד 2,699" אך הקטלוג מציג 2,390 ו-2,290. לברר.'),

    /* ---- תפילין · קלף ---------------------------------------------------
       הדירוג מוסבר בקרבה לכתב ספר תורה, לא בתווית איכות מופשטת. */
    'tefillin.klaf.standard': P('קלף — כתיבה תמה', null,
      'רמה 1: כתיבה תמה כשרה למהדרין.'),
    'tefillin.klaf.mehudar': P('קלף — הידור בינוני', null,
      'רמה 2: קרוב יותר לכתב ספר תורה.'),
    'tefillin.klaf.sofer': P('קלף — כתב ספר תורה', null,
      'רמה 3: זהה ברמתו לכתיבת ספר תורה.'),

    /* ---- תפילין · רצועות (זהות בשני הקווים, שתי אפשרויות בלבד) -------- */
    'tefillin.retzuot.machine': P('רצועות תפורות מכונה — צבועות משני צדדים', null),
    'tefillin.retzuot.hand': P('רצועות תפורות יד — צבועות משני צדדים', null),

    /* ---- תפילין · קופסה ותפירה ----------------------------------------- */
    'tefillin.box.standard': P('קופסה סטנדרטית', null),
    'tefillin.box.mehudar': P('קופסה מהודרת', null),
    'tefillin.sewing.machine': P('תפירת בתים — מכונה', null),
    'tefillin.sewing.hand': P('תפירת בתים — יד', null),

    /* ---- תפילין · פצפונים (רבנו תם) ------------------------------------ */
    'tefillin.pitzponim.pair': P('פצפונים — זוג', null,
      'ברירת מחדל: זוג אחד. תיבת סימון מכפילה רכיבים.'),
    'tefillin.pitzponim.double': P('פצפונים — הכפלת רכיבים', null),

    /* ---- סטים מוכנים (כפי שמוצגים בקטלוג ובמודאל) ---------------------- */
    'set.yahalom.blue': P('סט בר מצווה — קו יהלום כחול-לבן', 2699),
    'set.shoham.gold': P("סט קו שהם — דגם ה' כתר זהב", 2450,
      'סתירה: index.html מציג 2,350 לאותו דגם. יעקב לקבוע.'),
    'set.shoham.flame': P('סט קו שהם — דגם להבת אש', 2390),
    'set.shoham.brown': P('סט קו שהם — דגם זמש חום כהה', 2290),

    /* ---- אביזרים (הרכיב היחיד שמותר להנחה) ---------------------------- */
    'accessory.case.basic': P('נרתיק בסיסי לתפילין', 160),
    'accessory.case.mehudar': P('נרתיק מהודר לתפילין', 350),
    'accessory.case.custom': P('נרתיק בעיצוב אישי', 450),
    'accessory.tallit.cotton': P('טלית 100% כותנה', 220),
    'accessory.tallit.wool': P('טלית 100% צמר רחלים', 350),
    'accessory.kippah': P('כיפה תואמת', null),
    'accessory.siddur': P('סידור', null),
    'accessory.bag': P('תיק טלית', null),

    /* ---- מזוזות · קלף ---------------------------------------------------
       ⚠️ תמחור מזוזות טרם התקבל מיעקב — כל השורות כאן ריקות במכוון. */
    'mezuzah.klaf.7': P('קלף מזוזה 7 ס"מ', null),
    'mezuzah.klaf.10': P('קלף מזוזה 10 ס"מ', 250),
    'mezuzah.klaf.12': P('קלף מזוזה 12 ס"מ', 280),
    'mezuzah.klaf.15': P('קלף מזוזה 15 ס"מ', null),

    /* ---- מזוזות · בתים -------------------------------------------------- */
    'mezuzah.case.concrete': P('בית מזוזה בטון שחור', 90),
    'mezuzah.case.stone': P('בית מזוזה שיש ירושלמי', 120),
    'mezuzah.case.olive': P('בית מזוזה עץ זית', 150),

    /* ---- בדיקות סת"ם ---------------------------------------------------- */
    'inspection.mezuzah': P('בדיקת מזוזה', null),
    'inspection.tefillin': P('בדיקת תפילין', null),
    'inspection.business': { label: 'בדיקה לבתי עסק', price: null, legacy: null,
      status: 'quote', note: 'הצעת מחיר לפי כמות ומיקום.' }
  };

  /* ==========================================================================
     3. מבנה הקונפיגורטור
     ────────────────────────────────────────────────────────────────────────
     הקווים והרכיבים — למילוי דינמי של הקונפיגורטור.
     המחירים עצמם לא חוזרים כאן, רק מפתחות ל-MP.items.
     ========================================================================== */

  MP.lines = {
    shoham: {
      label: 'שֹׁהַם',
      subtitle: 'בתים דקים',
      components: {
        batim: ['tefillin.shoham.batim.kashrut', 'tefillin.shoham.batim.vip',
                'tefillin.shoham.batim.jerusalem', 'tefillin.shoham.batim.gold'],
        klaf: ['tefillin.klaf.standard', 'tefillin.klaf.mehudar', 'tefillin.klaf.sofer'],
        retzuot: ['tefillin.retzuot.machine', 'tefillin.retzuot.hand'],
        box: ['tefillin.box.standard', 'tefillin.box.mehudar'],
        sewing: ['tefillin.sewing.machine', 'tefillin.sewing.hand']
      }
    },
    yahalom: {
      label: 'יַהֲלוֹם',
      subtitle: 'בתים גסות מכוונות',
      components: {
        batim: ['tefillin.yahalom.batim.bw', 'tefillin.yahalom.batim.silver',
                'tefillin.yahalom.batim.blue'],
        klaf: ['tefillin.klaf.standard', 'tefillin.klaf.mehudar', 'tefillin.klaf.sofer'],
        retzuot: ['tefillin.retzuot.machine', 'tefillin.retzuot.hand'],
        box: ['tefillin.box.standard', 'tefillin.box.mehudar'],
        sewing: ['tefillin.sewing.machine', 'tefillin.sewing.hand']
      }
    }
  };

  /* ==========================================================================
     4. סטים = פריסטים של הקונפיגורטור
     ────────────────────────────────────────────────────────────────────────
     ⚠️ כלל תמחור: הנחה חלה אך ורק על accessories. לעולם לא על תפילין.
     המבנה אוכף את זה — אין שדה הנחה בצד ה-tefillin.
     ========================================================================== */

  MP.sets = {
    'shoham-gold': {
      label: 'סט שהם — כתר זהב',
      line: 'shoham',
      tefillin: {                       // ← אף פעם לא מוזל
        batim: 'tefillin.shoham.batim.gold',
        klaf: 'tefillin.klaf.mehudar',
        retzuot: 'tefillin.retzuot.machine',
        box: 'tefillin.box.standard',
        sewing: 'tefillin.sewing.machine'
      },
      accessories: ['accessory.tallit.wool', 'accessory.bag',
                    'accessory.kippah', 'accessory.siddur'],
      accessoryDiscountPct: null        // ← ממתין להחלטת יעקב
    },
    'yahalom-blue': {
      label: 'סט יהלום — כחול-לבן',
      line: 'yahalom',
      tefillin: {
        batim: 'tefillin.yahalom.batim.blue',
        klaf: 'tefillin.klaf.sofer',
        retzuot: 'tefillin.retzuot.hand',
        box: 'tefillin.box.mehudar',
        sewing: 'tefillin.sewing.hand'
      },
      accessories: ['accessory.tallit.wool', 'accessory.bag',
                    'accessory.kippah', 'accessory.siddur'],
      accessoryDiscountPct: null
    }
  };

  /* ==========================================================================
     5. API
     ========================================================================== */

  var usedLegacy = [];   // מחירים שהוצגו מ-legacy במהלך הריצה
  var missingKeys = [];  // מפתחות שנתבקשו ולא קיימים

  /** מחזיר את רשומת הפריט המלאה, או null. */
  MP.get = function (key) {
    var it = MP.items[key];
    if (!it) {
      if (missingKeys.indexOf(key) === -1) missingKeys.push(key);
      return null;
    }
    return it;
  };

  /** מחזיר מספר לחישוב, או null אם אין מחיר שמיש. */
  MP.value = function (key) {
    var it = MP.get(key);
    if (!it) return null;
    if (typeof it.price === 'number') return it.price;
    if (MP.config.fallbackToLegacy && typeof it.legacy === 'number') {
      if (usedLegacy.indexOf(key) === -1) usedLegacy.push(key);
      return it.legacy;
    }
    return null;
  };

  /** מעצב מספר: 2450 → "2,450 ₪" */
  MP.format = function (n) {
    if (typeof n !== 'number' || !isFinite(n)) return MP.config.pendingLabel;
    return n.toLocaleString('he-IL') + ' ' + MP.config.currency;
  };

  /** מחרוזת מוכנה לתצוגה עבור מפתח. */
  MP.display = function (key) {
    var v = MP.value(key);
    return v === null ? MP.config.pendingLabel : MP.format(v);
  };

  /** "החל מ-1,250 ₪" — המינימום מתוך רשימת מפתחות. */
  MP.displayFrom = function (keys) {
    var vals = keys.map(MP.value).filter(function (v) { return typeof v === 'number'; });
    if (!vals.length) return MP.config.pendingLabel;
    return MP.config.fromPrefix + MP.format(Math.min.apply(null, vals));
  };

  /** טווח: "1,250–2,350 ₪" */
  MP.displayRange = function (keys) {
    var vals = keys.map(MP.value).filter(function (v) { return typeof v === 'number'; });
    if (!vals.length) return MP.config.pendingLabel;
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    return lo === hi ? MP.format(lo)
      : lo.toLocaleString('he-IL') + '–' + hi.toLocaleString('he-IL') + ' ' + MP.config.currency;
  };

  /**
   * מחשב סט. מחזיר פירוט מלא.
   * ההנחה מחושבת אך ורק על סכום האביזרים — התפילין תמיד במחיר מלא.
   */
  MP.calcSet = function (setId) {
    var set = MP.sets[setId];
    if (!set) return null;

    var tefillinTotal = 0, tefillinComplete = true;
    Object.keys(set.tefillin).forEach(function (slot) {
      var v = MP.value(set.tefillin[slot]);
      if (v === null) tefillinComplete = false; else tefillinTotal += v;
    });

    var accTotal = 0, accComplete = true;
    set.accessories.forEach(function (k) {
      var v = MP.value(k);
      if (v === null) accComplete = false; else accTotal += v;
    });

    var pct = set.accessoryDiscountPct;
    var discount = (typeof pct === 'number') ? Math.round(accTotal * pct / 100) : 0;

    return {
      tefillinTotal: tefillinTotal,
      accessoriesTotal: accTotal,
      accessoriesDiscount: discount,   // תמיד 0 או הנחה על אביזרים בלבד
      total: tefillinTotal + accTotal - discount,
      complete: tefillinComplete && accComplete,
      note: tefillinComplete && accComplete ? '' : 'חלק מהמחירים טרם אושרו'
    };
  };

  /* ==========================================================================
     6. קישור ל-DOM
     ────────────────────────────────────────────────────────────────────────
     <span data-price="tefillin.shoham.batim.gold"></span>
     <span data-price-from="tefillin.shoham.batim.kashrut,...">
     <span data-price-range="...">
     <span data-price-label="accessory.tallit.wool">  ← שם הפריט בלבד
     ========================================================================== */

  MP.bind = function (root) {
    root = root || document;

    root.querySelectorAll('[data-price]').forEach(function (el) {
      el.textContent = MP.display(el.getAttribute('data-price'));
    });
    root.querySelectorAll('[data-price-from]').forEach(function (el) {
      el.textContent = MP.displayFrom(el.getAttribute('data-price-from').split(',').map(trim));
    });
    root.querySelectorAll('[data-price-range]').forEach(function (el) {
      el.textContent = MP.displayRange(el.getAttribute('data-price-range').split(',').map(trim));
    });
    root.querySelectorAll('[data-price-label]').forEach(function (el) {
      var it = MP.get(el.getAttribute('data-price-label'));
      if (it) el.textContent = it.label;
    });

    if (isDebug('pricecheck')) markUnverified(root);
  };

  function trim(s) { return s.trim(); }

  function markUnverified(root) {
    root.querySelectorAll('[data-price],[data-price-from],[data-price-range]').forEach(function (el) {
      el.style.outline = '2px dashed #C9A24B';
      el.style.outlineOffset = '2px';
      el.title = 'מחיר לא מאומת — ממתין לאישור יעקב';
    });
  }

  /* ==========================================================================
     7. ביקורת — מאתר מחירים קשיחים ששרדו
     ========================================================================== */

  MP.audit = function () {
    var total = Object.keys(MP.items).length;
    var verified = 0, pending = 0, empty = 0;

    Object.keys(MP.items).forEach(function (k) {
      var it = MP.items[k];
      if (it.status === 'verified' && typeof it.price === 'number') verified++;
      else pending++;
      if (it.price === null && it.legacy === null) empty++;
    });

    // סריקת הדף אחר סימן ₪ שאינו מגיע מהמערכת
    var stray = [];
    document.querySelectorAll('body *').forEach(function (el) {
      if (el.children.length) return;
      if (el.hasAttribute('data-price') || el.hasAttribute('data-price-from') ||
          el.hasAttribute('data-price-range')) return;
      var t = (el.textContent || '');
      if (t.indexOf('₪') !== -1 && t.length < 120) {
        stray.push({ text: t.trim().slice(0, 60), el: el });
      }
    });

    console.group('%c מלכותא — ביקורת מחירים ', 'background:#16294A;color:#C9A24B;font-weight:bold');
    console.log('סה"כ פריטים:', total, '| מאומתים:', verified, '| ממתינים:', pending, '| ריקים לגמרי:', empty);
    if (usedLegacy.length) {
      console.warn('הוצגו ' + usedLegacy.length + ' מחירים ישנים לא מאומתים:', usedLegacy);
    }
    if (missingKeys.length) {
      console.error('מפתחות שנתבקשו ולא קיימים:', missingKeys);
    }
    if (stray.length) {
      console.error('⚠️ נמצאו ' + stray.length + ' מחירים קשיחים שלא עברו למערכת:');
      stray.forEach(function (s) { console.log('   ', s.text, s.el); });
    } else {
      console.log('✓ לא נמצאו מחירים קשיחים בדף.');
    }
    console.groupEnd();

    return { total: total, verified: verified, pending: pending, usedLegacy: usedLegacy, stray: stray };
  };

  /* ==========================================================================
     8. טעינת CSV מגוגל שיטס
     ────────────────────────────────────────────────────────────────────────
     עמודות נדרשות:  key,price
     עמודות אופציונליות:  label,status
     כל כישלון — נופלים בשקט לערכים המקומיים.
     ========================================================================== */

  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  MP.loadCSV = function () {
    var url = MP.config.csvUrl;
    if (!url || isDebug('nocsv')) return Promise.resolve(false);

    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, MP.config.csvTimeoutMs);

    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (text) {
        if (timer) clearTimeout(timer);
        var rows = parseCSV(text);
        if (!rows.length) throw new Error('CSV ריק');

        var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
        var iKey = head.indexOf('key'), iPrice = head.indexOf('price');
        var iLabel = head.indexOf('label'), iStatus = head.indexOf('status');
        if (iKey === -1 || iPrice === -1) throw new Error('חסרות עמודות key/price');

        var applied = 0;
        rows.slice(1).forEach(function (r) {
          var key = (r[iKey] || '').trim();
          if (!key || !MP.items[key]) return;
          var raw = (r[iPrice] || '').replace(/[^\d.]/g, '');
          if (raw === '') return;
          MP.items[key].price = parseFloat(raw);
          MP.items[key].status = iStatus > -1 && r[iStatus] ? r[iStatus].trim() : 'verified';
          if (iLabel > -1 && r[iLabel]) MP.items[key].label = r[iLabel].trim();
          applied++;
        });

        MP.meta.source = 'csv';
        console.log('%c✓ מלכותא: נטענו ' + applied + ' מחירים מגוגל שיטס',
                    'color:#16294A;font-weight:bold');
        MP.bind();
        document.dispatchEvent(new CustomEvent('malchuta:prices-updated', { detail: { applied: applied } }));
        return true;
      })
      .catch(function (err) {
        if (timer) clearTimeout(timer);
        MP.meta.source = 'local';
        console.warn('מלכותא: טעינת CSV נכשלה, ממשיכים עם הערכים המקומיים —', err.message);
        return false;
      });
  };

  /* ==========================================================================
     9. אתחול
     ========================================================================== */

  function isDebug(flag) {
    try { return new URLSearchParams(location.search).get(flag) === '1'; }
    catch (e) { return false; }
  }

  function init() {
    MP.bind();
    MP.loadCSV();
    if (isDebug('pricecheck')) setTimeout(MP.audit, 300);
  }

  window.MALCHUTA_PRICING = MP;
  window.MP = MP;   // קיצור נוח לקונסול

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
