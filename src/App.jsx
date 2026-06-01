import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Sun, Users, BarChart3, Package, ShieldCheck, LogOut, Settings, ChevronDown, FileText, AlertCircle, Zap } from 'lucide-react';

// ==========================================
// 1. CONFIGURAÇÃO DO FIREBASE (O Seu Banco de Dados)
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

// ==========================================
// 2. DADOS DE KITS (Exemplo Simulado)
// ==========================================
const kitsString = [
  { nome: 'KIT 370kWh', placas: '5 placas', modulo: '590W', inversor: 'AUXSOL 3K', valor: '9.335,68' },
  { nome: 'KIT 590kWh', placas: '8 placas', modulo: '590W', inversor: 'AUXSOL 5K', valor: '12.177,50' },
  { nome: 'KIT 880kWh', placas: '12 placas', modulo: '590W', inversor: 'AUXSOL 5K', valor: '15.657,74' },
];

const kitsMicro = [
  { nome: 'KIT MICRO 230KWh', placas: '3 placas', modulo: '620W', inversor: 'TSUNESS TSOL', valor: '7.725,81' },
  { nome: 'KIT MICRO 460KWh', placas: '6 placas', modulo: '620W', inversor: 'TSUNESS TSOL', valor: '10.236,36' },
  { nome: 'KIT MICRO 690KWh', placas: '9 placas', modulo: '620W', inversor: 'TSUNESS TSOL', valor: '14.734,62' },
];

// ==========================================
// 3. COMPONENTE PRINCIPAL (App)
// ==========================================
export default function App() {
  const [view, setView] = useState('login'); // login, master, empresa, vendedor

  // BLINDAGEM DE SEGURANÇA (Impede botão direito e F12)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Roteador simples
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none">
      {view === 'login' && <LoginView setView={setView} />}
      {view === 'master' && <MasterView setView={setView} />}
      {view === 'empresa' && <EmpresaView setView={setView} />}
      {view === 'vendedor' && <VendedorView setView={setView} />}
    </div>
  );
}

// ==========================================
// 4. TELA DE LOGIN
// ==========================================
function LoginView({ setView }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-3 rounded-xl text-white shadow-lg shadow-orange-500/20">
              <Sun size={28} />
            </div>
            <div>
              <span className="text-xl font-black text-white block leading-none">LD SIMULADOR</span>
              <span className="text-orange-500 font-bold text-sm">Solar SaaS</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">E-mail de Acesso</label>
            <input type="email" placeholder="seu@email.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Palavra-passe</label>
            <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
          </div>
          
          <button onClick={() => setView('empresa')} className="w-full py-3 mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">
            Entrar no Sistema
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-2 pt-6 border-t border-slate-800">
          <p className="text-xs text-center text-slate-500 font-semibold mb-2">ACESSOS DE TESTE (ATALHOS):</p>
          <button onClick={() => setView('master')} className="text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded text-slate-300">Entrar como Master (Dono)</button>
          <button onClick={() => setView('vendedor')} className="text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded text-slate-300">Entrar como Vendedor</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. TELA MASTER (Dono do SaaS)
// ==========================================
function MasterView({ setView }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="master" setView={setView} />
      <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Painel Administrativo Master</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Empresas Ativas" value="12" icon={<ShieldCheck className="text-emerald-500" />} />
          <StatCard title="Total Vendedores" value="84" icon={<Users className="text-blue-500" />} />
          <StatCard title="Simulações Hoje" value="342" icon={<FileText className="text-orange-500" />} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Cadastrar Nova Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome da Empresa" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none" />
            <input type="email" placeholder="E-mail Responsável" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none" />
            <select className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none">
              <option>Plano Free (Até 1 Vendedor)</option>
              <option>Plano Básico (Até 5 Vendedores)</option>
              <option>Plano Pro (Até 20 Vendedores)</option>
              <option>Plano Ilimitado</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg py-3">Criar Conta Empresa</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. TELA DA EMPRESA (Cliente do SaaS)
// ==========================================
function EmpresaView({ setView }) {
  const [orcamentos, setOrcamentos] = useState([]);

  useEffect(() => {
    // Busca orçamentos do Firebase em tempo real
    const q = query(collection(db, "orcamentos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
      setOrcamentos(docs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="empresa" setView={setView} />
      <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Painel da Empresa (SolarTech)</h1>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Resultados (CRM)</h2>
              <p className="text-sm text-slate-400">Acompanhe as propostas enviadas pela sua equipa.</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-700">7 Dias</button>
              <button className="px-4 py-2 bg-orange-500/20 text-orange-500 border border-orange-500/50 rounded-lg text-sm font-semibold">30 Dias</button>
            </div>
          </div>

          {/* BARRA DE ROLAGEM APLICADA AQUI */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Vendedor</th>
                  <th className="px-4 py-3">Cliente / Cidade</th>
                  <th className="px-4 py-3">Estrutura</th>
                  <th className="px-4 py-3">Kit Escolhido</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orcamentos.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-500">Nenhum orçamento gerado ainda.</td></tr>
                ) : (
                  orcamentos.map((orc) => (
                    <tr key={orc.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-4 text-slate-300">{new Date(orc.timestamp?.toDate()).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-4 font-semibold text-white">{orc.vendedor}</td>
                      <td className="px-4 py-4">
                        <div className="text-white">{orc.cliente}</div>
                        <div className="text-xs text-slate-500">{orc.cidade} - {orc.whatsapp}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{orc.estrutura}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${orc.tipoKit === 'Micro' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {orc.tipoKit}
                        </span>
                        <div className="text-slate-300 text-xs mt-1">{orc.kit}</div>
                      </td>
                      <td className="px-4 py-4 font-bold text-emerald-400">{orc.valor}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. TELA DO VENDEDOR (O Simulador)
// ==========================================
function VendedorView({ setView }) {
  const [vendedor, setVendedor] = useState('');
  const [cliente, setCliente] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');
  const [estrutura, setEstrutura] = useState('');
  const [kitString, setKitString] = useState('');
  const [kitMicro, setKitMicro] = useState('');
  const [loading, setLoading] = useState(false);

  // Máscara de WhatsApp
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
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    const kitSelecionado = kitString ? kitsString[kitString] : kitsMicro[kitMicro];
    const tipoKit = kitString ? 'String' : 'Micro';
    
    const dados = {
      vendedor,
      cliente,
      whatsapp,
      cidade,
      estrutura,
      tipoKit,
      kit: kitSelecionado.nome,
      valor: `R$ ${kitSelecionado.valor}`,
      timestamp: serverTimestamp()
    };

    try {
      // Grava no Firebase
      await addDoc(collection(db, "orcamentos"), dados);
      
      // Abre o WhatsApp
      const texto = `Olá ${cliente}! Segue o orçamento do Kit Solar ${kitSelecionado.nome} (${tipoKit}) no valor de R$ ${kitSelecionado.valor}. Estrutura: ${estrutura}. Atenciosamente, ${vendedor}.`;
      const numZap = '55' + whatsapp.replace(/\D/g, '');
      window.open(`https://api.whatsapp.com/send?phone=${numZap}&text=${encodeURIComponent(texto)}`, '_blank');
      
      // Limpa formulário
      setCliente(''); setWhatsapp(''); setCidade(''); setEstrutura(''); setKitString(''); setKitMicro('');
    } catch (error) {
      alert("Erro ao salvar orçamento. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="vendedor" setView={setView} />
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl font-bold text-white mb-4 md:mb-0">O Meu Desempenho</h2>
            <div className="flex space-x-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 min-w[100px] text-center">
                <p className="text-xs text-slate-400 font-bold">PROPOSTAS</p>
                <p className="text-2xl font-black text-white">12</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 min-w[100px] text-center">
                <p className="text-xs text-slate-400 font-bold">STATUS</p>
                <p className="text-sm font-black text-emerald-500 mt-2">No Ritmo</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleEnviar} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-orange-500 mb-4 border-b border-slate-800 pb-2">1. CONSULTOR</h3>
              <input type="text" value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Seu Nome Completo" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500" required />
            </div>

            <div>
              <h3 className="text-sm font-bold text-orange-500 mb-4 border-b border-slate-800 pb-2">2. CONFIGURAÇÃO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select value={kitString} onChange={(e) => { setKitString(e.target.value); setKitMicro(''); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none cursor-pointer">
                  <option value="">-- Selecione Kit String --</option>
                  {kitsString.map((k, i) => <option key={i} value={i}>{k.nome} - R$ {k.valor}</option>)}
                </select>
                <select value={kitMicro} onChange={(e) => { setKitMicro(e.target.value); setKitString(''); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none cursor-pointer">
                  <option value="">-- Selecione Kit Micro --</option>
                  {kitsMicro.map((k, i) => <option key={i} value={i}>{k.nome} - R$ {k.valor}</option>)}
                </select>
              </div>
              <select value={estrutura} onChange={(e) => setEstrutura(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none cursor-pointer">
                <option value="">-- Estrutura do Telhado --</option>
                <option value="Madeira">Madeira</option>
                <option value="Ferro">Ferro</option>
                <option value="Laje">Laje</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-bold text-orange-500 mb-4 border-b border-slate-800 pb-2">3. CLIENTE</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do Cliente" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500" required />
                <input type="text" value={whatsapp} onChange={handleWhatsapp} placeholder="WhatsApp" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500" required />
                <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade - Estado" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20">
              {loading ? 'Processando...' : 'Enviar Proposta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================
function Sidebar({ role, setView }) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-orange-500 p-2 rounded-lg text-white">
          <Sun size={20} />
        </div>
        <div>
          <span className="text-sm font-black text-white block">LD SIMULADOR</span>
          <span className="text-orange-500 font-bold text-[10px]">SaaS</span>
        </div>
      </div>
      
      <div className="p-4 flex-1 space-y-2">
        {role === 'master' && (
          <>
            <NavItem icon={<BarChart3 />} text="Dashboard Master" active />
            <NavItem icon={<ShieldCheck />} text="Gerir Empresas" />
            <NavItem icon={<Settings />} text="Configurações" />
          </>
        )}
        {role === 'empresa' && (
          <>
            <NavItem icon={<BarChart3 />} text="Dashboard Central" />
            <NavItem icon={<FileText />} text="Resultados (CRM)" active />
            <NavItem icon={<Users />} text="Meus Vendedores" />
            <NavItem icon={<Package />} text="Gestão de Kits" />
          </>
        )}
        {role === 'vendedor' && (
          <>
            <NavItem icon={<Zap />} text="Nova Simulação" active />
            <NavItem icon={<FileText />} text="Minhas Vendas" />
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button onClick={() => setView('login')} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full p-2">
          <LogOut size={18} />
          <span className="text-sm font-semibold">Sair com Segurança</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, text, active }) {
  return (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
      {React.cloneElement(icon, { size: 18, className: active ? 'text-orange-500' : '' })}
      <span className="text-sm font-semibold">{text}</span>
    </button>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400 font-semibold mb-1">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
        {icon}
      </div>
    </div>
  );
}
