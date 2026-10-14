// Flávia Fernandes · Property Pages — mini-site independente (derivado do MORE Property Pages v1.2). Não faz parte de nenhum outro projeto.
// Routes: GET /  (generator)  | GET /p/:slug (page) | GET /api/search | POST /api/pages | POST /api/lead

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://agippaaddhautvryjpze.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_3uAzyhRUWZoJylSmT8mqJw_C1ckPV01';

const AGENT = {
  name: process.env.AGENT_NAME || 'Flávia Fernandes',
  title: process.env.AGENT_TITLE || 'Real Estate Advisor',
  phone: process.env.AGENT_PHONE || '+1 (954) 549-3056',
  phoneRaw: (process.env.AGENT_PHONE || '19545493056').replace(/\D/g, ''),
  email: process.env.AGENT_EMAIL || 'FlaviaFRealtor@gmail.com',
  company: 'Luxe Properties',
  address: process.env.AGENT_ADDRESS || 'Miami · South Florida',
  photo: process.env.AGENT_PHOTO || '',
  site: process.env.AGENT_SITE || 'https://flaviafernandes.vercel.app',
};

const T = {
  en: {
    beds: 'Beds', baths: 'Baths', sqft: 'Sq Ft', year: 'Built', garage: 'Garage', dom: 'Days on market',
    forSale: 'For Sale', forRent: 'For Rent', month: '/ month', status: 'Status',
    about: 'About this residence', details: 'Details', features: 'Features & amenities', gallery: 'Gallery',
    location: 'Location', contact: 'Request information', send: 'Send request', sent: 'Thank you. I will get back to you shortly.',
    name: 'Name', email: 'Email', phone: 'Phone', message: 'Message', msgPh: 'I would like more information about',
    curated: 'A curated selection by', presented: 'Presented by', properties: 'properties', property: 'property',
    hoa: 'HOA', tax: 'Taxes / yr', type: 'Type', furnished: 'Furnished', view: 'View', waterfront: 'Waterfront', pool: 'Pool',
    pets: 'Pets', parking: 'Parking', mls: 'MLS #', call: 'Call', whatsapp: 'WhatsApp', emailBtn: 'Email', tour: 'Virtual tour',
    openMap: 'Open in Maps', yes: 'Yes', no: 'No', photos: 'photos', viewAll: 'View all', close: 'Close',
    st: { Active: 'Active', Pending: 'Pending', 'Active Under Contract': 'Under contract', 'Coming Soon': 'Coming soon', Closed: 'Sold', ClosedRent: 'Rented', Off: 'Off market' },
    stNote: { Pending: 'This property is currently under contract (pending).', 'Active Under Contract': 'This property is under contract and still accepting backup offers.', Closed: 'This property has been sold.', ClosedRent: 'This property has been rented.', Off: 'This property is no longer on the market.' },
    addrHidden: 'Address available upon request',
    courtesy: 'Listing courtesy of', disclaimer: 'The data relating to real estate for sale on this web site comes in part from the Internet Data Exchange (IDX) program of the MIAMI Association of REALTORS® MLS. Information is deemed reliable but not guaranteed. Properties displayed may be listed or sold by brokerage firms other than Luxe Properties. Buyers are advised to verify all facts before making a decision to purchase. Data last updated',
  },
  pt: {
    beds: 'Dormitórios', baths: 'Banheiros', sqft: 'Sq Ft', year: 'Ano de construção', garage: 'Vagas', dom: 'Dias no mercado',
    forSale: 'Venda', forRent: 'Locação', month: '/ mês', status: 'Status',
    about: 'Sobre o imóvel', details: 'Ficha técnica', features: 'Características e amenidades', gallery: 'Galeria de fotos',
    location: 'Localização', contact: 'Solicitar informações', send: 'Enviar', sent: 'Obrigada. Retorno em breve.',
    name: 'Nome', email: 'E-mail', phone: 'Telefone', message: 'Mensagem', msgPh: 'Gostaria de mais informações sobre',
    curated: 'Seleção exclusiva de', presented: 'Apresentado por', properties: 'imóveis', property: 'imóvel',
    hoa: 'Condomínio (HOA)', tax: 'Imposto anual', type: 'Tipo', furnished: 'Mobiliado', view: 'Vista', waterfront: 'Frente ao mar / água', pool: 'Piscina',
    pets: 'Aceita pets', parking: 'Vagas de garagem', mls: 'MLS #', call: 'Ligar', whatsapp: 'WhatsApp', emailBtn: 'E-mail', tour: 'Tour virtual',
    openMap: 'Abrir no mapa', yes: 'Sim', no: 'Não', photos: 'fotos', viewAll: 'Ver todas', close: 'Fechar',
    st: { Active: 'Disponível', Pending: 'Pendente', 'Active Under Contract': 'Sob contrato', 'Coming Soon': 'Em breve', Closed: 'Vendido', ClosedRent: 'Alugado', Off: 'Fora do mercado' },
    stNote: { Pending: 'Este imóvel está sob contrato (pendente).', 'Active Under Contract': 'Este imóvel está sob contrato, aceitando propostas de reserva.', Closed: 'Este imóvel foi vendido.', ClosedRent: 'Este imóvel foi alugado.', Off: 'Este imóvel não está mais no mercado.' },
    addrHidden: 'Endereço sob consulta',
    courtesy: 'Anúncio cortesia de', disclaimer: 'Os dados de imóveis à venda neste site vêm em parte do programa Internet Data Exchange (IDX) do MIAMI Association of REALTORS® MLS. As informações são consideradas confiáveis, mas não garantidas. Os imóveis exibidos podem estar anunciados ou vendidos por outras imobiliárias que não a Luxe Properties. Compradores devem verificar todos os fatos antes de decidir pela compra. Dados atualizados em',
  },
};

// ---------- Supabase helpers (REST, no SDK) ----------
async function sb(path, opts = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) throw new Error(`${r.status} ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  return data;
}

const LISTING_COLS = 'listing_key,listing_id,standard_status,mls_status,property_type,property_sub_type,is_rental,list_price,bedrooms,bathrooms_full,bathrooms_half,bathrooms_total,living_area,lot_size_sqft,year_built,unit_number,unparsed_address,street_number,street_name,city,state,postal_code,county,subdivision,building_name,latitude,longitude,public_remarks,list_office_name,association_fee,association_fee_frequency,tax_annual,days_on_market,furnished,waterfront,pool,view,parking_total,garage_spaces,stories,virtual_tour_url,photos,photos_count,features,modification_ts,synced_at';

const pick = l => { const o = {}; for (const k of LISTING_COLS.split(',')) o[k] = l[k]; return o; };

async function searchListings(q, rent = 'all') {
  q = (q || '').trim();
  if (!q) return [];
  const ids = q.split(/[,\s;]+/).map(s => s.trim()).filter(Boolean);
  const looksLikeIds = ids.length > 0 && ids.every(s => /^[A-Za-z]{1,2}\d{5,}$/.test(s));
  const rpc = (query, r) => sb('rpc/search_listings?select=' + LISTING_COLS, { method: 'POST', body: JSON.stringify({ q: query, p_rent: r, p_limit: 60 }) });
  if (looksLikeIds) {
    const out = [];
    for (const id of ids) { const r = await rpc(id.toUpperCase(), 'all'); out.push(...r.filter(l => l.listing_id === id.toUpperCase())); }
    return out;
  }
  const clean = q.replace(/[%_]/g, '').replace(/\s+/g, '%');
  return rpc(clean, rent);
}

async function listingsForPage(slug, keys) {
  const rows = await sb('rpc/ff_page_listings?select=' + LISTING_COLS, { method: 'POST', body: JSON.stringify({ p_slug: slug }) });
  const order = new Map(keys.map((k, i) => [k, i]));
  rows.sort((a, b) => order.get(a.listing_key) - order.get(b.listing_key));
  return rows;
}

// ---------- utils ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => n == null ? '' : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const num = n => n == null ? '' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const slugify = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const rid = (n = 6) => { const a = 'abcdefghjkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };
const baths = l => { const f = l.bathrooms_full ?? 0, h = l.bathrooms_half ?? 0; if (!f && !h && l.bathrooms_total) return String(l.bathrooms_total); return h ? `${f}.5` : String(f); };
const addr1 = l => { if (l._hide) return l.building_name || l.subdivision || T[l._lang || 'en'].addrHidden; const base = (l.unparsed_address || '').replace(/,\s*[^,]*\s(FL|Florida)\s*\d{5}.*$/i, '').replace(/\s#\s*/, ' #'); return base || [l.street_number, l.street_name].filter(Boolean).join(' '); };
const addr2 = l => l._hide ? [l.city, l.state].filter(Boolean).join(', ') : [l.city, [l.state, l.postal_code].filter(Boolean).join(' ')].filter(Boolean).join(', ');
const titleOf = l => `${addr1(l)}, ${l.city || ''}`;
const stKey = l => { const s = l.standard_status || ''; if (s === 'Closed') return l.is_rental ? 'ClosedRent' : 'Closed'; if (['Active', 'Pending', 'Active Under Contract', 'Coming Soon'].includes(s)) return s; return 'Off'; };
const stLabel = (l, lang) => T[lang].st[stKey(l)];
const isLive = l => stKey(l) === 'Active' || stKey(l) === 'Coming Soon';
const fmtDate = d => { try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return ''; } };

const ICONS = {
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V5"/><path d="M20 14v7"/><path d="M4 14h16"/><path d="M4 21v-7"/><path d="M7 11h4c1.2 0 2 .8 2 2v1H4v-1c0-1.2.8-2 2-2z"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M7 19l-1 2"/><path d="M17 19l1 2"/></svg>',
  area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9h5V4"/><path d="M20 15h-5v5"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16l1.5-5h11L19 16"/><path d="M3 16h18v3H3z"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-12A7 7 0 0 0 5 9c0 5.8 7 12 7 12z"/><path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.5c0 3 2.5 6 6 6.5l1.5-1.5-2-1-1 1a5 5 0 0 1-3-3l1-1-1-2z"/></svg>',
};

// ---------- CSS ----------
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Montserrat:wght@300;400;500&display=swap');
:root{--navy:#012700;--white:#FFFFFF;--salmon:#D6BE96;--sand:#F4F1EA;--ice:#EFECE3;--grey:#C9C4B6;--ink:#012700;--muted:rgba(1,39,0,.62);--line:rgba(1,39,0,.14);--gut:clamp(20px,5vw,72px)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:'Montserrat',Helvetica,Arial,sans-serif;color:var(--ink);background:var(--white);line-height:1.55;font-size:15px;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.wrap{max-width:1180px;margin:0 auto;padding:0 var(--gut)}
.eyebrow{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
.eyebrow.dark{color:rgba(255,255,255,.7)}
.rule{width:44px;height:1px;background:var(--salmon);margin:14px 0 22px}
.dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--salmon);margin:0 10px;vertical-align:middle}
h1,h2,h3{font-weight:300;letter-spacing:.08em;line-height:1.2;text-transform:uppercase}
.agent h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;text-transform:uppercase;letter-spacing:.04em;font-size:26px}
h2{font-size:clamp(20px,2.6vw,28px);margin-bottom:6px}
.sec{padding:clamp(40px,6vw,76px) 0;border-top:1px solid var(--line)}
.sec.sand{background:var(--sand);border-top:0}
.sec.ice{background:var(--ice);border-top:0}
/* header */
.top{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:66px}
.top img{height:54px;width:auto}
.top .acts{display:flex;gap:8px;align-items:center}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border:1px solid var(--navy);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;background:transparent;color:var(--navy);font-family:inherit;transition:.2s}
.btn:hover{background:var(--navy);color:#fff}
.btn.solid{background:var(--navy);color:#fff}
.btn.solid:hover{background:#1F3416}
.btn.light{border-color:rgba(255,255,255,.5);color:#fff}
.btn.light:hover{background:#fff;color:var(--navy)}
.btn svg{width:15px;height:15px}
.lang a{font-size:11px;letter-spacing:.14em;color:var(--muted);padding:6px 8px}
.lang a.on{color:var(--navy);border-bottom:1px solid var(--salmon)}
/* hero */
.hero{position:relative;background:var(--navy);color:#fff;min-height:62vh;display:flex;align-items:flex-end;overflow:hidden}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.92}
.hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,39,0,.05) 30%,rgba(1,39,0,.78) 100%)}
.hero .wrap{position:relative;z-index:2;padding-top:40px;padding-bottom:40px;width:100%}
.hero h1{font-size:clamp(26px,4.2vw,48px);text-shadow:0 2px 20px rgba(0,0,0,.25)}
.hero .sub{margin-top:8px;font-size:14px;color:rgba(255,255,255,.85);letter-spacing:.04em}
.hero .price{margin-top:18px;font-size:clamp(22px,3vw,34px);font-weight:500}
.hero .price small{font-size:13px;font-weight:400;letter-spacing:.08em;opacity:.8;margin-left:6px}
.badge.off{background:var(--salmon);border-color:var(--salmon);color:var(--navy);font-weight:500}
.stnote{background:var(--salmon);color:var(--navy);font-size:13px;letter-spacing:.04em;padding:12px 0;text-align:center}
.badge{display:inline-block;font-size:10px;letter-spacing:.22em;text-transform:uppercase;border:1px solid rgba(255,255,255,.5);padding:5px 10px;margin-bottom:14px}
/* stats */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));border:1px solid var(--line);background:#fff}
.stat{padding:18px 14px;border-right:1px solid var(--line);display:flex;align-items:center;gap:12px}
.stat:last-child{border-right:0}
.stat svg{width:26px;height:26px;color:var(--navy);flex:none}
.stat b{display:block;font-size:18px;line-height:1}
.stat span{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.statsbar{margin-top:-34px;position:relative;z-index:3}
/* two col */
.cols{display:grid;grid-template-columns:1.4fr .9fr;gap:clamp(28px,5vw,72px)}
@media(max-width:860px){.cols{grid-template-columns:1fr}}
.remarks{font-size:16px;line-height:1.75;white-space:pre-line}
.kv{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;border-top:1px solid var(--line)}
.kv div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:13.5px}
.kv div span:first-child{color:var(--muted)}
.kv div span:last-child{text-align:right;font-weight:500}
@media(max-width:560px){.kv{grid-template-columns:1fr}}
/* features */
.feat{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:26px 32px}
.feat h4{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;font-weight:400}
.feat ul{list-style:none}
.feat li{padding:5px 0 5px 14px;position:relative;font-size:14px;border-bottom:1px solid var(--line)}
.feat li:before{content:'';position:absolute;left:0;top:13px;width:4px;height:4px;border-radius:50%;background:var(--salmon)}
/* gallery */
.gal{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.gal a{aspect-ratio:4/3;overflow:hidden;background:var(--ice);position:relative}
.gal a:nth-child(1){grid-column:span 2;grid-row:span 2}
.gal img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.gal a:hover img{transform:scale(1.03)}
@media(max-width:700px){.gal{grid-template-columns:repeat(2,1fr)}}
.more{display:block;margin:14px auto 0;width:max-content}
.lb{position:fixed;inset:0;background:rgba(1,39,0,.96);z-index:100;display:none;align-items:center;justify-content:center;flex-direction:column}
.lb.on{display:flex}
.lb img{max-width:92vw;max-height:84vh;object-fit:contain}
.lb .x,.lb .n,.lb .p{position:absolute;color:#fff;background:none;border:1px solid rgba(255,255,255,.4);width:44px;height:44px;cursor:pointer;font-size:20px;font-family:inherit}
.lb .x{top:16px;right:16px}.lb .p{left:16px;top:50%}.lb .n{right:16px;top:50%}
.lb .c{color:rgba(255,255,255,.7);font-size:11px;letter-spacing:.2em;margin-top:12px}
/* map */
.map{aspect-ratio:16/7;background:var(--ice);border:1px solid var(--line)}
.map iframe{width:100%;height:100%;border:0}
@media(max-width:700px){.map{aspect-ratio:4/3}}
/* agent */
.agent{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center}
.agent .ph{width:120px;height:120px;border-radius:50%;object-fit:cover;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:500;letter-spacing:.05em}
.agent h3{font-size:22px}
.agent .ttl{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin:4px 0 14px}
.agent .ct{display:flex;flex-wrap:wrap;gap:8px}
@media(max-width:560px){.agent{grid-template-columns:1fr;text-align:center}.agent .ph{margin:0 auto}.agent .ct{justify-content:center}}
/* form */
form.lead{display:grid;gap:12px}
.lead input,.lead textarea{width:100%;font:inherit;font-size:14px;padding:13px 14px;border:1px solid var(--line);background:#fff;color:var(--ink);outline:none;border-radius:0}
.lead input:focus,.lead textarea:focus{border-color:var(--navy)}
.lead textarea{min-height:110px;resize:vertical}
.lead .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.lead .row{grid-template-columns:1fr}}
.ok{padding:14px;border:1px solid var(--salmon);background:#fff;font-size:14px}
/* footer */
footer{background:var(--navy);color:rgba(255,255,255,.75);padding:48px 0 34px;font-size:12px;line-height:1.7}
footer img{height:84px;margin-bottom:22px}
footer .co{color:#fff;margin-bottom:10px}
footer .fine{max-width:900px}
footer .bar{margin-top:26px;padding-top:16px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;letter-spacing:.1em}
/* collection */
.collhead{background:var(--navy);color:#fff;padding:clamp(48px,8vw,96px) 0}
.collhead h1{font-size:clamp(28px,4.5vw,52px);margin:14px 0}
.collhead p{color:rgba(255,255,255,.8);max-width:720px;font-size:15px}
.idx{position:sticky;top:66px;z-index:20;background:#fff;border-bottom:1px solid var(--line);overflow-x:auto;white-space:nowrap}
.idx .wrap{display:flex;gap:0}
.idx a{display:inline-block;padding:14px 16px 12px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid transparent}
.idx a:hover{color:var(--navy);border-color:var(--salmon)}
.card{display:grid;grid-template-columns:1.1fr 1fr;gap:0;border:1px solid var(--line);background:#fff;margin-bottom:28px}
.card .im{aspect-ratio:4/3;overflow:hidden;background:var(--ice)}
.card .im img{width:100%;height:100%;object-fit:cover}
.card .bd{padding:28px}
.card h3{font-size:20px;margin:6px 0 2px}
.card .pr{font-size:22px;font-weight:500;margin:12px 0 14px}
.card .pr small{font-size:12px;font-weight:400;letter-spacing:.08em;opacity:.7}
.card .st{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;color:var(--muted);margin-bottom:16px}
.card .st b{color:var(--ink)}
.card .rm{font-size:14px;color:var(--muted);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:18px}
@media(max-width:760px){.card{grid-template-columns:1fr}}
.cnt{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--salmon)}
`;

// ---------- components ----------
function header(lang, path) {
  const other = lang === 'pt' ? 'en' : 'pt';
  const q = `?lang=`;
  return `<header class="top"><div class="wrap">
  <a href="${AGENT.site}" aria-label="Flávia Fernandes"><img src="/logo-green.png" alt="Flávia Fernandes · Real Estate Advisor"></a>
  <div class="acts">
    <span class="lang"><a href="${path}${q}en" class="${lang === 'en' ? 'on' : ''}">EN</a><a href="${path}${q}pt" class="${lang === 'pt' ? 'on' : ''}">PT</a></span>
    <a class="btn solid" href="#contact">${ICONS.mail}<span>${T[lang].contact}</span></a>
  </div></div></header>`;
}

function agentBlock(lang, msgCtx) {
  const t = T[lang];
  const initials = AGENT.name.split(/\s+/).map(s => s[0]).slice(0, 2).join('');
  const ph = AGENT.photo ? `<img class="ph" src="${esc(AGENT.photo)}" alt="${esc(AGENT.name)}">` : `<div class="ph">${esc(initials)}</div>`;
  const wa = `https://wa.me/${AGENT.phoneRaw}?text=${encodeURIComponent(`${t.msgPh} ${msgCtx}`)}`;
  return `<section class="sec sand" id="contact"><div class="wrap"><div class="cols">
  <div>
    <div class="eyebrow">${t.presented}</div><div class="rule"></div>
    <div class="agent">${ph}<div>
      <h3>${esc(AGENT.name)}</h3>
      <div class="ttl">${esc(AGENT.title)} <span class="dot"></span> ${esc(AGENT.company)}</div>
      <div class="ct">
        <a class="btn" href="tel:+${AGENT.phoneRaw}">${ICONS.phone}<span>${t.call}</span></a>
        <a class="btn" href="${wa}" target="_blank" rel="noopener">${ICONS.wa}<span>${t.whatsapp}</span></a>
        <a class="btn" href="mailto:${esc(AGENT.email)}">${ICONS.mail}<span>${t.emailBtn}</span></a>
      </div>
      <p style="margin-top:16px;font-size:13px;color:var(--muted)">${esc(AGENT.phone)} <span class="dot"></span> ${esc(AGENT.email)}<br>${esc(AGENT.address)}</p>
    </div></div>
  </div>
  <div>
    <div class="eyebrow">${t.contact}</div><div class="rule"></div>
    <form class="lead" id="leadform">
      <div class="row"><input name="name" placeholder="${t.name}" required><input name="phone" placeholder="${t.phone}"></div>
      <input name="email" type="email" placeholder="${t.email}" required>
      <textarea name="message" placeholder="${t.msgPh} ${esc(msgCtx)}"></textarea>
      <input type="hidden" name="listing_key" value=""><input type="hidden" name="page_url" value="">
      <button class="btn solid" type="submit">${t.send}</button>
      <div class="ok" id="leadok" style="display:none">${t.sent}</div>
    </form>
  </div>
  </div></div></section>`;
}

function footer(lang, offices, updated) {
  const t = T[lang];
  const off = [...new Set(offices.filter(Boolean))];
  return `<footer><div class="wrap">
  <img src="/logo-white.png" alt="Flávia Fernandes · Real Estate Advisor">
  <div class="co">${esc(AGENT.company)} <span class="dot"></span> ${esc(AGENT.address)} <span class="dot"></span> ${esc(AGENT.phone)}</div>
  <div class="fine">${off.length ? `${t.courtesy} ${esc(off.join(' · '))}. ` : ''}${t.disclaimer} ${esc(updated)}.</div>
  <div class="bar"><span>© ${new Date().getFullYear()} ${esc(AGENT.company)}</span><span>MIAMI Association of REALTORS® MLS · IDX</span></div>
  </div></footer>`;
}

function lightbox(lang) {
  return `<div class="lb" id="lb"><button class="x" onclick="lbClose()">×</button><button class="p" onclick="lbNav(-1)">‹</button><img id="lbimg" alt=""><div class="c" id="lbc"></div><button class="n" onclick="lbNav(1)">›</button></div>`;
}

const SCRIPT = `
<script>
let LB=[],LBi=0;
function lbOpen(list,i){LB=list;LBi=i;document.getElementById('lb').classList.add('on');lbShow()}
function lbShow(){document.getElementById('lbimg').src=LB[LBi];document.getElementById('lbc').textContent=(LBi+1)+' / '+LB.length}
function lbNav(d){LBi=(LBi+d+LB.length)%LB.length;lbShow()}
function lbClose(){document.getElementById('lb').classList.remove('on')}
document.addEventListener('keydown',e=>{if(!document.getElementById('lb').classList.contains('on'))return;if(e.key==='Escape')lbClose();if(e.key==='ArrowRight')lbNav(1);if(e.key==='ArrowLeft')lbNav(-1)});
document.querySelectorAll('[data-gal]').forEach(g=>{const list=JSON.parse(g.getAttribute('data-gal'));g.querySelectorAll('a').forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();lbOpen(list,i)}))});
const f=document.getElementById('leadform');if(f){f.page_url.value=location.href;f.listing_key.value=document.body.getAttribute('data-keys')||'';f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button');b.disabled=true;const d=Object.fromEntries(new FormData(f).entries());const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(r.ok){f.querySelectorAll('input,textarea,button').forEach(x=>x.style.display='none');document.getElementById('leadok').style.display='block'}else{b.disabled=false;alert('Error. Please try again.')}})}
</script>`;

function statsBar(l, lang) {
  const t = T[lang];
  const items = [
    [ICONS.bed, l.bedrooms, t.beds], [ICONS.bath, baths(l), t.baths], [ICONS.area, num(l.living_area), t.sqft],
    [ICONS.cal, l.year_built, t.year], [ICONS.car, l.garage_spaces ?? l.parking_total, t.garage],
  ].filter(x => x[1] !== null && x[1] !== undefined && x[1] !== '' && x[1] !== 0);
  return `<div class="stats">${items.map(([i, v, k]) => `<div class="stat">${i}<div><b>${esc(v)}</b><span>${k}</span></div></div>`).join('')}</div>`;
}

function kvTable(l, lang) {
  const t = T[lang];
  const yn = v => v === true ? t.yes : v === false ? t.no : null;
  const f = l.features || {};
  const pets = f.MIAMIRE_PetsAllowedYN;
  const rows = [
    [t.mls, l.listing_id], [t.status, stLabel(l, lang)], [t.type, l.property_sub_type || l.property_type],
    [t.year, l.year_built], [t.sqft, l.living_area ? num(l.living_area) : null],
    [t.hoa, l.association_fee ? `${money(l.association_fee)}${l.association_fee_frequency ? ' / ' + l.association_fee_frequency.toLowerCase() : ''}` : null],
    [t.tax, l.tax_annual ? money(l.tax_annual) : null], [t.furnished, l.furnished], [t.view, l.view],
    [t.waterfront, yn(l.waterfront)], [t.pool, yn(l.pool)], [t.pets, yn(pets)], [t.parking, l.parking_total ?? l.garage_spaces],
    [t.dom, l.days_on_market], ['Building', l.building_name || l.subdivision],
  ].filter(r => r[1] !== null && r[1] !== undefined && r[1] !== '');
  return `<div class="kv">${rows.map(([k, v]) => `<div><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}</div>`;
}

const FEAT_GROUPS = [
  ['AssociationAmenities', { en: 'Building amenities', pt: 'Amenidades do prédio' }],
  ['InteriorFeatures', { en: 'Interior', pt: 'Interior' }],
  ['ExteriorFeatures', { en: 'Exterior', pt: 'Exterior' }],
  ['Appliances', { en: 'Appliances', pt: 'Eletrodomésticos' }],
  ['Flooring', { en: 'Flooring', pt: 'Pisos' }],
  ['WindowFeatures', { en: 'Windows', pt: 'Janelas' }],
  ['SecurityFeatures', { en: 'Security', pt: 'Segurança' }],
  ['ParkingFeatures', { en: 'Parking', pt: 'Estacionamento' }],
  ['WaterfrontFeatures', { en: 'Waterfront', pt: 'Frente d’água' }],
  ['PoolFeatures', { en: 'Pool', pt: 'Piscina' }],
  ['LotFeatures', { en: 'Lot', pt: 'Terreno' }],
];
function featuresGrid(l, lang) {
  const f = l.features || {};
  const groups = FEAT_GROUPS.map(([k, label]) => [label[lang], Array.isArray(f[k]) ? f[k] : (typeof f[k] === 'string' ? f[k].split(',').map(s => s.trim()) : [])]).filter(g => g[1].length);
  if (!groups.length) return '';
  return `<div class="feat">${groups.map(([h, items]) => `<div><h4>${esc(h)}</h4><ul>${items.slice(0, 12).map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>`;
}

function gallery(l, lang, max = 8) {
  const ph = Array.isArray(l.photos) ? l.photos : [];
  if (!ph.length) return '';
  const shown = ph.slice(0, max);
  return `<div class="gal" data-gal='${esc(JSON.stringify(ph))}'>${shown.map((p, i) => `<a href="${esc(p)}"><img loading="lazy" src="${esc(p)}" alt="Photo ${i + 1}"></a>`).join('')}</div>
  ${ph.length > max ? `<a class="btn more" href="#" onclick="lbOpen(${esc(JSON.stringify(ph))},0);return false">${T[lang].viewAll} ${ph.length} ${T[lang].photos}</a>` : ''}`;
}

function mapBlock(l, lang) {
  if (!l.latitude || !l.longitude) return '';
  const la = Number(l.latitude), lo = Number(l.longitude), d = 0.006;
  const bbox = `${lo - d},${la - d},${lo + d},${la + d}`;
  const g = `https://www.google.com/maps/search/?api=1&query=${la},${lo}`;
  return `<div class="map"><iframe loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${la},${lo}" title="Map"></iframe></div>
  <p style="margin-top:12px;font-size:13px;color:var(--muted)">${ICONS.pin.replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px;margin-right:6px"')}${esc(l.unparsed_address || '')} <span class="dot"></span> <a href="${g}" target="_blank" rel="noopener" style="border-bottom:1px solid var(--salmon)">${T[lang].openMap}</a></p>`;
}

function priceHtml(l, lang) {
  const t = T[lang];
  return `${money(l.list_price)}${l.is_rental ? `<small>${t.month}</small>` : ''}`;
}

function listingSection(l, lang, standalone) {
  const t = T[lang];
  const hero = (l.photos && l.photos[0]) || '';
  return `
  <section class="hero" id="l-${esc(l.listing_id)}">${hero ? `<img class="bg" src="${esc(hero)}" alt="">` : ''}<div class="wrap">
    <span class="badge${isLive(l) ? '' : ' off'}">${l.is_rental ? t.forRent : t.forSale} · ${esc(stLabel(l, lang))}</span>
    <h1>${esc(addr1(l))}</h1>
    <div class="sub">${esc(addr2(l))}${l.building_name && !l._hide ? ` <span class="dot"></span> ${esc(l.building_name)}` : ''}</div>
    <div class="price">${priceHtml(l, lang)}</div>
  </div></section>
  ${isLive(l) ? '' : `<div class="stnote"><div class="wrap">${esc(t.stNote[stKey(l)] || '')}</div></div>`}
  <div class="wrap statsbar">${statsBar(l, lang)}</div>
  <section class="sec" style="border-top:0"><div class="wrap cols">
    <div><div class="eyebrow">${t.about}</div><div class="rule"></div><p class="remarks">${esc(l.public_remarks || '')}</p></div>
    <div><div class="eyebrow">${t.details}</div><div class="rule"></div>${kvTable(l, lang)}
      ${l.virtual_tour_url ? `<p style="margin-top:18px"><a class="btn" href="${esc(l.virtual_tour_url)}" target="_blank" rel="noopener">${t.tour}</a></p>` : ''}
    </div>
  </div></section>
  ${featuresGrid(l, lang) ? `<section class="sec ice"><div class="wrap"><div class="eyebrow">${t.features}</div><div class="rule"></div>${featuresGrid(l, lang)}</div></section>` : ''}
  ${gallery(l, lang) ? `<section class="sec"><div class="wrap"><div class="eyebrow">${t.gallery} <span class="dot"></span> ${l.photos_count || (l.photos || []).length} ${t.photos}</div><div class="rule"></div>${gallery(l, lang)}</div></section>` : ''}
  ${!l._hide && mapBlock(l, lang) ? `<section class="sec"><div class="wrap"><div class="eyebrow">${t.location}</div><div class="rule"></div>${mapBlock(l, lang)}</div></section>` : ''}`;
}

function pageHtml({ lang, title, desc, image, body, keys, path }) {
  return `<!doctype html><html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | ${AGENT.company}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website">${image ? `<meta property="og:image" content="${esc(image)}">` : ''}<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/logo-green.png"><style>${CSS}</style></head><body data-keys="${esc(keys.join(','))}">
${header(lang, path)}${body}${lightbox(lang)}${SCRIPT}</body></html>`;
}

function renderSingle(l, lang, path) {
  const t = T[lang];
  const body = listingSection(l, lang, true) + agentBlock(lang, `${addr1(l)} (MLS ${l.listing_id})`) + footer(lang, [l.list_office_name], fmtDate(l.synced_at || l.modification_ts));
  return pageHtml({ lang, title: `${addr1(l)}, ${l.city}`, desc: `${l.bedrooms ?? ''} ${t.beds} · ${baths(l)} ${t.baths} · ${num(l.living_area)} ${t.sqft} · ${money(l.list_price)}`, image: l.photos && l.photos[0], body, keys: [l.listing_key], path });
}

function renderCollection(page, ls, lang, path) {
  const t = T[lang];
  const title = page.title || `${ls.length} ${t.properties}`;
  const cards = ls.map((l, i) => `<article class="card" id="c-${esc(l.listing_id)}">
    <a class="im" href="#l-${esc(l.listing_id)}"><img loading="lazy" src="${esc((l.photos && l.photos[0]) || '')}" alt=""></a>
    <div class="bd"><div class="cnt">${String(i + 1).padStart(2, '0')} <span style="color:var(--muted)">/ ${String(ls.length).padStart(2, '0')}</span> · ${l.is_rental ? t.forRent : t.forSale} · ${esc(stLabel(l, lang))}</div>
      <h3>${esc(addr1(l))}</h3><div style="font-size:13px;color:var(--muted)">${esc(addr2(l))}${l.building_name ? ` · ${esc(l.building_name)}` : ''}</div>
      <div class="pr">${priceHtml(l, lang)}</div>
      <div class="st"><span><b>${esc(l.bedrooms ?? '–')}</b> ${t.beds}</span><span><b>${esc(baths(l))}</b> ${t.baths}</span><span><b>${num(l.living_area)}</b> ${t.sqft}</span>${l.year_built ? `<span><b>${l.year_built}</b> ${t.year}</span>` : ''}</div>
      <p class="rm">${esc(l.public_remarks || '')}</p>
      <a class="btn" href="#l-${esc(l.listing_id)}">${t.details}</a>
    </div></article>`).join('');
  const body = `
  <section class="collhead"><div class="wrap"><div class="eyebrow dark">${t.curated} ${esc(AGENT.name)} <span class="dot"></span> ${esc(AGENT.company)}</div><h1>${esc(title)}</h1>${page.note ? `<p>${esc(page.note)}</p>` : ''}<p style="margin-top:10px;font-size:12px;letter-spacing:.2em;text-transform:uppercase">${ls.length} ${t.properties}</p></div></section>
  <nav class="idx"><div class="wrap">${ls.map((l, i) => `<a href="#l-${esc(l.listing_id)}">${String(i + 1).padStart(2, '0')} · ${esc(addr1(l))}</a>`).join('')}</div></nav>
  <section class="sec" style="border-top:0"><div class="wrap">${cards}</div></section>
  ${ls.map(l => listingSection(l, lang, false)).join('')}
  ${agentBlock(lang, `${title} (${ls.map(l => l.listing_id).join(', ')})`)}
  ${footer(lang, ls.map(l => l.list_office_name), fmtDate(ls[0].synced_at || ls[0].modification_ts))}`;
  return pageHtml({ lang, title, desc: page.note || `${ls.length} ${t.properties} · ${AGENT.company}`, image: ls[0].photos && ls[0].photos[0], body, keys: ls.map(l => l.listing_key), path });
}

// ---------- generator UI ----------
function generatorHtml() {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Flávia Fernandes · Property Pages</title><meta name="robots" content="noindex"><style>${CSS}
.gen{max-width:860px;margin:0 auto;padding:clamp(40px,8vw,90px) var(--gut)}
.gen h1{font-size:clamp(24px,3.4vw,38px);margin:12px 0 6px}
.gen p.lead{color:var(--muted);font-size:15px;max-width:640px}
.sbox{display:flex;gap:0;margin-top:28px;border:1px solid var(--navy)}
.sbox input{flex:1;font:inherit;font-size:16px;padding:16px 18px;border:0;outline:none;background:#fff;min-width:0}
.sbox button{font:inherit;font-size:12px;letter-spacing:.16em;text-transform:uppercase;padding:0 22px;background:var(--navy);color:#fff;border:0;cursor:pointer}
.hint{font-size:12px;color:var(--muted);margin-top:10px}
.chips{display:flex;gap:18px;margin-top:12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.chips label{cursor:pointer;display:flex;gap:6px;align-items:center}
.sel-bar label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;display:flex;gap:6px;align-items:center;cursor:pointer}
.res{margin-top:22px;display:grid;gap:10px}
.r{display:grid;grid-template-columns:96px 1fr auto;gap:16px;align-items:center;border:1px solid var(--line);padding:10px;background:#fff;cursor:pointer}
.r:hover{border-color:var(--navy)}
.r.sel{border-color:var(--navy);box-shadow:inset 0 0 0 1px var(--navy)}
.r img{width:96px;height:72px;object-fit:cover;background:var(--ice)}
.r b{display:block;font-size:15px}
.r small{color:var(--muted);font-size:12.5px}
.r .pr{font-weight:500;white-space:nowrap}
.sel-bar{position:sticky;bottom:0;background:var(--navy);color:#fff;padding:14px var(--gut);display:none;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.sel-bar.on{display:flex}
.sel-bar input{font:inherit;font-size:14px;padding:10px 12px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;min-width:260px;flex:1}
.modal{position:fixed;inset:0;background:rgba(1,39,0,.7);display:none;align-items:center;justify-content:center;z-index:50;padding:20px}
.modal.on{display:flex}
.box{background:#fff;max-width:620px;width:100%;padding:34px;max-height:90vh;overflow:auto}
.box h2{font-size:20px;margin-bottom:12px}
.box p{font-size:13.5px;line-height:1.7;color:var(--muted);margin-bottom:12px}
.box .acts{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
.done{background:var(--sand);padding:22px;border:1px solid var(--line);margin-top:22px;display:none}
.done.on{display:block}
.done input{width:100%;font:inherit;font-size:14px;padding:12px;border:1px solid var(--line);background:#fff;margin:10px 0}
.recent{margin-top:48px}
.recent a{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--line);font-size:13.5px}
.recent a span:last-child{color:var(--muted);white-space:nowrap}
</style></head><body>
<header class="top"><div class="wrap"><img src="/logo-green.png" alt="Flávia Fernandes"><span class="eyebrow">Property Pages</span></div></header>
<main class="gen">
  <div class="eyebrow">Gerador</div><div class="rule"></div>
  <h1>Crie uma página com a sua marca</h1>
  <p class="lead">Digite um ou mais números do MLS (separados por vírgula), ou um endereço / nome de prédio. Selecione os imóveis, clique em Gerar, confirme a divulgação e copie o link.</p>
  <form class="sbox" id="sf"><input id="q" placeholder="MLS#, endereço, prédio ou cidade  ·  ex.: Jade Ocean" autofocus autocomplete="off"><button type="submit">Buscar</button></form>
  <div class="chips"><label><input type="radio" name="rent" value="all" checked> Todos</label><label><input type="radio" name="rent" value="sale"> Venda</label><label><input type="radio" name="rent" value="rent"> Locação</label></div>
  <div class="hint">Base: MIAMI MLS via Bridge. A busca traz imóveis que estão no MLS hoje (disponíveis, pendentes, sob contrato). Páginas já criadas continuam no ar mesmo depois de vendido ou alugado, mostrando o status atual.</div>
  <div class="res" id="res"></div>
  <div class="done" id="done"><div class="eyebrow">Página criada</div><input id="link" readonly onclick="this.select()"><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn solid" onclick="copyLink()">Copiar link</button><a class="btn" id="openlink" target="_blank">Abrir</a><a class="btn" id="walink" target="_blank">WhatsApp</a></div></div>
  <div class="recent" id="recent"></div>
</main>
<div class="sel-bar" id="bar"><span id="cnt"></span><input id="title" placeholder="Título da página (opcional) · ex.: Seleção Jade Ocean para o João"><label><input type="checkbox" id="hide"> Ocultar endereço</label><button class="btn light" onclick="clearSel()">Limpar</button><button class="btn light" onclick="openDisc()">Gerar página</button></div>
<div class="modal" id="disc"><div class="box">
  <div class="eyebrow">Disclosure</div><div class="rule"></div>
  <h2>Divulgação de dados do MLS</h2>
  <p>A página vai exibir dados e fotos do(s) imóvel(is) selecionado(s) provenientes do feed IDX do MIAMI Association of REALTORS® MLS, com a atribuição “Listing courtesy of [corretora anunciante]” e o aviso legal padrão no rodapé, conforme as regras IDX.</p>
  <p id="discl"></p>
  <p>Ao confirmar, você declara que o uso é feito por Flávia Fernandes (Luxe Properties), participante do MLS, para apresentar imóveis a clientes.</p>
  <div class="acts"><button class="btn" onclick="closeDisc()">Cancelar</button><button class="btn solid" onclick="createPage()">OK, criar página</button></div>
</div></div>
<script>
const sel=new Map();let last=[];
const $=s=>document.querySelector(s);
const money=n=>'$'+Number(n).toLocaleString('en-US',{maximumFractionDigits:0});
$('#sf').addEventListener('submit',async e=>{e.preventDefault();const q=$('#q').value.trim();if(!q)return;$('#res').innerHTML='<div class="hint">Buscando…</div>';const rent=document.querySelector('input[name=rent]:checked').value;const r=await fetch('/api/search?q='+encodeURIComponent(q)+'&rent='+rent);const d=await r.json();last=d;render();if(/^[A-Za-z]{1,2}\\d{5,}(\\s*[,;\\s]\\s*[A-Za-z]{1,2}\\d{5,})*$/.test(q)){d.forEach(l=>sel.set(l.listing_key,l));bar();render()}});
function render(){if(!last.length){$('#res').innerHTML='<div class="hint">Nenhum imóvel ativo encontrado.</div>';return}$('#res').innerHTML=last.map(l=>'<div class="r '+(sel.has(l.listing_key)?'sel':'')+'" onclick="tog(\\''+l.listing_key+'\\')"><img src="'+((l.photos&&l.photos[0])||'')+'"><div><b>'+l.unparsed_address+'</b><small>MLS '+l.listing_id+' · '+(l.is_rental?'Locação':'Venda')+' · '+(l.standard_status||'')+' · '+(l.bedrooms??'–')+' dorm · '+(l.bathrooms_full??'–')+' ba · '+(l.living_area?Number(l.living_area).toLocaleString():'–')+' sqft'+(l.building_name?' · '+l.building_name:'')+'</small></div><div class="pr">'+money(l.list_price)+(l.is_rental?'<br><small>/mo</small>':'')+'</div></div>').join('')}
function tog(k){const l=last.find(x=>x.listing_key===k);if(sel.has(k))sel.delete(k);else sel.set(k,l);bar();render()}
function bar(){$('#bar').classList.toggle('on',sel.size>0);$('#cnt').textContent=sel.size+' selecionado(s)'}
function clearSel(){sel.clear();bar();render()}
function openDisc(){const ls=[...sel.values()];$('#discl').innerHTML='<b>Imóveis:</b> '+ls.map(l=>l.listing_id+' — '+l.unparsed_address+' <i>(Listing courtesy of '+(l.list_office_name||'')+')</i>').join('<br>');$('#disc').classList.add('on')}
function closeDisc(){$('#disc').classList.remove('on')}
async function createPage(){closeDisc();const ls=[...sel.values()];const r=await fetch('/api/pages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({keys:ls.map(l=>l.listing_key),title:$('#title').value.trim(),hide_address:$('#hide').checked,hint:ls.length===1?ls[0].unparsed_address:($('#title').value.trim()||ls[0].building_name||ls[0].city)})});const d=await r.json();if(!r.ok){alert('Erro: '+(d.error||r.status));return}const url=location.origin+d.path;$('#link').value=url;$('#openlink').href=url;$('#walink').href='https://wa.me/?text='+encodeURIComponent(url);$('#done').classList.add('on');$('#done').scrollIntoView({behavior:'smooth'});loadRecent()}
function copyLink(){navigator.clipboard.writeText($('#link').value);$('#link').select()}
async function loadRecent(){const r=await fetch('/api/pages?recent=1');const d=await r.json();if(!d.length)return;$('#recent').innerHTML='<div class="eyebrow">Páginas recentes</div><div class="rule"></div>'+d.map(p=>'<a href="/p/'+p.slug+'" target="_blank"><span>'+(p.title||p.slug)+' · '+p.listing_keys.length+' imóvel(is)</span><span>'+new Date(p.created_at).toLocaleDateString()+' · '+(p.views||0)+' views</span></a>').join('')}
loadRecent();
</script></body></html>`;
}

// ---------- handler ----------
function send(res, status, body, type = 'text/html; charset=utf-8', extra = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  for (const [k, v] of Object.entries(extra)) res.setHeader(k, v);
  res.end(body);
}
function json(res, status, obj) { send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8'); }
async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = ''; for await (const c of req) raw += c; try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const lang = (url.searchParams.get('lang') || 'en').toLowerCase() === 'pt' ? 'pt' : 'en';

    if (path === '/' && req.method === 'GET') return send(res, 200, generatorHtml(), 'text/html; charset=utf-8', { 'Cache-Control': 'no-store' });

    if (path === '/api/search') {
      const rows = await searchListings(url.searchParams.get('q'), url.searchParams.get('rent') || 'all');
      return json(res, 200, rows.map(l => ({ ...pick(l), photos: (l.photos || []).slice(0, 1), public_remarks: undefined, features: undefined })));
    }

    if (path === '/api/pages' && req.method === 'GET') {
      const rows = await sb('ff_property_pages?select=slug,title,listing_keys,created_at,views&order=created_at.desc&limit=15');
      return json(res, 200, rows);
    }

    if (path === '/api/pages' && req.method === 'POST') {
      const b = await readJson(req);
      const keys = Array.isArray(b.keys) ? b.keys.filter(k => /^[a-f0-9]{16,64}$/i.test(k)).slice(0, 30) : [];
      if (!keys.length) return json(res, 400, { error: 'no listings' });
      const base = slugify(b.hint || b.title || '') || 'homes';
      const slug = `${base}-${rid(5)}`;
      await sb('ff_property_pages', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ slug, listing_keys: keys, title: (b.title || '').slice(0, 140) || null, note: (b.note || '').slice(0, 500) || null, hide_address: !!b.hide_address }) });
      return json(res, 200, { slug, path: `/p/${slug}` });
    }

    if (path === '/api/lead' && req.method === 'POST') {
      const b = await readJson(req);
      if (!b.name || !b.email) return json(res, 400, { error: 'name and email required' });
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      await sb('ff_leads', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ kind: 'property_page', name: String(b.name).slice(0, 120), email: String(b.email).slice(0, 160), phone: String(b.phone || '').slice(0, 40), message: String(b.message || '').slice(0, 2000), listing_key: String(b.listing_key || '').split(',')[0].slice(0, 64) || null, page_url: String(b.page_url || '').slice(0, 500), ip, user_agent: String(req.headers['user-agent'] || '').slice(0, 300) }) });
      return json(res, 200, { ok: true });
    }

    const m = path.match(/^\/p\/([a-z0-9-]+)$/i);
    if (m) {
      const slug = m[1];
      const rows = await sb(`ff_property_pages?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (!rows.length) return send(res, 404, notFound(lang));
      const page = rows[0];
      const ls = await listingsForPage(slug, page.listing_keys);
      if (!ls.length) return send(res, 404, notFound(lang, true));
      ls.forEach(l => { l._hide = !!page.hide_address; l._lang = lang; });
      sb(`rpc/ff_bump_page_views`, { method: 'POST', body: JSON.stringify({ p_slug: slug }) }).catch(() => {});
      const html = ls.length === 1 && !page.title ? renderSingle(ls[0], lang, path) : renderCollection(page, ls, lang, path);
      return send(res, 200, html, 'text/html; charset=utf-8', { 'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600' });
    }

    // direct by MLS id: /mls/A12092955 (no page record; convenience)
    const d = path.match(/^\/mls\/([A-Za-z]{1,2}\d{5,})$/);
    if (d) {
      const rows = await searchListings(d[1]);
      if (!rows.length) return send(res, 404, notFound(lang, true));
      rows[0]._lang = lang;
      return send(res, 200, renderSingle(rows[0], lang, path), 'text/html; charset=utf-8', { 'Cache-Control': 'public, max-age=300' });
    }

    return send(res, 404, notFound(lang));
  } catch (e) {
    console.error(e);
    return send(res, 500, `<pre style="font-family:monospace;padding:20px">Error: ${esc(e.message)}</pre>`);
  }
};

function notFound(lang, gone) {
  const msg = gone ? (lang === 'pt' ? 'Este imóvel não está mais disponível.' : 'This property is no longer available.') : (lang === 'pt' ? 'Página não encontrada.' : 'Page not found.');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${AGENT.company}</title><style>${CSS}</style></head><body>
  <header class="top"><div class="wrap"><img src="/logo-green.png" alt="Flávia Fernandes"></div></header>
  <main class="wrap" style="padding:80px var(--gut)"><div class="eyebrow">404</div><div class="rule"></div><h2>${msg}</h2><p style="margin-top:14px"><a class="btn" href="${AGENT.site}">flaviafernandes.vercel.app</a></p></main></body></html>`;
}
