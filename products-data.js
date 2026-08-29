/* ============================================================
   מלכותא — נתוני קטלוג
   מבנה: categories[] (מערך) — פריט יכול להשתייך לכמה קטגוריות.
   internal:true  = לא מוצג בקטלוג הציבורי (מוצג רק עם ?debug=1)
   needsReview    = מוצג, אך דורש תיקון לפני פרסום סופי
   רשימת הקטגוריות מוגדרת כאן ומשמשת גם לבניית הטאבים ב-catalog.html
   ============================================================ */
window.PRODUCTS_DATA = {
  "categories": [
    {
      "slug": "sets",
      "label": "סטים מלאים",
      "icon": "🎁"
    },
    {
      "slug": "cases",
      "label": "נרתיקים וכיסויים",
      "icon": "👜"
    },
    {
      "slug": "tefillin",
      "label": "תפילין ובתים",
      "icon": "📦"
    },
    {
      "slug": "mezuzot",
      "label": "מזוזות",
      "icon": "📜"
    },
    {
      "slug": "klaf-art",
      "label": "קלפים ואלבומים",
      "icon": "🕯️"
    },
    {
      "slug": "judaica",
      "label": "יודאיקה ומגילות",
      "icon": "👑"
    },
    {
      "slug": "tallitot",
      "label": "טליתות",
      "icon": "🕊️"
    },
    {
      "slug": "inspection",
      "label": "בדיקות סת\"ם",
      "icon": "🔍"
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "תכלת – ברכת כהנים",
      "description": "סט זמש רך בגווני תכלת, עם ברכת כהנים על כל פריט. כולל תיק טלית, תיק תפילין, סידור עת רצון, כיפה, כיסוי רצועות, שני כיסויי בתים, טלית פסים ותפילין מצופי כסף.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "תכלת וכחול כהה",
      "material": "זמש",
      "imageName": "WhatsApp Image 2026-08-05 at 20.28.59 (1).jpeg"
    },
    {
      "id": 2,
      "name": "קאמל – אות ה'",
      "description": "עיצוב חם ועכשווי בגוון קאמל, עם אות ה' גדולה במעגל הכיתוב 'שלום ברכה והצלחה' ואפשרות לרקמת שם אישית.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "חום קאמל",
      "material": "זמש",
      "imageName": "WhatsApp Image 2026-08-05 at 20.28.59.jpeg"
    },
    {
      "id": 3,
      "name": "אפור קורדרוי – דגם מזוודה",
      "description": "דגם מזוודה מודרני עם ידית נשיאה ורצועת כתף, בהטבעה 'להחבר ולהתחבר'. נוח לנשיאה יומיומית לבית הכנסת ולישיבה.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "אפור",
      "material": "קורדרוי ואלמנטים בזמש",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.13 (1).jpeg"
    },
    {
      "id": 4,
      "name": "פשתן בז' – מגן דוד",
      "description": "סט קלאסי ורך בגוון בז' טבעי, עם רקמת מגן דוד בטון-על-טון והכיתוב 'השם יברך לבנך'.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "בז' בהיר",
      "material": "בד ארוג בסגנון פשתן",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.13 (2).jpeg"
    },
    {
      "id": 5,
      "name": "ג'ינס ארוג – דגם מזוודה",
      "description": "גוון ג'ינס אופנתי במרקם ארוג עמיד, בדגם מזוודה עם ידית ורצועת כתף. הבחירה של הנערים שרוצים משהו צעיר ומודרני.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "כחול ג'ינס",
      "material": "בד ארוג",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.13.jpeg"
    },
    {
      "id": 6,
      "name": "לבן קפיטונאז' – ברכת כהנים זהב",
      "description": "הדר של ממש: לבן ונקי עם כתר וברכת כהנים בהבלטת זהב, תפילין מצופי זהב וטלית עם פסי זהב. סט חגיגי במיוחד לחתן בר המצווה.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "לבן וזהב",
      "material": "דמוי עור בתפר קפיטונאז'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.28 (1).jpeg"
    },
    {
      "id": 7,
      "name": "לבן קפיטונאז' – מנורה זהב",
      "description": "מנורת המקדש ו'שיויתי ה' לנגדי תמיד' בכתב זהב על רקע לבן מפואר. סט מתנה מרשים במיוחד.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "לבן וזהב",
      "material": "דמוי עור בתפר קפיטונאז'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.28 (2).jpeg"
    },
    {
      "id": 8,
      "name": "שחור קפיטונאז' – ברכת כהנים כסף",
      "description": "שחור-כסף בקו נקי ומכובד. הדגם הקלאסי שמתאים גם לבר מצווה וגם למבוגרים שמחפשים סט לכל החיים.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "שחור וכסף",
      "material": "דמוי עור בתפר קפיטונאז'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.28.jpeg"
    },
    {
      "id": 9,
      "name": "שחור קפיטונאז' – ברכת כהנים זהב",
      "description": "ניגוד עשיר של שחור וזהב, עם כתר וברכת כהנים בהבלטה. אותו קו קלאסי בגרסה חמה ומפוארת יותר.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "שחור וזהב",
      "material": "דמוי עור בתפר קפיטונאז'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.29 (1).jpeg"
    },
    {
      "id": 10,
      "name": "לבן קפיטונאז' – מנורה כסף",
      "description": "לבן על לבן עם מנורה וכיתוב 'מציון תצא תורה' בכסף. מושלם למי שמעדיף פאר עדין ולא בולט.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "לבן וכסף",
      "material": "דמוי עור בתפר קפיטונאז'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.29.jpeg"
    },
    {
      "id": 11,
      "name": "חום עור – דגם מזוודה",
      "description": "מראה עור וינטג' חם עם אביזרי זהב וידית נשיאה. סט בוגר ומכובד שנראה כמו תיק מסמכים אלגנטי.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "חום",
      "material": "דמוי עור בגימור וינטג'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.45 (1).jpeg"
    },
    {
      "id": 12,
      "name": "לבן עור – דגם מזוודה מלכותי",
      "description": "סט הדגל: לבן מלכותי עם כתר וברכת כהנים בהבלטה, ידית נשיאה, וגם ספר תהלים תואם. מתנה שנותנת תחושת אירוע.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "לבן",
      "material": "דמוי עור בתפר קפיטונאז'",
      "imageName": "WhatsApp Image 2026-08-07 at 12.16.45.jpeg"
    },
    {
      "id": 13,
      "name": "קטיפה נייבי – עיטור קלאסי",
      "description": "הקלאסיקה שלא מתיישנת: קטיפה עמוקה עם רקמת זהב וכסף ועיטור פינתי. סט מסורתי במחיר נגיש.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "כחול נייבי",
      "material": "קטיפה",
      "imageName": "WhatsApp Image 2026-08-07 at 12.17.01 (1).jpeg"
    },
    {
      "id": 14,
      "name": "קטיפה כחול רויאל – פרחוני",
      "description": "רקמה פרחונית עשירה בזהב וכסף על קטיפה כחולה עזה, עם תפילין מצופי זהב. סט עשיר למראה.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "כחול רויאל",
      "material": "קטיפה",
      "imageName": "WhatsApp Image 2026-08-07 at 12.17.01 (2).jpeg"
    },
    {
      "id": 15,
      "name": "קטיפה כחול רויאל – רקמת כסף",
      "description": "גרסה מונוכרומטית ומאופקת של הדגם הפרחוני — רקמת עלים בכסף בלבד על כחול. נקי ומרשים.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "כחול רויאל",
      "material": "קטיפה",
      "imageName": "WhatsApp Image 2026-08-07 at 12.17.01.jpeg"
    },
    {
      "id": 16,
      "name": "קטיפה נייבי – רקמת עלים",
      "description": "סט קטיפה מסורתי בגוון נייבי כהה עם רקמת עלים דו-גונית בזהב וכסף. בחירה בטוחה ומכובדת.",
      "categories": [
        "sets",
        "cases"
      ],
      "color": "כחול נייבי",
      "material": "קטיפה",
      "imageName": "WhatsApp Image 2026-08-07 at 12.17.02.jpeg"
    },
    {
      "id": 17,
      "name": "ארץ ישראל – נרתיקים לבן/זהב",
      "description": "זוג נרתיקי טלית ותפילין בהדפס מפת ארץ ישראל ובתוכה נוף ירושלים, לצד דגל, מגן דוד, ענף זית וברכת כהנים המלאה. נרתיקים בלבד, ללא תפילין וטלית.",
      "categories": [
        "cases"
      ],
      "color": "לבן עם הדפס חום-זהוב",
      "material": "בד",
      "imageName": "WhatsApp Image 2026-08-26 at 21.10.55 (1).jpeg"
    },
    {
      "id": 18,
      "name": "ארץ ישראל – נרתיקים לבן/כחול",
      "description": "אותו עיצוב של סדרת ארץ ישראל בהדפס כחול. זוג נרתיקי טלית ותפילין בלבד.",
      "categories": [
        "cases"
      ],
      "color": "לבן עם הדפס כחול",
      "material": "בד",
      "imageName": "WhatsApp Image 2026-08-26 at 21.10.55 (2).jpeg"
    },
    {
      "id": 19,
      "name": "ארץ ישראל – נרתיקים בז'/חום",
      "description": "גרסת דמוי הזמש של סדרת ארץ ישראל, בהדפס טון-על-טון עם ניקוד מלא בברכת כהנים.",
      "categories": [
        "cases"
      ],
      "color": "בז' עם הדפס חום",
      "material": "דמוי זמש",
      "imageName": "WhatsApp Image 2026-08-26 at 21.10.55.jpeg"
    },
    {
      "id": 20,
      "name": "גימור בתים – שחור עם לוחית זהב",
      "description": "בתים שחורים קלאסיים עם מסגרת קישוטית וכיתוב 'תפילין של ראש / של יד' בזהב.",
      "categories": [
        "tefillin"
      ],
      "color": "שחור וזהב",
      "material": "עור צבוע",
      "imageName": "WhatsApp Image 2026-08-07 at 12.32.16 (1).jpeg"
    },
    {
      "id": 21,
      "name": "גימור בתים – כסף מלא",
      "description": "בתים ותושבת מצופים כסף עם כיתוב מובלט. גימור בולט ומרשים.",
      "categories": [
        "tefillin"
      ],
      "color": "כסף",
      "material": "ציפוי כסף על בתי עור",
      "imageName": "WhatsApp Image 2026-08-26 at 10.43.49 (2).jpeg"
    },
    {
      "id": 22,
      "name": "גימור בתים – שחור עם לוחית כסף-פנינה",
      "description": "בתי רש\"י שחורים עם לוחית מעוטרת בגוון פנינה ומסגרת קישוטית עשירה.",
      "categories": [
        "tefillin"
      ],
      "color": "שחור עם פנינה וכסף",
      "material": "עור צבוע",
      "imageName": "WhatsApp Image 2026-08-26 at 10.43.49 (1).jpeg"
    },
    {
      "id": 23,
      "name": "גימור בתים – שחור עם כיתוב זהב",
      "description": "בתי רש\"י שחורים מט עם מסגרת וכיתוב בזהב. הגימור הנפוץ והקלאסי.",
      "categories": [
        "tefillin"
      ],
      "color": "שחור וזהב",
      "material": "עור צבוע",
      "imageName": "WhatsApp Image 2026-08-26 at 10.43.49 (3).jpeg"
    },
    {
      "id": 24,
      "name": "גימור בתים – שנהב עם זהב",
      "description": "בתי רש\"י בגוון שנהב עם כיתוב וקישוט זהב — הגימור הבולט ביותר מבין הסדרה.",
      "categories": [
        "tefillin"
      ],
      "color": "שנהב וזהב",
      "material": "בתים בגימור בהיר",
      "imageName": "WhatsApp Image 2026-08-26 at 10.43.49.jpeg"
    },
    {
      "id": 25,
      "name": "גימור בתים – זהב מלא",
      "description": "בתים ותושבת מצופים זהב עם כיתוב מובלט. הגימור היוקרתי בסדרה.",
      "categories": [
        "tefillin"
      ],
      "color": "זהב",
      "material": "ציפוי זהב על בתי עור",
      "imageName": "WhatsApp Image 2026-08-26 at 10.43.50.jpeg"
    },
    {
      "id": 26,
      "name": "קלף פיטום הקטורת עם מנורה",
      "description": "קלף כתוב ביד בכתב סת\"ם, ובו פיטום הקטורת המלא לצד מנורת 'שיויתי ה' לנגדי תמיד' הכתובה באותיות. מיועד למסגור או לאלבום.",
      "categories": [
        "klaf-art"
      ],
      "color": "קלף טבעי עם דיו שחורה",
      "material": "קלף",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.23 (1).jpeg"
    },
    {
      "id": 27,
      "name": "קלף אגרת הרמב\"ן",
      "description": "אגרת הרמב\"ן במלואה על קלף כתוב ביד, עם עיטור מנורה בתחתית. מתנה משמעותית לבר מצווה או לחתן.",
      "categories": [
        "klaf-art"
      ],
      "color": "קלף טבעי עם דיו שחורה",
      "material": "קלף",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.23 (2).jpeg"
    },
    {
      "id": 28,
      "name": "אלבום פיטום הקטורת – עור חום",
      "description": "אלבום עור חום קלאסי עם הטבעת זהב 'ועשית אותה קטורת רוקח מעשה רוקח', ובתוכו קלף פיטום הקטורת.",
      "categories": [
        "klaf-art"
      ],
      "color": "חום כהה",
      "material": "דמוי עור עם הטבעת זהב",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.24 (1).jpeg"
    },
    {
      "id": 29,
      "name": "אלבום פיטום הקטורת – שחור וזהב עם כתר",
      "description": "הדגם המפואר: שחור עמוק ברקע מעוין עם ניטים זהובים וכתר זהב תלת-ממדי בולט. מתנה שמכובדת עוד לפני שפותחים אותה.",
      "categories": [
        "klaf-art"
      ],
      "color": "שחור וזהב",
      "material": "דמוי עור בתפר מעוין",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.24 (2).jpeg"
    },
    {
      "id": 30,
      "name": "אלבום פיטום הקטורת – עור בורדו",
      "description": "עיצוב ספרייה קלאסי בגוון בורדו חם עם הטבעה פרחונית וקו זהב. הבחירה למי שמעדיף מראה מסורתי ומאופק.",
      "categories": [
        "klaf-art"
      ],
      "color": "בורדו",
      "material": "דמוי עור עם הטבעה",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.24.jpeg"
    },
    {
      "id": 31,
      "name": "אלבום פיטום הקטורת – לבן וכסף עם כתר",
      "description": "גרסה לבנה-כסופה של דגם הכתר, עם כתר כסף בולט ותפר מעוין. אלגנטי ובהיר, מתאים כמתנה לחתונה או לבית חדש.",
      "categories": [
        "klaf-art"
      ],
      "color": "לבן שבור וכסף",
      "material": "דמוי עור בתפר מעוין",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.24 (4).jpeg"
    },
    {
      "id": 32,
      "name": "ברכת כהנים בחיתוך סטנסיל – ממוסגר",
      "description": "יצירת קלף ייחודית: ברכת כהנים ו'אמן' עם עיטורי פרחים חתוכים בסטנסיל, ממוסגרת ומוכנה לתלייה. שים לב — יש שגיאות כתיב בטקסט הנוכחי ('דסד' במקום 'חסד') שיש לתקן לפני הפקה נוספת.",
      "categories": [
        "klaf-art"
      ],
      "color": "קלף בהיר במסגרת שחורה",
      "material": "קלף חתוך בסטנסיל, מסגרת עץ וזכוכית",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.23 (3).jpeg",
      "needsReview": "שגיאת כתיב בטקסט הקלף (\"דסד\" במקום \"חסד\") — לתקן לפני הפקה נוספת"
    },
    {
      "id": 33,
      "name": "בית מגילה מיניאטורי בקופסת מתנה",
      "description": "פריט אספנות קטן ומרהיב: בית מגילה מגולף בכסף וזהב עם כתר, מוגש בקופסת מתנה ירוקה מרופדת.",
      "categories": [
        "judaica"
      ],
      "color": "כסף וזהב",
      "material": "מתכת מצופה",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.20.jpeg"
    },
    {
      "id": 34,
      "name": "מגילת אסתר מאוירת ספרדי (מתחרה)",
      "description": "מגילת אסתר מאוירת עם עץ חיים בכסף, מאתר תפארה ART. מחיר 27,900 ₪ (במקום 29,900 ₪). לצורכי השוואת שוק.",
      "categories": [],
      "color": "קלף טבעי עם איור חום",
      "material": "קלף מאויר",
      "imageName": "WhatsApp Image 2026-08-11 at 20.18.02.jpeg",
      "internal": true,
      "internalTag": "competitor",
      "internalReason": "מוצר מתחרה (תפארה ART) — להשוואת שוק בלבד"
    },
    {
      "id": 35,
      "name": "מגילה מצוירת (מתחרה)",
      "description": "מגילה מוארת בצבע מאתר תפארה ART, ללא מחיר מוצג. לצורכי השוואת שוק והשראה עיצובית.",
      "categories": [],
      "color": "קלף עם איור צבעוני",
      "material": "קלף מאויר",
      "imageName": "WhatsApp Image 2026-08-11 at 20.19.51.jpeg",
      "internal": true,
      "internalTag": "competitor",
      "internalReason": "מוצר מתחרה (תפארה ART) — להשוואת שוק בלבד"
    },
    {
      "id": 36,
      "name": "מגילה על רקע שיש – תמונת מוצר",
      "description": "תמונת מוצר מעוצבת של מגילה עם עצי גליל בכסף וזהב וכתר, על רקע שיש. ככל הנראה תמונה מעובדת או שנוצרה בבינה מלאכותית — לא צילום של פריט קיים.",
      "categories": [],
      "color": "קלף, כסף וזהב",
      "material": "קלף עם עצי גליל מתכת",
      "imageName": "WhatsApp Image 2026-08-21 at 11.56.20 (1).jpeg",
      "internal": true,
      "internalTag": "review",
      "internalReason": "תמונה מעובדת/AI — לא צילום של פריט קיים"
    },
    {
      "id": 37,
      "name": "בתים שפירא 'פרודות'",
      "description": "בתים מהודרים מבית שפירא — אשכנז/אר\"י/ספרד, ריבוע רגל, מכוון, פרודות. מחיר 1,000 ₪ באתר stj.co.il.",
      "categories": [],
      "color": "שחור עם כיתוב זהב",
      "material": "עור אמריקאי",
      "imageName": "WhatsApp Image 2026-08-26 at 08.18.24.jpeg",
      "internal": true,
      "internalTag": "competitor",
      "internalReason": "בתי שפירא מאתר stj.co.il עם מחיר ספק — לא לפרסום"
    },
    {
      "id": 38,
      "name": "תעודת כשרות – מכון יד רפאל (09857)",
      "description": "תווית כשרות בהשגחת הרה\"ג שלמה מועלם שליט\"א: פרודות, ללא חשש נקב, עור אמריקאי ללא חשש מליחה ועיבוד נכרי, שי\"ן משוך כולו ביד, ריבוע רגל, מכוון.",
      "categories": [],
      "color": null,
      "material": null,
      "imageName": "WhatsApp Image 2026-08-26 at 08.12.57.jpeg",
      "internal": true,
      "internalTag": "kashrut",
      "internalReason": "תעודת כשרות — תיעוד פנימי"
    },
    {
      "id": 39,
      "name": "תג כשרות – שפירא 'התפילין המהודרות'",
      "description": "תג מוצר: מעור משובח, ללא שום חשש בכור, העיבוד בסיד בעבודת יד, השי\"ן משוך ביד, חוט התפירה בין בית לבית. כשר למהדרין מן המהדרין.",
      "categories": [],
      "color": null,
      "material": null,
      "imageName": "WhatsApp Image 2026-08-26 at 08.15.22.jpeg",
      "internal": true,
      "internalTag": "kashrut",
      "internalReason": "תג כשרות של ספק — תיעוד פנימי"
    },
    {
      "id": 40,
      "name": "סימון פנימי – בתי שפירא",
      "description": "תווית זיהוי פנימית על הבית: עור אמריקאי, ר\"ר מכוונות, אדום, מתוק.",
      "categories": [],
      "color": null,
      "material": "עור אמריקאי",
      "imageName": "WhatsApp Image 2026-08-26 at 08.16.12.jpeg",
      "internal": true,
      "internalTag": "kashrut",
      "internalReason": "סימון פנימי על הבית — תיעוד פנימי"
    },
    {
      "id": 41,
      "name": "בתים 'בצפונים'",
      "description": "בתים שחורים עם שי\"ן בולט וחותם זהב. מידות: 22 מ\"מ גובה על 24 מ\"מ.",
      "categories": [
        "tefillin"
      ],
      "color": "שחור",
      "material": "עור צבוע",
      "imageName": "WhatsApp Image 2026-08-26 at 10.28.54.jpeg"
    },
    {
      "id": 42,
      "name": "כשרות 'תפילין מהודרות' – הרב משה שאול קליין",
      "description": "שישה סעיפי הידור: מעור בהמה גסה, עיבוד העור בסיד ביד, ללא חשש בכור, שי\"ן משוך ביד לחומרא, חוט התפירה בין בית לבית, פרודות.",
      "categories": [],
      "color": null,
      "material": "עור בהמה גסה",
      "imageName": "WhatsApp Image 2026-08-26 at 15.14.46.jpeg",
      "internal": true,
      "internalTag": "kashrut",
      "internalReason": "תעודת כשרות — תיעוד פנימי"
    },
    {
      "id": 43,
      "name": "כשרות 'מעלין בקודש מיוחד'",
      "description": "שמונה סעיפי הידור בהשגחת הרב משה שאול קליין שליט\"א — כולל את ששת הסעיפים הקודמים בתוספת ריבוע רגל ומכוון.",
      "categories": [],
      "color": null,
      "material": "עור בהמה גסה",
      "imageName": "WhatsApp Image 2026-08-26 at 15.16.00.jpeg",
      "internal": true,
      "internalTag": "kashrut",
      "internalReason": "תעודת כשרות — תיעוד פנימי"
    },
    {
      "id": 44,
      "name": "מדבקת כשרות 13310",
      "description": "מדבקת 'תפילין מהודרים': שי\"ן משוך מתוך הבית, מחובר עם כנפיים.",
      "categories": [],
      "color": null,
      "material": null,
      "imageName": "WhatsApp Image 2026-08-26 at 15.18.37.jpeg",
      "internal": true,
      "internalTag": "kashrut",
      "internalReason": "מדבקת כשרות — תיעוד פנימי"
    },
    {
      "id": 45,
      "name": "תעודת משמרת סת\"ם (660318)",
      "description": "כתב הודעה, רשות בי\"ד ומכתב קבלה מטעם משמרת סת\"ם בבני ברק, על שם שפירא קדימה. מסמך אישי — יש לאשר עם הספק לפני פרסום, ולשקול טשטוש מספר התעודה.",
      "categories": [],
      "color": null,
      "material": null,
      "imageName": "WhatsApp Image 2026-08-26 at 10.44.32.jpeg",
      "internal": true,
      "internalTag": "private",
      "internalReason": "מסמך אישי עם מספר תעודה ושם ספק — אין לפרסם"
    },
    {
      "id": 46,
      "name": "רצועות בית יוסף",
      "description": "רצועות מהודרות עור עליון בעבודת יד — העיבוד, הצביעה והחיתוך כולם ביד. גליל 88 מטר ברוחב 15 מ\"מ, בכשרות בי\"ד בית יוסף.",
      "categories": [],
      "color": "שחור",
      "material": "עור עליון עבודת יד",
      "imageName": "WhatsApp Image 2026-08-26 at 10.39.41.jpeg",
      "internal": true,
      "internalTag": "supply",
      "internalReason": "גליל רצועות 88 מ׳ מהספק — חומר גלם, לא מוצר צרכני"
    },
    {
      "id": 47,
      "name": "רצועות עטרת",
      "description": "רצועות עור תחתון בעבודת מכונה, ברוחב 15 מ\"מ, בהשגחת הרה\"ג חיים אלמקייס שליט\"א מאשדוד.",
      "categories": [],
      "color": "שחור",
      "material": "עור תחתון עבודת מכונה",
      "imageName": "WhatsApp Image 2026-08-26 at 15.21.50.jpeg",
      "internal": true,
      "internalTag": "supply",
      "internalReason": "גליל רצועות מהספק — חומר גלם, לא מוצר צרכני"
    },
    {
      "id": 49,
      "name": "ארגז בתים גולמיים לפני צביעה",
      "description": "כשלושים בתים גולמיים בגוון אפור עם שי\"ן מובלט, לפני שלב הצביעה. חומר גלם מצוין לתוכן 'מאחורי הקלעים' באתר וברשתות.",
      "categories": [],
      "color": "אפור",
      "material": "עור מעובד לפני צביעה",
      "imageName": "WhatsApp Image 2026-08-26 at 15.36.01.jpeg",
      "internal": true,
      "internalTag": "bts",
      "internalReason": "תמונת סדנה — מאחורי הקלעים"
    },
    {
      "id": 50,
      "name": "בתים אחרי צביעה – שולחן עבודה",
      "description": "זוגות בתים שחורים מבריקים עם שי\"ן ומדבקות כשרות, מצולמים על שולחן העבודה בסדנה.",
      "categories": [],
      "color": "שחור מבריק",
      "material": "עור צבוע",
      "imageName": "WhatsApp Image 2026-08-26 at 15.18.52.jpeg",
      "internal": true,
      "internalTag": "bts",
      "internalReason": "תמונת סדנה — מאחורי הקלעים"
    },
    {
      "id": 52,
      "name": "באנר שיווקי 'מלכותא'",
      "description": "באנר פרסומי — 'להנגיש את הנצח לדור המסכים' בחוויית O.D.T, עם קריאה לפרטים והזמנת סדנה. השראה לשפה שיווקית.",
      "categories": [],
      "color": null,
      "material": null,
      "imageName": "WhatsApp Image 2026-08-19 at 20.59.23.jpeg",
      "internal": true,
      "internalTag": "marketing",
      "internalReason": "באנר שיווקי — לא מוצר"
    },
    {
      "id": 54,
      "name": "סטנסיל מנדלה",
      "description": "סטנסיל חתוך בלייזר עם דוגמה פרחונית וגיאומטרית, לשימוש בייצור קלפים מעוטרים.",
      "categories": [],
      "color": "תכלת",
      "material": "פלסטיק חתוך לייזר",
      "imageName": "WhatsApp Image 2026-08-11 at 20.21.15.jpeg",
      "internal": true,
      "internalTag": "bts",
      "internalReason": "כלי עבודה בסדנה — לא מוצר"
    },
    {
      "id": 55,
      "name": "סטנסיל 'קטורת'",
      "description": "רצועת קלף עם המילה 'קטורת' בשלב עבודה, מצולמת על משטח עץ צבוע כחול בסדנה.",
      "categories": [],
      "color": "קלף בהיר",
      "material": "קלף",
      "imageName": "WhatsApp Image 2026-08-18 at 12.50.18.jpeg",
      "internal": true,
      "internalTag": "bts",
      "internalReason": "תמונת תהליך עבודה — מאחורי הקלעים"
    }
  ]
};
