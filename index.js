let issues = [
    { id: 1, region: "Ташкент", category: "Авария трубы", address: "Юнусабад 4-й квартал, дом 12", desc: "Сильная течь под землей, вода вытекает на асфальт.", status: "new", date: "Сегодня, 14:20" },
    { id: 2, region: "Самарканд", category: "Утечка в арыке", address: "ул. Регистанская, 45", desc: "Засор и утечка воды из поливного канала.", status: "progress", date: "Вчера, 10:15" },
    { id: 3, region: "Бухара", category: "Авария трубы", address: "м-р Бахауддин Накшбанд, 8", desc: "Прорыв трубы холодного водоснабжения ликвидирован.", status: "resolved", date: "5 окт, 09:00" },
    { id: 4, region: "Фергана", category: "Авария трубы", address: "ул. Алишера Навои, 89", desc: "Порыв магистральной трубы у школы №4.", status: "new", date: "Только что, 18:00" }
];

function detectDeviceType() {
    const width = window.innerWidth;
    const indicator = document.getElementById('device-indicator');
    const mobileName = document.getElementById('mobile-device-name');
    
    let text = "Ноутбук (Десктоп)";
    if (width < 640) {
        text = "Смартфон";
    } else if (width >= 640 && width < 1024) {
        text = "Планшет";
    }
    
    if (indicator) indicator.innerText = text;
    if (mobileName) mobileName.innerText = text;
}

window.addEventListener('resize', detectDeviceType);
document.addEventListener('DOMContentLoaded', () => {
    detectDeviceType();
    renderIssues('all');
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-white', 'bg-cyan-600', 'shadow-md');
        btn.classList.add('text-slate-400');
    });

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('text-white', 'bg-cyan-600', 'shadow-md');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function openModal() {
    document.getElementById('report-modal').classList.remove('hidden');
    document.getElementById('report-modal').classList.add('flex');
}

function closeModal() {
    document.getElementById('report-modal').classList.add('hidden');
    document.getElementById('report-modal').classList.remove('flex');
}

function setLang(lang) {
    document.getElementById('lang-ru').className = lang === 'ru' ? 'px-2.5 py-1 rounded-full bg-cyan-600 text-white shadow' : 'px-2.5 py-1 rounded-full text-slate-400 hover:text-white transition';
    document.getElementById('lang-uz').className = lang === 'uz' ? 'px-2.5 py-1 rounded-full bg-cyan-600 text-white shadow' : 'px-2.5 py-1 rounded-full text-slate-400 hover:text-white transition';
}

function renderIssues(filter = 'all') {
    const listContainer = document.getElementById('issues-list');
    listContainer.innerHTML = '';

    let filtered = issues;
    if (filter !== 'all') {
        filtered = issues.filter(i => i.status === filter);
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="p-8 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">Нет заявок с таким статусом</div>`;
        return;
    }

    filtered.forEach(item => {
        let badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        let statusText = 'Новая';
        if (item.status === 'progress') {
            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            statusText = 'В работе';
        } else if (item.status === 'resolved') {
            badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            statusText = 'Устранено';
        }

        const card = document.createElement('div');
        card.className = "p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3";
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}">${statusText}</span>
                <span class="text-xs text-slate-500 font-medium">${item.date}</span>
            </div>
            <div>
                <h4 class="font-bold text-white text-base">${item.region} — ${item.category}</h4>
                <p class="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
                    <i class="fa-solid fa-location-dot text-cyan-400"></i>
                    <span>${item.address}</span>
                </p>
            </div>
            <p class="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">${item.desc}</p>
        `;
        listContainer.appendChild(card);
    });

    document.getElementById('total-points-count').innerText = issues.length;
}

function filterIssues(status) {
    ['all', 'new', 'progress', 'resolved'].forEach(s => {
        const btn = document.getElementById(`filter-${s}`);
        if (btn) {
            btn.className = s === status 
                ? "px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold transition shadow" 
                : "px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition";
        }
    });
    renderIssues(status);
}

function submitIssue(e) {
    e.preventDefault();
    const region = document.getElementById('form-region').value;
    const category = document.getElementById('form-category').value;
    const address = document.getElementById('form-address').value;
    const desc = document.getElementById('form-desc').value;

    const newIssue = {
        id: issues.length + 1,
        region,
        category,
        address,
        desc,
        status: "new",
        date: "Только что"
    };

    issues.unshift(newIssue);
    renderIssues('all');
    closeModal();
    document.getElementById('issue-form').reset();

    document.getElementById('stat-active').innerText = parseInt(document.getElementById('stat-active').innerText) + 1;

    alert("Заявка успешно отправлена и зафиксирована на карте!");
}

function selectMarker(regionName) {
    switchTab('map');
    alert(`Регион: ${regionName}. Просмотр инцидентов и статусов бригад.`);
}

document.addEventListener('DOMContentLoaded', () => {
    const calcType = document.getElementById('calc-type');
    const calcTime = document.getElementById('calc-time');

    function updateCalculator() {
        const litersPerDay = parseInt(calcType.value);
        const days = parseInt(calcTime.value);
        const totalLiters = litersPerDay * days;
        const totalCost = Math.round(totalLiters * 12);

        document.getElementById('calc-result-liters').innerText = totalLiters.toLocaleString() + ' л';
        document.getElementById('calc-result-cost').innerText = totalCost.toLocaleString() + ' сум';
    }

    if (calcType && calcTime) {
        calcType.addEventListener('change', updateCalculator);
        calcTime.addEventListener('change', updateCalculator);
        updateCalculator();
    }
});