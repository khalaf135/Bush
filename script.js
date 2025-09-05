// ---- اللغة + التصنيفات (بدون "الكل") ----
const LANG = { current: 'ar' }; // 'ar' or 'en'

const CATS = [
  { id: 'coffee',  name_ar: 'قهوة',             name_en: 'Coffee' },
  { id: 'drinks',  name_ar: 'مشروبات',          name_en: 'Drinks' },
  { id: 'bakery',  name_ar: 'مخبوزات',          name_en: 'Bakery' },
  { id: 'sweets',  name_ar: 'حلويات',           name_en: 'Sweets' },
  { id: 'beans',   name_ar: 'أنواع البن/محامص', name_en: 'Beans / Roasters' },
];

// ---- عناصر المنيو (عدّل الأسماء/الأسعار هنا) ----
const ITEMS = [
  // Coffee
  { id:'v60-hot',  cat:'coffee', name_ar:'V60 (حار)', name_en:'V60 · Hot',  price:14.0, note_ar:'قهوة ترشيح', note_en:'Pour-over' },
  { id:'v60-cold', cat:'coffee', name_ar:'V60 (بارد)', name_en:'V60 · Cold', price:16.0, note_ar:'', note_en:'' },
  { id:'cof-day-h',cat:'coffee', name_ar:'قهوة اليوم (حار)', name_en:'Hot Coffee of the Day', price:12.0, note_ar:'', note_en:'' },
  { id:'cof-day-i',cat:'coffee', name_ar:'قهوة اليوم (بارد)', name_en:'Iced Coffee of the Day', price:14.0, note_ar:'', note_en:'' },

  // Drinks
  { id:'hib',      cat:'drinks', name_ar:'كركديه ', name_en:'Iced Hibiscus', price:9.95, note_ar:'', note_en:'' },
  { id:'iced-tea', cat:'drinks', name_ar:'آيس تي', name_en:'Iced Tea', price:9.95, note_ar:'', note_en:'' },
  { id:'matcha',   cat:'drinks', name_ar:'ماتشا ', name_en:'Matcha', price:9.95, note_ar:'', note_en:'' },
  { id:'water',    cat:'drinks', name_ar:'ماء', name_en:'Water', price:4.95, note_ar:'صغير', note_en:'Small' },

  // Bakery & Sweets
  { id:'victoria', cat:'sweets', name_ar:'كيكة فيكتوريا رول', name_en:'Victoriaroll Cake', price:6.50, note_ar:'', note_en:'' },
  { id:'magicbar', cat:'bakery', name_ar:'ماجيك بار', name_en:'Magic Bar', price:7.50, note_ar:'', note_en:'' },

  // Beans/Roasters
  { id:'w-roast',  cat:'beans', name_ar:'محمصة W', name_en:'W Roaster', price:55.0, note_ar:'250غ', note_en:'250g' },
  { id:'riyadh',   cat:'beans', name_ar:'محمصة الرياض', name_en:'Riyadh Roaster', price:55.0, note_ar:'250غ', note_en:'250g' },
  { id:'tricycle', cat:'beans', name_ar:'محمصة ترايسكل', name_en:'Tricycle Roaster', price:55.0, note_ar:'250غ', note_en:'250g' },
];

// ---- عناصر DOM ----
const catNav   = document.getElementById('catNav');
const grid     = document.getElementById('grid');
const searchEl = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearSearch');
const langAr   = document.getElementById('langAr');
const langEn   = document.getElementById('langEn');
const subTitle = document.getElementById('subTitle');
const footerNote = document.getElementById('footerNote');

let state = { cat: 'coffee', q: '' }; // تبويب افتراضي

// ---- وظائف ترجمة بسيطة ----
function tCat(catId){
  const c = CATS.find(c=>c.id===catId);
  return LANG.current === 'ar' ? c.name_ar : c.name_en;
}
function tItemName(item){ return LANG.current === 'ar' ? item.name_ar : item.name_en; }
function tItemNote(item){ return (LANG.current === 'ar' ? item.note_ar : item.note_en) || ''; }

function tUI(){
  if(LANG.current === 'ar'){
    document.documentElement.lang = 'ar';
    document.documentElement.dir  = 'rtl';
    searchEl.placeholder = 'ابحث في القائمة...';
    subTitle.textContent = 'قهوة مختصة · Specialty Coffee';
    footerNote.textContent = 'BUNH';
    langAr.classList.add('active');   langAr.setAttribute('aria-pressed','true');
    langEn.classList.remove('active');langEn.setAttribute('aria-pressed','false');
  }else{
    document.documentElement.lang = 'en';
    document.documentElement.dir  = 'ltr';
    searchEl.placeholder = 'Search the menu...';
    subTitle.textContent = 'Specialty Coffee · Crafted Menu';
    footerNote.textContent = 'Simple design inspired by BUNH board • Edit as you like';
    langEn.classList.add('active');   langEn.setAttribute('aria-pressed','true');
    langAr.classList.remove('active');langAr.setAttribute('aria-pressed','false');
  }
}

// ---- تصنيفات ----
function renderCats(){
  catNav.innerHTML = '';
  CATS.forEach((c)=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.type = 'button';
    btn.role = 'tab';
    btn.dataset.cat = c.id;
    btn.setAttribute('aria-selected', state.cat === c.id ? 'true' : 'false');
    btn.textContent = LANG.current === 'ar' ? c.name_ar : c.name_en;
    btn.addEventListener('click', ()=>{
      state.cat = c.id;
      document.querySelectorAll('.cat-btn').forEach(b=>b.setAttribute('aria-selected','false'));
      btn.setAttribute('aria-selected','true');
      renderGrid();
      grid.scrollIntoView({behavior:'smooth', block:'start'});
    });
    catNav.appendChild(btn);
  });
}

// ---- بطاقات ----
function renderGrid(){
  const q = state.q.trim().toLowerCase();
  const filtered = ITEMS.filter(item=>{
    const inCat = item.cat === state.cat;
    const text = `${item.name_ar} ${item.name_en} ${item.note_ar} ${item.note_en}`.toLowerCase();
    const inSearch = q ? text.includes(q) : true;
    return inCat && inSearch;
  });

  if(filtered.length === 0){
    grid.innerHTML = `<p class="subtitle small">${LANG.current==='ar'?'لا توجد عناصر.':'No items found.'}</p>`;
    return;
  }

  grid.innerHTML = filtered.map(item=>{
    const price = (Math.round(item.price * 100) / 100).toFixed(2);
    const badge = tCat(item.cat);
    const note  = tItemNote(item);
    return `
      <article class="card" tabindex="0">
        <span class="badge">${badge}</span>
        <h3 class="title">${tItemName(item)}</h3>
        <p class="subtitle small">${note}</p>
        <div class="footer-tag">
          <span class="price">${LANG.current==='ar' ? `${price} ر.س` : `${price} SAR`}</span>
          <span class="badge" aria-hidden="true">BUNH</span>
        </div>
      </article>
    `;
  }).join('');
}

// ---- بحث ----
searchEl.addEventListener('input', (e)=>{
  state.q = e.target.value;
  renderGrid();
});
clearBtn.addEventListener('click', ()=>{
  searchEl.value = '';
  state.q = '';
  renderGrid();
  searchEl.focus();
});

// ---- تبديل اللغة ----
langAr.addEventListener('click', ()=>{
  LANG.current = 'ar'; tUI(); renderCats(); renderGrid();
});
langEn.addEventListener('click', ()=>{
  LANG.current = 'en'; tUI(); renderCats(); renderGrid();
});

// ---- Init ----
tUI();
renderCats();
renderGrid();
