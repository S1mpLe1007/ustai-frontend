import React, { useState } from 'react';
import RasmTahlil from './RasmTahlil';
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const MATERIALLAR = [
  { id: 'kafel', nom: 'Kafel', icon: '🟦', endpoint: '/hisob/kafel' },
  { id: 'oboy', nom: 'Oboy', icon: '📜', endpoint: '/hisob/oboy' },
  { id: 'gipsokarton', nom: 'Gips', icon: '⬜', endpoint: '/hisob/gipsokarton' },
  { id: 'pol', nom: 'Pol', icon: '🪵', endpoint: '/hisob/pol-qoplama' },
  { id: 'kraska', nom: 'Kraska', icon: '🪣', endpoint: '/hisob/suyuq-material' },
];

const XONA_TURLARI = ['yotoq xona', 'mehmon xona', 'oshxona', 'vannaxona', 'bolalar xonasi'];
const USLUBLAR = ['zamonaviy', 'klassik', 'minimalist', 'skandinaviya', 'industrial'];

const KEY_MAP = {
  joy: 'Joy', yuza_m2: 'Yuza (m²)', kafel_olchami: "O'lchami",
  kerakli_dona: 'Kerakli dona', taxminiy_quti: 'Quti soni', zaxira_foiz: 'Zaxira %',
  devor_yuzasi_m2: 'Devor yuzasi', rulon_olchami: "Rulon o'lchami",
  rulon_yuza_m2: 'Rulon yuzasi', kerakli_rulon: 'Kerakli rulon',
  umumiy_yuza_m2: 'Umumiy yuza', list_olchami: "List o'lchami",
  kerakli_list: 'Kerakli list', ud_profil_dona: 'UD profil',
  cd_profil_dona: 'CD profil', samorez_soni: 'Samorez',
  pol_yuzasi_m2: 'Pol yuzasi', taxta_olchami: "Taxta o'lchami",
  kerakli_taxta: 'Kerakli taxta', podlozka_m2: 'Podlozka',
  material: 'Material', qatlam_soni: 'Qatlam', umumiy_sarflanish: 'Sarflanish',
  birlik: 'Birlik', idish_hajmi: 'Idish', kerakli_idish: 'Kerakli idish',
  birlik_narxi: 'Birlik narxi', izoh: 'Izoh',
};

const MUHIM = ['kerakli_dona', 'taxminiy_quti', 'kerakli_rulon', 'kerakli_list', 'kerakli_taxta', 'kerakli_idish'];
const NARX = ['jami_material'];
const SKIP = ['list_narxi', 'ud_profil_narxi', 'cd_profil_narxi', 'laminat_narxi', 'podlozka_narxi'];

function NatijaKarta({ material, natija }) {
  const entries = Object.entries(natija).filter(([k]) => !SKIP.includes(k));
  return (
    <div className="natija-karta">
      <div className="natija-karta-bosh">
        <span>{material.icon}</span>
        {material.nom}
      </div>
      {entries.map(([key, val]) => {
        if (NARX.includes(key)) {
          return (
            <div key={key} className="natija-narx">
              <span>Jami narx</span>
              <b>{String(val)}</b>
            </div>
          );
        }
        if (MUHIM.includes(key)) {
          return (
            <div key={key} className="natija-qator natija-muhim">
              <span className="natija-kalit">{KEY_MAP[key] || key}</span>
              <span className="natija-qiymat">{String(val)}</span>
            </div>
          );
        }
        return (
          <div key={key} className="natija-qator">
            <span className="natija-kalit">{KEY_MAP[key] || key}</span>
            <span className="natija-qiymat">{String(val)}</span>
          </div>
        );
      })}
    </div>
  );
}

function AiBlok({ xona }) {
  const [xonaTuri, setXonaTuri] = useState('yotoq xona');
  const [uslub, setUslub] = useState('zamonaviy');
  const [maslahat, setMaslahat] = useState('');
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState('');

  const maslahatOl = async () => {
    setYuklanmoqda(true); setXato(''); setMaslahat('');
    try {
      const res = await fetch(`${API}/ai/dizayn-maslahat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uzunlik: xona.uzunlik, kenglik: xona.kenglik, balandlik: xona.balandlik, xona_turi: xonaTuri, uslub }),
      });
      const data = await res.json();
      if (data.muvaffaqiyat) setMaslahat(data.maslahat);
      else setXato(data.xato || 'Xatolik');
    } catch { setXato('Server bilan ulanishda muammo.'); }
    setYuklanmoqda(false);
  };

  return (
    <div className="ai-blok">
      <div className="ai-bosh">
        <span className="ai-badge">AI</span>
        <span className="ai-sarlavha">Dizayn maslahatchi</span>
      </div>
      <p className="ai-sub">Xona o'lchamlariga mos professional tavsiyalar oling</p>
      <div className="ai-sozlamalar">
        <div><label>Xona turi</label>
          <select value={xonaTuri} onChange={e => setXonaTuri(e.target.value)}>
            {XONA_TURLARI.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label>Dizayn uslubi</label>
          <select value={uslub} onChange={e => setUslub(e.target.value)}>
            {USLUBLAR.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
     <button className={`ai-btn ${yuklanmoqda ? 'yuklanyapti' : ''}`} onClick={maslahatOl} disabled={yuklanmoqda}>
  {yuklanmoqda ? '' : '✨ AI maslahat olish'}
</button>  
      {xato && <div style={{marginTop:'10px',color:'#fca5a5',fontSize:'13px'}}>⚠️ {xato}</div>}
      {maslahat && (
        <div className="ai-natija">
          <div className="ai-natija-title">🎨 Dizayn tavsiyalari</div>
          <div className="ai-matn">
            {maslahat.split('\n').map((q, i) => (
              <p key={i} className={q.startsWith('**') || /^\d\./.test(q) ? 'sarlavha' : ''}>
                {q.replace(/\*\*/g, '')}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [xona, setXona] = useState({ uzunlik: 5, kenglik: 4, balandlik: 2.7, eshiklar: 1, derazalar: 2 });
  const [tanlangan, setTanlangan] = useState({ kafel: true, oboy: true, gipsokarton: false, pol: false, kraska: false });
  const [natijalar, setNatijalar] = useState({});
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState('');
  const [mijozIsmi, setMijozIsmi] = useState('');

  const xonaOzgartir = e => setXona({ ...xona, [e.target.name]: parseFloat(e.target.value) || 0 });
  const materialTanla = id => setTanlangan({ ...tanlangan, [id]: !tanlangan[id] });

  const hisobla = async () => {
    setYuklanmoqda(true); setXato(''); setNatijalar({});
    const yangi = {};
    for (const m of MATERIALLAR) {
      if (!tanlangan[m.id]) continue;
      try {
        const body = m.id === 'kraska' ? { xona, material_turi: 'kraska', qatlam_soni: 2 } : { xona };
        const res = await fetch(`${API}${m.endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error();
        yangi[m.id] = await res.json();
      } catch { setXato('Server bilan ulanishda muammo.'); break; }
    }
    setNatijalar(yangi); setYuklanmoqda(false);
  };

  const smetaYukla = async () => {
    try {
      const res = await fetch(`${API}/smeta/yaratish`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xona, kafel: tanlangan.kafel, oboy: tanlangan.oboy, gipsokarton: tanlangan.gipsokarton, pol_qoplama: tanlangan.pol, kraska: tanlangan.kraska, mijoz_ismi: mijozIsmi || 'Mijoz' }),
      });
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `smeta_${mijozIsmi || 'mijoz'}.pdf`;
      a.click();
    } catch { setXato('PDF yuklab olishda xato.'); }
  };

  const tanlananSoni = Object.values(tanlangan).filter(Boolean).length;
  const polYuza = (xona.uzunlik * xona.kenglik).toFixed(1);
  const devorYuza = Math.max(0, 2*(xona.uzunlik+xona.kenglik)*xona.balandlik - xona.eshiklar*1.8 - xona.derazalar*1.68).toFixed(1);
  const hajm = (xona.uzunlik * xona.kenglik * xona.balandlik).toFixed(1);

  return (
    <div className="app">
      <div className="topbar">
        <div className="logo">
          <div className="logo-icon">🏗️</div>
          UstAI
        </div>
        <span className="pro-badge">Professional</span>
      </div>

      <div className="hero">
        <div className="hero-title">Xona remont hisobini boshlang</div>
        <div className="hero-sub">Materiallar, narxlar va AI dizayn maslahati — barchasi bir joyda</div>
        <div className="hero-chips">
  <span className="hero-chip aktiv" onClick={() => document.querySelector('.karta').scrollIntoView({behavior:'smooth'})}>📊 Hisob-kitob</span>
  <span className="hero-chip" onClick={() => document.querySelector('.ai-blok').scrollIntoView({behavior:'smooth'})}>✨ AI maslahat</span>
  <span className="hero-chip" onClick={() => document.querySelector('.pdf-btn')?.scrollIntoView({behavior:'smooth'})}>📄 PDF smeta</span>
  <span className="hero-chip" onClick={() => document.querySelector('.natija-narx')?.scrollIntoView({behavior:'smooth'})}>💰 Narxlar</span>
</div>
      </div>

      <div className="karta">
        <div className="karta-bosh">
          <div className="step-raqam">01</div>
          <span className="karta-sarlavha">Xona o'lchamlari</span>
        </div>
        <div className="input-grid">
          {['uzunlik','kenglik','balandlik'].map(nom => (
            <div key={nom} className="input-group">
              <label>{nom.charAt(0).toUpperCase()+nom.slice(1)} (m)</label>
              <input type="number" name={nom} value={xona[nom]} onChange={xonaOzgartir} step="0.1" />
            </div>
          ))}
        </div>
        <div className="input-grid-2">
          <div className="input-group"><label>Eshiklar soni</label><input type="number" name="eshiklar" value={xona.eshiklar} onChange={xonaOzgartir} step="1" /></div>
          <div className="input-group"><label>Derazalar soni</label><input type="number" name="derazalar" value={xona.derazalar} onChange={xonaOzgartir} step="1" /></div>
        </div>
        <div className="input-group" style={{marginBottom:'14px'}}>
          <label>Mijoz ismi (PDF uchun)</label>
          <input type="text" value={mijozIsmi} onChange={e => setMijozIsmi(e.target.value)} placeholder="Masalan: Akbar" />
        </div>
        <div className="stats">
          <span className="stat-chip">🟫 Pol: {polYuza} m²</span>
          <span className="stat-chip">🧱 Devor: {devorYuza} m²</span>
          <span className="stat-chip">📦 Hajm: {hajm} m³</span>
        </div>
      </div>

      <AiBlok xona={xona} />

      <RasmTahlil />

      <div className="karta">
        <div className="karta-bosh">
          <div className="step-raqam">02</div>
          <span className="karta-sarlavha">Materiallarni tanlang</span>
        </div>
        <div className="mat-grid">
          {MATERIALLAR.map(m => (
            <div key={m.id} className={`mat-tugma ${tanlangan[m.id] ? 'tanlangan' : ''}`} onClick={() => materialTanla(m.id)}>
              <div className="mat-icon">{m.icon}</div>
              <div className="mat-nom">{m.nom}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="amallar">
        <button className={`hisobla-btn ${yuklanmoqda ? 'yuklanyapti' : ''}`} onClick={hisobla} disabled={yuklanmoqda || tanlananSoni === 0}>
  {yuklanmoqda ? '' : `🔢 Hisoblash (${tanlananSoni} material)`}
</button>
      </div>

      {xato && <div className="xato">⚠️ {xato}</div>}
{yuklanmoqda && (
  <div>
    <div className="natija-header">
      <div className="karta-bosh" style={{marginBottom:0}}>
        <div className="step-raqam">03</div>
        <span className="karta-sarlavha">Hisoblanmoqda...</span>
      </div>
    </div>
    <div className="natija-grid">
      {[1,2].map(i => (
        <div key={i} className="skeleton-karta">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-qator"></div>
          <div className="skeleton skeleton-qator kalta"></div>
          <div className="skeleton skeleton-qator"></div>
          <div className="skeleton skeleton-muhim"></div>
        </div>
      ))}
    </div>
  </div>
)}
      {Object.keys(natijalar).length > 0 && (
        <div>
          <div className="natija-header">
            <div className="karta-bosh" style={{marginBottom:0}}>
              <div className="step-raqam">03</div>
              <span className="karta-sarlavha">Natijalar</span>
            </div>
            <button className="pdf-btn" onClick={smetaYukla}>📄 PDF Smeta</button>
          </div>
          <div className="natija-grid">
            {MATERIALLAR.map(m => natijalar[m.id] ? <NatijaKarta key={m.id} material={m} natija={natijalar[m.id]} /> : null)}
          </div>
        </div>
      )}
    </div>
  );
}
