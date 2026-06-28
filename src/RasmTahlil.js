import React, { useState, useRef } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function RasmTahlil() {
  const [rasm, setRasm] = useState(null);
  const [rasmUrl, setRasmUrl] = useState('');
  const [tahlil, setTahlil] = useState('');
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState('');
  const fileRef = useRef();

  const rasmTanla = (e) => {
    const fayl = e.target.files[0];
    if (!fayl) return;
    setRasm(fayl);
    setRasmUrl(URL.createObjectURL(fayl));
    setTahlil('');
    setXato('');
  };

  const tahlilQil = async () => {
    if (!rasm) return;
    setYuklanmoqda(true);
    setXato('');
    setTahlil('');

    try {
      const formData = new FormData();
      formData.append('rasm', rasm);
      formData.append('xona_turi', 'yotoq xona');
      formData.append('uslub', 'zamonaviy');

      const res = await fetch(`${API}/ai/rasm-tahlil`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.muvaffaqiyat) setTahlil(data.tahlil);
      else setXato(data.xato || 'Xatolik yuz berdi');
    } catch {
      setXato('Server bilan ulanishda muammo.');
    }
    setYuklanmoqda(false);
  };

  return (
    <div className="ai-blok" style={{marginBottom:'1rem'}}>
      <div className="ai-bosh">
        <span className="ai-badge">AI</span>
        <span className="ai-sarlavha">Xona rasmi tahlili</span>
      </div>
      <p className="ai-sub">Xona rasmini yuklang — AI o'lchamlar va dizayn tavsiya beradi</p>

      <div
        onClick={() => fileRef.current.click()}
        style={{
          border: '1.5px dashed rgba(255,255,255,0.25)',
          borderRadius: '10px',
          padding: rasmUrl ? '0' : '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '1rem',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        {rasmUrl ? (
          <img src={rasmUrl} alt="Xona" style={{width:'100%',maxHeight:'220px',objectFit:'cover',borderRadius:'10px',display:'block'}} />
        ) : (
          <>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>📸</div>
            <div style={{color:'rgba(255,255,255,0.6)',fontSize:'13px'}}>Rasm yuklash uchun bosing</div>
            <div style={{color:'rgba(255,255,255,0.35)',fontSize:'11px',marginTop:'4px'}}>JPG, PNG formatlar qabul qilinadi</div>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={rasmTanla} style={{display:'none'}} />

      {rasm && (
        <button className="ai-btn" onClick={tahlilQil} disabled={yuklanmoqda}>
          {yuklanmoqda ? '🤖 AI tahlil qilmoqda...' : '🔍 Rasmni tahlil qilish'}
        </button>
      )}

      {xato && <div style={{marginTop:'10px',color:'#fca5a5',fontSize:'13px'}}>⚠️ {xato}</div>}

      {tahlil && (
        <div className="ai-natija" style={{marginTop:'1rem'}}>
          <div className="ai-natija-title">📊 Tahlil natijalari</div>
          <div className="ai-matn">
            {tahlil.split('\n').map((q, i) => (
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
