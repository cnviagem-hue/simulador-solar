import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs, writeBatch, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { Search, Building, Users, Zap, Plus, Settings, AlertCircle, LogOut, CheckCircle, ChevronDown, User, Smartphone, MapPin, BarChart3, Sun, FileSpreadsheet, ClipboardList, MessageCircle, BookOpen, Menu, X, Eye, EyeOff, Download, Activity, List, TrendingUp, Calendar, MessageSquare, Trash2 } from 'lucide-react';

// ==========================================
// 1. CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD4GqSo-4EjCQ-nJa-gX3S5knTCVcjuYOY",
  authDomain: "ld-simulador-solar.firebaseapp.com",
  projectId: "ld-simulador-solar",
  storageBucket: "ld-simulador-solar.firebasestorage.app",
  messagingSenderId: "9543973605",
  appId: "1:9543973605:web:721bdd9895198418f6b20c"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const secondaryApp = getApps().find(a => a.name === "Secondary") || initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

// ==========================================
// HELPER: FORMATAR MOEDA
// ==========================================
export const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    let numeroStr = String(valor).replace(/[^\d.,-]/g, '');
    if(numeroStr.includes(',') && numeroStr.includes('.')){
         numeroStr = numeroStr.replace(/\./g, '').replace(',', '.');
    } else if (numeroStr.includes(',')){
         numeroStr = numeroStr.replace(',', '.');
    }
    const numero = parseFloat(numeroStr);
    if (isNaN(numero)) return valor; 
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// ==========================================
// 2. KITS DE SEGURANÇA
// ==========================================
const fallbackKitsString = [
  { Kit: 'KIT 370kWh (Padrão)', Placas: '5', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '9335.68' },
  { Kit: 'KIT 590kWh (Padrão)', Placas: '8', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '12177.50' },
  { Kit: 'KIT 1020kWh (Padrão)', Placas: '14', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '17758.83' }
];

const fallbackKitsMicro = [
  { Kit: 'KIT MICRO 230KWh (Padrão)', Placas: '3', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX2250', Valor: '7725.81' },
  { Kit: 'KIT MICRO 540KWh (Padrão)', Placas: '7', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '12679.71' },
  { Kit: 'KIT MICRO 1000KWh (Padrão)', Placas: '13', Modulo: '620W', Inversor: 'TSUNESS TSOL-MX3000D', Valor: '20136.94' }
];

// ==========================================
// 3. LAYOUT BASE DO SAAS 
// ==========================================
const DashboardLayout = ({ children, title, setView, role, currentTab, setCurrentTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleTabChange = (tab) => { setCurrentTab(tab); setIsMobileMenuOpen(false); };

  const handleLogout = () => {
    signOut(auth).then(() => setView('login')).catch((error) => console.error("Erro ao sair", error));
  };

  return (
    <div className="flex h-screen bg-[#030811] text-slate-100 font-sans selection:bg-orange-500 overflow-hidden w-full">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={toggleMobileMenu}></div>}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0B192C] border-r border-slate-800 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-1.5 rounded-lg"><Sun className="w-5 h-5 text-[#0B192C]" /></div>
              <span className="font-extrabold text-white tracking-tight">LD <span className="text-amber-500">SIMULADOR</span></span>
            </div>
            <button onClick={toggleMobileMenu} className="md:hidden text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <nav className="p-4 space-y-2 overflow-y-auto">
            <button onClick={() => handleTabChange('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'dashboard' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
              <BarChart3 className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-amber-500' : ''}`} /> <span>Dashboard Central</span>
            </button>
            {role === 'master' && (
              <button onClick={() => handleTabChange('empresas')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'empresas' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                <Building className={`w-5 h-5 ${currentTab === 'empresas' ? 'text-amber-500' : ''}`} /> <span>Gestão de Empresas</span>
              </button>
            )}
            {role === 'empresa' && (
              <>
                <button onClick={() => handleTabChange('resultados')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'resultados' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <ClipboardList className={`w-5 h-5 ${currentTab === 'resultados' ? 'text-amber-500' : ''}`} /> <span>Resultados (CRM)</span>
                </button>
                <button onClick={() => handleTabChange('vendedores')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'vendedores' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Users className={`w-5 h-5 ${currentTab === 'vendedores' ? 'text-amber-500' : ''}`} /> <span>Meus Vendedores</span>
                </button>
                <button onClick={() => handleTabChange('kits')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'kits' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Zap className={`w-5 h-5 ${currentTab === 'kits' ? 'text-amber-500' : ''}`} /> <span>Gestão de Kits</span>
                </button>
                <div className="pt-4 mt-4 border-t border-slate-800/50">
                  <button onClick={() => handleTabChange('tutorial')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'tutorial' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <BookOpen className={`w-5 h-5 ${currentTab === 'tutorial' ? 'text-amber-500' : ''}`} /> <span>Tutorial do Sistema</span>
                  </button>
                  <button onClick={() => window.open('https://wa.me/5564981005505?text=Olá', '_blank')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400">
                    <MessageCircle className="w-5 h-5" /> <span>Suporte</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-500 hover:text-red-400 transition px-4 py-2 w-full text-left font-medium">
            <LogOut className="w-5 h-5" /> <span>Sair com Segurança</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full relative bg-[#030811] overflow-hidden w-full">
        <header className="h-20 border-b border-slate-800 bg-[#0B192C]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 relative z-10 w-full shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleMobileMenu} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"><Menu className="w-6 h-6" /></button>
            <h1 className="text-lg sm:text-xl font-bold text-white truncate pr-2">{title}</h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            <div className="text-right">
              <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-none">{role === 'master' ? 'Super Admin' : 'Admin Empresa'}</p>
              <p className="text-[10px] sm:text-xs text-emerald-400">Online</p>
            </div>
            <button onClick={handleLogout} className="md:hidden p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg bg-slate-800/50 border border-slate-700/50" title="Sair"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 relative z-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

// ==========================================
// 4. TELA DE LOGIN 
// ==========================================
const LoginView = ({ setView, setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha o seu e-mail e senha.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (email.toLowerCase() === 'cnviagem@gmail.com') {
        setUserData({ role: 'master', uid: user.uid, email: user.email });
        setView('master');
      } else {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          if (data.status === 'Bloqueado' || data.status === 'Bloqueada') {
              await signOut(auth);
              setError('Acesso negado. Favor entrar em contato com a Empresa para ativar seu acesso.');
              setLoading(false);
              return;
          }

          setUserData({ ...data, uid: user.uid });
          if (data.role === 'vendedor') {
            setView('vendedor');
          } else {
            setView('empresa');
          }
        } else {
          setUserData({ role: 'empresa', uid: user.uid, email: user.email });
          setView('empresa'); 
        }
      }
    } catch (err) {
      console.error(err);
      setError('Credenciais inválidas. Verifique o seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030811] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.08),transparent_70%)] pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-md bg-[#0B192C]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-2xl mb-4 shadow-lg shadow-orange-500/20"><Sun className="w-8 h-8 text-[#0B192C]" /></div>
          <h2 className="text-2xl font-extrabold text-white">LD <span className="text-amber-500">SIMULADOR SOLAR</span></h2>
          <p className="text-slate-400 text-sm mt-1">Acesso Restrito ao Sistema</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">E-mail de Acesso</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com" 
              className="w-full bg-[#030811] border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Senha Segura</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-[#030811] border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3.5 rounded-xl mt-4 transition cursor-pointer flex justify-center items-center gap-2 ${loading ? 'opacity-70' : 'hover:scale-[1.02]'}`}>
            {loading ? 'A autenticar...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
           <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Ambiente Protegido por Firebase Auth</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. VISÃO MASTER 
// ==========================================
const MasterView = ({ setView }) => {
  const [currentTab, setCurrentTab] = useState('empresas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEmpresaModal, setEditEmpresaModal] = useState(null);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);
  
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [estatisticas, setEstatisticas] = useState({ empresas: 0, vendedores: 0 });
  const [totalSimulacoes, setTotalSimulacoes] = useState(0);

  const [novaEmpresa, setNovaEmpresa] = useState({ nomeFantasia: '', socio: '', whatsapp: '', email: '', plano: 'Free [Teste Ilimitado 14 dias]', senha: '' });
  const [empresaLoading, setEmpresaLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const q = query(collection(db, "usuarios"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allDocs = [];
      querySnapshot.forEach((docSnap) => {
        allDocs.push({ id: docSnap.id, ...docSnap.data() });
      });

      const empresasArray = allDocs.filter(u => u.role === 'empresa');
      const vendedoresArray = allDocs.filter(u => u.role === 'vendedor');

      let countEmpresas = 0;
      
      const empresasComEquipa = empresasArray.map(emp => {
         if (emp.status === 'Ativa') countEmpresas++;
         const qtdVendedores = vendedoresArray.filter(v => v.empresaId === emp.id).length;
         return { ...emp, equipa: qtdVendedores };
      });

      empresasComEquipa.sort((a, b) => {
        const timeA = a.dataCriacao?.toMillis() || 0;
        const timeB = b.dataCriacao?.toMillis() || 0;
        return timeB - timeA;
      });

      setEmpresas(empresasComEquipa);
      setEstatisticas({ empresas: countEmpresas, vendedores: vendedoresArray.length });
      setLoadingEmpresas(false);
    }, (error) => {
      console.error("Erro ao carregar usuários:", error);
      setLoadingEmpresas(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "orcamentos"));
    const unsubscribe = onSnapshot(q, (snap) => {
       setTotalSimulacoes(snap.size);
    });
    return () => unsubscribe();
  }, []);

  const empresasFiltradas = empresas.filter(emp => {
      const matchesSearch = emp.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || emp.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
  });

  const handleCreateEmpresa = async () => {
    if(!novaEmpresa.nomeFantasia || !novaEmpresa.email || novaEmpresa.senha.length < 6) {
      return showToast('Preencha os campos obrigatórios e use uma senha com pelo menos 6 caracteres.', 'error');
    }
    
    setEmpresaLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, novaEmpresa.email, novaEmpresa.senha);
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nome: novaEmpresa.nomeFantasia,
        socio: novaEmpresa.socio,
        whatsapp: novaEmpresa.whatsapp,
        email: novaEmpresa.email,
        plano: novaEmpresa.plano,
        role: 'empresa',
        status: 'Ativa',
        dataCriacao: serverTimestamp()
      });
      
      await signOut(secondaryAuth); 
      showToast(`Empresa "${novaEmpresa.nomeFantasia}" cadastrada com sucesso!`, 'success');
      
      setNovaEmpresa({ nomeFantasia: '', socio: '', whatsapp: '', email: '', plano: 'Free [Teste Ilimitado 14 dias]', senha: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Erro ao criar a empresa: ' + err.message, 'error');
    } finally {
      setEmpresaLoading(false);
    }
  };

  const toggleEmpresaStatus = async (empresa) => {
    const novoStatus = empresa.status === 'Bloqueada' ? 'Ativa' : 'Bloqueada';
    try {
        await updateDoc(doc(db, 'usuarios', empresa.id), { status: novoStatus });
        showToast(`Acesso de ${empresa.nome} foi ${novoStatus === 'Bloqueada' ? 'bloqueado' : 'desbloqueado'}.`, 'success');
    } catch (err) {
        console.error("Erro ao alterar status:", err);
        showToast("Erro ao alterar o status da empresa.", "error");
    }
  };

  const confirmDeleteEmpresa = async () => {
    if (!empresaToDelete) return;
    try {
        const batch = writeBatch(db);

        // 1. Apaga todos os Orcamentos desta empresa
        const snapOrc = await getDocs(query(collection(db, "orcamentos")));
        snapOrc.forEach(d => { if (d.data().empresaId === empresaToDelete.id) batch.delete(doc(db, "orcamentos", d.id)); });

        // 2. Apaga todos os Kits desta empresa
        const snapKits = await getDocs(query(collection(db, "kits")));
        snapKits.forEach(d => { if (d.data().empresaId === empresaToDelete.id) batch.delete(doc(db, "kits", d.id)); });

        // 3. Apaga todos os Vendedores vinculados a esta empresa
        const snapUsers = await getDocs(query(collection(db, "usuarios")));
        snapUsers.forEach(d => { if (d.data().empresaId === empresaToDelete.id && d.data().role === 'vendedor') batch.delete(doc(db, "usuarios", d.id)); });

        // 4. Apaga a conta da Empresa
        batch.delete(doc(db, "usuarios", empresaToDelete.id));

        await batch.commit();
        showToast(`Empresa e todos os seus dados excluídos com sucesso!`, 'success');
        setEmpresaToDelete(null);
    } catch (error) {
        console.error("Erro ao excluir", error);
        showToast("Erro ao excluir a empresa e seus dados.", "error");
    }
  };

  return (
    <DashboardLayout title="Visão Master (LD Negócios)" setView={setView} role="master" currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {toast && (
        <div className={`fixed top-24 right-5 z-[100] flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white border border-white/10`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      )}

      {currentTab === 'dashboard' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Empresas Ativas</p>
                  <h3 className="text-3xl font-extrabold text-white">{estatisticas.empresas}</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"><Building className="w-6 h-6 text-emerald-400"/></div>
              </div>
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Total de Vendedores</p>
                  <h3 className="text-3xl font-extrabold text-white">{estatisticas.vendedores}</h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20"><Users className="w-6 h-6 text-blue-400"/></div>
              </div>
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Simulações Geradas</p>
                  <h3 className="text-3xl font-extrabold text-white">{totalSimulacoes}</h3>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20"><Zap className="w-6 h-6 text-amber-500"/></div>
              </div>
           </div>
           <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-12 text-center shadow-sm">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <h3 className="text-xl font-bold text-white mb-2">Resumo de Crescimento</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">Vá para a aba "Gestão de Empresas" no menu lateral para visualizar, filtrar, adicionar ou bloquear clientes do sistema SaaS.</p>
              <button onClick={() => setCurrentTab('empresas')} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Ir para Gestão de Empresas</button>
           </div>
        </div>
      )}

      {currentTab === 'empresas' && (
        <div className="bg-[#0B192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative w-full">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0B192C]/50 w-full">
            <div className="w-full flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 group w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 group-focus-within:text-amber-500" />
                <input type="text" placeholder="Buscar empresa por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#030811] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-amber-500 outline-none shadow-inner transition" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-48 bg-[#030811] border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-amber-500 outline-none shadow-inner transition cursor-pointer appearance-none">
                  <option value="all" className="bg-[#0B192C] text-white">Todos os Status</option>
                  <option value="Ativa" className="bg-[#0B192C] text-white">Ativas</option>
                  <option value="Bloqueada" className="bg-[#0B192C] text-white">Bloqueadas</option>
              </select>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg w-full lg:w-auto shrink-0"><Plus className="w-4 h-4" /> <span>Nova Empresa</span></button>
          </div>
          
          <div className="overflow-x-auto w-full block">
            {loadingEmpresas ? (
               <div className="flex justify-center items-center h-32">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
               </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300 min-w-max">
                <thead className="text-[10px] uppercase tracking-widest bg-[#030811] text-slate-500 font-bold border-b border-slate-800 sticky top-0">
                  <tr><th className="px-6 py-4">Empresa / Contato</th><th className="px-6 py-4 text-center">Plano</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-right">Ações</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {empresasFiltradas.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-8 text-slate-500 font-bold">Nenhuma empresa encontrada com estes filtros.</td></tr>
                  ) : (
                    empresasFiltradas.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4"><div className="font-extrabold text-white text-base">{item.nome}</div><div className="text-xs text-slate-500 mt-0.5">{item.email}</div></td>
                        <td className="px-6 py-4 text-center"><span className="bg-slate-800 px-3 py-1 rounded-md text-xs font-medium border border-slate-700">{item.plano}</span><div className="text-xs text-slate-500 mt-1">{item.equipa} vendedores ativos</div></td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mx-auto ${item.status === 'Ativa' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
                            {item.status === 'Ativa' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                            <span>{item.status || 'Ativa'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="text-slate-400 hover:text-white transition p-1" title="Editar Empresa" onClick={() => setEditEmpresaModal(item)}><Settings className="w-4 h-4" /></button>
                          <button className="text-slate-400 hover:text-amber-500 transition p-1" title={item.status === 'Bloqueada' ? 'Desbloquear Acesso' : 'Suspender Acesso'} onClick={() => toggleEmpresaStatus(item)}>
                              {item.status === 'Bloqueada' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                          </button>
                          <button className="text-slate-400 hover:text-red-500 transition p-1" title="Excluir Empresa" onClick={() => setEmpresaToDelete(item)}>
                              <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Cadastrar Nova Empresa</h3>
                 <p className="text-xs text-slate-400 mb-6">Esta ação criará um ambiente seguro na nuvem para o seu cliente.</p>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Fantasia / Razão Social *</label>
                     <input type="text" value={novaEmpresa.nomeFantasia} onChange={(e) => setNovaEmpresa({...novaEmpresa, nomeFantasia: e.target.value})} placeholder="Ex: SolarTech Brasil" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Nome do Sócio</label>
                        <input type="text" value={novaEmpresa.socio} onChange={(e) => setNovaEmpresa({...novaEmpresa, socio: e.target.value})} placeholder="João Silva" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">WhatsApp</label>
                        <input type="text" value={novaEmpresa.whatsapp} onChange={(e) => setNovaEmpresa({...novaEmpresa, whatsapp: e.target.value})} placeholder="(00) 00000-0000" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                      </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login Principal) *</label>
                     <input type="email" value={novaEmpresa.email} onChange={(e) => setNovaEmpresa({...novaEmpresa, email: e.target.value})} placeholder="contato@empresa.com" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Senha Segura Inicial *</label>
                     <input type="text" value={novaEmpresa.senha} onChange={(e) => setNovaEmpresa({...novaEmpresa, senha: e.target.value})} placeholder="Mínimo 6 caracteres" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-amber-500 font-mono text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div className="relative group">
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Plano Contratado *</label>
                     <select value={novaEmpresa.plano} onChange={(e) => setNovaEmpresa({...novaEmpresa, plano: e.target.value})} className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 appearance-none cursor-pointer">
                        <option value="Free [Teste Ilimitado 14 dias]" className="bg-[#0B192C] text-white">Free [Teste Ilimitado 14 dias]</option>
                        <option value="Básico até 5 vendedores [R$ 100,00]" className="bg-[#0B192C] text-white">Básico até 5 vendedores [R$ 100,00]</option>
                        <option value="Pró até 10 vendedores [R$ 125,00]" className="bg-[#0B192C] text-white">Pró até 10 vendedores [R$ 125,00]</option>
                        <option value="Master Ilimitado [R$ 150,00]" className="bg-[#0B192C] text-white">Master Ilimitado [R$ 150,00]</option>
                     </select>
                     <span className="absolute inset-y-0 right-0 flex items-center pr-4 pt-5 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                   </div>
                   <button 
                      onClick={handleCreateEmpresa} 
                      disabled={empresaLoading}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3 rounded-xl mt-2 transition disabled:opacity-50">
                      {empresaLoading ? 'A Registar Nuvem...' : 'Criar Conta e Enviar Senha'}
                   </button>
                 </div>
               </div>
            </div>
          )}

          {editEmpresaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <button onClick={() => setEditEmpresaModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Editar Empresa</h3>
                 <p className="text-xs text-slate-400 mb-6">Altere os dados de perfil da empresa cliente.</p>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Fantasia / Razão Social</label>
                     <input type="text" value={editEmpresaModal.nome} onChange={(e) => setEditEmpresaModal({...editEmpresaModal, nome: e.target.value})} className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div className="relative group">
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Plano Contratado</label>
                     <select value={editEmpresaModal.plano || 'Free [Teste Ilimitado 14 dias]'} onChange={(e) => setEditEmpresaModal({...editEmpresaModal, plano: e.target.value})} className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 appearance-none cursor-pointer">
                        <option value="Free [Teste Ilimitado 14 dias]" className="bg-[#0B192C] text-white">Free [Teste Ilimitado 14 dias]</option>
                        <option value="Básico até 5 vendedores [R$ 100,00]" className="bg-[#0B192C] text-white">Básico até 5 vendedores [R$ 100,00]</option>
                        <option value="Pró até 10 vendedores [R$ 125,00]" className="bg-[#0B192C] text-white">Pró até 10 vendedores [R$ 125,00]</option>
                        <option value="Master Ilimitado [R$ 150,00]" className="bg-[#0B192C] text-white">Master Ilimitado [R$ 150,00]</option>
                     </select>
                     <span className="absolute inset-y-0 right-0 flex items-center pr-4 pt-5 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login de Acesso)</label>
                     <input type="email" value={editEmpresaModal.email} disabled className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-500 text-sm outline-none cursor-not-allowed"/>
                     <p className="text-[10px] text-slate-500 mt-1">O e-mail de acesso não pode ser alterado por motivos de segurança.</p>
                   </div>
                   <button 
                     onClick={async () => {
                        if(!editEmpresaModal.nome) return showToast('O nome é obrigatório.', 'error');
                        try {
                            await updateDoc(doc(db, 'usuarios', editEmpresaModal.id), { nome: editEmpresaModal.nome, plano: editEmpresaModal.plano });
                            setEditEmpresaModal(null);
                            showToast('Empresa atualizada com sucesso!', 'success');
                        } catch (err) {
                            console.error(err);
                            showToast('Erro ao atualizar empresa.', 'error');
                        }
                     }} 
                     className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3 rounded-xl mt-2 transition hover:scale-[1.02]">
                     Salvar Alterações
                   </button>
                 </div>
               </div>
            </div>
          )}

          {empresaToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-red-900/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <h3 className="text-xl font-extrabold text-white mb-2 text-center text-red-400">Excluir Empresa?</h3>
                 <p className="text-sm text-slate-300 mb-4 text-center">Tem a certeza que deseja excluir permanentemente <strong>{empresaToDelete.nome}</strong>?</p>
                 <p className="text-[11px] leading-relaxed text-slate-400 mb-6 text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20"><strong>Atenção Absoluta:</strong> Esta ação apagará TODOS os vendedores, TODOS os orçamentos e TODOS os kits desta empresa para sempre. Não é possível desfazer.</p>
                 <div className="flex gap-3">
                     <button onClick={() => setEmpresaToDelete(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition">Cancelar</button>
                     <button onClick={confirmDeleteEmpresa} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">Sim, Excluir Tudo</button>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 6. VISÃO EMPRESA (O CRM Vivo com Upload e Exportação)
// ==========================================
const EmpresaView = ({ setView, userData }) => {
  const [currentTab, setCurrentTab] = useState('resultados');
  const [dateFilter, setDateFilter] = useState('semana');
  const [customStartDash, setCustomStartDash] = useState('');
  const [customEndDash, setCustomEndDash] = useState('');

  const [resultadosFilter, setResultadosFilter] = useState('7dias');
  const [customStartCRM, setCustomStartCRM] = useState('');
  const [customEndCRM, setCustomEndCRM] = useState('');
  const [vendedorFilter, setVendedorFilter] = useState('todos');
  const [crmStatusFilter, setCrmStatusFilter] = useState('todos');
  
  // Modais e Estados de Gestão de Equipa
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  
  const [vendedoresLista, setVendedoresLista] = useState([]);
  const [loadingVendedores, setLoadingVendedores] = useState(true);
  const [isVendedorModalOpen, setIsVendedorModalOpen] = useState(false);
  const [editVendedorModal, setEditVendedorModal] = useState(null);
  const [vendedorToDelete, setVendedorToDelete] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [novoVendedor, setNovoVendedor] = useState({ nome: '', email: '', whatsapp: '', senha: '' });
  const [vendedorLoading, setVendedorLoading] = useState(false);

  const [orcamentos, setOrcamentos] = useState([]);
  const [loadingCRM, setLoadingCRM] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Carregar Orçamentos da Nuvem
  useEffect(() => {
    const q = query(collection(db, "orcamentos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let dataFormatada = 'Sem Data';
        let msTimestamp = 0;
        if (data.timestamp) {
           const date = data.timestamp.toDate();
           msTimestamp = date.getTime();
           dataFormatada = date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } else if (data.data) {
           dataFormatada = data.data;
           const [dataPart, timePart] = data.data.split(' ');
           if(dataPart && timePart) {
               const [day, month, year] = dataPart.split('/');
               const [hour, min] = timePart.split(':');
               msTimestamp = new Date(year, month - 1, day, hour, min).getTime();
           }
        }
        docs.push({ id: doc.id, ...data, dataVisual: dataFormatada, msTimestamp });
      });
      setOrcamentos(docs);
      setLoadingCRM(false);
    }, (error) => {
      setLoadingCRM(false);
    });
    return () => unsubscribe();
  }, []);

  // Carregar Vendedores da Empresa
  useEffect(() => {
    if (!userData || !userData.uid) return;
    const q = query(collection(db, "usuarios"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vends = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.role === 'vendedor' && data.empresaId === userData.uid) {
          vends.push({ id: docSnap.id, ...data });
        }
      });
      setVendedoresLista(vends);
      setLoadingVendedores(false);
    }, (error) => {
      console.error(error);
      setLoadingVendedores(false);
    });
    return () => unsubscribe();
  }, [userData]);

  const orcamentosFiltrados = orcamentos.filter(orc => {
      if (userData && userData.uid && orc.empresaId && orc.empresaId !== userData.uid) return false;
      if (vendedorFilter !== 'todos' && orc.vendedor !== vendedorFilter) return false;

      const currentStatus = orc.status || 'Negociando';
      if (crmStatusFilter !== 'todos' && currentStatus !== crmStatusFilter) return false;

      const hojeMs = new Date().getTime();
      const umDiaMs = 24 * 60 * 60 * 1000;
      let limiteMs = 0;

      if (resultadosFilter === 'hoje') {
          const inicioHoje = new Date();
          inicioHoje.setHours(0,0,0,0);
          limiteMs = inicioHoje.getTime();
      } else if (resultadosFilter === '7dias') limiteMs = hojeMs - (7 * umDiaMs);
      else if (resultadosFilter === '15dias') limiteMs = hojeMs - (15 * umDiaMs);
      else if (resultadosFilter === '30dias') limiteMs = hojeMs - (30 * umDiaMs);
      else if (resultadosFilter === 'personalizado' && customStartCRM && customEndCRM) {
          const startMs = new Date(customStartCRM + 'T00:00:00').getTime();
          const endMs = new Date(customEndCRM + 'T23:59:59').getTime();
          if (orc.msTimestamp < startMs || orc.msTimestamp > endMs) return false;
      }

      if (limiteMs > 0 && orc.msTimestamp && orc.msTimestamp < limiteMs) return false;
      return true;
  });

  const vendedoresUnicos = [...new Set(orcamentos.map(orc => orc.vendedor))].filter(Boolean);

  const hojeIncioDash = new Date();
  hojeIncioDash.setHours(0, 0, 0, 0);
  const hojeMsDash = hojeIncioDash.getTime();
  const umDiaMsDash = 24 * 60 * 60 * 1000;

  const simulacoesHoje = orcamentos.filter(orc => {
      if (userData && userData.uid && orc.empresaId && orc.empresaId !== userData.uid) return false;
      return orc.msTimestamp && orc.msTimestamp >= hojeMsDash;
  }).length;

  const simulacoesSemana = orcamentos.filter(orc => {
      if (userData && userData.uid && orc.empresaId && orc.empresaId !== userData.uid) return false;
      return orc.msTimestamp && orc.msTimestamp >= (hojeMsDash - 7 * umDiaMsDash);
  }).length;

  const diasSemanaMap = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const dynamicChartData = [];
  let maxVendas = 0;
  for (let i = 6; i >= 0; i--) {
      const dataAlvo = new Date(hojeIncioDash);
      dataAlvo.setDate(hojeIncioDash.getDate() - i);
      const startMs = dataAlvo.getTime();
      const endMs = startMs + 24 * 60 * 60 * 1000;
      
      const qtd = orcamentos.filter(orc => {
          if (userData && userData.uid && orc.empresaId && orc.empresaId !== userData.uid) return false;
          return orc.msTimestamp >= startMs && orc.msTimestamp < endMs;
      }).length;

      if (qtd > maxVendas) maxVendas = qtd;
      dynamicChartData.push({ name: diasSemanaMap[dataAlvo.getDay()], propostas: qtd, height: '0%' });
  }
  dynamicChartData.forEach(d => {
      d.height = maxVendas === 0 ? '5%' : `${Math.max((d.propostas / maxVendas) * 100, 5)}%`;
  });

  const handleExportExcel = async () => {
    if (orcamentosFiltrados.length === 0) {
      showToast("Não há dados para exportar com os filtros atuais.", "error");
      return;
    }

    try {
      if (typeof window.XLSX === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const XLSX = window.XLSX;

      const dadosExcel = orcamentosFiltrados.map(orc => ({
        'Data da Simulação': orc.dataVisual,
        'Consultor Comercial': orc.vendedor,
        'Nome do Cliente': orc.cliente,
        'WhatsApp Contato': orc.whatsapp,
        'Cidade / UF': orc.cidade,
        'Estrutura do Telhado': orc.estrutura,
        'Categoria': orc.tipoKit,
        'Kit Escolhido': orc.kit,
        'Valor do Orçamento': formatarMoeda(orc.valor)
      }));

      const folha = XLSX.utils.json_to_sheet(dadosExcel);
      const livro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(livro, folha, "Relatório de Vendas");

      const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      XLSX.writeFile(livro, `Relatorio_SaaS_${dataAtual}.xlsx`);
    } catch (err) {
      console.error("Erro ao exportar Excel", err);
      showToast("Erro ao gerar o ficheiro Excel.", "error");
    }
  };

  const handleRealUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    setUploadStatus('deleting');

    try {
      if (typeof window.XLSX === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const XLSX = window.XLSX;
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonKits = XLSX.utils.sheet_to_json(worksheet);

          if(jsonKits.length === 0) {
             alert("A planilha parece estar vazia ou não tem o formato correto.");
             setUploadStatus('idle');
             return;
          }

          const q = query(collection(db, "kits"));
          const snapshot = await getDocs(q);
          const batch = writeBatch(db);
          
          snapshot.docs.forEach((docSnap) => {
              batch.delete(doc(db, "kits", docSnap.id));
          });
          
          setUploadStatus('saving');
          
          jsonKits.forEach((kit) => {
             const nomeKit = String(kit.Kit || kit.kit || kit.KIT || '');
             const tipoInferido = nomeKit.toUpperCase().includes('MICRO') ? 'Micro' : 'String';

             const newKitRef = doc(collection(db, "kits"));
             batch.set(newKitRef, {
               Kit: nomeKit,
               Placas: String(kit.Placas || kit.placas || kit.PLACAS || ''),
               Modulo: String(kit.Modulo || kit.modulo || kit.MODULO || ''),
               Inversor: String(kit.Inversor || kit.inversor || kit.INVERSOR || ''),
               Valor: String(kit.Valor || kit.valor || kit.VALOR || '').replace('R$', '').trim(),
               Tipo: String(kit.Tipo || kit.tipo || kit.TIPO || tipoInferido),
               empresaId: userData?.uid || 'padrao' 
             });
          });

          await batch.commit();
          
          setUploadStatus('success');
          setTimeout(() => { setUploadStatus('idle'); setIsUploadModalOpen(false); }, 3000);

        } catch (error) {
           console.error("Erro interno na leitura do Excel", error);
           alert("Ocorreu um erro ao processar a planilha. Verifique as colunas.");
           setUploadStatus('idle');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch(err) {
      console.error("Erro ao carregar motor Excel", err);
      alert("Erro ao conectar à biblioteca de Excel.");
      setUploadStatus('idle');
    }
  };

  const downloadTemplate = (e) => {
    e.preventDefault();
    const csvContent = "data:text/csv;charset=utf-8,Kit,Placas,Modulo,Inversor,Valor,Tipo\nKIT 500kWh,6,590W,AUXSOL 3K,10000.00,String\nKIT MICRO 300kWh,4,620W,TSUNESS,8500.00,Micro";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Modelo_Kits_Solar.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        await updateDoc(doc(db, "orcamentos", id), { status: newStatus });
        showToast('Status atualizado com sucesso!', 'success');
    } catch (error) {
        console.error("Erro ao atualizar status", error);
        showToast('Erro ao atualizar status do lead.', 'error');
    }
  };

  const toggleVendedorStatus = async (vendedor) => {
    const novoStatus = vendedor.status === 'Bloqueado' ? 'Ativo' : 'Bloqueado';
    try {
        await updateDoc(doc(db, 'usuarios', vendedor.id), { status: novoStatus });
        showToast(`Acesso de ${vendedor.nome} foi ${novoStatus === 'Bloqueado' ? 'bloqueado' : 'desbloqueado'}.`, 'success');
    } catch (err) {
        console.error("Erro ao alterar status:", err);
        showToast("Erro ao alterar o status do vendedor.", "error");
    }
  };

  const confirmDeleteVendedor = async () => {
    if (!vendedorToDelete) return;
    try {
        const qOrc = query(collection(db, "orcamentos"));
        const snap = await getDocs(qOrc);
        const batch = writeBatch(db);
        snap.forEach(d => {
            const data = d.data();
            if (data.vendedorUid === vendedorToDelete.id || data.vendedor === vendedorToDelete.nome) {
                batch.update(doc(db, "orcamentos", d.id), { 
                    vendedor: userData?.nome || 'Empresa',
                    vendedorUid: userData?.uid || 'padrao'
                });
            }
        });
        await batch.commit();

        await deleteDoc(doc(db, 'usuarios', vendedorToDelete.id));
        showToast(`Vendedor excluído com sucesso e orçamentos migrados!`, 'success');
        setVendedorToDelete(null);
    } catch (error) {
        console.error("Erro ao excluir", error);
        showToast("Erro ao excluir vendedor.", "error");
    }
  };

  const handleOpenNovoVendedor = () => {
      const plano = userData?.plano || '';
      let limite = Infinity;
      if (plano.includes('Básico')) limite = 5;
      else if (plano.includes('Pró')) limite = 10;
      
      if (vendedoresLista.length >= limite) {
          setShowLimitModal(true);
      } else {
          setIsVendedorModalOpen(true);
      }
  };
  
  return (
    <DashboardLayout title={`Painel da Empresa (${userData?.nome || 'SolarTech'})`} setView={setView} role="empresa" currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {toast && (
        <div className={`fixed top-24 right-5 z-[100] flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white border border-white/10`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      )}

      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Simulações (Hoje)</p>
              <h3 className="text-4xl font-extrabold text-white mb-1">{simulacoesHoje}</h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Orçamentos gerados hoje</p>
            </div>
            <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Simulações (Semana)</p>
              <h3 className="text-4xl font-extrabold text-white mb-1">{simulacoesSemana}</h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Nos últimos 7 dias</p>
            </div>
            <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Análise de Equipa</p>
                    <h3 className="text-lg font-bold text-white">Desempenho por Vendedor</h3>
                 </div>
                 <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50"><Users className="w-5 h-5 text-blue-400" /></div>
              </div>
              <p className="text-sm text-slate-400">Vá para a aba <strong>Resultados (CRM)</strong> para filtrar orçamentos por vendedor específico e baixar relatórios completos em Excel.</p>
            </div>
          </div>
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">Desempenho Geral</h3>
                <div className="bg-[#030811] border border-slate-700 rounded-xl p-1 inline-flex shadow-inner">
                  <button onClick={() => setDateFilter('semana')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'semana' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Últimos 7 dias</button>
                  <button onClick={() => setDateFilter('mes')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'mes' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Este Mês</button>
                  {dateFilter === 'personalizado' ? (
                      <div className="flex items-center gap-2 ml-1 bg-slate-800 px-2 py-1 rounded-lg border border-amber-500/30">
                          <input type="date" value={customStartDash} onChange={(e) => setCustomStartDash(e.target.value)} className="bg-transparent text-xs text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                          <span className="text-slate-500 text-xs">até</span>
                          <input type="date" value={customEndDash} onChange={(e) => setCustomEndDash(e.target.value)} className="bg-transparent text-xs text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                          <button onClick={() => setDateFilter('semana')} className="text-slate-500 hover:text-red-400 ml-1"><X className="w-3 h-3"/></button>
                      </div>
                  ) : (
                      <button onClick={() => setDateFilter('personalizado')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white whitespace-nowrap`}><Calendar className="w-3 h-3"/> Personalizado</button>
                  )}
                </div>
             </div>
             <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6">
               {dynamicChartData.map((data, index) => (
                 <div key={index} className="flex flex-col items-center w-full group">
                   <div className="w-full relative flex items-end justify-center h-48 bg-[#030811] rounded-t-md border border-slate-800 border-b-0">
                     <div className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-sm transition-all duration-500 group-hover:opacity-80 relative cursor-pointer" style={{ height: data.height }}>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-bold shadow-xl transition-all pointer-events-none whitespace-nowrap z-10 border border-slate-700">{data.propostas} Vendas</div>
                     </div>
                   </div>
                   <span className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-wider">{data.name}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {currentTab === 'resultados' && (
         <div className="bg-[#0B192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full w-full">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0B192C]/80 w-full">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-amber-500"/> Histórico de Orçamentos</h3>
                <p className="text-sm text-slate-400 mt-1">Acompanhe e gira todas as propostas enviadas pela sua equipa.</p>
              </div>
              <div className="flex flex-col w-full lg:w-auto gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative w-full sm:w-48 group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><User className="w-4 h-4" /></span>
                    <select value={vendedorFilter} onChange={(e) => setVendedorFilter(e.target.value)} className="w-full bg-[#030811] border border-slate-700 rounded-xl py-2 pl-9 pr-8 text-sm text-white focus:border-amber-500 outline-none shadow-inner appearance-none cursor-pointer transition">
                        <option value="todos" className="bg-[#0B192C] text-white">Todos Vendedores</option>
                        {vendedoresUnicos.map((vend, idx) => (
                            <option key={idx} value={vend} className="bg-[#0B192C] text-white">{vend}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                    <div className="relative w-full sm:w-48 group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Activity className="w-4 h-4" /></span>
                    <select value={crmStatusFilter} onChange={(e) => setCrmStatusFilter(e.target.value)} className="w-full bg-[#030811] border border-slate-700 rounded-xl py-2 pl-9 pr-8 text-sm text-white focus:border-amber-500 outline-none shadow-inner appearance-none cursor-pointer transition">
                        <option value="todos" className="bg-[#0B192C] text-white">Todos Status</option>
                        <option value="Negociando" className="bg-[#0B192C] text-white">Negociando</option>
                        <option value="Fin Aprovado" className="bg-[#0B192C] text-white">Fin Aprovado</option>
                        <option value="Fin Reprovado" className="bg-[#0B192C] text-white">Fin Reprovado</option>
                        <option value="Não Interessou" className="bg-[#0B192C] text-white">Não Interessou</option>
                        <option value="Fechou" className="bg-[#0B192C] text-white">Fechou</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                </div>
                <div className="w-full overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  <div className="flex items-center gap-2 w-max">
                    <div className="flex items-center bg-[#030811] border border-slate-700 rounded-xl p-1 shadow-inner shrink-0">
                      <button onClick={() => {setResultadosFilter('hoje'); setCustomStartCRM(''); setCustomEndCRM('');}} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === 'hoje' ? 'bg-amber-500 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>Hoje</button>
                      <button onClick={() => {setResultadosFilter('7dias'); setCustomStartCRM(''); setCustomEndCRM('');}} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '7dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>7 Dias</button>
                      <button onClick={() => {setResultadosFilter('15dias'); setCustomStartCRM(''); setCustomEndCRM('');}} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '15dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>15 Dias</button>
                      <button onClick={() => {setResultadosFilter('30dias'); setCustomStartCRM(''); setCustomEndCRM('');}} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '30dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>30 Dias</button>
                      {resultadosFilter === 'personalizado' ? (
                          <div className="flex items-center gap-2 ml-1 bg-slate-800 px-2 py-1 rounded-lg border border-amber-500/30">
                              <input type="date" value={customStartCRM} onChange={(e) => setCustomStartCRM(e.target.value)} className="bg-transparent text-xs text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                              <span className="text-slate-500 text-xs">até</span>
                              <input type="date" value={customEndCRM} onChange={(e) => setCustomEndCRM(e.target.value)} className="bg-transparent text-xs text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                              <button onClick={() => setResultadosFilter('7dias')} className="text-slate-500 hover:text-red-400 ml-1"><X className="w-3 h-3"/></button>
                          </div>
                      ) : (
                          <button onClick={() => setResultadosFilter('personalizado')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white whitespace-nowrap`}><Calendar className="w-3 h-3"/> Personalizado</button>
                      )}
                    </div>
                    <button onClick={handleExportExcel} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 whitespace-nowrap"><FileSpreadsheet className="w-3.5 h-3.5"/> Exportar Excel</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto p-4 max-h-[60vh]">
              {loadingCRM ? (
                 <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                 </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-300 min-w-max">
                  <thead className="text-[10px] uppercase tracking-widest bg-[#030811] text-slate-500 font-bold border-b border-slate-800 sticky top-0 z-10">
                    <tr><th className="px-4 py-3 rounded-tl-lg">Data / Hora</th><th className="px-4 py-3">Vendedor</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">Cidade</th><th className="px-4 py-3">Estrutura</th><th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Kit Solar</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 rounded-tr-lg text-right">Valor (R$)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {orcamentosFiltrados.length === 0 ? (
                      <tr><td colSpan="10" className="text-center py-8 text-slate-500 font-bold">Nenhum orçamento encontrado com estes filtros.</td></tr>
                    ) : (
                      orcamentosFiltrados.map((sim) => (
                        <tr key={sim.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sim.dataVisual}</td>
                          <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{sim.vendedor}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{sim.cliente}</td>
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{sim.whatsapp}</td>
                          <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.cidade}</td>
                          <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.estrutura}</td>
                          <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sim.tipoKit === 'String' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{sim.tipoKit}</span></td>
                          <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{sim.kit}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                              <select 
                                 value={sim.status || 'Negociando'} 
                                 onChange={(e) => handleStatusChange(sim.id, e.target.value)}
                                 className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded outline-none cursor-pointer transition-colors
                                    ${sim.status === 'Fechou' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                      sim.status === 'Não Interessou' || sim.status === 'Fin Reprovado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                      sim.status === 'Fin Aprovado' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                              >
                                 <option value="Negociando" className="bg-[#0B192C] text-white">Negociando</option>
                                 <option value="Fin Aprovado" className="bg-[#0B192C] text-white">Fin Aprovado</option>
                                 <option value="Fin Reprovado" className="bg-[#0B192C] text-white">Fin Reprovado</option>
                                 <option value="Não Interessou" className="bg-[#0B192C] text-white">Não Interessou</option>
                                 <option value="Fechou" className="bg-[#0B192C] text-white">Fechou</option>
                              </select>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-amber-500 whitespace-nowrap">{formatarMoeda(sim.valor)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
         </div>
      )}

      {currentTab === 'vendedores' && (
        <div className="bg-[#0B192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative w-full">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0B192C]/50 w-full">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-6 h-6 text-amber-500"/> Gestão de Equipa</h3>
              <p className="text-sm text-slate-400 mt-1">Controle os acessos e informações dos seus consultores comerciais.</p>
            </div>
            <button onClick={handleOpenNovoVendedor} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg w-full sm:w-auto shrink-0"><Plus className="w-4 h-4" /> <span>Novo Vendedor</span></button>
          </div>
          
          <div className="overflow-x-auto w-full block min-h-[300px]">
            {loadingVendedores ? (
               <div className="flex justify-center items-center h-full pt-20">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
               </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300 min-w-max">
                <thead className="text-[10px] uppercase tracking-widest bg-[#030811] text-slate-500 font-bold border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Consultor / E-mail</th>
                    <th className="px-6 py-4">WhatsApp</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {vendedoresLista.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-16">
                        <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold">Nenhum vendedor cadastrado na sua equipa.</p>
                        <p className="text-xs text-slate-600 mt-1">Clique em "Novo Vendedor" para adicionar o seu primeiro consultor.</p>
                      </td>
                    </tr>
                  ) : (
                    vendedoresLista.map((vend) => (
                      <tr key={vend.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4"><div className="font-extrabold text-white text-base">{vend.nome}</div><div className="text-xs text-slate-500 mt-0.5">{vend.email}</div></td>
                        <td className="px-6 py-4">
                          {vend.whatsapp ? (
                            <button 
                              onClick={() => window.open(`https://wa.me/${String(vend.whatsapp).replace(/\D/g, '').length >= 10 && !String(vend.whatsapp).replace(/\D/g, '').startsWith('55') ? '55' + String(vend.whatsapp).replace(/\D/g, '') : String(vend.whatsapp).replace(/\D/g, '')}`, '_blank')}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-lg border border-emerald-400/20 cursor-pointer"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {vend.whatsapp}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-600 italic">Sem número</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mx-auto ${vend.status === 'Bloqueado' ? 'text-red-400 bg-red-400/10 border border-red-400/20' : 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'}`}>
                            {vend.status !== 'Bloqueado' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                            <span>{vend.status === 'Bloqueado' ? 'Bloqueado' : 'Ativo'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="text-slate-400 hover:text-white transition p-1" title="Editar Vendedor" onClick={() => setEditVendedorModal(vend)}><Settings className="w-4 h-4" /></button>
                          <button className="text-slate-400 hover:text-amber-500 transition p-1" title={vend.status === 'Bloqueado' ? 'Desbloquear Acesso' : 'Suspender Acesso'} onClick={() => toggleVendedorStatus(vend)}>
                              {vend.status === 'Bloqueado' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                          </button>
                          <button className="text-slate-400 hover:text-red-500 transition p-1" title="Excluir Vendedor" onClick={() => setVendedorToDelete(vend)}>
                              <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {editVendedorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <button onClick={() => setEditVendedorModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Editar Consultor</h3>
                 <p className="text-xs text-slate-400 mb-6">Altere os dados de perfil do seu vendedor.</p>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Completo</label>
                     <input type="text" value={editVendedorModal.nome} onChange={(e) => setEditVendedorModal({...editVendedorModal, nome: e.target.value})} className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login de Acesso)</label>
                     <input type="email" value={editVendedorModal.email} disabled className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-500 text-sm outline-none cursor-not-allowed"/>
                     <p className="text-[10px] text-slate-500 mt-1">O e-mail de acesso não pode ser alterado por motivos de segurança.</p>
                   </div>
                   <button 
                     onClick={async () => {
                        if(!editVendedorModal.nome) return showToast('O nome é obrigatório.', 'error');
                        try {
                            await updateDoc(doc(db, 'usuarios', editVendedorModal.id), { nome: editVendedorModal.nome });
                            setEditVendedorModal(null);
                            showToast('Vendedor atualizado com sucesso!', 'success');
                        } catch (err) {
                            console.error(err);
                            showToast('Erro ao atualizar vendedor.', 'error');
                        }
                     }} 
                     className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3 rounded-xl mt-2 transition hover:scale-[1.02]">
                     Salvar Alterações
                   </button>
                 </div>
               </div>
            </div>
          )}

          {isVendedorModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <button onClick={() => setIsVendedorModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Novo Vendedor</h3>
                 <p className="text-xs text-slate-400 mb-6">Crie um acesso para a sua equipa comercial.</p>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Completo do Consultor</label>
                     <input type="text" value={novoVendedor.nome} onChange={(e) => setNovoVendedor({...novoVendedor, nome: e.target.value})} placeholder="Ex: Carlos Mendes" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">WhatsApp do Consultor</label>
                     <input type="tel" value={novoVendedor.whatsapp} onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 11) val = val.substring(0, 11);
                          let formatted = val.length > 0 ? '(' + val.substring(0, 2) : '';
                          if (val.length > 2) formatted += ') ' + val.substring(2, 7);
                          if (val.length > 7) formatted += '-' + val.substring(7, 11);
                          setNovoVendedor({...novoVendedor, whatsapp: formatted});
                      }} placeholder="(00) 00000-0000" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login de Acesso)</label>
                     <input type="email" value={novoVendedor.email} onChange={(e) => setNovoVendedor({...novoVendedor, email: e.target.value})} placeholder="carlos@suaempresa.com" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Senha Provisória</label>
                     <input type="text" value={novoVendedor.senha} onChange={(e) => setNovoVendedor({...novoVendedor, senha: e.target.value})} placeholder="Mínimo 6 caracteres" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-amber-500 font-mono text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <button 
                     onClick={async () => {
                        if(!novoVendedor.nome || !novoVendedor.email || novoVendedor.senha.length < 6) return showToast('Preencha os dados e use uma senha com no mínimo 6 caracteres.', 'error');
                        setVendedorLoading(true);
                        try {
                          const cred = await createUserWithEmailAndPassword(secondaryAuth, novoVendedor.email, novoVendedor.senha);
                          await setDoc(doc(db, 'usuarios', cred.user.uid), {
                            nome: novoVendedor.nome,
                            whatsapp: novoVendedor.whatsapp,
                            email: novoVendedor.email,
                            role: 'vendedor',
                            empresaId: userData?.uid || 'padrao',
                            status: 'Ativo',
                            dataCriacao: serverTimestamp()
                          });
                          await signOut(secondaryAuth);
                          showToast('Vendedor cadastrado com sucesso e já pode fazer login!', 'success');
                          setNovoVendedor({ nome: '', email: '', whatsapp: '', senha: '' });
                          setIsVendedorModalOpen(false);
                        } catch (err) {
                          console.error(err);
                          showToast('Erro ao criar vendedor: ' + err.message, 'error');
                        } finally {
                          setVendedorLoading(false);
                        }
                     }} 
                     disabled={vendedorLoading}
                     className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3 rounded-xl mt-2 transition disabled:opacity-50">
                     {vendedorLoading ? 'A Registar...' : 'Cadastrar Vendedor'}
                   </button>
                 </div>
               </div>
            </div>
          )}

          {showLimitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-amber-900/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <button onClick={() => setShowLimitModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <div className="text-center pt-2">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-extrabold text-white mb-2">Limite de Equipa Atingido</h3>
                    <p className="text-sm text-slate-400 mb-6">A sua empresa atingiu o limite de vendedores disponível no plano atual <strong>({userData?.plano || 'Free'})</strong>.</p>
                    <button onClick={() => window.open('https://wa.me/5564981005505?text=Olá,%20gostaria%20de%20fazer%20um%20upgrade%20no%20meu%20plano%20do%20Simulador%20Solar.', '_blank')} className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-extrabold py-3.5 rounded-xl transition hover:scale-[1.02] flex justify-center items-center gap-2">
                        <MessageCircle className="w-5 h-5" /> Falar com o Suporte
                    </button>
                    <p className="text-xs text-slate-500 mt-4 font-medium">(64) 9 8100-5505</p>
                 </div>
               </div>
            </div>
          )}

          {vendedorToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-red-900/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <h3 className="text-xl font-extrabold text-white mb-2 text-center text-red-400">Excluir Vendedor?</h3>
                 <p className="text-sm text-slate-300 mb-4 text-center">Tem a certeza que deseja excluir permanentemente o acesso de <strong>{vendedorToDelete.nome}</strong>?</p>
                 <p className="text-[11px] leading-relaxed text-slate-400 mb-6 text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20"><strong>Importante:</strong> Não se preocupe! O histórico de orçamentos gerados por este vendedor <strong>não será apagado</strong> e continuará disponível para a empresa na aba CRM.</p>
                 <div className="flex gap-3">
                     <button onClick={() => setVendedorToDelete(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition">Cancelar</button>
                     <button onClick={confirmDeleteVendedor} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">Sim, Excluir</button>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}

      {currentTab === 'kits' && (
        <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-12 text-center shadow-sm relative">
          <Zap className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">Tabela de Preços e Kits (Nuvem)</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Ao fazer upload de uma planilha, os preços nos telemóveis de todos os seus vendedores na rua são atualizados no mesmo segundo!</p>
          <button onClick={() => setIsUploadModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Fazer Upload de Planilha</button>
          
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Motor Excel Dinâmico</h3>
                 
                 {uploadStatus === 'idle' && (
                     <>
                        <div className="bg-[#030811] border border-slate-700 rounded-xl p-4 my-4">
                            <p className="text-xs text-slate-300 font-bold mb-2">Instruções:</p>
                            <ol className="text-xs text-slate-400 space-y-1 list-decimal pl-4">
                              <li>Baixe o <a href="#" onClick={downloadTemplate} className="text-amber-500 hover:underline font-bold">Modelo Obrigatório CSV aqui</a>.</li>
                              <li>Abra no Excel, edite os preços, guarde, e envie.</li>
                            </ol>
                        </div>
                        <label className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-slate-800/50 transition cursor-pointer group">
                            <input type="file" className="hidden" accept=".xlsx, .csv, .xls" onChange={handleRealUpload} />
                            <FileSpreadsheet className="w-10 h-10 text-slate-500 group-hover:text-amber-500 mb-2 transition" />
                            <p className="text-sm font-bold text-slate-300">Clique para selecionar a planilha</p>
                        </label>
                        <button onClick={() => setIsUploadModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl mt-4 border border-slate-700 transition">Cancelar</button>
                     </>
                 )}
                 {uploadStatus === 'deleting' && (<div className="border-2 border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-red-500/10 transition-all mt-4"><AlertCircle className="w-10 h-10 text-red-500 mb-2 animate-pulse" /><p className="text-sm font-bold text-red-400 text-center">Passo 1: Limpando kits antigos da nuvem...</p></div>)}
                 {uploadStatus === 'saving' && (<div className="border-2 border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-blue-500/10 transition-all mt-4"><Zap className="w-10 h-10 text-blue-500 mb-2 animate-bounce" /><p className="text-sm font-bold text-blue-400 text-center">Passo 2: Lendo Excel e salvando os novos preços...</p></div>)}
                 {uploadStatus === 'success' && (<div className="border-2 border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-emerald-500/10 transition-all mt-4"><CheckCircle className="w-10 h-10 text-emerald-500 mb-2" /><p className="text-sm font-bold text-emerald-400 text-center">Sucesso! Simuladores de rua 100% atualizados.</p></div>)}
               </div>
            </div>
          )}
        </div>
      )}
      
      {currentTab === 'tutorial' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-6 mb-6">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20"><BookOpen className="w-8 h-8 text-blue-400"/></div>
              <div><h2 className="text-2xl font-bold text-white">Central de Treinamento</h2><p className="text-slate-400 text-sm mt-1">Aprenda a tirar o máximo de proveito da plataforma de gestão e acelere as suas vendas.</p></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#030811] rounded-xl p-6 border border-slate-800/50 hover:border-amber-500/30 transition group"><h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><span className="bg-amber-500 text-slate-950 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">1</span> Cadastrar Vendedores</h3><p className="text-sm text-slate-400 leading-relaxed">Vá à aba <strong>"Meus Vendedores"</strong> e clique em "Cadastrar Novo Vendedor". O sistema gera uma senha provisória automaticamente. Entregue o e-mail de acesso e a senha ao seu consultor para ele aceder ao Simulador no telemóvel.</p></div>
              <div className="bg-[#030811] rounded-xl p-6 border border-slate-800/50 hover:border-amber-500/30 transition group"><h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><span className="bg-amber-500 text-slate-950 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">2</span> Atualizar Tabela de Kits</h3><p className="text-sm text-slate-400 leading-relaxed">Na aba <strong>"Gestão de Kits"</strong>, faça o upload da sua planilha Excel padrão. Isso atualiza instantaneamente os preços nos simuladores de todos os seus vendedores na rua, evitando vendas com preços antigos.</p></div>
              <div className="bg-[#030811] rounded-xl p-6 border border-slate-800/50 hover:border-amber-500/30 transition group md:col-span-2"><h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3"><span className="bg-amber-500 text-slate-950 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">3</span> Acompanhar Resultados (CRM)</h3><p className="text-sm text-slate-400 leading-relaxed">Toda simulação enviada pela sua equipa cai diretamente na aba <strong>"Resultados (CRM)"</strong> em tempo real. Utilize os filtros no topo para ver as vendas de um vendedor específico num determinado mês e baixe o relatório em Excel para o seu computador.</p></div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 7. VISÃO VENDEDOR (Agora com dados da Nuvem)
// ==========================================
const VendedorView = ({ setView, kitsString, kitsMicro, userData }) => {
  const [viewMode, setViewMode] = useState('simulador');
  const [formData, setFormData] = useState({ sellerName: userData?.nome || '', kitString: '', kitMicro: '', roofStructure: '', clientName: '', clientWhatsapp: '', clientCity: '' });
  const [timeFilter, setTimeFilter] = useState('hoje');
  const [customStartVend, setCustomStartVend] = useState('');
  const [customEndVend, setCustomEndVend] = useState('');
  const [toast, setToast] = useState(null);
  
  const [orcamentos, setOrcamentos] = useState([]);
  const [loadingCRM, setLoadingCRM] = useState(true);
  const [crmStatusFilter, setCrmStatusFilter] = useState('todos'); 

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!userData || !userData.uid) return;
    const q = query(collection(db, "orcamentos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.vendedorUid === userData.uid || data.vendedor === userData.nome) {
            let dataFormatada = 'Sem Data';
            let msTimestamp = 0;
            if (data.timestamp) {
               const date = data.timestamp.toDate();
               msTimestamp = date.getTime();
               dataFormatada = date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            } else if (data.data) {
               dataFormatada = data.data;
               const [dataPart, timePart] = data.data.split(' ');
               if(dataPart && timePart) {
                   const [day, month, year] = dataPart.split('/');
                   const [hour, min] = timePart.split(':');
                   msTimestamp = new Date(year, month - 1, day, hour, min).getTime();
               }
            }
            docs.push({ id: doc.id, ...data, dataVisual: dataFormatada, msTimestamp });
        }
      });
      docs.sort((a, b) => b.msTimestamp - a.msTimestamp);
      setOrcamentos(docs);
      setLoadingCRM(false);
    });
    return () => unsubscribe();
  }, [userData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let newFormData = { ...formData, [id]: value };
    if (id === 'kitString' && value !== '') { newFormData.kitMicro = ''; newFormData.roofStructure = ''; } 
    else if (id === 'kitMicro' && value !== '') { newFormData.kitString = ''; newFormData.roofStructure = ''; }
    setFormData(newFormData);
  };

  const activeKit = formData.kitString !== '' ? kitsString[formData.kitString] : formData.kitMicro !== '' ? kitsMicro[formData.kitMicro] : null;

  const [nomeEmpresa, setNomeEmpresa] = useState("Energia Solar ☀️");
  
  useEffect(() => {
     if(userData && userData.empresaId && userData.empresaId !== 'padrao') {
         getDoc(doc(db, 'usuarios', userData.empresaId)).then(docSnap => {
             if(docSnap.exists()) {
                 setNomeEmpresa(docSnap.data().nome + " ☀️");
             }
         }).catch(err => console.log("Erro ao buscar nome empresa:", err));
     }
  }, [userData]);

  const buildMessage = () => {
    const clientName = formData.clientName.trim() || '[Nome do Cliente]';
    const clientCity = formData.clientCity.trim() || '[Cidade]';
    const clientWhatsapp = formData.clientWhatsapp.trim() || '[WhatsApp Cliente]';
    const sellerName = formData.sellerName.trim() || '[Nome do Vendedor]';
    const roofStructure = formData.roofStructure || '[Estrutura do Telhado]';
    let kitName = '[Kit Selecionado]', placas = '--', modulo = '--', inversor = '--', valor = '--';

    if (activeKit) {
        kitName = activeKit.Kit; placas = activeKit.Placas; modulo = activeKit.Modulo; inversor = activeKit.Inversor; valor = formatarMoeda(activeKit.Valor);
    }
    const cleanPotencia = modulo.replace(/Módulo\s*/gi, '').trim();

    return `Empresa: *${nomeEmpresa}*\n\nSegue o seu orçamento personalizado de Energia Solar\n\n👤 *Cliente:* ${clientName}\n📍 *Cidade:* ${clientCity}\n📱 *Zap:* ${clientWhatsapp}\n\n🏠 *Estrutura do Telhado:* ${roofStructure}\n📦 *Kit Selecionado:* ${kitName}\n☀️ *Placas:* ${placas}\n⚡ *Potência:* ${cleanPotencia}\n🔄 *Inversor:* ${inversor}\n\n💰 *Valor do Kit:* ${valor}\n\n✨ *Condições Especiais:*\n\n💳 Financiamos 100% com Zero de Entrada\n\n📅 Primeira parcela com prazo de até 120 dias para começar a pagar\n\n💼 Atendido por: *${sellerName}*\n\nFicamos à disposição para esclarecer dúvidas e realizar o seu projeto.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sellerName || (!formData.kitString && !formData.kitMicro) || !formData.roofStructure || !formData.clientName || !formData.clientWhatsapp || !formData.clientCity) {
      return showToast('Preencha todos os campos obrigatórios!');
    }

    let cleanPhone = formData.clientWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) return showToast('Insira um WhatsApp válido.');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) cleanPhone = '55' + cleanPhone;

    try {
      showToast('A enviar dados...', 'success');
      const dateNow = new Date();
      await addDoc(collection(db, "orcamentos"), {
        data: dateNow.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        vendedor: formData.sellerName, 
        cliente: formData.clientName, 
        whatsapp: formData.clientWhatsapp, 
        cidade: formData.clientCity,
        estrutura: formData.roofStructure, 
        tipoKit: formData.kitString !== '' ? 'String' : 'Micro', 
        kit: activeKit.Kit, 
        valor: activeKit.Valor, 
        timestamp: serverTimestamp(),
        msTimestamp: dateNow.getTime(),
        empresaId: userData?.empresaId || 'padrao', 
        vendedorUid: userData?.uid || 'padrao',
        status: 'Negociando'
      });
      const textMessage = buildMessage();
      const encodedText = encodeURIComponent(textMessage);
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
      window.location.href = waUrl;
    } catch (error) {
      showToast('Erro ao gravar na nuvem.', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        await updateDoc(doc(db, "orcamentos", id), { status: newStatus });
        showToast('Status atualizado com sucesso!', 'success');
    } catch (error) {
        console.error("Erro ao atualizar status", error);
        showToast('Erro ao atualizar status do lead.', 'error');
    }
  };

  const orcamentosVendedorFiltrados = orcamentos.filter(orc => {
    if (crmStatusFilter !== 'todos' && (orc.status || 'Negociando') !== crmStatusFilter) return false;
    
    const hojeIncio = new Date();
    hojeIncio.setHours(0, 0, 0, 0);
    const hojeMs = hojeIncio.getTime();
    const umDiaMs = 24 * 60 * 60 * 1000;
    
    if (timeFilter === 'hoje') {
        if (!orc.msTimestamp || orc.msTimestamp < hojeMs) return false;
    } else if (timeFilter === 'semana') {
        if (!orc.msTimestamp || orc.msTimestamp < (hojeMs - 7 * umDiaMs)) return false;
    } else if (timeFilter === 'quinzena') {
        if (!orc.msTimestamp || orc.msTimestamp < (hojeMs - 15 * umDiaMs)) return false;
    } else if (timeFilter === 'mes') {
        if (!orc.msTimestamp || orc.msTimestamp < (hojeMs - 30 * umDiaMs)) return false;
    } else if (timeFilter === 'personalizado') {
        if (customStartVend) {
            const start = new Date(customStartVend + 'T00:00:00').getTime();
            if (!orc.msTimestamp || orc.msTimestamp < start) return false;
        }
        if (customEndVend) {
            const end = new Date(customEndVend + 'T23:59:59').getTime();
            if (!orc.msTimestamp || orc.msTimestamp > end) return false;
        }
    }
    return true;
  });
  
  return (
    <div className="min-h-screen bg-[#030811] text-slate-100 font-sans selection:bg-amber-500 overflow-x-hidden relative">
      {toast && (
        <div className={`fixed top-24 right-5 z-[100] flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white border border-white/10`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      )}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B192C]/80 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 truncate pr-2">
                <div className="bg-gradient-to-tr from-amber-500 to-amber-300 p-2.5 rounded-xl shadow-lg shadow-amber-500/20 shrink-0"><Sun className="w-6 h-6 text-[#0B192C]" /></div>
                <div className="truncate">
                    <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white block truncate">LD <span className="text-amber-400">SIMULADOR SOLAR</span></span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block -mt-1 font-semibold truncate">Tecnologia Sustentável</span>
                </div>
            </div>
            <nav className="flex items-center space-x-4 shrink-0">
                <div className="hidden sm:flex bg-[#030811] p-1 rounded-xl border border-slate-700/50">
                    <button onClick={() => setViewMode('simulador')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === 'simulador' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Simulador</button>
                    <button onClick={() => setViewMode('historico')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === 'historico' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Meus Orçamentos</button>
                </div>
                <button onClick={() => setView('login')} className="text-slate-400 hover:text-red-400 transition p-2 bg-slate-800/50 rounded-lg border border-slate-700/50" title="Sair"><LogOut className="w-5 h-5"/></button>
            </nav>
        </div>
      </header>

      {/* Tabs para Mobile */}
      <div className="sm:hidden flex bg-[#0B192C] border-b border-slate-800 p-2">
         <div className="w-full flex bg-[#030811] p-1 rounded-xl border border-slate-700/50">
            <button onClick={() => setViewMode('simulador')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${viewMode === 'simulador' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Simulador</button>
            <button onClick={() => setViewMode('historico')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${viewMode === 'historico' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Meus Orçamentos</button>
         </div>
      </div>

      <section className="py-8 sm:py-20 bg-[#0B192C] border-t border-b border-slate-800 relative min-h-[80vh] flex items-center flex-col w-full" style={{ backgroundImage: 'radial-gradient(at 0% 0%, hsla(210,100%,12%,1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(38,100%,50%,0.08) 0px, transparent 50%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.04),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            
            {viewMode === 'simulador' ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-[#030811] rounded-3xl border border-slate-700/60 shadow-xl mb-12 p-4 sm:p-5 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 border-b border-slate-800/80 pb-4 w-full overflow-hidden">
                    <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2 shrink-0"><BarChart3 className="w-4 h-4 text-amber-500"/> O Meu Desempenho</h2>
                    <div className="w-full overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                      <div className="bg-[#0B192C] rounded-xl p-1 flex text-xs font-bold border border-slate-700 shadow-inner w-max">
                        <button onClick={() => setTimeFilter('hoje')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'hoje' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Hoje</button>
                        <button onClick={() => setTimeFilter('semana')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'semana' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Semana</button>
                        <button onClick={() => setTimeFilter('quinzena')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'quinzena' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Quinzena</button>
                        <button onClick={() => setTimeFilter('mes')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'mes' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Mês</button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                     <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left"><p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Propostas</p><p className="text-2xl font-extrabold text-white">{orcamentosVendedorFiltrados.length}</p></div>
                     <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left"><p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits String</p><p className="text-2xl font-extrabold text-blue-400">{orcamentosVendedorFiltrados.filter(o => o.tipoKit === 'String').length}</p></div>
                     <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left"><p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits Micro</p><p className="text-2xl font-extrabold text-emerald-400">{orcamentosVendedorFiltrados.filter(o => o.tipoKit === 'Micro').length}</p></div>
                     <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm flex flex-col justify-center items-center sm:items-start"><p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Status Meta</p><span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-400/20 mt-1"><CheckCircle className="w-3 h-3"/> No Ritmo</span></div>
                  </div>
                </div>

                <div className="bg-[#030811] rounded-3xl border border-slate-700/60 shadow-[0_0_25px_rgba(245,166,35,0.1)] overflow-hidden w-full">
                    <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-8 sm:space-y-10">
                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                                <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0">1</span>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Consultor</h4>
                            </div>
                            <div>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-amber-400 transition-colors"><User className="w-5 h-5"/></span>
                                    <input type="text" id="sellerName" value={formData.sellerName} onChange={handleInputChange} placeholder="Digite o seu nome completo" className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0">2</span>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Configuração</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-amber-400"><Zap className="w-4 h-4"/></span>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">1: Kits String *</label>
                                    <select id="kitString" value={formData.kitString} onChange={handleInputChange} className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-8 text-sm text-white transition outline-none appearance-none shadow-inner cursor-pointer truncate">
                                      <option value="" disabled>-- Selecione Kit String --</option>
                                      {kitsString.length === 0 ? <option disabled>Sem kits. Faça Upload no CRM.</option> : kitsString.map((k, i) => <option key={i} value={i} className="bg-[#0B192C] text-white">{k.Kit} - {formatarMoeda(k.Valor)}</option>)}
                                    </select>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                                </div>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-amber-400"><Zap className="w-4 h-4"/></span>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">2: Kits Micro *</label>
                                    <select id="kitMicro" value={formData.kitMicro} onChange={handleInputChange} className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-8 text-sm text-white transition outline-none appearance-none shadow-inner cursor-pointer truncate">
                                      <option value="" disabled>-- Selecione Kit Micro --</option>
                                      {kitsMicro.length === 0 ? <option disabled>Sem kits. Faça Upload no CRM.</option> : kitsMicro.map((k, i) => <option key={i} value={i} className="bg-[#0B192C] text-white">{k.Kit} - {formatarMoeda(k.Valor)}</option>)}
                                    </select>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                                </div>
                            </div>
                            <div>
                                <div className="relative group">
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">Estrutura do Telhado *</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-amber-400 transition-colors"><Building className="w-4 h-4"/></span>
                                    <select id="roofStructure" value={formData.roofStructure} onChange={handleInputChange} className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-8 text-sm text-white transition outline-none appearance-none shadow-inner cursor-pointer truncate">
                                      <option value="" disabled>-- Selecione a Estrutura --</option>
                                      <option value="Madeira" className="bg-[#0B192C] text-white">1: Madeira</option>
                                      <option value="Ferro" className="bg-[#0B192C] text-white">2: Ferro</option>
                                    </select>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-[#0B192C] to-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative overflow-hidden shadow-lg">
                                <div className="absolute -right-8 -bottom-8 text-slate-800/40 pointer-events-none transform rotate-12"><Sun className="w-48 h-48"/></div>
                                <div className="space-y-1.5 relative z-10"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">Qtd. Placas</span><span className="text-base sm:text-lg font-extrabold text-white block truncate">{activeKit ? activeKit.Placas : '--'}</span></div>
                                <div className="space-y-1.5 relative z-10"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">Inversor</span><span className="text-base sm:text-lg font-extrabold text-white block truncate">{activeKit ? activeKit.Inversor : '--'}</span></div>
                                <div className="space-y-1.5 relative z-10"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">Estrutura</span><span className="text-base sm:text-lg font-extrabold text-white block truncate">{formData.roofStructure || '--'}</span></div>
                                <div className="space-y-1.5 relative z-10"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5"><span className="text-emerald-600">Valor do Kit</span></span><span className="text-base sm:text-lg font-extrabold text-emerald-400 block truncate">{activeKit ? formatarMoeda(activeKit.Valor) : '--'}</span></div>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                                <span className="bg-orange-500/20 border border-orange-500/30 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0">3</span>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cliente</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                                <div className="relative group">
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">Nome do Cliente *</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-orange-500 transition-colors"><User className="w-4 h-4"/></span>
                                    <input type="text" id="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Nome do Cliente" className="w-full bg-[#0B192C] border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                                </div>
                                <div className="relative group">
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">WhatsApp *</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-orange-500 transition-colors"><Smartphone className="w-4 h-4"/></span>
                                    <input type="tel" id="clientWhatsapp" value={formData.clientWhatsapp} onChange={(e) => {
                                          let val = e.target.value.replace(/\D/g, '');
                                          if (val.length > 11) val = val.substring(0, 11);
                                          let formatted = val.length > 0 ? '(' + val.substring(0, 2) : '';
                                          if (val.length > 2) formatted += ') ' + val.substring(2, 7);
                                          if (val.length > 7) formatted += '-' + val.substring(7, 11);
                                          setFormData({...formData, clientWhatsapp: formatted});
                                      }} placeholder="(00) 00000-0000" className="w-full bg-[#0B192C] border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                                </div>
                                <div className="relative group">
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">Cidade / Estado *</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-orange-500 transition-colors"><MapPin className="w-4 h-4"/></span>
                                    <input type="text" id="clientCity" value={formData.clientCity} onChange={handleInputChange} placeholder="Cidade - Estado" className="w-full bg-[#0B192C] border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0B192C]/50 border border-slate-700/60 rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-sm w-full">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span><span>Visualização da Mensagem</span></div>
                            <div className="bg-[#030811] p-4 sm:p-5 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-none max-h-64 overflow-y-auto shadow-inner w-full break-words">
                                {buildMessage()}
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full inline-flex items-center justify-center px-4 sm:px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-extrabold text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(245,166,35,0.2)] hover:scale-[1.02] active:scale-[0.98]">
                                Enviar Proposta WhatsApp
                            </button>
                        </div>
                    </form>
                </div>
              </div>
            ) : (
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full w-full">
                 <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0B192C]/80 w-full">
                   <div>
                     <h3 className="text-xl font-bold text-white flex items-center gap-2"><List className="w-6 h-6 text-amber-500"/> Meus Orçamentos (CRM)</h3>
                     <p className="text-sm text-slate-400 mt-1">Faça a gestão e acompanhamento das suas vendas.</p>
                   </div>
                 </div>
                 <div className="flex-1 overflow-x-auto p-4 max-h-[60vh]">
                   <table className="w-full text-left text-sm text-slate-300 min-w-max">
                     <thead className="text-[10px] uppercase tracking-widest bg-[#030811] text-slate-500 font-bold border-b border-slate-800 sticky top-0 z-10">
                       <tr><th className="px-4 py-3 rounded-tl-lg">Data / Hora</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">Cidade</th><th className="px-4 py-3">Estrutura</th><th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Kit Solar</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 rounded-tr-lg text-right">Valor (R$)</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                       {orcamentosVendedorFiltrados.length === 0 ? (
                         <tr><td colSpan="9" className="text-center py-8 text-slate-500 font-bold">Nenhum orçamento encontrado com estes filtros.</td></tr>
                       ) : (
                         orcamentosVendedorFiltrados.map((sim) => (
                           <tr key={sim.id} className="hover:bg-slate-800/40 transition">
                             <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sim.dataVisual}</td>
                             <td className="px-4 py-3 whitespace-nowrap"><div className="font-bold text-white">{sim.cliente}</div></td>
                             <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{sim.whatsapp}</td>
                             <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.cidade}</td>
                             <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.estrutura}</td>
                             <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sim.tipoKit === 'String' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{sim.tipoKit}</span></td>
                             <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{sim.kit}</td>
                             <td className="px-4 py-3 text-center whitespace-nowrap">
                                 <select 
                                    value={sim.status || 'Negociando'} 
                                    onChange={(e) => handleStatusChange(sim.id, e.target.value)}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded outline-none cursor-pointer transition-colors
                                       ${sim.status === 'Fechou' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                         sim.status === 'Não Interessou' || sim.status === 'Fin Reprovado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                         sim.status === 'Fin Aprovado' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                         'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                                 >
                                    <option value="Negociando" className="bg-[#0B192C] text-white">Negociando</option>
                                    <option value="Fin Aprovado" className="bg-[#0B192C] text-white">Fin Aprovado</option>
                                    <option value="Fin Reprovado" className="bg-[#0B192C] text-white">Fin Reprovado</option>
                                    <option value="Não Interessou" className="bg-[#0B192C] text-white">Não Interessou</option>
                                    <option value="Fechou" className="bg-[#0B192C] text-white">Fechou</option>
                                 </select>
                             </td>
                             <td className="px-4 py-3 text-right font-bold text-amber-500 whitespace-nowrap">{formatarMoeda(sim.valor)}</td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 8. O GESTOR PRINCIPAL
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [userData, setUserData] = useState(null); 
  
  const [kitsString, setKitsString] = useState(fallbackKitsString);
  const [kitsMicro, setKitsMicro] = useState(fallbackKitsMicro);

  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockKeyboardShortcuts = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) || (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockKeyboardShortcuts);
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeyboardShortcuts);
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "kits"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const strings = [];
        const micros = [];
        
        const targetEmpresaId = userData?.role === 'vendedor' ? userData?.empresaId : userData?.uid;
        
        querySnapshot.forEach((doc) => {
          const kit = doc.data();
          if (targetEmpresaId && kit.empresaId && kit.empresaId !== targetEmpresaId) return;

          if (kit.Tipo === 'Micro' || (kit.Kit && String(kit.Kit).toUpperCase().includes('MICRO'))) {
            micros.push(kit);
          } else {
            strings.push(kit);
          }
        });
        
        const sortKits = (a, b) => {
            const valA = parseFloat(String(a.Valor).replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
            const valB = parseFloat(String(b.Valor).replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
            return valA - valB;
        };

        if(strings.length === 0 && micros.length === 0) {
            setKitsString([...fallbackKitsString].sort(sortKits));
            setKitsMicro([...fallbackKitsMicro].sort(sortKits));
        } else {
            setKitsString(strings.sort(sortKits));
            setKitsMicro(micros.sort(sortKits));
        }
      }
    });
    return () => unsubscribe();
  }, [userData]);

  return (
    <div className="font-sans antialiased bg-[#030811] min-h-screen w-full select-none">
      {currentView === 'login' && <LoginView setView={setCurrentView} setUserData={setUserData} />}
      {currentView === 'master' && <MasterView setView={setCurrentView} />}
      {currentView === 'empresa' && <EmpresaView setView={setCurrentView} userData={userData} />}
      {currentView === 'vendedor' && <VendedorView setView={setCurrentView} kitsString={kitsString} kitsMicro={kitsMicro} userData={userData} />}
    </div>
  );
}
