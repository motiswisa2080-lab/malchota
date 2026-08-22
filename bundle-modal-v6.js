// Malchota Tefillin Visual Configurator - Vanilla JS
document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_NUMBER = '972535502797';

    // State
    let state = {
        step: 1,
        tefillinType: 'dakot', // 'dakot' or 'gasot'
        dakotSub: 'regular', // 'regular' or 'eizenbach'
        gasotSub: 'stern', // 'stern', 'klein', 'moalem', 'square', 'compact', 'pitzponim', '4x4'
        soferType: 'srugi', // 'srugi' or 'avrech' (for regular gasot)
        klafType: 'kosher', // depends on selection
        strapsWork: 'machine', // 'machine' or 'handmade'
        strapsSides: 1, // 1 or 2
        boxType: 'standard', // 'standard' or 'upgrade'
        embroideryName: ''
    };

    // Prices database
    const prices = {
        dakot: { regular: 120, eizenbach: 180 },
        gasot: { stern: 550, klein: 650, moalem: 700, square: 850, compact: 1000, pitzponim: 1200, '4x4': 1400 },
        klaf: {
            dakot: { kosher: 750, mehudar: 1000 },
            regularGasot: { kosher: 750, mehudar: 1000, 'mehudar-plus': 1500 },
            compact: { kosher: 1200, mehudar: 1500, 'mehudar-plus': 1800 },
            pitzponim: { mehudar: 2000, 'mehudar-plus': 2600 },
            '4x4': { kosher: 1500, mehudar: 1900 }
        },
        straps: { machine: 35, handmade: 50 },
        assembly: 150, // תפירה, סגירה וצביעה חובה
        box: { dakot: 12, gasot: 15 }
    };

    // Render Configurator Modal HTML inside the page
    const modalContainer = document.createElement('div');
    modalContainer.id = 'tefillin-configurator-modal';
    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 hidden';
    modalContainer.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-right" dir="rtl">
            <button id="close-configurator" class="absolute top-4 left-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">התאמה אישית והרכבת תפילין</h2>
            <p class="text-sm text-gray-500 mb-6">בחר את המרכיבים בשקיפות מלאה לצراכיך</p>
            
            <div id="configurator-content"></div>
            
            <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                    <span class="text-gray-500 text-sm block">סה"כ לתשלום:</span>
                    <span id="live-total-price" class="text-2xl font-black text-[#c59b27]">0 ₪</span>
                </div>
                <div class="flex gap-2">
                    <button id="prev-step" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hidden">חזור</button>
                    <button id="next-step" class="px-4 py-2 bg-[#c59b27] text-white rounded-lg hover:bg-[#b08820] font-bold">המשך</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Expose open function globally so buttons on your site can trigger it
    window.openTefillinModal = function() {
        modalContainer.classList.remove('hidden');
        renderStep();
    };

    document.getElementById('close-configurator').addEventListener('click', () => {
        modalContainer.classList.add('hidden');
    });

    function calculateTotal() {
        let total = 0;
        // 1. Bayit
        if (state.tefillinType === 'dakot') {
            total += prices.dakot[state.dakotSub];
        } else {
            total += prices.gasot[state.gasotSub];
        }

        // 2. Klaf
        if (state.tefillinType === 'dakot') {
            total += prices.klaf.dakot[state.klafType] || 750;
        } else if (state.gasotSub === 'compact') {
            total += prices.klaf.compact[state.klafType] || 1200;
        } else if (state.gasotSub === 'pitzponim') {
            total += prices.klaf.pitzponim[state.klafType] || 2000;
        } else if (state.gasotSub === '4x4') {
            total += prices.klaf['4x4'][state.klafType] || 1500;
        } else {
            total += prices.klaf.regularGasot[state.klafType] || 750;
        }

        // 3. Straps
        total += prices.straps[state.strapsWork];

        // 4. Fixed Assembly + Box
        total += prices.assembly;
        total += prices.box[state.tefillinType];

        return total;
    }

    function renderStep() {
        const container = document.getElementById('configurator-content');
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        
        document.getElementById('live-total-price').innerText = calculateTotal() + ' ₪';
        prevBtn.classList.toggle('hidden', state.step === 1);

        if (state.step === 1) {
            nextBtn.innerText = 'המשך לקלף';
            container.innerHTML = `
                <h3 class="text-lg font-bold mb-4 text-gray-700">שלב 1: בחירת סוג הבית</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="border-2 p-4 rounded-xl cursor-pointer transition ${state.tefillinType === 'dakot' ? 'border-[#c59b27] bg-[#fdfbf7]' : 'border-gray-200'}" onclick="selectTefillinType('dakot')">
                        <h4 class="font-bold text-gray-800">בתים דקות</h4>
                        <p class="text-xs text-gray-500 mt-1">החל מ-120 ₪</p>
                    </div>
                    <div class="border-2 p-4 rounded-xl cursor-pointer transition ${state.tefillinType === 'gasot' ? 'border-[#c59b27] bg-[#fdfbf7]' : 'border-gray-200'}" onclick="selectTefillinType('gasot')">
                        <h4 class="font-bold text-gray-800">בתים גסות</h4>
                        <p class="text-xs text-gray-500 mt-1">החל מ-550 ₪</p>
                    </div>
                </div>
                <div class="mt-4">
                    ${state.tefillinType === 'dakot' ? `
                        <label class="block text-sm font-medium text-gray-700 mb-2">רמת הבית (דקות):</label>
                        <select id="dakot-sub-select" class="w-full p-2 border rounded-lg" onchange="updateDakotSub(this.value)">
                            <option value="regular" ${state.dakotSub === 'regular' ? 'selected' : ''}>בית רגיל (120 ₪)</option>
                            <option value="eizenbach" ${state.dakotSub === 'eizenbach' ? 'selected' : ''}>בית מהודר - איזנבאך עם כשרות (180 ₪)</option>
                        </select>
                    ` : `
                        <label class="block text-sm font-medium text-gray-700 mb-2">סוג ורמת הגסות:</label>
                        <select id="gasot-sub-select" class="w-full p-2 border rounded-lg" onchange="updateGasotSub(this.value)">
                            <option value="stern" ${state.gasotSub === 'stern' ? 'selected' : ''}>פרוד מלא - כשרות הרב שטרן (550 ₪)</option>
                            <option value="klein" ${state.gasotSub === 'gasot' ? 'selected' : ''}>פרוד מלא - כשרות הרב קליין / פדר (650 ₪)</option>
                            <option value="moalem" ${state.gasotSub === 'moalem' ? 'selected' : ''}>פרוד מלא - כשרות הרב מועלם (700 ₪)</option>
                            <option value="square" ${state.gasotSub === 'square' ? 'selected' : ''}>מכוונות ריבוע רגל - מועלם ושפירא (850 ₪)</option>
                            <option value="compact" ${state.gasotSub === 'compact' ? 'selected' : ''}>גס קומפקטי גודל 28 - שפירא (1,000 ₪)</option>
                            <option value="pitzponim" ${state.gasotSub === 'pitzponim' ? 'selected' : ''}>בתים פצפונים לרש"י ור"ת - שפירא (1,200 ₪)</option>
                            <option value="4x4" ${state.gasotSub === '4x4' ? 'selected' : ''}>גסות גדולות 4x4 (1,400 ₪)</option>
                        </select>
                    `}
                </div>
            `;
        } else if (state.step === 2) {
            nextBtn.innerText = 'המשך לרצועות';
            container.innerHTML = `
                <h3 class="text-lg font-bold mb-4 text-gray-700">שלב 2: בחירת קלף ופרשיות</h3>
                <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">רמת הידור וסופר:</label>
                    <select id="klaf-select" class="w-full p-2 border rounded-lg" onchange="updateKlaf(this.value)">
                        <option value="kosher" ${state.klafType === 'kosher' ? 'selected' : ''}>קלף כשר</option>
                        <option value="mehudar" ${state.klafType === 'mehudar' ? 'selected' : ''}>קלף מהודר</option>
                        <option value="mehudar-plus" ${state.klafType === 'mehudar-plus' ? 'selected' : ''}>קלף מהודר ביותר</option>
                    </select>
                </div>
            `;
        } else if (state.step === 3) {
            nextBtn.innerText = 'המשך לגימור';
            container.innerHTML = `
                <h3 class="text-lg font-bold mb-4 text-gray-700">שלב 3: בחירת רצועות עור</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="border-2 p-4 rounded-xl cursor-pointer transition ${state.strapsWork === 'machine' ? 'border-[#c59b27] bg-[#fdfbf7]' : 'border-gray-200'}" onclick="updateStraps('machine')">
                        <h4 class="font-bold text-gray-800">עבודת מכונה</h4>
                        <p class="text-xs text-gray-500 mt-1">35 ₪</p>
                    </div>
                    <div class="border-2 p-4 rounded-xl cursor-pointer transition ${state.strapsWork === 'handmade' ? 'border-[#c59b27] bg-[#fdfbf7]' : 'border-gray-200'}" onclick="updateStraps('handmade')">
                        <h4 class="font-bold text-gray-800">עבודת יד</h4>
                        <p class="text-xs text-gray-500 mt-1">50 ₪</p>
                    </div>
                </div>
            `;
        } else if (state.step === 4) {
            nextBtn.innerText = 'סיום ושליחה לוואטסאפ';
            container.innerHTML = `
                <h3 class="text-lg font-bold mb-4 text-gray-700">שלב 4: סיכום ופרטים אחרונים</h3>
                <div class="bg-gray-50 p-4 rounded-xl text-sm space-y-2 mb-4">
                    <p>✅ <b>תפירה, סגירה וצביעה:</b> כלול (150 ₪)</p>
                    <p>✅ <b>קופסה לתפילין:</b> כלול (${state.tefillinType === 'dakot' ? '12' : '15'} ₪)</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">הערות או שם להטבעה (רשות):</label>
                    <input type="text" id="embroidery-input" class="w-full p-2 border rounded-lg" value="${state.embroideryName}" oninput="state.embroideryName = this.value" placeholder="לדוגמה: ישראל ישראלי">
                </div>
            `;
        }
    }

    // Global helper functions for UI events
    window.selectTefillinType = (type) => { state.tefillinType = type; renderStep(); };
    window.updateDakotSub = (val) => { state.dakotSub = val; renderStep(); };
    window.updateGasotSub = (val) => { state.gasotSub = val; renderStep(); };
    window.updateKlaf = (val) => { state.klafType = val; renderStep(); };
    window.updateStraps = (val) => { state.strapsWork = val; renderStep(); };

    document.getElementById('next-step').addEventListener('click', () => {
        if (state.step < 4) {
            state.step++;
            renderStep();
        } else {
            // Submit order to WhatsApp
            let msg = `שלום! אני מעוניין להזמין תפילין בהתאמה אישית ממלכותא:\n`;
            msg += `- סוג הבית: ${state.tefillinType === 'dakot' ? 'דקות (' + state.dakotSub + ')' : 'גסות (' + state.gasotSub + ')'}\n`;
            msg += `- קלף: ${state.klafType}\n`;
            msg += `- רצועות: ${state.strapsWork}\n`;
            if (state.embroideryName) msg += `- שם להטבעה: ${state.embroideryName}\n`;
            msg += `סה"כ משוער: ${calculateTotal()} ₪`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
        }
    });

    document.getElementById('prev-step').addEventListener('click', () => {
        if (state.step > 1) {
            state.step--;
            renderStep();
        }
    });
});