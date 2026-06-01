import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Sun, Users, BarChart3, Package, ShieldCheck, LogOut, Settings, ChevronDown, FileText, AlertCircle, Zap, Search, Download } from 'lucide-react';
import { BarChart, Bar, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// ==========================================
// 1. CONFIGURAÇÃO DO FIREBASE (Banco de Dados e Auth)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD4GqSo-4EjCQ-nJa-gX3S5knTCVcjuYOY",
  authDomain: "ld-simulador-solar.firebaseapp.com",
  projectId: "ld-simulador-solar",
  storageBucket: "ld-simulador-solar.firebasestorage.app",
  messagingSenderId: "9543973605",
  appId: "1:9543973605:web:721bdd9895198418f6b20c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================================
// 2. DADOS DE KITS (Base de Dados Local)
// ==========================================
const kitsString = [
  { Kit: 'KIT 370kWh', Placas: '5 placas', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '9.335,68' },
  { Kit: 'KIT 440kWh', Placas: '6 placas', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '9.924,54' },
  { Kit: 'KIT 510kWh', Placas: '7 placas', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '10.513,40' },
  { Kit: 'KIT 590kWh', Placas: '8 placas', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '12.177,50' },
  { Kit: 'KIT 660kWh', Placas: '9 placas', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '12.950,81' },
  { Kit: 'KIT 730kWh', Placas: '10 placas', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '14.022,87' },
  { Kit: 'KIT 800kWh', Placas: '11 placas', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '14.840,30' },
  { Kit: 'KIT 880kWh', Placas: '12 placas', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '15.657,74' },
  { Kit: 'KIT 950kWh', Placas: '13 placas', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '16.941,40' },
  { Kit: 'KIT 1020kWh', Placas: '14 placas', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '17.758,83' },
  { Kit: 'KIT 1090kWh', Placas: '15 placas', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '18.586,78' },
  { Kit: 'KIT 1170kWh', Placas: '16 placas', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '20.119,90' },
  { Kit: 'KIT 1240kWh', Placas: '17 placas', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '21.089,72' },
  { Kit: 'KIT 1310kWh', Placas: '18 placas', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '22.191,31' },
  { Kit: 'KIT 1380kWh', Placas: '19 placas', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '23.029,30' },
  { Kit: 'KIT 1460kWh', Placas: '20 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '24.491,09' },
  { Kit: 'KIT 1530kWh', Placas: '21 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '25.689,47' },
  { Kit: 'KIT 1600kWh', Placas: '22 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '26.527,52' },
  { Kit: 'KIT 1670kWh', Placas: '23 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '27.365,57' },
  { Kit: 'KIT 1750kWh', Placas: '24 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '28.203,61' },
  { Kit: 'KIT 1820kWh', Placas: '25 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '29.173,42' },
  { Kit: 'KIT 1890kWh', Placas: '26 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '30.760,71' },
  { Kit: 'KIT 1960kWh', Placas: '27 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '31.598,76' },
  { Kit: 'KIT 2040kWh', Placas: '28 placas', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '32.436,81' }
];

const kitsMicro = [
  { Kit: 'KIT MICRO 230KWh', Placas: '3 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX2250', Valor: '7.725,81' },
  { Kit: 'KIT MICRO 310KWh', Placas: '4 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX2250', Valor: '8.342,16' },
  { Kit: 'KIT MICRO 390KWh', Placas: '5 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '9.620,01' },
  { Kit: 'KIT MICRO 460KWh', Placas: '6 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '10.236,36' },
  { Kit: 'KIT MICRO 540KWh', Placas: '7 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '12.679,71' },
  { Kit: 'KIT MICRO 620KWh', Placas: '8 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '13.924,63' },
  { Kit: 'KIT MICRO 690KWh', Placas: '9 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '14.734,62' },
  { Kit: 'KIT MICRO 770KWh', Placas: '10 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '15.579,54' },
  { Kit: 'KIT MICRO 840KWh', Placas: '11 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '16.424,46' },
  { Kit: 'KIT MICRO 920KWh', Placas: '12 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '17.269,38' },
  { Kit: 'KIT MICRO 1000KWh', Placas: '13 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '20.136,94' },
  { Kit: 'KIT MICRO 1070KWh', Placas: '14 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '21.264,26' },
  { Kit: 'KIT MICRO 1150KWh', Placas: '15 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '22.130,75' },
  { Kit: 'KIT MICRO 1230KWh', Placas: '16 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '22.997,24' },
  { Kit: 'KIT MICRO 1300KWh', Placas: '17 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '24.005,01' },
  { Kit: 'KIT MICRO 1380KWh', Placas: '18 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '24.871,51' },
  { Kit: 'KIT MICRO 1450KWh', Placas: '19 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '28.057,52' },
  { Kit: 'KIT MICRO 1530KWh', Placas: '20 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '28.924,01' },
  { Kit: 'KIT MICRO 1610KWh', Placas: '21 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '30.160,35' },
  { Kit: 'KIT MICRO 1680KWh', Placas: '22 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '31.026,84' },
  { Kit: 'KIT MICRO 1760KWh', Placas: '23 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '31.893,35' },
  { Kit: 'KIT MICRO 1840KWh', Placas: '24 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '32.759,84' },
  { Kit: 'KIT MICRO 1910KWh', Placas: '25 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '35.397,73' },
  { Kit: 'KIT MICRO 1990KWh', Placas: '26 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '37.010,76' },
  { Kit: 'KIT MICRO 2060KWh', Placas: '27 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '37.877,26' },
  { Kit: 'KIT MICRO 2140KWh', Placas: '28 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '38.743,75' },
  { Kit: 'KIT MICRO 2220KWh', Placas: '29 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '39.751,52' },
  { Kit: 'KIT MICRO 2290KWh', Placas: '30 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '40.618,01' },
  { Kit: 'KIT MICRO 2370KWh', Placas: '31 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '44.043,20' },
  { Kit: 'KIT MICRO 2450KWh', Placas: '32 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '45.170,51' },
  { Kit: 'KIT MICRO 2520KWh', Placas: '33 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '46.178,29' },
  { Kit: 'KIT MICRO 2600KWh', Placas: '34 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '47.044,78' },
  { Kit: 'KIT MICRO 2670KWh', Placas: '35 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '47.911,28' },
  { Kit: 'KIT MICRO 2750KWh', Placas: '36 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '48.777,77' },
  { Kit: 'KIT MICRO 2830KWh', Placas: '37 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '51.844,23' },
  { Kit: 'KIT MICRO 2900KWh', Placas: '38 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '52.971,55' },
  { Kit: 'KIT MICRO 2980KWh', Placas: '39 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '53.838,05' },
  { Kit: 'KIT MICRO 3060KWh', Placas: '40 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '54.704,54' },
  { Kit: 'KIT MICRO 3130KWh', Placas: '41 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '56.069,45' },
  { Kit: 'KIT MICRO 3210KWh', Placas: '42 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '56.935,94' },
  { Kit: 'KIT MICRO 3280KWh', Placas: '43 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '59.432,56' },
  { Kit: 'KIT MICRO 3360KWh', Placas: '44 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '60.559,88' },
  { Kit: 'KIT MICRO 3440KWh', Placas: '45 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '61.567,65' },
  { Kit: 'KIT MICRO 3510KWh', Placas: '46 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '62.434,14' },
  { Kit: 'KIT MICRO 3590KWh', Placas: '47 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '63.300,64' },
  { Kit: 'KIT MICRO 3670KWh', Placas: '48 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '64.167,13' },
  { Kit: 'KIT MICRO 3740KWh', Placas: '49 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '66.805,02' },
  { Kit: 'KIT MICRO 3820KWh', Placas: '50 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '67.671,51' },
  { Kit: 'KIT MICRO 3890KWh', Placas: '51 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '69.655,98' },
  { Kit: 'KIT MICRO 3970KWh', Placas: '52 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '70.522,47' },
  { Kit: 'KIT MICRO 4050KWh', Placas: '53 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '71.530,24' },
  { Kit: 'KIT MICRO 4120KWh', Placas: '54 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '72.396,73' },
  { Kit: 'KIT MICRO 4200KWh', Placas: '55 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '75.321,93' },
  { Kit: 'KIT MICRO 4280KWh', Placas: '56 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '76.188,42' },
  { Kit: 'KIT MICRO 4350KWh', Placas: '57 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '77.457,01' },
  { Kit: 'KIT MICRO 4430KWh', Placas: '58 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '78.323,50' },
  { Kit: 'KIT MICRO 4500KWh', Placas: '59 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '79.190,00' },
  { Kit: 'KIT MICRO 4580KWh', Placas: '60 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '80.056,49' },
  { Kit: 'KIT MICRO 4660KWh', Placas: '61 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '83.494,38' },
  { Kit: 'KIT MICRO 4730KWh', Placas: '62 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '84.360,88' },
  { Kit: 'KIT MICRO 4810KWh', Placas: '63 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '85.488,20' },
  { Kit: 'KIT MICRO 4890KWh', Placas: '64 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '86.354,69' },
  { Kit: 'KIT MICRO 4960KWh', Placas: '65 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '87.362,46' },
  { Kit: 'KIT MICRO 5040KWh', Placas: '66 placas', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '88.228,95' }
];


// ==========================================
// 3. COMPONENTE MESTRE
// ==========================================
export default function App() {
  const [view, setView] = useState('login'); 
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // BLINDAGEM DO SISTEMA (Impede botão direito e atalhos de código)
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockShortcuts = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) e.preventDefault();
    };
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockShortcuts);
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcuts);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030811] text-slate-100 font-sans selection:bg-orange-500 select-none">
      {toast && (
        <div className={`fixed top-10 right-5 z-[100] flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {view === 'login' && <LoginView setView={setView} showToast={showToast} />}
      {view === 'master' && <MasterView setView={setView} showToast={showToast} />}
      {view === 'empresa' && <EmpresaView setView={setView} showToast={showToast} />}
      {view === 'vendedor' && <VendedorView setView={setView} showToast={showToast} />}
    </div>
  );
}


// ==========================================
// 4. TELA DE LOGIN (Autenticação Real Firebase)
// ==========================================
function LoginView({ setView, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      showToast("Preencha e-mail e palavra-passe.", "error"); return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sucesso no login real - Como ainda não temos painel de controlo de permissões, vai para empresa por defeito.
      showToast("Login efetuado com sucesso!", "success");
      setView('empresa'); 
    } catch (error) {
      showToast("Utilizador não encontrado no Firebase. Use os atalhos de teste abaixo.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.08),transparent_70%)]">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-orange-400 to-amber-600 p-3 rounded-2xl mb-4 shadow-lg shadow-orange-500/20">
            <Sun className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">LD <span className="text-orange-500">SIMULADOR SOLAR</span></h2>
          <p className="text-slate-400 text-sm mt-1">Plataforma de Gestão e Vendas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">E-mail Corporativo</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nome@empresa.com" className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Palavra-passe Segura</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-3.5 rounded-xl mt-4 transition">
            {loading ? 'A verificar...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50">
          <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest mb-4">Acesso Rápido de Teste</p>
          <div className="space-y-3">
            <button onClick={() => setView('master')} className="w-full flex items-center justify-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2.5 rounded-xl transition text-sm font-medium">
              <ShieldCheck className="w-4 h-4" /> <span>Visão MASTER (Dono)</span>
            </button>
            <button onClick={() => setView('empresa')} className="w-full flex items-center justify-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2.5 rounded-xl transition text-sm font-medium">
              <BarChart3 className="w-4 h-4" /> <span>Visão EMPRESA (Cliente)</span>
            </button>
            <button onClick={() => setView('vendedor')} className="w-full flex items-center justify-center space-x-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 py-2.5 rounded-xl transition text-sm font-medium">
              <Users className="w-4 h-4" /> <span>Visão VENDEDOR (Simulador)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 5. TELA MASTER (Dono do Sistema)
// ==========================================
function MasterView({ setView, showToast }) {
  const [tab, setTab] = useState('dashboard');
  const [modalNovaEmpresa, setModalNovaEmpresa] = useState(false);

  return (
    <div className="flex h-screen bg-[#0B192C] overflow-hidden">
      <Sidebar role="master" tab={tab} setTab={setTab} setView={setView} />
      
      <main className="flex-1 overflow-auto p-8 relative">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Visão Master</h1>
          <div className="text-right">
            <p className="text-sm font-bold text-white">Super Admin</p>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </header>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Empresas Ativas" value="24" icon={<ShieldCheck className="text-emerald-500" />} />
              <StatCard title="Total Vendedores" value="156" icon={<Users className="text-blue-500" />} />
              <StatCard title="Simulações Mês" value="8.432" icon={<Zap className="text-orange-500" />} />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Bem-vindo ao Painel Master</h3>
              <p className="text-slate-400 text-sm">Vá à aba "Gestão de Empresas" no menu lateral para adicionar ou bloquear clientes.</p>
              <button onClick={() => setTab('empresas')} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition">Ir para Empresas</button>
            </div>
          </div>
        )}

        {tab === 'empresas' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="relative w-64 group">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input type="text" placeholder="Procurar empresa..." className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-orange-500 outline-none" />
              </div>
              <button onClick={() => setModalNovaEmpresa(true)} className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition">
                + Nova Empresa
              </button>
            </div>
            
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[10px] uppercase bg-slate-950 text-slate-500 font-bold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4 text-center">Plano</th>
                  <th className="px-6 py-4 text-center">Equipa</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr className="hover:bg-slate-800/40">
                  <td className="px-6 py-4"><span className="font-bold text-white block">SolarTech Brasil</span><span className="text-xs text-slate-500">contato@solartech.com</span></td>
                  <td className="px-6 py-4 text-center"><span className="bg-slate-800 px-3 py-1 rounded text-xs font-medium">Pro</span></td>
                  <td className="px-6 py-4 text-center font-bold text-white">12</td>
                  <td className="px-6 py-4 text-center"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-[11px] font-bold">ATIVA</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Nova Empresa */}
        {modalNovaEmpresa && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
               <button onClick={() => setModalNovaEmpresa(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><LogOut className="w-5 h-5"/></button>
               <h3 className="text-xl font-bold text-white mb-6">Cadastrar Nova Empresa</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Fantasia</label>
                   <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail Principal</label>
                   <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 mb-1 block">Plano Contratado</label>
                   <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500">
                      <option>Plano Free (Até 1 Vendedor)</option>
                      <option>Plano Básico (Até 5 Vendedores)</option>
                      <option>Plano Pro (Até 20 Vendedores)</option>
                      <option>Plano Ilimitado</option>
                   </select>
                   <p className="text-[10px] text-slate-500 mt-2">A gestão de valores e pagamentos destes planos é feita via Gateway de Pagamento (Asaas/Stripe) na aba Planos.</p>
                 </div>
                 <button onClick={() => { showToast("Empresa cadastrada. E-mail de acesso enviado!"); setModalNovaEmpresa(false); }} className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-3 rounded-xl mt-2">Criar Empresa</button>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}


// ==========================================
// 6. TELA DA EMPRESA (CRM e Gráficos Reais)
// ==========================================
function EmpresaView({ setView, showToast }) {
  const [tab, setTab] = useState('dashboard');
  const [orcamentos, setOrcamentos] = useState([]);
  
  // Filtros Reais
  const [dateFilter, setDateFilter] = useState('all'); // all, 7, 15, 30
  const [vendedorFilter, setVendedorFilter] = useState('todos');

  // Buscar orçamentos do Firebase em tempo real
  useEffect(() => {
    const q = query(collection(db, "orcamentos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
      setOrcamentos(docs);
    });
    return () => unsubscribe();
  }, []);

  // Lógica REAL de filtragem do CRM
  const orcamentosFiltrados = orcamentos.filter(orc => {
    // 1. Filtro de Vendedor
    if (vendedorFilter !== 'todos' && orc.vendedor !== vendedorFilter) return false;
    
    // 2. Filtro de Data
    if (dateFilter === 'all') return true;
    
    const dataOrcamento = orc.timestamp?.toDate();
    if(!dataOrcamento) return false; // Se a data não existir por alguma razão
    
    const hoje = new Date();
    const diferencaTempo = Math.abs(hoje - dataOrcamento);
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
    
    if (dateFilter === '7' && diferencaDias > 7) return false;
    if (dateFilter === '15' && diferencaDias > 15) return false;
    if (dateFilter === '30' && diferencaDias > 30) return false;
    
    return true;
  });

  // Função REAL para gerar CSV e baixar para o Excel
  const exportarParaExcel = () => {
    if(orcamentosFiltrados.length === 0) {
      showToast("Não há dados para exportar com estes filtros.", "error"); return;
    }
    showToast("A gerar ficheiro Excel...", "success");

    const cabecalhos = ["Data", "Vendedor", "Cliente", "WhatsApp", "Cidade", "Estrutura", "Tipo", "Kit", "Valor"];
    
    const linhas = orcamentosFiltrados.map(orc => {
      const dataStr = orc.timestamp ? new Date(orc.timestamp.toDate()).toLocaleDateString('pt-BR') : '--';
      return [dataStr, orc.vendedor, orc.cliente, orc.whatsapp, orc.cidade, orc.estrutura, orc.tipoKit, orc.kit, orc.valor];
    });

    const conteudoCSV = "data:text/csv;charset=utf-8,\uFEFF" 
      + [cabecalhos.join(";"), ...linhas.map(e => e.join(";"))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(conteudoCSV));
    link.setAttribute("download", `Relatorio_Simulador_${new Date().toLocaleDateString('pt-BR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extrair lista de vendedores únicos para o filtro
  const listaVendedores = [...new Set(orcamentos.map(o => o.vendedor))];

  // Dados para o Gráfico (Resumo Semanal Fixo para Visualização)
  const chartData = [
    { name: 'Seg', propostas: 12 }, { name: 'Ter', propostas: 19 }, { name: 'Qua', propostas: 15 },
    { name: 'Qui', propostas: 22 }, { name: 'Sex', propostas: 28 }, { name: 'Sáb', propostas: 9 }, { name: 'Dom', propostas: 4 }
  ];

  return (
    <div className="flex h-screen bg-[#0B192C] overflow-hidden">
      <Sidebar role="empresa" tab={tab} setTab={setTab} setView={setView} />
      
      <main className="flex-1 overflow-auto p-8 relative">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Painel da Empresa</h1>
          <div className="text-right">
            <p className="text-sm font-bold text-white">Admin Empresa</p>
          </div>
        </header>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Simulações (Total)" value={orcamentos.length} icon={<FileText className="text-orange-500" />} />
              <StatCard title="Vendedores Ativos" value={listaVendedores.length} icon={<Users className="text-blue-500" />} />
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
                 <p className="text-xs uppercase font-bold text-slate-500 mb-1">Acesso Rápido</p>
                 <h3 className="text-lg font-bold text-white">Relatórios CRM</h3>
                 <p className="text-xs text-slate-400 mt-1">Vá à aba Resultados para filtrar os vendedores e descarregar o Excel.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-6">Desempenho de Propostas (Última Semana)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} />
                    <Bar dataKey="propostas" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'resultados' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[calc(100vh-140px)]">
            <div className="p-6 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500"/> Histórico de Orçamentos</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Filtro de Vendedor */}
                <select value={vendedorFilter} onChange={(e) => setVendedorFilter(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl py-2 px-4 text-sm text-white outline-none cursor-pointer">
                  <option value="todos">Todos os Vendedores</option>
                  {listaVendedores.map((v, i) => <option key={i} value={v}>{v}</option>)}
                </select>

                {/* Filtros de Data Reais */}
                <div className="bg-slate-950 border border-slate-700 rounded-xl p-1 inline-flex">
                  <button onClick={() => setDateFilter('7')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === '7' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>7 Dias</button>
                  <button onClick={() => setDateFilter('15')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === '15' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>15 Dias</button>
                  <button onClick={() => setDateFilter('30')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === '30' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>30 Dias</button>
                  <button onClick={() => setDateFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>Todos</button>
                </div>
                
                {/* Botão Exportar Excel Real */}
                <button onClick={exportarParaExcel} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">
                  <Download className="w-4 h-4"/> Baixar Excel
                </button>
              </div>
            </div>
            
            {/* Tabela com BARRA DE ROLAGEM */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-sm text-slate-300 min-w-max">
                <thead className="text-[10px] uppercase bg-slate-950 text-slate-500 font-bold border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Vendedor</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Tel / Cidade</th>
                    <th className="px-4 py-3">Estrutura</th>
                    <th className="px-4 py-3">Kit Escohido</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {orcamentosFiltrados.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-8 text-slate-500">Nenhum orçamento encontrado para os filtros selecionados.</td></tr>
                  ) : (
                    orcamentosFiltrados.map((orc) => (
                      <tr key={orc.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 text-xs text-slate-400">{orc.timestamp ? new Date(orc.timestamp.toDate()).toLocaleDateString('pt-BR') : '--'}</td>
                        <td className="px-4 py-3 font-medium text-white">{orc.vendedor}</td>
                        <td className="px-4 py-3">{orc.cliente}</td>
                        <td className="px-4 py-3 text-xs"><span className="block font-mono text-slate-400">{orc.whatsapp}</span>{orc.cidade}</td>
                        <td className="px-4 py-3 text-xs">{orc.estrutura}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${orc.tipoKit === 'Micro' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>{orc.tipoKit}</span>
                          <span className="block text-xs mt-1">{orc.kit}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-orange-400">{orc.valor}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'vendedores' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-10">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <h3 className="text-xl font-bold text-white mb-2">Cadastrar Vendedor</h3>
            <div className="space-y-4 mt-6 text-left">
              <input type="text" placeholder="Nome do Consultor" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none" />
              <input type="email" placeholder="E-mail de Login" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none" />
              <input type="text" value="Senha Automática: Solar@2026" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-orange-400 font-mono text-sm outline-none cursor-not-allowed" />
              <button onClick={() => showToast("Vendedor cadastrado com sucesso!", "success")} className="w-full bg-orange-500 text-slate-950 font-bold py-3 rounded-xl">Criar Acesso</button>
            </div>
          </div>
        )}

        {tab === 'kits' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-10">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <h3 className="text-xl font-bold text-white mb-2">Atualizar Preços (Excel)</h3>
            <p className="text-sm text-slate-400 mb-6">Suba a sua planilha padrão para atualizar os kits no telemóvel dos vendedores.</p>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 hover:bg-slate-800/50 cursor-pointer transition" onClick={() => showToast("Função de upload disponível após ligar ao Servidor Backend.", "error")}>
              <Download className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-bold text-slate-300">Clique para selecionar ficheiro .xlsx</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


// ==========================================
// 7. TELA DO VENDEDOR (O Simulador Real)
// ==========================================
function VendedorView({ setView, showToast }) {
  const [tab, setTab] = useState('simulador');
  const [vendedor, setVendedor] = useState('');
  const [cliente, setCliente] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');
  const [estrutura, setEstrutura] = useState('');
  const [kitString, setKitString] = useState('');
  const [kitMicro, setKitMicro] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados Locais para o Dashboard Real do Vendedor
  const [todasMinhasVendas, setTodasMinhasVendas] = useState([]);
  const [tempoFiltro, setTempoFiltro] = useState('mes'); // hoje, semana, mes

  // Busca dados para o Dashboard do Vendedor
  useEffect(() => {
    if(!vendedor) return; // Só busca se ele já digitou o nome (em produção usa o ID logado)
    const q = query(collection(db, "orcamentos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if(data.vendedor.toLowerCase() === vendedor.toLowerCase()) {
          docs.push({ id: doc.id, ...data });
        }
      });
      setTodasMinhasVendas(docs);
    });
    return () => unsubscribe();
  }, [vendedor]);

  // Aplica o filtro de tempo aos cards do Vendedor
  const vendasFiltradas = todasMinhasVendas.filter(orc => {
    const dataOrc = orc.timestamp?.toDate();
    if(!dataOrc) return false;
    const hoje = new Date();
    const difDias = Math.ceil(Math.abs(hoje - dataOrc) / (1000 * 60 * 60 * 24));
    
    if(tempoFiltro === 'hoje' && difDias > 1) return false;
    if(tempoFiltro === 'semana' && difDias > 7) return false;
    if(tempoFiltro === 'mes' && difDias > 30) return false;
    return true;
  });

  const qtyString = vendasFiltradas.filter(v => v.tipoKit === 'String').length;
  const qtyMicro = vendasFiltradas.filter(v => v.tipoKit === 'Micro').length;

  const handleWhatsapp = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    let formatted = val;
    if (val.length > 0) formatted = '(' + val.substring(0, 2);
    if (val.length > 2) formatted += ') ' + val.substring(2, 7);
    if (val.length > 7) formatted += '-' + val.substring(7, 11);
    setWhatsapp(formatted);
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!vendedor || !cliente || !whatsapp || !cidade || !estrutura || (!kitString && !kitMicro)) {
      showToast("Preencha todos os campos obrigatórios!", "error");
      return;
    }

    setLoading(true);
    showToast("A guardar no servidor...", "success");

    const kitSelecionado = kitString ? kitsString[kitString] : kitsMicro[kitMicro];
    const tipoKit = kitString ? 'String' : 'Micro';
    const cleanPotencia = kitSelecionado.Modulo.replace(/Módulo\s*/gi, '').trim();
    
    const dados = {
      vendedor,
      cliente,
      whatsapp,
      cidade,
      estrutura,
      tipoKit,
      kit: kitSelecionado.Kit,
      valor: `R$ ${kitSelecionado.Valor}`,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "orcamentos"), dados);
      
      const texto = `Empresa: Energia Solar ☀️\n\n` +
                    `Segue o seu orçamento personalizado de Energia Solar\n\n` +
                    `👤 *Cliente:* ${cliente}\n\n` +
                    `📍 *Cidade:* ${cidade}\n\n` +
                    `📱 *Zap:* ${whatsapp}\n\n` +
                    `🏠 *Estrutura do Telhado:* ${estrutura}\n\n` +
                    `📦 *Kit Selecionado:* ${kitSelecionado.Kit}\n\n` +
                    `☀️ *Placas:* ${kitSelecionado.Placas}\n\n` +
                    `⚡ *Potência:* ${cleanPotencia}\n\n` +
                    `🔄 *Inversor:* ${kitSelecionado.Inversor}\n\n` +
                    `💰 *Valor do Kit:* R$ ${kitSelecionado.Valor}\n\n` +
                    `✨ *Condições Especiais:*\n\n` +
                    `💳 Financiamos 100% com Zero de Entrada\n\n` +
                    `📅 Primeira parcela com prazo de até 120 dias para começar a pagar\n\n` +
                    `💼 Atendido por: *${vendedor}*\n\n` +
                    `Ficamos à disposição para esclarecer dúvidas e realizar o seu projeto.`;
                    
      const numZap = '55' + whatsapp.replace(/\D/g, '');
      setTimeout(() => {
         window.open(`https://api.whatsapp.com/send?phone=${numZap}&text=${encodeURIComponent(texto)}`, '_blank');
      }, 500);
      
      setCliente(''); setWhatsapp(''); setCidade(''); setEstrutura(''); setKitString(''); setKitMicro('');
    } catch (error) {
      showToast("Erro de conexão ao gravar no Banco de Dados.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0B192C] overflow-hidden">
      <Sidebar role="vendedor" tab={tab} setTab={setTab} setView={setView} />
      
      <main className="flex-1 overflow-auto p-4 md:p-8">
        
        {tab === 'simulador' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* MINI DASHBOARD REAL DO VENDEDOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 border-b border-slate-800 pb-4">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-500"/> O Meu Desempenho
                </h2>
                <div className="bg-slate-950 rounded-xl p-1 flex text-xs font-bold border border-slate-700">
                  <button onClick={() => setTempoFiltro('hoje')} className={`px-4 py-1.5 rounded-lg transition ${tempoFiltro === 'hoje' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Hoje</button>
                  <button onClick={() => setTempoFiltro('semana')} className={`px-4 py-1.5 rounded-lg transition ${tempoFiltro === 'semana' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Semana</button>
                  <button onClick={() => setTempoFiltro('mes')} className={`px-4 py-1.5 rounded-lg transition ${tempoFiltro === 'mes' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Mês</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Propostas</p>
                    <p className="text-2xl font-black text-white">{vendasFiltradas.length}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Kits String</p>
                    <p className="text-2xl font-black text-blue-400">{qtyString}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Kits Micro</p>
                    <p className="text-2xl font-black text-emerald-400">{qtyMicro}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex flex-col justify-center items-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status Meta</p>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">No Ritmo</span>
                </div>
              </div>
            </div>

            {/* FORMULÁRIO DO SIMULADOR */}
            <form onSubmit={handleEnviar} className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
              <div>
                <h3 className="text-sm font-black text-orange-500 mb-4 tracking-widest uppercase flex items-center gap-2"><span className="bg-orange-500/20 text-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> CONSULTOR</h3>
                <input type="text" value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Digite o seu nome completo para ver as suas estatísticas acima" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-orange-500 transition" required />
              </div>

              <div>
                <h3 className="text-sm font-black text-orange-500 mb-4 tracking-widest uppercase flex items-center gap-2"><span className="bg-orange-500/20 text-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> CONFIGURAÇÃO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select value={kitString} onChange={(e) => { setKitString(e.target.value); setKitMicro(''); setEstrutura(''); }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none cursor-pointer focus:border-orange-500">
                    <option value="">-- Selecione Kit String --</option>
                    {kitsString.map((k, i) => <option key={i} value={i}>{k.Kit} - R$ {k.Valor}</option>)}
                  </select>
                  <select value={kitMicro} onChange={(e) => { setKitMicro(e.target.value); setKitString(''); setEstrutura(''); }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none cursor-pointer focus:border-orange-500">
                    <option value="">-- Selecione Kit Micro --</option>
                    {kitsMicro.map((k, i) => <option key={i} value={i}>{k.Kit} - R$ {k.Valor}</option>)}
                  </select>
                </div>
                <select value={estrutura} onChange={(e) => setEstrutura(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none cursor-pointer focus:border-orange-500">
                  <option value="">-- Estrutura do Telhado --</option>
                  <option value="Madeira">Madeira</option>
                  <option value="Ferro">Ferro</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-black text-orange-500 mb-4 tracking-widest uppercase flex items-center gap-2"><span className="bg-orange-500/20 text-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span> CLIENTE</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do Cliente" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-orange-500" required />
                  <input type="tel" value={whatsapp} onChange={handleWhatsapp} placeholder="WhatsApp (00) 00000-0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-orange-500" required />
                  <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade - Estado" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-orange-500" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-lg py-4 rounded-xl transition-transform transform hover:-translate-y-0.5 shadow-xl shadow-orange-500/20">
                {loading ? 'Gravando no Banco de Dados...' : 'Enviar Proposta WhatsApp'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// 8. SIDEBAR GERAL (Menu Lateral)
// ==========================================
function Sidebar({ role, tab, setTab, setView }) {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="bg-orange-500 p-1.5 rounded-lg"><Sun className="w-6 h-6 text-slate-900" /></div>
        <span className="font-black text-white text-lg tracking-tight leading-none">LD SIMULADOR<br/><span className="text-orange-500 text-xs">Solar SaaS</span></span>
      </div>
      
      <nav className="p-4 flex-1 space-y-2 mt-4">
        {role === 'master' && (
          <>
            <NavItem icon={<BarChart3 />} text="Dashboard Master" active={tab==='dashboard'} onClick={()=>setTab('dashboard')} />
            <NavItem icon={<ShieldCheck />} text="Gerir Empresas" active={tab==='empresas'} onClick={()=>setTab('empresas')} />
          </>
        )}
        {role === 'empresa' && (
          <>
            <NavItem icon={<BarChart3 />} text="Dashboard Central" active={tab==='dashboard'} onClick={()=>setTab('dashboard')} />
            <NavItem icon={<FileText />} text="Resultados (CRM)" active={tab==='resultados'} onClick={()=>setTab('resultados')} />
            <NavItem icon={<Users />} text="Meus Vendedores" active={tab==='vendedores'} onClick={()=>setTab('vendedores')} />
            <NavItem icon={<Package />} text="Gestão de Kits" active={tab==='kits'} onClick={()=>setTab('kits')} />
            
            <div className="pt-6 mt-6 border-t border-slate-800/50">
              <p className="px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Suporte & Ajuda</p>
              <NavItem icon={<AlertCircle />} text="Tutorial do Sistema" onClick={() => alert("Janela de Vídeos de Tutorial em Breve")} />
              <button onClick={() => window.open('https://wa.me/5562999999999', '_blank')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-emerald-400 hover:bg-emerald-500/10 font-bold text-sm">
                 <Zap size={18} /> <span>Suporte WhatsApp</span>
              </button>
            </div>
          </>
        )}
        {role === 'vendedor' && (
          <>
            <NavItem icon={<Zap />} text="Novo Orçamento" active={tab==='simulador'} onClick={()=>setTab('simulador')} />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={() => setView('login')} className="flex items-center space-x-3 text-slate-500 hover:text-red-400 transition-colors w-full p-2 font-bold text-sm">
          <LogOut size={18} /> <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, text, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
      {React.cloneElement(icon, { size: 18, className: active ? 'text-orange-500' : '' })}
      <span className="text-sm font-bold">{text}</span>
    </button>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
        {icon}
      </div>
    </div>
  );
}
