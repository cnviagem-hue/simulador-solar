import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Building, Users, Zap, Plus, Settings, AlertCircle, LogOut, CheckCircle, ChevronDown, User, Smartphone, MapPin, BarChart3, Sun, FileSpreadsheet, ClipboardList, MessageCircle, BookOpen } from 'lucide-react';

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. DADOS DOS KITS (24 String + 66 Micro)
// ==========================================
const kitsString = [
  { Kit: 'KIT 370kWh', Placas: '5', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '9.335,68' },
  { Kit: 'KIT 440kWh', Placas: '6', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '9.924,54' },
  { Kit: 'KIT 510kWh', Placas: '7', Modulo: '590W', Inversor: 'AUXSOL 3K', Valor: '10.513,40' },
  { Kit: 'KIT 590kWh', Placas: '8', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '12.177,50' },
  { Kit: 'KIT 660kWh', Placas: '9', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '12.950,81' },
  { Kit: 'KIT 730kWh', Placas: '10', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '14.022,87' },
  { Kit: 'KIT 800kWh', Placas: '11', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '14.840,30' },
  { Kit: 'KIT 880kWh', Placas: '12', Modulo: '590W', Inversor: 'AUXSOL 5K', Valor: '15.657,74' },
  { Kit: 'KIT 950kWh', Placas: '13', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '16.941,40' },
  { Kit: 'KIT 1020kWh', Placas: '14', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '17.758,83' },
  { Kit: 'KIT 1090kWh', Placas: '15', Modulo: '590W', Inversor: 'AUXSOL 6K', Valor: '18.586,78' },
  { Kit: 'KIT 1170kWh', Placas: '16', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '20.119,90' },
  { Kit: 'KIT 1240kWh', Placas: '17', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '21.089,72' },
  { Kit: 'KIT 1310kWh', Placas: '18', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '22.191,31' },
  { Kit: 'KIT 1380kWh', Placas: '19', Modulo: '590W', Inversor: 'AUXSOL 7K', Valor: '23.029,30' },
  { Kit: 'KIT 1460kWh', Placas: '20', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '24.491,09' },
  { Kit: 'KIT 1530kWh', Placas: '21', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '25.689,47' },
  { Kit: 'KIT 1600kWh', Placas: '22', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '26.527,52' },
  { Kit: 'KIT 1670kWh', Placas: '23', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '27.365,57' },
  { Kit: 'KIT 1750kWh', Placas: '24', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '28.203,61' },
  { Kit: 'KIT 1820kWh', Placas: '25', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '29.173,42' },
  { Kit: 'KIT 1890kWh', Placas: '26', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '30.760,71' },
  { Kit: 'KIT 1960kWh', Placas: '27', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '31.598,76' },
  { Kit: 'KIT 2040kWh', Placas: '28', Modulo: '590W', Inversor: 'AUXSOL 10K', Valor: '32.436,81' }
];

const kitsMicro = [
  { Kit: 'KIT MICRO 230KWh', Placas: '3', Modulo: '620W', Inversor: 'TSUNESS', Valor: '7.725,81' },
  { Kit: 'KIT MICRO 310KWh', Placas: '4', Modulo: '620W', Inversor: 'TSUNESS', Valor: '8.342,16' },
  { Kit: 'KIT MICRO 390KWh', Placas: '5', Modulo: '620W', Inversor: 'TSUNESS', Valor: '9.620,01' },
  { Kit: 'KIT MICRO 460KWh', Placas: '6', Modulo: '620W', Inversor: 'TSUNESS', Valor: '10.236,36' },
  { Kit: 'KIT MICRO 540KWh', Placas: '7', Modulo: '620W', Inversor: 'TSUNESS', Valor: '12.679,71' },
  { Kit: 'KIT MICRO 620KWh', Placas: '8', Modulo: '620W', Inversor: 'TSUNESS', Valor: '13.924,63' },
  { Kit: 'KIT MICRO 690KWh', Placas: '9', Modulo: '620W', Inversor: 'TSUNESS', Valor: '14.734,62' },
  { Kit: 'KIT MICRO 770KWh', Placas: '10', Modulo: '620W', Inversor: 'TSUNESS', Valor: '15.579,54' },
  { Kit: 'KIT MICRO 840KWh', Placas: '11', Modulo: '620W', Inversor: 'TSUNESS', Valor: '16.424,46' },
  { Kit: 'KIT MICRO 920KWh', Placas: '12', Modulo: '620W', Inversor: 'TSUNESS', Valor: '17.269,38' },
  { Kit: 'KIT MICRO 1000KWh', Placas: '13', Modulo: '620W', Inversor: 'TSUNESS', Valor: '20.136,94' },
  { Kit: 'KIT MICRO 1070KWh', Placas: '14', Modulo: '620W', Inversor: 'TSUNESS', Valor: '21.264,26' },
  { Kit: 'KIT MICRO 1150KWh', Placas: '15', Modulo: '620W', Inversor: 'TSUNESS', Valor: '22.130,75' },
  { Kit: 'KIT MICRO 1230KWh', Placas: '16', Modulo: '620W', Inversor: 'TSUNESS', Valor: '22.997,24' },
  { Kit: 'KIT MICRO 1300KWh', Placas: '17', Modulo: '620W', Inversor: 'TSUNESS', Valor: '24.005,01' },
  { Kit: 'KIT MICRO 1380KWh', Placas: '18', Modulo: '620W', Inversor: 'TSUNESS', Valor: '24.871,51' },
  { Kit: 'KIT MICRO 1450KWh', Placas: '19', Modulo: '620W', Inversor: 'TSUNESS', Valor: '28.057,52' },
  { Kit: 'KIT MICRO 1530KWh', Placas: '20', Modulo: '620W', Inversor: 'TSUNESS', Valor: '28.924,01' },
  { Kit: 'KIT MICRO 1610KWh', Placas: '21', Modulo: '620W', Inversor: 'TSUNESS', Valor: '30.160,35' },
  { Kit: 'KIT MICRO 1680KWh', Placas: '22', Modulo: '620W', Inversor: 'TSUNESS', Valor: '31.026,84' },
  { Kit: 'KIT MICRO 1760KWh', Placas: '23', Modulo: '620W', Inversor: 'TSUNESS', Valor: '31.893,35' },
  { Kit: 'KIT MICRO 1840KWh', Placas: '24', Modulo: '620W', Inversor: 'TSUNESS', Valor: '32.759,84' },
  { Kit: 'KIT MICRO 1910KWh', Placas: '25', Modulo: '620W', Inversor: 'TSUNESS', Valor: '35.397,73' },
  { Kit: 'KIT MICRO 1990KWh', Placas: '26', Modulo: '620W', Inversor: 'TSUNESS', Valor: '37.010,76' },
  { Kit: 'KIT MICRO 2060KWh', Placas: '27', Modulo: '620W', Inversor: 'TSUNESS', Valor: '37.877,26' },
  { Kit: 'KIT MICRO 2140KWh', Placas: '28', Modulo: '620W', Inversor: 'TSUNESS', Valor: '38.743,75' },
  { Kit: 'KIT MICRO 2220KWh', Placas: '29', Modulo: '620W', Inversor: 'TSUNESS', Valor: '39.751,52' },
  { Kit: 'KIT MICRO 2290KWh', Placas: '30', Modulo: '620W', Inversor: 'TSUNESS', Valor: '40.618,01' },
  { Kit: 'KIT MICRO 2370KWh', Placas: '31', Modulo: '620W', Inversor: 'TSUNESS', Valor: '44.043,20' },
  { Kit: 'KIT MICRO 2450KWh', Placas: '32', Modulo: '620W', Inversor: 'TSUNESS', Valor: '45.170,51' },
  { Kit: 'KIT MICRO 2520KWh', Placas: '33', Modulo: '620W', Inversor: 'TSUNESS', Valor: '46.178,29' },
  { Kit: 'KIT MICRO 2600KWh', Placas: '34', Modulo: '620W', Inversor: 'TSUNESS', Valor: '47.044,78' },
  { Kit: 'KIT MICRO 2670KWh', Placas: '35', Modulo: '620W', Inversor: 'TSUNESS', Valor: '47.911,28' },
  { Kit: 'KIT MICRO 2750KWh', Placas: '36', Modulo: '620W', Inversor: 'TSUNESS', Valor: '48.777,77' },
  { Kit: 'KIT MICRO 2830KWh', Placas: '37', Modulo: '620W', Inversor: 'TSUNESS', Valor: '51.844,23' },
  { Kit: 'KIT MICRO 2900KWh', Placas: '38', Modulo: '620W', Inversor: 'TSUNESS', Valor: '52.971,55' },
  { Kit: 'KIT MICRO 2980KWh', Placas: '39', Modulo: '620W', Inversor: 'TSUNESS', Valor: '53.838,05' },
  { Kit: 'KIT MICRO 3060KWh', Placas: '40', Modulo: '620W', Inversor: 'TSUNESS', Valor: '54.704,54' },
  { Kit: 'KIT MICRO 3130KWh', Placas: '41', Modulo: '620W', Inversor: 'TSUNESS', Valor: '56.069,45' },
  { Kit: 'KIT MICRO 3210KWh', Placas: '42', Modulo: '620W', Inversor: 'TSUNESS', Valor: '56.935,94' },
  { Kit: 'KIT MICRO 3280KWh', Placas: '43', Modulo: '620W', Inversor: 'TSUNESS', Valor: '59.432,56' },
  { Kit: 'KIT MICRO 3360KWh', Placas: '44', Modulo: '620W', Inversor: 'TSUNESS', Valor: '60.559,88' },
  { Kit: 'KIT MICRO 3440KWh', Placas: '45', Modulo: '620W', Inversor: 'TSUNESS', Valor: '61.567,65' },
  { Kit: 'KIT MICRO 3510KWh', Placas: '46', Modulo: '620W', Inversor: 'TSUNESS', Valor: '62.434,14' },
  { Kit: 'KIT MICRO 3590KWh', Placas: '47', Modulo: '620W', Inversor: 'TSUNESS', Valor: '63.300,64' },
  { Kit: 'KIT MICRO 3670KWh', Placas: '48', Modulo: '620W', Inversor: 'TSUNESS', Valor: '64.167,13' },
  { Kit: 'KIT MICRO 3740KWh', Placas: '49', Modulo: '620W', Inversor: 'TSUNESS', Valor: '66.805,02' },
  { Kit: 'KIT MICRO 3820KWh', Placas: '50', Modulo: '620W', Inversor: 'TSUNESS', Valor: '67.671,51' },
  { Kit: 'KIT MICRO 3890KWh', Placas: '51', Modulo: '620W', Inversor: 'TSUNESS', Valor: '69.655,98' },
  { Kit: 'KIT MICRO 3970KWh', Placas: '52', Modulo: '620W', Inversor: 'TSUNESS', Valor: '70.522,47' },
  { Kit: 'KIT MICRO 4050KWh', Placas: '53', Modulo: '620W', Inversor: 'TSUNESS', Valor: '71.530,24' },
  { Kit: 'KIT MICRO 4120KWh', Placas: '54', Modulo: '620W', Inversor: 'TSUNESS', Valor: '72.396,73' },
  { Kit: 'KIT MICRO 4200KWh', Placas: '55', Modulo: '620W', Inversor: 'TSUNESS', Valor: '75.321,93' },
  { Kit: 'KIT MICRO 4280KWh', Placas: '56', Modulo: '620W', Inversor: 'TSUNESS', Valor: '76.188,42' },
  { Kit: 'KIT MICRO 4350KWh', Placas: '57', Modulo: '620W', Inversor: 'TSUNESS', Valor: '77.457,01' },
  { Kit: 'KIT MICRO 4430KWh', Placas: '58', Modulo: '620W', Inversor: 'TSUNESS', Valor: '78.323,50' },
  { Kit: 'KIT MICRO 4500KWh', Placas: '59', Modulo: '620W', Inversor: 'TSUNESS', Valor: '79.190,00' },
  { Kit: 'KIT MICRO 4580KWh', Placas: '60', Modulo: '620W', Inversor: 'TSUNESS', Valor: '80.056,49' },
  { Kit: 'KIT MICRO 4660KWh', Placas: '61', Modulo: '620W', Inversor: 'TSUNESS', Valor: '83.494,38' },
  { Kit: 'KIT MICRO 4730KWh', Placas: '62', Modulo: '620W', Inversor: 'TSUNESS', Valor: '84.360,88' },
  { Kit: 'KIT MICRO 4810KWh', Placas: '63', Modulo: '620W', Inversor: 'TSUNESS', Valor: '85.488,20' },
  { Kit: 'KIT MICRO 4890KWh', Placas: '64', Modulo: '620W', Inversor: 'TSUNESS', Valor: '86.354,69' },
  { Kit: 'KIT MICRO 4960KWh', Placas: '65', Modulo: '620W', Inversor: 'TSUNESS', Valor: '87.362,46' },
  { Kit: 'KIT MICRO 5040KWh', Placas: '66', Modulo: '620W', Inversor: 'TSUNESS', Valor: '88.228,95' }
];

// Dados Falsos (Mockup CRM)
const mockSimulacoes = [
  { id: 1, data: '01/06/2026 14:30', vendedor: 'Carlos Mendes', cliente: 'João Silva', whatsapp: '(62) 99999-1111', cidade: 'Goiânia - GO', estrutura: 'Madeira', tipo: 'String', kit: 'KIT 590kWh', valor: '12.177,50' },
  { id: 2, data: '01/06/2026 15:45', vendedor: 'Ana Paula', cliente: 'Maria Oliveira', whatsapp: '(62) 98888-2222', cidade: 'Aparecida de Goiânia - GO', estrutura: 'Ferro', tipo: 'Micro', kit: 'KIT MICRO 540KWh', valor: '12.679,71' },
  { id: 3, data: '31/05/2026 09:15', vendedor: 'Carlos Mendes', cliente: 'Pedro Santos', whatsapp: '(64) 97777-3333', cidade: 'Caldas Novas - GO', estrutura: 'Madeira', tipo: 'String', kit: 'KIT 1020kWh', valor: '17.758,83' },
  { id: 4, data: '30/05/2026 11:20', vendedor: 'Ricardo Alves', cliente: 'Lucas Fernandes', whatsapp: '(61) 96666-4444', cidade: 'Brasília - DF', estrutura: 'Ferro', tipo: 'Micro', kit: 'KIT MICRO 230KWh', valor: '7.725,81' },
  { id: 5, data: '28/05/2026 16:50', vendedor: 'Ana Paula', cliente: 'Fernanda Lima', whatsapp: '(62) 95555-5555', cidade: 'Anápolis - GO', estrutura: 'Madeira', tipo: 'String', kit: 'KIT 370kWh', valor: '9.335,68' },
];

const mockEmpresas = [
  { id: 1, nome: 'SolarTech Brasil', email: 'contato@solartech.com', plano: 'Pró até 10 vendedores', equipa: 12, status: 'Ativa', pgto: 'Pago' },
  { id: 2, nome: 'Goiás Solar Integrador', email: 'vendas@goiassolar.com', plano: 'Básico até 5 vendedores', equipa: 4, status: 'Ativa', pgto: 'Atrasado' },
  { id: 3, nome: 'Energia Pura Lda', email: 'diretoria@energiapura.com', plano: 'Free [Teste Ilimitado 14 dias]', equipa: 14, status: 'Bloqueada', pgto: 'Free' },
];

// Gráfico Nativo à prova de falhas
const chartData = [
  { name: 'Seg', propostas: 12, height: '40%' }, { name: 'Ter', propostas: 19, height: '65%' }, { name: 'Qua', propostas: 15, height: '50%' },
  { name: 'Qui', propostas: 22, height: '80%' }, { name: 'Sex', propostas: 28, height: '100%' }, { name: 'Sáb', propostas: 9, height: '30%' }, { name: 'Dom', propostas: 4, height: '15%' }
];

// ==========================================
// 3. LAYOUT BASE DO SAAS (Apenas para Master/Empresa)
// ==========================================
const DashboardLayout = ({ children, title, setView, role, currentTab, setCurrentTab }) => {
  return (
    <div className="flex h-screen bg-[#030811] text-slate-100 font-sans selection:bg-orange-500 overflow-hidden">
      <aside className="w-64 bg-[#0B192C] border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-1.5 rounded-lg"><Sun className="w-5 h-5 text-[#0B192C]" /></div>
            <span className="font-extrabold text-white tracking-tight">LD <span className="text-amber-500">SIMULADOR</span></span>
          </div>
          <nav className="p-4 space-y-2">
            <button onClick={() => setCurrentTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'dashboard' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
              <BarChart3 className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-amber-500' : ''}`} /> <span>Dashboard Central</span>
            </button>
            {role === 'master' && (
              <button onClick={() => setCurrentTab('empresas')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'empresas' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                <Building className={`w-5 h-5 ${currentTab === 'empresas' ? 'text-amber-500' : ''}`} /> <span>Gestão de Empresas</span>
              </button>
            )}
            {role === 'empresa' && (
              <>
                <button onClick={() => setCurrentTab('resultados')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'resultados' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <ClipboardList className={`w-5 h-5 ${currentTab === 'resultados' ? 'text-amber-500' : ''}`} /> <span>Resultados (CRM)</span>
                </button>
                <button onClick={() => setCurrentTab('vendedores')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'vendedores' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Users className={`w-5 h-5 ${currentTab === 'vendedores' ? 'text-amber-500' : ''}`} /> <span>Meus Vendedores</span>
                </button>
                <button onClick={() => setCurrentTab('kits')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'kits' ? 'bg-slate-800 text-white border-l-2 border-amber-500' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Zap className={`w-5 h-5 ${currentTab === 'kits' ? 'text-amber-500' : ''}`} /> <span>Gestão de Kits</span>
                </button>
                <div className="pt-4 mt-4 border-t border-slate-800/50">
                  <button onClick={() => window.open('https://wa.me/5562999999999?text=Olá, preciso de ajuda com o painel', '_blank')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400">
                    <MessageCircle className="w-5 h-5" /> <span>Suporte</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setView('login')} className="flex items-center space-x-3 text-slate-500 hover:text-red-400 transition px-4 py-2 w-full text-left font-medium">
            <LogOut className="w-5 h-5" /> <span>Sair com Segurança</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full relative bg-[#030811]">
        <header className="h-20 border-b border-slate-800 bg-[#0B192C]/80 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <div className="flex items-center space-x-4">
            {/* Margem ajustada para telemóveis - Adicionado pr-8 nas classes escondidas no ecrã muito pequeno, visíveis a partir de sm */}
            <div className="text-right hidden sm:block pr-8">
              <p className="text-sm font-bold text-white">{role === 'master' ? 'Super Admin' : 'Admin Empresa'}</p>
              <p className="text-xs text-emerald-400">Online</p>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

// ==========================================
// 4. TELA DE LOGIN 
// ==========================================
const LoginView = ({ setView }) => (
  <div className="min-h-screen bg-[#030811] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.08),transparent_70%)] pointer-events-none"></div>
    <div className="relative z-10 w-full max-w-md bg-[#0B192C]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-2xl mb-4 shadow-lg shadow-orange-500/20"><Sun className="w-8 h-8 text-[#0B192C]" /></div>
        <h2 className="text-2xl font-extrabold text-white">LD <span className="text-amber-500">SIMULADOR SOLAR</span></h2>
        <p className="text-slate-400 text-sm mt-1">Plataforma de Gestão e Vendas</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">E-mail Corporativo</label>
          <input type="email" placeholder="nome@empresa.com" className="w-full bg-[#030811] border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Senha Segura</label>
          <input type="password" placeholder="••••••••" className="w-full bg-[#030811] border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none" />
        </div>
        <button onClick={() => alert("Nesta versão, utilize os atalhos abaixo.")} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3.5 rounded-xl mt-4 transition cursor-pointer">Entrar no Sistema</button>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-800/50">
        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest mb-4">Botões de Teste (Navegação)</p>
        <div className="space-y-3">
          <button onClick={() => setView('master')} className="w-full flex items-center justify-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2.5 rounded-xl transition text-sm font-medium">
            <Building className="w-4 h-4" /> <span>Visão MASTER (Dono)</span>
          </button>
          <button onClick={() => setView('empresa')} className="w-full flex items-center justify-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2.5 rounded-xl transition text-sm font-medium">
            <BarChart3 className="w-4 h-4" /> <span>Visão EMPRESA (Cliente)</span>
          </button>
          <button onClick={() => setView('vendedor')} className="w-full flex items-center justify-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 py-2.5 rounded-xl transition text-sm font-medium">
            <User className="w-4 h-4" /> <span>Visão VENDEDOR (App)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 5. VISÃO MASTER 
// ==========================================
const MasterView = ({ setView }) => {
  const [currentTab, setCurrentTab] = useState('empresas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout title="Visão Master (LD Negócios)" setView={setView} role="master" currentTab={currentTab} setCurrentTab={setCurrentTab}>
      
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Empresas Ativas</p>
                  <h3 className="text-3xl font-extrabold text-white">3</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"><Building className="w-6 h-6 text-emerald-400"/></div>
              </div>
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Total de Vendedores</p>
                  <h3 className="text-3xl font-extrabold text-white">17</h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20"><Users className="w-6 h-6 text-blue-400"/></div>
              </div>
              <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Simulações Geradas</p>
                  <h3 className="text-3xl font-extrabold text-white">8,432</h3>
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
        <div className="bg-[#0B192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
          {/* Ajuste flex-col e sm:flex-row para a barra caber no telemóvel */}
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0B192C]/50">
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
              <div className="relative flex-1 group w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 group-focus-within:text-amber-500" />
                <input 
                  type="text" placeholder="Buscar empresa por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#030811] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-amber-500 outline-none shadow-inner transition"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-40 bg-[#030811] border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-amber-500 outline-none shadow-inner transition cursor-pointer appearance-none">
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativas</option>
                  <option value="blocked">Bloqueadas</option>
              </select>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg w-full sm:w-auto">
              <Plus className="w-4 h-4" /> <span>Nova Empresa</span>
            </button>
          </div>
          
          <div className="overflow-x-auto w-full block">
            <table className="w-full text-left text-sm text-slate-300 min-w-max">
              <thead className="text-[10px] uppercase tracking-widest bg-[#030811] text-slate-500 font-bold border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4">Empresa / Contato</th>
                  <th className="px-6 py-4 text-center">Plano</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {mockEmpresas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-white text-base">{item.nome}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-800 px-3 py-1 rounded-md text-xs font-medium border border-slate-700">{item.plano}</span>
                      <div className="text-xs text-slate-500 mt-1">{item.equipa} ativos</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mx-auto ${item.status === 'Ativa' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
                        {item.status === 'Ativa' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-slate-400 hover:text-white transition p-1" title="Editar / Nova Senha" onClick={() => alert('Abrirá pop-up de edição')}><Settings className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-amber-500 transition p-1" title="Suspender / Bloquear Acesso" onClick={() => alert('Deseja realmente bloquear esta empresa?')}><AlertCircle className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-red-400 transition p-1" title="Login como Empresa (Log as)" onClick={() => setView('empresa')}><LogOut className="w-4 h-4 rotate-180" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL: NOVA EMPRESA */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Cadastrar Nova Empresa</h3>
                 <p className="text-xs text-slate-400 mb-6">Esta ação criará um ambiente separado para o seu cliente.</p>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Fantasia / Razão Social</label>
                     <input type="text" placeholder="Ex: SolarTech Brasil" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Nome do Sócio</label>
                        <input type="text" placeholder="João Silva" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">WhatsApp Responsável</label>
                        <input type="text" placeholder="(00) 00000-0000" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                      </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login Principal)</label>
                     <input type="email" placeholder="contato@empresa.com" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div className="relative group">
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Plano Contratado</label>
                     <select className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 appearance-none cursor-pointer">
                        <option>Free [Teste Ilimitado 14 dias]</option>
                        <option>Básico até 5 vendedores [R$ 100,00]</option>
                        <option>Pró até 10 vendedores [R$ 125,00]</option>
                        <option>Master Ilimitado [R$ 150,00]</option>
                     </select>
                     <span className="absolute inset-y-0 right-0 flex items-center pr-4 pt-5 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3 rounded-xl mt-2 transition">Criar Conta e Enviar Senha</button>
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
// 6. VISÃO EMPRESA
// ==========================================
const EmpresaView = ({ setView }) => {
  const [currentTab, setCurrentTab] = useState('resultados');
  const [dateFilter, setDateFilter] = useState('semana');
  const [resultadosFilter, setResultadosFilter] = useState('7dias');
  const [vendedorFilter, setVendedorFilter] = useState('todos');
  const [isVendedorModalOpen, setIsVendedorModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  return (
    <DashboardLayout title="Painel da Empresa (SolarTech)" setView={setView} role="empresa" currentTab={currentTab} setCurrentTab={setCurrentTab}>
      
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Simulações (Hoje)</p>
              <h3 className="text-4xl font-extrabold text-white mb-1">42</h3>
              <p className="text-xs font-medium text-emerald-400 bg-emerald-400/10 w-max px-2 py-0.5 rounded flex items-center gap-1">+12% vs ontem</p>
            </div>
            
            <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Simulações (Semana)</p>
              <h3 className="text-4xl font-extrabold text-white mb-1">156</h3>
              <p className="text-xs font-medium text-emerald-400 bg-emerald-400/10 w-max px-2 py-0.5 rounded flex items-center gap-1">+5% vs semana ant.</p>
            </div>

            <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Análise de Equipa</p>
                    <h3 className="text-lg font-bold text-white">Desempenho por Vendedor</h3>
                 </div>
                 <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                   <Users className="w-5 h-5 text-blue-400" />
                 </div>
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
                  <button onClick={() => alert('Abrirá calendário para Mês Específico')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white`}><Search className="w-3 h-3"/> Personalizado</button>
                </div>
             </div>
             
             {/* Gráfico de Barras Nativo */}
             <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6">
               {chartData.map((data, index) => (
                 <div key={index} className="flex flex-col items-center w-full group">
                   <div className="w-full relative flex items-end justify-center h-48 bg-[#030811] rounded-t-md border border-slate-800 border-b-0">
                     <div 
                       className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-sm transition-all duration-500 group-hover:opacity-80 relative cursor-pointer"
                       style={{ height: data.height }}
                     >
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-bold shadow-xl transition-all pointer-events-none whitespace-nowrap z-10 border border-slate-700">
                         {data.propostas} Vendas
                       </div>
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
         <div className="bg-[#0B192C] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
            <div className="p-6 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0B192C]/80">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-amber-500"/> Histórico de Orçamentos</h3>
                <p className="text-sm text-slate-400 mt-1">Acompanhe e gira todas as propostas enviadas pela sua equipa.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-48 group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><User className="w-4 h-4" /></span>
                  <select value={vendedorFilter} onChange={(e) => setVendedorFilter(e.target.value)} className="w-full bg-[#030811] border border-slate-700 rounded-xl py-2 pl-9 pr-8 text-sm text-white focus:border-amber-500 outline-none shadow-inner appearance-none cursor-pointer transition">
                     <option value="todos">Todos Vendedores</option>
                     <option value="carlos">Carlos Mendes</option>
                     <option value="ana">Ana Paula</option>
                     <option value="ricardo">Ricardo Alves</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                </div>

                {/* FILTROS UNIFICADOS NUMA SÓ LINHA ESTÉTICA */}
                <div className="flex flex-wrap items-center bg-[#030811] border border-slate-700 rounded-xl p-1 shadow-inner gap-1 w-full sm:w-auto">
                  <button onClick={() => setResultadosFilter('7dias')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '7dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>7 Dias</button>
                  <button onClick={() => setResultadosFilter('15dias')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '15dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>15 Dias</button>
                  <button onClick={() => setResultadosFilter('30dias')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '30dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>30 Dias</button>
                  <button onClick={() => alert('Abrirá calendário para Mês Específico')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white whitespace-nowrap`}><Search className="w-3 h-3"/> Personalizado</button>
                  <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>
                  <button onClick={() => alert('Exportar Excel')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap">
                    <FileSpreadsheet className="w-3.5 h-3.5"/> Exportar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto p-4 max-h-[60vh]">
              <table className="w-full text-left text-sm text-slate-300 min-w-max">
                <thead className="text-[10px] uppercase tracking-widest bg-[#030811] text-slate-500 font-bold border-b border-slate-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Data / Hora</th>
                    <th className="px-4 py-3">Vendedor</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="px-4 py-3">Cidade</th>
                    <th className="px-4 py-3">Estrutura</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Kit Solar</th>
                    <th className="px-4 py-3 rounded-tr-lg text-right">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {mockSimulacoes.map((sim) => (
                    <tr key={sim.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sim.data}</td>
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{sim.vendedor}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{sim.cliente}</td>
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{sim.whatsapp}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.cidade}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.estrutura}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sim.tipo === 'String' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                          {sim.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{sim.kit}</td>
                      <td className="px-4 py-3 text-right font-bold text-amber-500 whitespace-nowrap">{sim.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
      )}

      {currentTab === 'vendedores' && (
        <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-12 text-center shadow-sm relative">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">Gestão de Equipa</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Aqui você poderá cadastrar novos vendedores, editar senhas e bloquear acessos rapidamente.</p>
          <button onClick={() => setIsVendedorModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Cadastrar Novo Vendedor</button>
          
          {isVendedorModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <button onClick={() => setIsVendedorModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Novo Vendedor</h3>
                 <p className="text-xs text-slate-400 mb-6">Crie um acesso para a sua equipa comercial.</p>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Completo do Consultor</label>
                     <input type="text" placeholder="Ex: Carlos Mendes" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login de Acesso)</label>
                     <input type="email" placeholder="carlos@suaempresa.com" className="w-full bg-[#030811] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Senha Provisória Automática</label>
                     <input type="text" readOnly value="Solar@2026" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-amber-500 font-mono text-sm outline-none cursor-not-allowed"/>
                   </div>
                   <button onClick={() => setIsVendedorModalOpen(false)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold py-3 rounded-xl mt-2 transition">Cadastrar Vendedor</button>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}

      {currentTab === 'kits' && (
        <div className="bg-[#0B192C] border border-slate-800 rounded-2xl p-12 text-center shadow-sm relative">
          <Zap className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">Tabela de Preços e Kits</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Atualize os preços de todos os seus vendedores instantaneamente importando a sua planilha de Excel.</p>
          <button onClick={() => setIsUploadModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Fazer Upload de Planilha</button>

          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Atualizar Kits (Excel)</h3>
                 <div className="bg-[#030811] border border-slate-700 rounded-xl p-4 my-4">
                    <p className="text-xs text-slate-300 font-bold mb-2">Instruções:</p>
                    <ol className="text-xs text-slate-400 space-y-1 list-decimal pl-4">
                      <li>Baixe o <a href="#" onClick={(e) => { e.preventDefault(); alert('Iniciaria o download do ficheiro Excel.'); }} className="text-amber-500 hover:underline">Modelo Excel Obrigatório (.xlsx)</a>.</li>
                      <li>Preencha com os seus Kits, Potências e Preços.</li>
                      <li>Não altere os nomes das colunas.</li>
                    </ol>
                 </div>
                 <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition cursor-pointer group">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-500 group-hover:text-amber-500 mb-2 transition" />
                    <p className="text-sm font-bold text-slate-300">Arraste a planilha aqui</p>
                 </div>
                 <button onClick={() => setIsUploadModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl mt-4 border border-slate-700 transition">Cancelar</button>
               </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};


// ==========================================
// 7. VISÃO VENDEDOR (RECONSTRUÇÃO 100% FIEL À FASE 1)
// ==========================================
const VendedorView = ({ setView }) => {
  const [formData, setFormData] = useState({ sellerName: '', kitString: '', kitMicro: '', roofStructure: '', clientName: '', clientWhatsapp: '', clientCity: '' });
  const [timeFilter, setTimeFilter] = useState('hoje'); // Controle do filtro do Mini-Dashboard
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let newFormData = { ...formData, [id]: value };
    if (id === 'kitString' && value !== '') { newFormData.kitMicro = ''; newFormData.roofStructure = ''; } 
    else if (id === 'kitMicro' && value !== '') { newFormData.kitString = ''; newFormData.roofStructure = ''; }
    setFormData(newFormData);
  };

  const activeKit = formData.kitString !== '' ? kitsString[formData.kitString] : formData.kitMicro !== '' ? kitsMicro[formData.kitMicro] : null;

  // Montagem da mensagem em tempo real para a Preview Box
  const buildMessage = () => {
    const clientName = formData.clientName.trim() || '[Nome do Cliente]';
    const clientCity = formData.clientCity.trim() || '[Cidade]';
    const clientWhatsapp = formData.clientWhatsapp.trim() || '[WhatsApp Cliente]';
    const sellerName = formData.sellerName.trim() || '[Nome do Vendedor]';
    const roofStructure = formData.roofStructure || '[Estrutura do Telhado]';
    
    let kitName = '[Kit Selecionado]';
    let placas = '--';
    let modulo = '--';
    let inversor = '--';
    let valor = '--';

    if (activeKit) {
        kitName = activeKit.Kit;
        placas = activeKit.Placas;
        modulo = activeKit.Modulo;
        inversor = activeKit.Inversor;
        valor = `R$ ${activeKit.Valor}`;
    }
    const cleanPotencia = modulo.replace(/Módulo\s*/gi, '').trim();

    return `Empresa: Energia Solar ☀️\n\n` +
           `Segue o seu orçamento personalizado de Energia Solar\n\n` +
           `👤 *Cliente:* ${clientName}\n\n` +
           `📍 *Cidade:* ${clientCity}\n\n` +
           `📱 *Zap:* ${clientWhatsapp}\n\n` +
           `🏠 *Estrutura do Telhado:* ${roofStructure}\n\n` +
           `📦 *Kit Selecionado:* ${kitName}\n\n` +
           `☀️ *Placas:* ${placas}\n\n` +
           `⚡ *Potência:* ${cleanPotencia}\n\n` +
           `🔄 *Inversor:* ${inversor}\n\n` +
           `💰 *Valor do Kit:* ${valor}\n\n` +
           `✨ *Condições Especiais:*\n\n` +
           `💳 Financiamos 100% com Zero de Entrada\n\n` +
           `📅 Primeira parcela com prazo de até 120 dias para começar a pagar\n\n` +
           `💼 Atendido por: *${sellerName}*\n\n` +
           `Ficamos à disposição para esclarecer dúvidas e realizar o seu projeto.`;
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
      
      await addDoc(collection(db, "orcamentos"), {
        data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        vendedor: formData.sellerName,
        cliente: formData.clientName,
        whatsapp: formData.clientWhatsapp,
        cidade: formData.clientCity,
        estrutura: formData.roofStructure,
        tipoKit: formData.kitString !== '' ? 'String' : 'Micro',
        kit: activeKit.Kit,
        valor: activeKit.Valor,
        timestamp: serverTimestamp()
      });

      const textMessage = buildMessage();
      const encodedText = encodeURIComponent(textMessage);
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

      setTimeout(() => { window.open(waUrl, '_blank'); }, 800);
    } catch (error) {
      showToast('Erro ao gravar na nuvem.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030811] text-slate-100 font-sans selection:bg-amber-500 overflow-x-hidden relative">
      
      {/* Toast Animado */}
      {toast && (
        <div className={`fixed top-24 right-5 z-[100] flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white border border-white/10`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      )}

      {/* Header Atualizado para Vendedor */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B192C]/80 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-amber-500 to-amber-300 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                    <Sun className="w-6 h-6 text-[#0B192C]" />
                </div>
                <div>
                    <span className="text-xl font-extrabold tracking-tight text-white block">LD <span className="text-amber-400">SIMULADOR SOLAR</span></span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block -mt-1 font-semibold">Tecnologia Sustentável</span>
                </div>
            </div>
            <nav className="flex space-x-8 text-sm font-medium text-slate-300">
                <button onClick={() => setView('login')} className="hover:text-amber-400 transition flex items-center gap-2"><LogOut className="w-4 h-4"/> Sair do App</button>
            </nav>
        </div>
      </header>

      {/* Secção do Simulador (Fundo bg-mesh replicado) */}
      <section className="py-12 sm:py-20 bg-[#0B192C] border-t border-b border-slate-800 relative min-h-[80vh] flex items-center flex-col" style={{ backgroundImage: 'radial-gradient(at 0% 0%, hsla(210,100%,12%,1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(38,100%,50%,0.08) 0px, transparent 50%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.04),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            
            {/* MINI DASHBOARD DO VENDEDOR AQUI */}
            <div className="bg-[#030811] rounded-3xl border border-slate-700/60 shadow-xl mb-12 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 border-b border-slate-800/80 pb-4">
                <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500"/> O Meu Desempenho
                </h2>
                <div className="bg-[#0B192C] rounded-xl p-1 flex text-xs font-bold border border-slate-700 shadow-inner">
                  <button onClick={() => setTimeFilter('hoje')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'hoje' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Hoje</button>
                  <button onClick={() => setTimeFilter('semana')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'semana' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Semana</button>
                  <button onClick={() => setTimeFilter('quinzena')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'quinzena' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Quinzena</button>
                  <button onClick={() => setTimeFilter('mes')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'mes' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Mês</button>
                  <button onClick={() => alert('Abrirá calendário para Mês Específico')} className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-slate-400 hover:text-white whitespace-nowrap`}><Search className="w-3 h-3"/> Personalizado</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Propostas</p>
                    <p className="text-2xl font-extrabold text-white">{timeFilter === 'hoje' ? '8' : timeFilter === 'semana' ? '34' : '142'}</p>
                 </div>
                 <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits String</p>
                    <p className="text-2xl font-extrabold text-blue-400">{timeFilter === 'hoje' ? '5' : timeFilter === 'semana' ? '20' : '90'}</p>
                 </div>
                 <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits Micro</p>
                    <p className="text-2xl font-extrabold text-emerald-400">{timeFilter === 'hoje' ? '3' : timeFilter === 'semana' ? '14' : '52'}</p>
                 </div>
                 <div className="bg-[#0B192C] p-4 rounded-2xl border border-slate-800/50 shadow-sm flex flex-col justify-center items-center sm:items-start">
                    <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Status Meta</p>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-400/20 mt-1"><CheckCircle className="w-3 h-3"/> No Ritmo</span>
                 </div>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold tracking-widest uppercase mb-4">NOVO ORÇAMENTO</span>
                <p className="text-slate-300 mt-2 text-sm sm:text-base">Insira os dados do cliente, escolha o kit desejado e envie a proposta de forma imediata.</p>
            </div>

            <div className="bg-[#030811] rounded-3xl border border-slate-700/60 shadow-[0_0_25px_rgba(245,166,35,0.1)] overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
                    
                    {/* 1. DADOS DO VENDEDOR */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                            <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">1</span>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Consultor</h4>
                        </div>
                        <div>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-amber-400 transition-colors"><User className="w-5 h-5"/></span>
                                <input type="text" id="sellerName" value={formData.sellerName} onChange={handleInputChange} placeholder="Digite o seu nome completo" 
                                       className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                            </div>
                        </div>
                    </div>

                    {/* 2. CONFIGURAÇÃO DO SISTEMA */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                            <span className="bg-amber-500/20 border border-amber-500/30 text-amber-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">2</span>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Configuração</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-amber-400"><Zap className="w-4 h-4"/></span>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">1: Kits String *</label>
                                <select id="kitString" value={formData.kitString} onChange={handleInputChange} className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white transition outline-none appearance-none shadow-inner cursor-pointer">
                                    <option value="" disabled>-- Selecione Kit String --</option>
                                    {kitsString.map((k, i) => <option key={i} value={i}>{k.Kit} - R$ {k.Valor}</option>)}
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 mt-6 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                            </div>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-amber-400"><Zap className="w-4 h-4"/></span>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">2: Kits Micro *</label>
                                <select id="kitMicro" value={formData.kitMicro} onChange={handleInputChange} className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white transition outline-none appearance-none shadow-inner cursor-pointer">
                                    <option value="" disabled>-- Selecione Kit Micro --</option>
                                    {kitsMicro.map((k, i) => <option key={i} value={i}>{k.Kit} - R$ {k.Valor}</option>)}
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 mt-6 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                            </div>
                        </div>
                        <div>
                            <div className="relative group">
                                <label className="block text-xs font-semibold text-slate-300 mb-2">Estrutura do Telhado *</label>
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-amber-400 transition-colors"><Building className="w-4 h-4"/></span>
                                <select id="roofStructure" value={formData.roofStructure} onChange={handleInputChange} className="w-full bg-[#0B192C] border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white transition outline-none appearance-none shadow-inner cursor-pointer">
                                    <option value="" disabled>-- Selecione a Estrutura --</option>
                                    <option value="Madeira">1: Madeira</option>
                                    <option value="Ferro">2: Ferro</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 mt-6 pointer-events-none text-slate-400"><ChevronDown className="w-4 h-4"/></span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#0B192C] to-slate-900 border border-slate-700/80 rounded-2xl p-6 mt-2 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden shadow-lg">
                            <div className="absolute -right-8 -bottom-8 text-slate-800/40 pointer-events-none transform rotate-12"><Sun className="w-48 h-48"/></div>
                            
                            <div className="space-y-1.5 relative z-10">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">
                                    Qtd. Placas
                                </span>
                                <span id="detail-placas" className="text-lg font-extrabold text-white block">{activeKit ? activeKit.Placas : '--'}</span>
                            </div>

                            <div className="space-y-1.5 relative z-10">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">
                                    Potência
                                </span>
                                <span id="detail-modulo" className="text-lg font-extrabold text-white truncate max-w-full block">{activeKit ? activeKit.Modulo.replace(/Módulo\s*/gi, '').trim() : '--'}</span>
                            </div>

                            <div className="space-y-1.5 relative z-10">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">
                                    Inversor
                                </span>
                                <span id="detail-inversor" className="text-lg font-extrabold text-white truncate max-w-full block">{activeKit ? activeKit.Inversor : '--'}</span>
                            </div>

                            <div className="space-y-1.5 relative z-10">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1.5">
                                    <span className="text-emerald-600">Valor do Kit</span>
                                </span>
                                <span className="text-lg font-extrabold text-emerald-400 block">{activeKit ? `R$ ${activeKit.Valor}` : '--'}</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. DADOS DO CLIENTE */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                            <span className="bg-orange-500/20 border border-orange-500/30 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">3</span>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cliente</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="relative group">
                                <label className="block text-xs font-semibold text-slate-300 mb-2">Nome do Cliente *</label>
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-orange-500 transition-colors"><User className="w-4 h-4"/></span>
                                <input type="text" id="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Nome do Cliente" 
                                       className="w-full bg-[#0B192C] border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
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
                                  }} placeholder="(00) 00000-0000" 
                                       className="w-full bg-[#0B192C] border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-semibold text-slate-300 mb-2">Cidade / Estado *</label>
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 mt-6 text-slate-400 group-focus-within:text-orange-500 transition-colors"><MapPin className="w-4 h-4"/></span>
                                <input type="text" id="clientCity" value={formData.clientCity} onChange={handleInputChange} placeholder="Cidade - Estado" 
                                       className="w-full bg-[#0B192C] border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition outline-none shadow-inner" />
                            </div>
                        </div>
                    </div>

                    {/* CAIXA DE PREVIEW */}
                    <div className="bg-[#0B192C]/50 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>Visualização da Mensagem</span>
                        </div>
                        <div className="bg-[#030811] p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-none max-h-64 overflow-y-auto shadow-inner">
                            {buildMessage()}
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div>
                        <button type="submit" className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-extrabold text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(245,166,35,0.2)] hover:scale-[1.02] active:scale-[0.98]">
                            Enviar Proposta WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </section>

    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('login'); 
  return (
    <div className="font-sans antialiased bg-[#030811] min-h-screen w-full select-none">
      {currentView === 'login' && <LoginView setView={setCurrentView} />}
      {currentView === 'master' && <MasterView setView={setCurrentView} />}
      {currentView === 'empresa' && <EmpresaView setView={setCurrentView} />}
      {currentView === 'vendedor' && <VendedorView setView={setCurrentView} />}
    </div>
  );
}
