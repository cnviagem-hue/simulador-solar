import React, { useState, useEffect } from 'react';
import { Search, Building, Users, Zap, Plus, Settings, AlertCircle, LogOut, CheckCircle2, ChevronDown, User, Smartphone, MapPin, BarChart3, Sun, FileSpreadsheet, ClipboardList, MessageCircle, BookOpen } from 'lucide-react';
import { BarChart, Bar, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

// --- CONFIGURAÇÃO FIREBASE ---
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

// --- DADOS FALSOS (MOCK DASHBOARD) ---
const chartData = [
  { name: 'Seg', propostas: 12 }, { name: 'Ter', propostas: 19 }, { name: 'Qua', propostas: 15 },
  { name: 'Qui', propostas: 22 }, { name: 'Sex', propostas: 28 }, { name: 'Sáb', propostas: 9 }, { name: 'Dom', propostas: 4 }
];

// --- LISTA COMPLETA DE KITS ---
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
  { Kit: 'KIT MICRO 230KWh', Placas: '3', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '7.725,81' },
  { Kit: 'KIT MICRO 310KWh', Placas: '4', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '8.342,16' },
  { Kit: 'KIT MICRO 390KWh', Placas: '5', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '9.620,01' },
  { Kit: 'KIT MICRO 460KWh', Placas: '6', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '10.236,36' },
  { Kit: 'KIT MICRO 540KWh', Placas: '7', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '12.679,71' },
  { Kit: 'KIT MICRO 620KWh', Placas: '8', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '13.924,63' },
  { Kit: 'KIT MICRO 690KWh', Placas: '9', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '14.734,62' },
  { Kit: 'KIT MICRO 770KWh', Placas: '10', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '15.579,54' },
  { Kit: 'KIT MICRO 840KWh', Placas: '11', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '16.424,46' },
  { Kit: 'KIT MICRO 920KWh', Placas: '12', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '17.269,38' },
  { Kit: 'KIT MICRO 1000KWh', Placas: '13', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '20.136,94' },
  { Kit: 'KIT MICRO 1070KWh', Placas: '14', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '21.264,26' },
  { Kit: 'KIT MICRO 1150KWh', Placas: '15', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '22.130,75' },
  { Kit: 'KIT MICRO 1230KWh', Placas: '16', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '22.997,24' },
  { Kit: 'KIT MICRO 1300KWh', Placas: '17', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '24.005,01' },
  { Kit: 'KIT MICRO 1380KWh', Placas: '18', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '24.871,51' },
  { Kit: 'KIT MICRO 1450KWh', Placas: '19', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '28.057,52' },
  { Kit: 'KIT MICRO 1530KWh', Placas: '20', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '28.924,01' },
  { Kit: 'KIT MICRO 1610KWh', Placas: '21', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '30.160,35' },
  { Kit: 'KIT MICRO 1680KWh', Placas: '22', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '31.026,84' },
  { Kit: 'KIT MICRO 1760KWh', Placas: '23', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '31.893,35' },
  { Kit: 'KIT MICRO 1840KWh', Placas: '24', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '32.759,84' },
  { Kit: 'KIT MICRO 1910KWh', Placas: '25', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '35.397,73' },
  { Kit: 'KIT MICRO 1990KWh', Placas: '26', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '37.010,76' },
  { Kit: 'KIT MICRO 2060KWh', Placas: '27', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '37.877,26' },
  { Kit: 'KIT MICRO 2140KWh', Placas: '28', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '38.743,75' },
  { Kit: 'KIT MICRO 2220KWh', Placas: '29', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '39.751,52' },
  { Kit: 'KIT MICRO 2290KWh', Placas: '30', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '40.618,01' },
  { Kit: 'KIT MICRO 2370KWh', Placas: '31', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '44.043,20' },
  { Kit: 'KIT MICRO 2450KWh', Placas: '32', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '45.170,51' },
  { Kit: 'KIT MICRO 2520KWh', Placas: '33', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '46.178,29' },
  { Kit: 'KIT MICRO 2600KWh', Placas: '34', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '47.044,78' },
  { Kit: 'KIT MICRO 2670KWh', Placas: '35', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '47.911,28' },
  { Kit: 'KIT MICRO 2750KWh', Placas: '36', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '48.777,77' },
  { Kit: 'KIT MICRO 2830KWh', Placas: '37', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '51.844,23' },
  { Kit: 'KIT MICRO 2900KWh', Placas: '38', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '52.971,55' },
  { Kit: 'KIT MICRO 2980KWh', Placas: '39', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '53.838,05' },
  { Kit: 'KIT MICRO 3060KWh', Placas: '40', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '54.704,54' },
  { Kit: 'KIT MICRO 3130KWh', Placas: '41', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '56.069,45' },
  { Kit: 'KIT MICRO 3210KWh', Placas: '42', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '56.935,94' },
  { Kit: 'KIT MICRO 3280KWh', Placas: '43', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '59.432,56' },
  { Kit: 'KIT MICRO 3360KWh', Placas: '44', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '60.559,88' },
  { Kit: 'KIT MICRO 3440KWh', Placas: '45', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '61.567,65' },
  { Kit: 'KIT MICRO 3510KWh', Placas: '46', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '62.434,14' },
  { Kit: 'KIT MICRO 3590KWh', Placas: '47', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '63.300,64' },
  { Kit: 'KIT MICRO 3670KWh', Placas: '48', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '64.167,13' },
  { Kit: 'KIT MICRO 3740KWh', Placas: '49', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '66.805,02' },
  { Kit: 'KIT MICRO 3820KWh', Placas: '50', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '67.671,51' },
  { Kit: 'KIT MICRO 3890KWh', Placas: '51', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '69.655,98' },
  { Kit: 'KIT MICRO 3970KWh', Placas: '52', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '70.522,47' },
  { Kit: 'KIT MICRO 4050KWh', Placas: '53', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '71.530,24' },
  { Kit: 'KIT MICRO 4120KWh', Placas: '54', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '72.396,73' },
  { Kit: 'KIT MICRO 4200KWh', Placas: '55', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '75.321,93' },
  { Kit: 'KIT MICRO 4280KWh', Placas: '56', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '76.188,42' },
  { Kit: 'KIT MICRO 4350KWh', Placas: '57', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '77.457,01' },
  { Kit: 'KIT MICRO 4430KWh', Placas: '58', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '78.323,50' },
  { Kit: 'KIT MICRO 4500KWh', Placas: '59', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '79.190,00' },
  { Kit: 'KIT MICRO 4580KWh', Placas: '60', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '80.056,49' },
  { Kit: 'KIT MICRO 4660KWh', Placas: '61', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '83.494,38' },
  { Kit: 'KIT MICRO 4730KWh', Placas: '62', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '84.360,88' },
  { Kit: 'KIT MICRO 4810KWh', Placas: '63', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '85.488,20' },
  { Kit: 'KIT MICRO 4890KWh', Placas: '64', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '86.354,69' },
  { Kit: 'KIT MICRO 4960KWh', Placas: '65', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '87.362,46' },
  { Kit: 'KIT MICRO 5040KWh', Placas: '66', Modulo: '620W', Inversor: 'TSUNESS TSOL', Valor: '88.228,95' }
];


// --- COMPONENTE LAYOUT BASE ---
const DashboardLayout = ({ children, title, setView, role, currentTab, setCurrentTab }) => {
  return (
    <div className="flex h-screen bg-[#0B192C] text-slate-100 font-sans selection:bg-orange-500 overflow-hidden select-none">
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

                {/* Secção de Ajuda */}
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
              <p className="text-sm font-bold text-white">{role === 'master' ? 'Super Admin' : 'Admin Empresa'}</p>
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

// --- TELA DE LOGIN ---
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
        <button className="w-full bg-orange-500 text-slate-950 font-bold py-3.5 rounded-xl mt-4 opacity-50 cursor-not-allowed">Entrar no Sistema (Inativo na Demo)</button>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-800/50">
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

// --- VISÃO MASTER ---
const MasterView = ({ setView }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
                  type="text" placeholder="Buscar empresa por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-orange-500 outline-none shadow-inner transition"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:border-orange-500 outline-none shadow-inner transition sm:w-40">
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
                     <p className="text-[10px] text-slate-500 mt-2">Valores e configurações de cada plano devem ser geridos na aba <strong>"Planos"</strong> (A ser desenvolvida na Fase 2).</p>
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

// --- VISÃO EMPRESA ---
const EmpresaView = ({ setView }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [dateFilter, setDateFilter] = useState('semana'); 
  const [resultadosFilter, setResultadosFilter] = useState('7dias');
  const [vendedorFilter, setVendedorFilter] = useState('todos'); 
  const [isVendedorModalOpen, setIsVendedorModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // FETCH FIREBASE ORÇAMENTOS
  const [orcamentos, setOrcamentos] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "orcamentos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
         docs.push({ id: doc.id, ...doc.data() });
      });
      setOrcamentos(docs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout title="Painel da Empresa (SolarTech)" setView={setView} role="empresa" currentTab={currentTab} setCurrentTab={setCurrentTab}>
      
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Equipa Ativa</p>
                    <h3 className="text-lg font-bold text-white">Desempenho Rápido</h3>
                 </div>
                 <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                   <Users className="w-5 h-5 text-blue-400" />
                 </div>
              </div>
              <p className="text-sm text-slate-400">Vá à aba <strong>Resultados (CRM)</strong> para ver o detalhe de cada vendedor e exportar os relatórios.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">Desempenho Geral</h3>
                <div className="bg-slate-950 border border-slate-700 rounded-xl p-1 inline-flex shadow-inner">
                  <button onClick={() => setDateFilter('semana')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'semana' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Últimos 7 dias</button>
                  <button onClick={() => setDateFilter('mes')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${dateFilter === 'mes' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>Este Mês</button>
                  <button onClick={() => alert('[MODO DE TESTE]\nEsta opção abrirá um calendário interativo para selecionar o intervalo exato na versão final com o banco de dados ligado.')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white`}><Search className="w-3 h-3"/> Personalizado</button>
                </div>
             </div>
             
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} />
                    <Bar dataKey="propostas" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                <button onClick={() => alert('[MODO DE TESTE]\nEsta opção abrirá um seletor de Data Inicial e Data Final para filtrar a tabela.')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-500 hover:text-white whitespace-nowrap`}><Search className="w-3 h-3"/> Personalizado</button>
              </div>
              
              <button onClick={() => alert('[MODO DE TESTE]\nEste botão vai processar a tabela abaixo (respeitando os filtros de vendedor e datas) e fazer o download de um ficheiro Excel (.xlsx) com o relatório de vendas.')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2 w-full sm:w-auto justify-center">
                <FileSpreadsheet className="w-4 h-4"/> Baixar Excel
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto p-4">
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
                {orcamentos.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-slate-500">A carregar orçamentos ou nenhum gerado...</td>
                    </tr>
                ) : (
                orcamentos.map((sim) => (
                  <tr key={sim.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sim.data || (sim.timestamp ? new Date(sim.timestamp.toDate()).toLocaleString('pt-BR') : '')}</td>
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{sim.vendedor}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{sim.cliente}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{sim.whatsapp}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.cidade}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{sim.estrutura}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sim.tipoKit === 'String' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {sim.tipoKit || sim.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{sim.kit}</td>
                    <td className="px-4 py-3 text-right font-bold text-orange-400 whitespace-nowrap">R$ {sim.valor}</td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === 'vendedores' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-sm relative">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">Gestão de Equipa</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Aqui você poderá cadastrar novos vendedores, editar senhas, ver o histórico individual e bloquear acessos rapidamente.</p>
          <button onClick={() => setIsVendedorModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold transition">Cadastrar Novo Vendedor</button>
          
          {/* MODAL: NOVO VENDEDOR */}
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
                     <p className="text-[10px] text-slate-500 mt-1">O vendedor será obrigado a trocar a senha no primeiro acesso.</p>
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

          {/* MODAL: UPLOAD EXCEL */}
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                 <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition"><LogOut className="w-5 h-5"/></button>
                 <h3 className="text-xl font-extrabold text-white mb-1">Atualizar Kits (Excel)</h3>
                 
                 <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 my-4">
                    <p className="text-xs text-slate-300 font-bold mb-2">Instruções:</p>
                    <ol className="text-xs text-slate-400 space-y-1 list-decimal pl-4">
                      <li>Baixe o <a href="#" onClick={(e) => { e.preventDefault(); alert('[MODO DE TESTE]\nNa versão do sistema real, este link iniciará o download do ficheiro "ModeloKits.xlsx" formatado com as colunas corretas para o sistema ler.'); }} className="text-orange-400 hover:underline">Modelo Excel Obrigatório (.xlsx)</a>.</li>
                      <li>Preencha com os seus Kits, Potências e Preços.</li>
                      <li>Não altere os nomes das colunas.</li>
                    </ol>
                 </div>

                 <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition cursor-pointer group">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-500 group-hover:text-orange-400 mb-2 transition" />
                    <p className="text-sm font-bold text-slate-300">Arraste a planilha aqui</p>
                    <p className="text-xs text-slate-500">ou clique para selecionar o arquivo</p>
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
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-6 mb-6">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20"><BookOpen className="w-8 h-8 text-blue-400"/></div>
              <div>
                <h2 className="text-2xl font-bold text-white">Central de Treinamento</h2>
                <p className="text-slate-400 text-sm mt-1">Aprenda a tirar o máximo proveito da plataforma de gestão.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800/50 hover:border-orange-500/30 transition group">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <span className="bg-orange-500 text-slate-950 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">1</span> Cadastrar Vendedores
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">Vá à aba "Meus Vendedores" e clique em "Cadastrar Novo Vendedor". O sistema gera uma senha provisória automaticamente para enviar à sua equipa.</p>
              </div>

              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800/50 hover:border-orange-500/30 transition group">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <span className="bg-orange-500 text-slate-950 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">2</span> Atualizar Kits
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">Na aba "Gestão de Kits", faça o upload da sua planilha Excel. Isso atualiza instantaneamente os preços nos telemóveis de todos os seus vendedores.</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between bg-slate-800/30 p-4 rounded-xl">
               <div className="flex items-center gap-3">
                 <MessageCircle className="w-6 h-6 text-emerald-400" />
                 <div>
                    <h4 className="font-bold text-white text-sm">Ainda com dúvidas?</h4>
                    <p className="text-xs text-slate-400">A nossa equipa está pronta para ajudar.</p>
                 </div>
               </div>
               <button onClick={() => window.open('https://wa.me/5562999999999?text=Olá, preciso de ajuda com o painel do Simulador Solar SaaS', '_blank')} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition">Chamar no Suporte</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// --- VISÃO VENDEDOR ---
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

    if (id === 'kitString' && value !== '') { 
      newFormData.kitMicro = ''; newFormData.roofStructure = ''; 
    } 
    else if (id === 'kitMicro' && value !== '') { 
      newFormData.kitString = ''; newFormData.roofStructure = ''; 
    }
    setFormData(newFormData);
  };

  const activeKit = formData.kitString !== '' ? kitsString[formData.kitString] : formData.kitMicro !== '' ? kitsMicro[formData.kitMicro] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sellerName) return showToast('Preencha o Nome do Consultor.');
    if (formData.kitString === '' && formData.kitMicro === '') return showToast('Selecione um Kit Solar.');
    if (!formData.roofStructure) return showToast('Selecione a Estrutura do Telhado.');
    if (!formData.clientName) return showToast('Preencha o Nome do Cliente.');
    if (!formData.clientWhatsapp) return showToast('Preencha o WhatsApp do Cliente.');
    if (!formData.clientCity) return showToast('Preencha a Cidade.');

    let cleanPhone = formData.clientWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) return showToast('Insira um WhatsApp válido com DDD.');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) cleanPhone = '55' + cleanPhone;

    const kitName = activeKit.Kit;
    const modulo = activeKit.Modulo;
    const cleanPotencia = modulo.replace(/Módulo\s*/gi, '').trim();
    const valorFormatado = `R$ ${activeKit.Valor}`;

    try {
      showToast('A enviar dados para a Base de Dados...', 'success');

      await addDoc(collection(db, "orcamentos"), {
        data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        vendedor: formData.sellerName,
        cliente: formData.clientName,
        whatsapp: formData.clientWhatsapp,
        cidade: formData.clientCity,
        estrutura: formData.roofStructure,
        tipoKit: formData.kitString !== '' ? 'String' : 'Micro',
        kit: kitName,
        valor: activeKit.Valor,
        timestamp: serverTimestamp() 
      });

      const textMessage = `Empresa: Energia Solar ☀️\n\n` +
        `Segue o seu orçamento personalizado de Energia Solar\n\n` +
        `👤 *Cliente:* ${formData.clientName}\n\n` +
        `📍 *Cidade:* ${formData.clientCity}\n\n` +
        `📱 *Zap:* ${formData.clientWhatsapp}\n\n` +
        `🏠 *Estrutura do Telhado:* ${formData.roofStructure}\n\n` +
        `📦 *Kit Selecionado:* ${kitName}\n\n` +
        `☀️ *Placas:* ${activeKit.Placas}\n\n` +
        `⚡ *Potência:* ${cleanPotencia}\n\n` +
        `🔄 *Inversor:* ${activeKit.Inversor}\n\n` +
        `💰 *Valor do Kit:* ${valorFormatado}\n\n` +
        `✨ *Condições Especiais:*\n\n` +
        `💳 Financiamos 100% com Zero de Entrada\n\n` +
        `📅 Primeira parcela com prazo de até 120 dias para começar a pagar\n\n` +
        `💼 Atendido por: *${formData.sellerName}*\n\n` +
        `Ficamos à disposição para esclarecer dúvidas e realizar o seu projeto.`;

      const encodedText = encodeURIComponent(textMessage);
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);

    } catch (error) {
      console.error("Erro Firebase:", error);
      showToast('Erro de conexão com o banco de dados. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 font-sans selection:bg-orange-500 overflow-y-auto pb-12 relative select-none">
      
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

      <main className="py-6 sm:py-10 px-4 max-w-3xl mx-auto space-y-6">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 border-b border-slate-800/80 pb-4">
            <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500"/> O Meu Desempenho
            </h2>
            <div className="bg-slate-950 rounded-xl p-1 flex text-xs font-bold border border-slate-700 shadow-inner">
              <button onClick={() => setTimeFilter('hoje')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'hoje' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Hoje</button>
              <button onClick={() => setTimeFilter('semana')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'semana' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Semana</button>
              <button onClick={() => setTimeFilter('mes')} className={`px-4 py-1.5 rounded-lg transition ${timeFilter === 'mes' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}>Mês</button>
              <button onClick={() => alert('[MODO DE TESTE]\nFiltro de calendário disponível na versão final.')} className="px-4 py-1.5 rounded-lg transition text-slate-400 hover:text-white flex items-center gap-1"><Search className="w-3 h-3"/> Personalizado</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Propostas</p>
                <p className="text-2xl font-extrabold text-white">{timeFilter === 'hoje' ? '8' : timeFilter === 'semana' ? '34' : '142'}</p>
             </div>
             <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits String</p>
                <p className="text-2xl font-extrabold text-blue-400">{timeFilter === 'hoje' ? '5' : timeFilter === 'semana' ? '20' : '90'}</p>
             </div>
             <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm text-center sm:text-left">
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Kits Micro</p>
                <p className="text-2xl font-extrabold text-emerald-400">{timeFilter === 'hoje' ? '3' : timeFilter === 'semana' ? '14' : '52'}</p>
             </div>
             <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 shadow-sm flex flex-col justify-center items-center sm:items-start">
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Status Meta</p>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-400/20 mt-1"><CheckCircle2 className="w-3 h-3"/> No Ritmo</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-slate-800/20 opacity-50"><Sun className="w-48 h-48" /></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                <span className="bg-blue-500/10 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border border-blue-500/20">1</span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Consultor</h4>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500"><User className="w-4 h-4" /></span>
                <input type="text" id="sellerName" value={formData.sellerName} onChange={handleInputChange} placeholder="Seu Nome Completo" 
                        className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
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
                  <select id="kitString" value={formData.kitString} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white appearance-none outline-none shadow-inner transition cursor-pointer">
                    <option value="" disabled>-- Kit String --</option>
                    {kitsString.map((k, i) => <option key={i} value={i}>{k.Kit} (R$ {k.Valor})</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-4 text-slate-500 pointer-events-none" />
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-orange-500"><Zap className="w-4 h-4" /></span>
                  <select id="kitMicro" value={formData.kitMicro} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white appearance-none outline-none shadow-inner transition cursor-pointer">
                    <option value="" disabled>-- Kit Micro --</option>
                    {kitsMicro.map((k, i) => <option key={i} value={i}>{k.Kit} (R$ {k.Valor})</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="relative group mt-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-orange-500"><Building className="w-4 h-4" /></span>
                  <select id="roofStructure" value={formData.roofStructure} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white appearance-none outline-none shadow-inner transition cursor-pointer">
                    <option value="" disabled>-- Estrutura do Telhado --</option>
                    <option value="Madeira">1: Madeira</option>
                    <option value="Ferro">2: Ferro</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-4 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden shadow-inner">
                 <div className="absolute -right-8 -bottom-8 text-slate-800/40 text-8xl pointer-events-none transform rotate-12"><Sun className="w-48 h-48"/></div>
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
                  <input type="text" id="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Nome Completo" 
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
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
                  }} placeholder="(00) 00000-0000" 
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-amber-500"><MapPin className="w-4 h-4" /></span>
                  <input type="text" id="clientCity" value={formData.clientCity} onChange={handleInputChange} placeholder="Cidade - UF" 
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none shadow-inner transition" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-lg rounded-2xl transition duration-300 shadow-xl shadow-orange-500/20 transform hover:-translate-y-0.5">
              Enviar Proposta
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
