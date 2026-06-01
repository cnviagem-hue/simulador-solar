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

// Dados Gráfico Nativo (Sem dependências externas)
const chartData = [
  { name: 'Seg', propostas: 12, height: '40%' }, 
  { name: 'Ter', propostas: 19, height: '65%' }, 
  { name: 'Qua', propostas: 15, height: '50%' },
  { name: 'Qui', propostas: 22, height: '80%' }, 
  { name: 'Sex', propostas: 28, height: '100%' }, 
  { name: 'Sáb', propostas: 9, height: '30%' }, 
  { name: 'Dom', propostas: 4, height: '15%' }
];

// ==========================================
// 3. LAYOUT BASE (O Design Lindo que Aprovámos)
// ==========================================
const DashboardLayout = ({ children, title, setView, role, currentTab, setCurrentTab }) => {
  return (
    <div className="flex h-screen bg-[#0B192C] text-slate-100 font-sans selection:bg-orange-500 overflow-hidden">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
            <div className="bg-orange-500 p-1.5 rounded-lg"><Sun className="w-5 h-5 text-slate-900" /></div>
            <span className="font-extrabold text-white tracking-tight">LD <span className="text-orange-500">SIMULADOR SOLAR</span></span>
          </div>
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setCurrentTab('dashboard')} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
              <BarChart3 className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-orange-400' : ''}`} /> <span>Dashboard Central</span>
            </button>
            {role === 'master' && (
              <button 
                onClick={() => setCurrentTab('empresas')} 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'empresas' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                <Building className={`w-5 h-5 ${currentTab === 'empresas' ? 'text-orange-400' : ''}`} /> <span>Gestão de Empresas</span>
              </button>
            )}
            {role === 'empresa' && (
              <>
                <button 
                  onClick={() => setCurrentTab('resultados')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'resultados' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                  <ClipboardList className={`w-5 h-5 ${currentTab === 'resultados' ? 'text-orange-400' : ''}`} /> <span>Resultados (CRM)</span>
                </button>
                <button 
                  onClick={() => setCurrentTab('vendedores')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'vendedores' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                  <Users className={`w-5 h-5 ${currentTab === 'vendedores' ? 'text-orange-400' : ''}`} /> <span>Meus Vendedores</span>
                </button>
                <button 
                  onClick={() => setCurrentTab('kits')} 
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'kits' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                  <Zap className={`w-5 h-5 ${currentTab === 'kits' ? 'text-orange-400' : ''}`} /> <span>Gestão de Kits</span>
                </button>

                <div className="pt-4 mt-4 border-t border-slate-800/50">
                  <p className="px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Ajuda & Suporte</p>
                  <button 
                    onClick={() => setCurrentTab('tutorial')} 
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${currentTab === 'tutorial' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                    <BookOpen className={`w-5 h-5 ${currentTab === 'tutorial' ? 'text-orange-400' : ''}`} /> <span>Tutorial do Sistema</span>
                  </button>
                  <button 
                    onClick={() => window.open('https://wa.me/5562999999999?text=Olá, preciso de ajuda com o painel do Simulador Solar SaaS', '_blank')} 
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400`}>
                    <MessageCircle className="w-5 h-5" /> <span>Suporte via WhatsApp</span>
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

      {/* Área Principal */}
      <main className="flex-1 flex flex-col h-full relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,166,35,0.03),transparent_50%)] pointer-events-none"></div>
        <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{role === 'master' ? 'Super Admin' : role === 'empresa' ? 'Admin Empresa' : 'Consultor(a)'}</p>
              <p className="text-xs text-emerald-400">Online</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative z-10">
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
    <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex bg-gradient-to-br from-orange-400 to-amber-600 p-3 rounded-2xl mb-4 shadow-lg shadow-orange-500/20"><Sun className="w-8 h-8 text-slate-950" /></div>
        <h2 className="text-2xl font-extrabold text-white">LD <span className="text-orange-500">SIMULADOR SOLAR</span></h2>
        <p className="text-slate-400 text-sm mt-1">Plataforma de Gestão e Vendas</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">E-mail Corporativo</label>
          <input type="email" placeholder="nome@empresa.com" className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Senha Segura</label>
          <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none" />
        </div>
        <button onClick={() => alert("Nesta versão, utilize os botões abaixo para aceder aos diferentes perfis.")} className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-3.5 rounded-xl mt-4 transition cursor-pointer">Entrar no Sistema</button>
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
          <button onClick={() => setView('vendedor')} className="w-full flex items-center justify-center space-x-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 py-2.5 rounded-xl transition text-sm font-medium">
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
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout title="Visão Master (LD Negócios)" setView={setView} role="master" currentTab={currentTab} setCurrentTab={setCurrentTab}>
      
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Empresas Ativas</p>
                  <h3 className="text-3xl font-extrabold text-white">24</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"><Building className="w-6 h-6 text-emerald-400"/></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Total de Vendedores</p>
                  <h3 className="text-3xl font-extrabold text-white">156</h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20"><Users className="w-6 h-6 text-blue-400"/></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Simulações Geradas</p>
                  <h3 className="text-3xl font-extrabold text-white">8,432</h3>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20"><Zap className="w-6 h-6 text-orange-400"/></div>
              </div>
           </div>
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-sm">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <h3 className="text-xl font-bold text-white mb-2">Resumo de Crescimento</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">Vá para a aba "Gestão de Empresas" no menu lateral para visualizar, filtrar, adicionar ou bloquear clientes do sistema SaaS.</p>
              <button onClick={() => setCurrentTab('empresas')} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Ir para Gestão de Empresas</button>
           </div>
        </div>
      )}

      {currentTab === 'empresas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50">
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 group-focus-within:text-orange-400" />
                <input 
                  type="text" placeholder="Buscar empresa por nome ou email..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-orange-500 outline-none shadow-inner transition"
                />
              </div>
              <select className="bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-orange-500 outline-none shadow-inner transition sm:w-40">
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativas</option>
                  <option value="blocked">Bloqueadas</option>
              </select>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg w-full sm:w-auto">
              <Plus className="w-4 h-4" /> <span>Nova Empresa</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[10px] uppercase tracking-widest bg-slate-950 text-slate-500 font-bold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Empresa / Contato</th>
                  <th className="px-6 py-4 text-center">Plano</th>
                  <th className="px-6 py-4 text-center">Equipa</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-white text-base">SolarTech Brasil {item}</div>
                      <div className="text-xs text-slate-500 mt-0.5">contato@solartech{item}.com</div>
                    </td>
                    <td className="px-6 py-4 text-center"><span className="bg-slate-800 px-3 py-1 rounded-md text-xs font-medium border border-slate-700">Pro 50</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-slate-300 font-bold">12</span> <span className="text-xs text-slate-500">ativos</span></td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center space-x-1.5 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mx-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Ativa</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-slate-400 hover:text-white transition p-1" title="Editar / Nova Senha"><Settings className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-orange-400 transition p-1" title="Suspender / Bloquear Acesso"><AlertCircle className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-red-400 transition p-1" title="Login como Empresa (Log as)"><LogOut className="w-4 h-4 rotate-180" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL: NOVA EMPRESA */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Cadastrar Nova Empresa</h3>
                 <p className="text-xs text-slate-400 mb-6">Esta ação criará um ambiente separado para o seu cliente.</p>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Fantasia / Razão Social</label>
                     <input type="text" placeholder="Ex: SolarTech Brasil" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Nome do Sócio</label>
                        <input type="text" placeholder="João Silva" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">WhatsApp Responsável</label>
                        <input type="text" placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                      </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login Principal)</label>
                     <input type="email" placeholder="contato@empresa.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Plano Contratado</label>
                     <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500">
                        <option>Plano Free (Até 1 Vendedor)</option>
                        <option>Plano Básico (Até 5 Vendedores)</option>
                        <option>Plano Pro (Até 20 Vendedores)</option>
                        <option>Plano Ilimitado</option>
                     </select>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-3 rounded-xl mt-2 transition">Criar Conta e Enviar Senha</button>
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
  const [currentTab, setCurrentTab] = useState('dashboard');
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Simulações (Hoje)</p>
              <h3 className="text-4xl font-extrabold text-white mb-1">42</h3>
              <p className="text-xs font-medium text-emerald-400 bg-emerald-400/10 w-max px-2 py-0.5 rounded flex items-center gap-1">+12% vs ontem</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Simulações (Semana)</p>
              <h3 className="text-4xl font-extrabold text-white mb-1">156</h3>
              <p className="text-xs font-medium text-emerald-400 bg-emerald-400/10 w-max px-2 py-0.5 rounded flex items-center gap-1">+5% vs semana ant.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col justify-center">
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

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">Desempenho Geral</h3>
                <div className="bg-slate-950 border border-slate-700 rounded-xl p-1 inline-flex shadow-inner">
                  <button onClick={() => setDateFilter('semana')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'semana' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Últimos 7 dias</button>
                  <button onClick={() => setDateFilter('mes')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'mes' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Este Mês</button>
                  <button onClick={() => alert('[MOCKUP] Na versão final com banco de dados, este botão abrirá um calendário interativo para o utilizador.')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white`}><Search className="w-3 h-3"/> Personalizado</button>
                </div>
             </div>
             
             {/* Gráfico de Barras Nativo (100% à prova de falhas, sem bibliotecas externas) */}
             <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6">
               {chartData.map((data, index) => (
                 <div key={index} className="flex flex-col items-center w-full group">
                   <div className="w-full relative flex items-end justify-center h-48 bg-slate-950 rounded-t-md border border-slate-800 border-b-0">
                     <div 
                       className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500 group-hover:from-orange-500 group-hover:to-orange-300 relative cursor-pointer"
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
          <div className="p-6 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/80">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-orange-500"/> Histórico de Orçamentos</h3>
              <p className="text-sm text-slate-400 mt-1">Acompanhe e gira todas as propostas enviadas pela sua equipa.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-48 group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><User className="w-4 h-4" /></span>
                <select value={vendedorFilter} onChange={(e) => setVendedorFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-8 text-sm text-white focus:border-orange-500 outline-none shadow-inner appearance-none cursor-pointer transition">
                   <option value="todos">Todos Vendedores</option>
                   <option value="carlos">Carlos Mendes</option>
                   <option value="ana">Ana Paula</option>
                   <option value="ricardo">Ricardo Alves</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
              </div>
              <div className="bg-slate-950 border border-slate-700 rounded-xl p-1 inline-flex shadow-inner overflow-x-auto w-full sm:w-auto">
                <button onClick={() => setResultadosFilter('7dias')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '7dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>7 Dias</button>
                <button onClick={() => setResultadosFilter('15dias')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '15dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>15 Dias</button>
                <button onClick={() => setResultadosFilter('30dias')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${resultadosFilter === '30dias' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>30 Dias</button>
                <button onClick={() => alert('[MOCKUP] Aqui abrirá um seletor de Data Inicial e Data Final para filtrar as propostas.')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white whitespace-nowrap`}><Search className="w-3 h-3"/> Mês Específico</button>
              </div>
              <button onClick={() => alert('[MOCKUP] Este botão exportará a tabela abaixo para o formato Excel.')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2 w-full sm:w-auto justify-center">
                <FileSpreadsheet className="w-4 h-4"/> Baixar Excel
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto p-4 max-h-[60vh]">
            <table className="w-full text-left text-sm text-slate-300 min-w-max">
              <thead className="text-[10px] uppercase tracking-widest bg-slate-950 text-slate-500 font-bold border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg whitespace-nowrap">Data / Hora</th>
                  <th className="px-4 py-3 whitespace-nowrap">Vendedor</th>
                  <th className="px-4 py-3 whitespace-nowrap">Cliente</th>
                  <th className="px-4 py-3 whitespace-nowrap">WhatsApp</th>
                  <th className="px-4 py-3 whitespace-nowrap">Cidade</th>
                  <th className="px-4 py-3 whitespace-nowrap">Estrutura</th>
                  <th className="px-4 py-3 whitespace-nowrap">Tipo</th>
                  <th className="px-4 py-3 whitespace-nowrap">Kit Solar</th>
                  <th className="px-4 py-3 rounded-tr-lg whitespace-nowrap text-right">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {mockSimulacoes.map((sim) => (
                  <tr key={sim.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sim.data}</td>
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{sim.vendedor}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{sim.cliente}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{sim.whatsapp}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.cidade}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.estrutura}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sim.tipo === 'String' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {sim.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{sim.kit}</td>
                    <td className="px-4 py-3 text-right font-bold text-orange-400 whitespace-nowrap">{sim.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === 'vendedores' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-sm relative">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">Gestão de Equipa</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Aqui você poderá cadastrar novos vendedores, editar senhas e bloquear acessos rapidamente.</p>
          <button onClick={() => setIsVendedorModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Cadastrar Novo Vendedor</button>
          
          {isVendedorModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                 <button onClick={() => setIsVendedorModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Novo Vendedor</h3>
                 <p className="text-xs text-slate-400 mb-6">Crie um acesso para a sua equipa comercial.</p>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Nome Completo do Consultor</label>
                     <input type="text" placeholder="Ex: Carlos Mendes" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">E-mail (Login de Acesso)</label>
                     <input type="email" placeholder="carlos@suaempresa.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 mb-1 block">Senha Provisória Automática</label>
                     <input type="text" readOnly value="Solar@2026" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-orange-400 font-mono text-sm outline-none cursor-not-allowed"/>
                   </div>
                   <button onClick={() => setIsVendedorModalOpen(false)} className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-3 rounded-xl mt-2 transition">Cadastrar Vendedor</button>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}

      {currentTab === 'kits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-sm relative">
          <Zap className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">Tabela de Preços e Kits</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Atualize os preços de todos os seus vendedores instantaneamente importando a sua planilha de Excel.</p>
          <button onClick={() => setIsUploadModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Fazer Upload de Planilha</button>

          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Atualizar Kits (Excel)</h3>
                 <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 my-4">
                    <p className="text-xs text-slate-300 font-bold mb-2">Instruções:</p>
                    <ol className="text-xs text-slate-400 space-y-1 list-decimal pl-4">
                      <li>Baixe o Modelo Excel Obrigatório.</li>
                      <li>Preencha com os seus Kits, Potências e Preços.</li>
                      <li>Não altere os nomes das colunas.</li>
                    </ol>
                 </div>
                 <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition cursor-pointer group">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-500 group-hover:text-orange-400 mb-2 transition" />
                    <p className="text-sm font-bold text-slate-300">Arraste a planilha aqui</p>
                 </div>
                 <button onClick={() => setIsUploadModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl mt-4 border border-slate-700 transition">Cancelar</button>
               </div>
            </div>
          )}
        </div>
      )}
      
      {currentTab === 'tutorial' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Central de Treinamento</h2>
            <p className="text-slate-400 text-sm mb-6">Aprenda a tirar o máximo de proveito da plataforma de gestão.</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// ==========================================
// 7. VISÃO VENDEDOR (Simulador Real)
// ==========================================
const VendedorView = ({ setView }) => {
  const [formData, setFormData] = useState({ sellerName: '', kitString: '', kitMicro: '', roofStructure: '', clientName: '', clientWhatsapp: '', clientCity: '' });
  const [timeFilter, setTimeFilter] = useState('hoje');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sellerName || (!formData.kitString && !formData.kitMicro) || !formData.roofStructure || !formData.clientName || !formData.clientWhatsapp || !formData.clientCity) {
      return showToast("Preencha todos os campos obrigatórios!");
    }

    const kitSelecionado = formData.kitString !== '' ? kitsString[formData.kitString] : kitsMicro[formData.kitMicro];
    const tipoKit = formData.kitString !== '' ? 'String' : 'Micro';
    const cleanPotencia = kitSelecionado.Modulo.replace(/Módulo\s*/gi, '').trim();

    const dados = {
      vendedor: formData.sellerName,
      cliente: formData.clientName,
      whatsapp: formData.clientWhatsapp,
      cidade: formData.clientCity,
      estrutura: formData.roofStructure,
      tipoKit: tipoKit,
      kit: kitSelecionado.Kit,
      valor: `R$ ${kitSelecionado.Valor}`,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "orcamentos"), dados);
      
      const texto = `Empresa: Energia Solar ☀️\n\n` +
                    `Segue o seu orçamento personalizado de Energia Solar\n\n` +
                    `👤 *Cliente:* ${formData.clientName}\n\n` +
                    `📍 *Cidade:* ${formData.clientCity}\n\n` +
                    `📱 *Zap:* ${formData.clientWhatsapp}\n\n` +
                    `🏠 *Estrutura do Telhado:* ${formData.roofStructure}\n\n` +
                    `📦 *Kit Selecionado:* ${kitSelecionado.Kit}\n\n` +
                    `☀️ *Placas:* ${kitSelecionado.Placas}\n\n` +
                    `⚡ *Potência:* ${cleanPotencia}\n\n` +
                    `🔄 *Inversor:* ${kitSelecionado.Inversor}\n\n` +
                    `💰 *Valor do Kit:* R$ ${kitSelecionado.Valor}\n\n` +
                    `✨ *Condições Especiais:*\n\n` +
                    `💳 Financiamos 100% com Zero de Entrada\n\n` +
                    `📅 Primeira parcela com prazo de até 120 dias para começar a pagar\n\n` +
                    `💼 Atendido por: *${formData.sellerName}*\n\n` +
                    `Ficamos à disposição para esclarecer dúvidas e realizar o seu projeto.`;
                    
      const numZap = '55' + formData.clientWhatsapp.replace(/\D/g, '');
      setTimeout(() => { window.open(`https://api.whatsapp.com/send?phone=${numZap}&text=${encodeURIComponent(texto)}`, '_blank'); }, 500);
      setFormData({...formData, clientName: '', clientWhatsapp: '', clientCity: '', roofStructure: '', kitString: '', kitMicro: ''});
    } catch (error) {
      showToast("Erro ao salvar orçamento. Tente novamente.");
    }
  };

  const activeKit = formData.kitString !== '' ? kitsString[formData.kitString] : formData.kitMicro !== '' ? kitsMicro[formData.kitMicro] : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-orange-500 overflow-x-hidden relative">
      
      {toast && (
        <div className={`fixed top-24 right-5 z-[100] flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} text-white border border-white/10`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-1.5 rounded-lg shadow-lg shadow-orange-500/20"><Sun className="w-5 h-5 text-slate-900" /></div>
            <span className="font-extrabold text-white text-lg tracking-tight">LD <span className="text-orange-400">SIMULADOR SOLAR</span></span>
          </div>
          <button onClick={() => setView('login')} className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs font-bold hidden sm:block">Sair do App</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 border-b border-slate-800/80 pb-4">
              <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500"/> O Meu Desempenho
              </h2>
              <div className="bg-slate-950 rounded-xl p-1 flex text-xs font-bold border border-slate-700 shadow-inner">
                <button onClick={() => setTimeFilter('hoje')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'hoje' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Hoje</button>
                <button onClick={() => setTimeFilter('semana')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'semana' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Semana</button>
                <button onClick={() => setTimeFilter('mes')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'mes' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Mês</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Propostas</p>
                  <p className="text-2xl font-extrabold text-white">12</p>
               </div>
               <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits String</p>
                  <p className="text-2xl font-extrabold text-blue-400">8</p>
               </div>
               <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits Micro</p>
                  <p className="text-2xl font-extrabold text-emerald-400">4</p>
               </div>
               <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm flex flex-col justify-center items-center sm:items-start">
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Status Meta</p>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-400/20 mt-1"><CheckCircle className="w-3 h-3"/> No Ritmo</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-slate-800/20 opacity-50"><Sun className="w-48 h-48" /></div>
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                  <span className="bg-blue-500/10 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border border-blue-500/20">1</span>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Consultor</h4>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500"><User className="w-4 h-4" /></span>
                  <input type="text" id="sellerName" value={formData.sellerName} onChange={handleInputChange} placeholder="Seu Nome Completo" className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                  <span className="bg-orange-500/20 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border border-orange-500/30">2</span>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Configuração</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-500"><Zap className="w-4 h-4" /></span>
                    <select id="kitString" value={formData.kitString} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white appearance-none outline-none shadow-inner transition cursor-pointer">
                      <option value="" disabled>-- Selecione Kit String --</option>
                      {kitsString.map((k, i) => <option key={i} value={i}>{k.Kit} - R$ {k.Valor}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-4 top-4 text-slate-500 pointer-events-none" />
                  </div>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-500"><Zap className="w-4 h-4" /></span>
                    <select id="kitMicro" value={formData.kitMicro} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white appearance-none outline-none shadow-inner transition cursor-pointer">
                      <option value="" disabled>-- Selecione Kit Micro --</option>
                      {kitsMicro.map((k, i) => <option key={i} value={i}>{k.Kit} - R$ {k.Valor}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-4 top-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="relative group mt-4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-orange-500"><Building className="w-4 h-4" /></span>
                    <select id="roofStructure" value={formData.roofStructure} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white appearance-none outline-none shadow-inner transition cursor-pointer">
                      <option value="" disabled>-- Estrutura do Telhado --</option>
                      <option value="Madeira">Madeira</option>
                      <option value="Ferro">Ferro</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-4 top-4 text-slate-500 pointer-events-none" />
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mt-4 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden shadow-inner">
                   <div className="space-y-1.5 relative z-10">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Qtd. Placas</span>
                      <span className="text-lg font-extrabold text-white block">{activeKit ? activeKit.Placas : '--'}</span>
                   </div>
                   <div className="space-y-1.5 relative z-10">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Potência</span>
                      <span className="text-lg font-extrabold text-white block truncate">{activeKit ? activeKit.Modulo.replace(/Módulo\s*/gi, '').trim() : '--'}</span>
                   </div>
                   <div className="space-y-1.5 relative z-10">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Inversor</span>
                      <span className="text-lg font-extrabold text-white block truncate">{activeKit ? activeKit.Inversor : '--'}</span>
                   </div>
                   <div className="space-y-1.5 relative z-10">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Valor do Kit</span>
                      <span className="text-lg font-extrabold text-emerald-400 block">R$ {activeKit ? activeKit.Valor : '--'}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                  <span className="bg-amber-500/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border border-amber-500/30">3</span>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Cliente</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-amber-500"><User className="w-4 h-4" /></span>
                    <input type="text" id="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Nome Completo" className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
                  </div>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-amber-500"><Smartphone className="w-4 h-4" /></span>
                    <input type="tel" id="clientWhatsapp" value={formData.clientWhatsapp} onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 11) val = val.substring(0, 11);
                      let formatted = val.length > 0 ? '(' + val.substring(0, 2) : '';
                      if (val.length > 2) formatted += ') ' + val.substring(2, 7);
                      if (val.length > 7) formatted += '-' + val.substring(7, 11);
                      setFormData({...formData, clientWhatsapp: formatted});
                    }} placeholder="WhatsApp" className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
                  </div>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-amber-500"><MapPin className="w-4 h-4" /></span>
                    <input type="text" id="clientCity" value={formData.clientCity} onChange={handleInputChange} placeholder="Cidade - Estado" className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-lg rounded-2xl transition duration-300 shadow-xl shadow-orange-500/20 transform hover:-translate-y-0.5">
                Enviar Proposta
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('login'); 

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

  return (
    <div className="font-sans antialiased bg-[#030811] min-h-screen w-full select-none">
      {currentView === 'login' && <LoginView setView={setCurrentView} />}
      {currentView === 'master' && <MasterView setView={setCurrentView} />}
      {currentView === 'empresa' && <EmpresaView setView={setCurrentView} />}
      {currentView === 'vendedor' && <VendedorView setView={setCurrentView} />}
    </div>
  );
}
