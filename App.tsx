import React, { useState, useEffect } from 'react';
import { User, ProgressState, Discipline, Level, Technique } from './types';
import { DISCIPLINES, WEEKLY_SCHEDULE } from './constants';
import { askSensei } from './services/geminiService';

// --- Shared Components ---

const BottomNavigation = ({ active, onNavigate }: { active: string, onNavigate: (view: ViewState) => void }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 pb-5 pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-30 dark:bg-surface-dark dark:border-white/5">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
            <button onClick={() => onNavigate(ViewState.DASHBOARD)} className={`flex flex-col items-center justify-center gap-1 w-12 group ${active === 'home' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'} transition-colors`}>
                <span className={`material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform ${active === 'home' ? 'filled' : ''}`}>home</span>
                <span className="text-[10px] font-medium">Início</span>
            </button>
            <button onClick={() => onNavigate(ViewState.SCHEDULE)} className={`flex flex-col items-center justify-center gap-1 w-12 group ${active === 'agenda' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'} transition-colors`}>
                <span className={`material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform ${active === 'agenda' ? 'filled' : ''}`}>calendar_month</span>
                <span className="text-[10px] font-medium">Agenda</span>
            </button>
            <div className="relative -top-6">
                <button onClick={() => onNavigate(ViewState.ATTENDANCE)} className="size-14 rounded-full bg-black text-white shadow-xl shadow-black/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 border-4 border-white dark:border-[#1C1C1E]">
                    <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
                </button>
            </div>
            <button onClick={() => onNavigate(ViewState.EVOLUTION)} className={`flex flex-col items-center justify-center gap-1 w-12 group ${active === 'evolution' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'} transition-colors`}>
                <span className={`material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform ${active === 'evolution' ? 'filled' : ''}`}>bar_chart</span>
                <span className="text-[10px] font-medium">Evolução</span>
            </button>
            <button onClick={() => onNavigate(ViewState.PROFILE)} className={`flex flex-col items-center justify-center gap-1 w-12 group ${active === 'profile' ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'} transition-colors`}>
                <span className={`material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform ${active === 'profile' ? 'filled' : ''}`}>person</span>
                <span className="text-[10px] font-medium">Perfil</span>
            </button>
        </div>
      </nav>
  )
};

// --- View Components ---

const LoginView = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    const storedUserStr = localStorage.getItem(`user_${email}`);
    
    if (isRegistering) {
      if (storedUserStr) {
        setError('Usuário já existe.');
        return;
      }
      // Create new user with defaults
      const newUser: User = { 
        email, 
        name: email.split('@')[0],
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3srA55zGUWfg8BxETBFloB9muv6M8nfCIA07QKBPEYjiTkK0Vx-3nTsexLH7ov4KJaJ_k4ZO6cyAIFp4PW4Q-sAJGrrzkJoxbDveyBUhhn5ZHmTYC9obcEj5gKIaDO1t0vsZX_gr-fwB_mHrJPjJUjA5kOE4-BEAELAnGljRYMgNlEw2IMot1Ic-LXmCsuwWB2BcF3aWdhUceKAKo6dUKf2fqNXRXsdIMcd8Z4a-iYZ7mkNGiQ_L8v7V5SP1TnGwx2W1SFlouMg' 
      };
      // Save with password
      localStorage.setItem(`user_${email}`, JSON.stringify({ ...newUser, password })); 
      onLogin(newUser);
    } else {
      if (!storedUserStr) {
        setError('Usuário não encontrado.');
        return;
      }
      const parsed = JSON.parse(storedUserStr);
      if (parsed.password !== password) {
        setError('Senha incorreta.');
        return;
      }
      // Return user without password to state (security best practice simulation)
      const { password: _, ...userWithoutPass } = parsed;
      onLogin(userWithoutPass);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white text-black font-display antialiased">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl opacity-80"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-gray-200 rounded-full blur-3xl opacity-80"></div>
        <div className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-multiply opacity-[0.03]" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWydIwwXA2JFYIjLgORrcq1R8Kir_C8_cyEQjGIzZiNZRnhQ7JCXmIN8YQKIKphDpEWJMLkNg3-OGfaa-2L1sxoNgY-RCaM3j-xI9LVMI5BvwNXV4_4snjb1hfJUFWG5yo6J8ntPCumc0fpcnyZzp8a7z1AytZaBk80ndsXyh67xB55PbOT9Adhaut4WA9HFWbRAbWpvuMixSTMx5A-XbNRHHs7SApvR-r2SwSFvqSeZ6DUeOlg-pNCGB_cyQbrDg0GLtLrQETww")'}}></div>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl">
            <span className="material-symbols-outlined text-3xl">self_improvement</span>
          </div>
          <h1 className="text-center text-4xl font-black tracking-tighter text-black uppercase drop-shadow-sm">
            ZEN <span className="font-light">JITSU</span>
          </h1>
          <p className="mt-3 text-center text-sm text-gray-500 font-medium tracking-wide uppercase">
            Domine sua mente. Treine seu corpo.
          </p>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[400px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold leading-6 text-black">Email</label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-black text-[20px]">mail</span>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-black ring-1 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-all duration-200" 
                  placeholder="exemplo@email.com" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold leading-6 text-black">Senha</label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-black text-[20px]">lock</span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-white py-4 pl-12 pr-12 text-black ring-1 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 transition-all duration-200" 
                  placeholder="••••••••" 
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}

            <div className="flex flex-col gap-4 pt-2">
              <button type="submit" className="flex w-full justify-center items-center gap-2 rounded-xl bg-black px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-[0.98]">
                {isRegistering ? 'CADASTRAR' : 'ENTRAR'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button 
                type="button" 
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="flex w-full justify-center rounded-xl bg-gray-900 px-3 py-4 text-sm font-semibold leading-6 text-white hover:bg-black transition-all active:scale-[0.98]"
              >
                {isRegistering ? 'JÁ TENHO CONTA' : 'CRIAR CONTA'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const OnboardingView = ({ user, onComplete }: { user: User, onComplete: (data: Partial<User>) => void }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: user.name || '',
    age: user.age || '',
    weight: user.weight || '',
    height: user.height || '',
    goal: user.goal || ''
  });

  const goals = [
    { id: 'defesa', icon: 'shield', label: 'Defesa Pessoal' },
    { id: 'competicao', icon: 'trophy', label: 'Competição' },
    { id: 'saude', icon: 'favorite', label: 'Saúde & Fitness' },
    { id: 'mente', icon: 'self_improvement', label: 'Mente & Espírito' }
  ];

  const handleNext = () => {
    if (step === 3) {
      onComplete(data);
    } else {
      setStep(step + 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return data.name.length > 2;
    if (step === 2) return data.age && data.weight && data.height;
    if (step === 3) return data.goal;
    return false;
  };

  return (
    <div className="min-h-screen bg-black text-white font-display flex flex-col justify-between p-6">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col pt-10">
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-1 rounded-full mb-8">
          <div className="bg-white h-1 rounded-full transition-all duration-500" style={{width: `${(step/3)*100}%`}}></div>
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fadeIn">
            <span className="material-symbols-outlined text-5xl mb-6">badge</span>
            <h1 className="text-3xl font-black uppercase mb-2">Quem é você, guerreiro?</h1>
            <p className="text-gray-400 mb-8">Comece sua jornada se apresentando ao dojo.</p>
            
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Nome Completo</label>
                  <input 
                    type="text" 
                    value={data.name}
                    onChange={(e) => setData({...data, name: e.target.value})}
                    className="w-full bg-gray-900 border-0 border-b-2 border-gray-700 focus:border-white focus:ring-0 text-2xl font-bold px-0 py-2 transition-colors placeholder-gray-700"
                    placeholder="Seu nome"
                    autoFocus
                  />
               </div>
            </div>
          </div>
        )}

        {/* Step 2: Stats */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fadeIn">
            <span className="material-symbols-outlined text-5xl mb-6">accessibility_new</span>
            <h1 className="text-3xl font-black uppercase mb-2">Conheça seu corpo</h1>
            <p className="text-gray-400 mb-8">Para medirmos sua evolução, precisamos saber onde você está.</p>
            
            <div className="space-y-6">
               <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Idade</label>
                  <input 
                    type="number" 
                    value={data.age}
                    onChange={(e) => setData({...data, age: e.target.value})}
                    className="w-full bg-gray-900 border-0 border-b-2 border-gray-700 focus:border-white focus:ring-0 text-2xl font-bold px-0 py-2 transition-colors placeholder-gray-700"
                    placeholder="00"
                  />
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Peso (kg)</label>
                    <input 
                      type="number" 
                      value={data.weight}
                      onChange={(e) => setData({...data, weight: e.target.value})}
                      className="w-full bg-gray-900 border-0 border-b-2 border-gray-700 focus:border-white focus:ring-0 text-2xl font-bold px-0 py-2 transition-colors placeholder-gray-700"
                      placeholder="00"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Altura (m)</label>
                    <input 
                      type="text" 
                      value={data.height}
                      onChange={(e) => setData({...data, height: e.target.value})}
                      className="w-full bg-gray-900 border-0 border-b-2 border-gray-700 focus:border-white focus:ring-0 text-2xl font-bold px-0 py-2 transition-colors placeholder-gray-700"
                      placeholder="1.75"
                    />
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Step 3: Goal */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-fadeIn">
            <span className="material-symbols-outlined text-5xl mb-6">flag</span>
            <h1 className="text-3xl font-black uppercase mb-2">Qual é o seu caminho?</h1>
            <p className="text-gray-400 mb-8">O que você busca dentro do Zen Jitsu?</p>
            
            <div className="grid grid-cols-1 gap-3">
               {goals.map((g) => (
                 <button
                    key={g.id}
                    onClick={() => setData({...data, goal: g.label})}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                    ${data.goal === g.label 
                      ? 'bg-white text-black border-white' 
                      : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600'}`}
                 >
                    <span className={`material-symbols-outlined text-2xl ${data.goal === g.label ? 'filled' : ''}`}>{g.icon}</span>
                    <span className="font-bold text-lg">{g.label}</span>
                 </button>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-md mx-auto pt-6">
        <button 
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all
          ${isStepValid() ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
          {step === 3 ? 'Entrar no Dojo' : 'Próximo'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}

const AttendanceView = ({ progress, onNavigate, onCheckIn }: { progress: ProgressState, onNavigate: (view: ViewState) => void, onCheckIn: (date: string) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const isPresent = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const year = checkDate.getFullYear();
    const month = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${d}`;
    return progress.attendanceDates.includes(isoDate);
  };

  const handleCheckIn = () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    onCheckIn(iso);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  };

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const checkedInToday = progress.attendanceDates.includes(todayIso);

  return (
    <div className="bg-white text-slate-900 font-display antialiased min-h-screen flex flex-col pb-20 dark:bg-surface-dark dark:text-white">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-black/5 dark:bg-surface-dark/90 dark:border-white/5">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => onNavigate(ViewState.DASHBOARD)} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Frequência</h2>
          <div className="size-10"></div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center w-full px-4 pt-2 pb-24 max-w-md mx-auto bg-white dark:bg-surface-dark">
        <div className="w-full mt-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <button onClick={() => changeMonth(-1)} className="text-slate-500 hover:text-black dark:hover:text-white transition-colors p-2">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <p className="text-lg font-bold text-black dark:text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
            <button onClick={() => changeMonth(1)} className="text-slate-500 hover:text-black dark:hover:text-white transition-colors p-2">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const attended = isPresent(day);
                const today = isToday(day);
                return (
                  <button key={day} className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-full text-sm font-bold
                    ${today ? 'bg-black text-white shadow-lg shadow-black/20' : ''}
                    ${!today && attended ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white' : ''}
                    ${!today && !attended ? 'text-slate-700 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5' : ''}
                  `}>
                    {day}
                    {attended && !today && <span className="absolute bottom-1.5 w-1 h-1 bg-slate-600 dark:bg-slate-400 rounded-full"></span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <div className="flex flex-col gap-2 rounded-2xl p-5 border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
            <div className="flex items-center gap-2 text-black dark:text-white">
              <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              <p className="text-xs font-bold uppercase tracking-wider">Total</p>
            </div>
            <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">{progress.attendanceDates.length}</p>
            <p className="text-xs text-slate-500 font-medium">Treinos</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-5 border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
              <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
              <p className="text-xs font-bold uppercase tracking-wider">Sequência</p>
            </div>
            <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">--</p>
            <p className="text-xs text-slate-500 font-medium">Dias seguidos</p>
          </div>
        </div>

        <div className="w-full mt-8">
          <button 
            onClick={handleCheckIn}
            disabled={checkedInToday}
            className={`group relative w-full flex items-center justify-center gap-3 overflow-hidden rounded-xl h-14 shadow-lg shadow-black/25 active:scale-[0.98] transition-all duration-200
            ${checkedInToday ? 'bg-slate-800 text-white cursor-default' : 'bg-black text-white hover:bg-slate-800'}`}
          >
            <span className={`material-symbols-outlined relative z-10 ${checkedInToday ? 'filled' : ''}`}>check_circle</span>
            <span className="text-base font-bold leading-normal tracking-[0.015em] relative z-10">{checkedInToday ? 'Presença Confirmada' : 'Fazer Check-in'}</span>
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">Confirme sua presença no dojo</p>
        </div>

      </main>
      <BottomNavigation active="attendance" onNavigate={onNavigate} />
    </div>
  );
};

const ScheduleView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const getTodayIndex = () => {
    const day = new Date().getDay();
    if (day === 0) return 6;
    return day - 1;
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayIndex());
  const todaySessions = WEEKLY_SCHEDULE[selectedDayIndex]?.sessions || [];

  return (
    <div className="bg-background-light font-display text-black antialiased min-h-screen pb-20 dark:bg-surface-dark dark:text-white">
      <header className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/5">
        <button onClick={() => onNavigate(ViewState.DASHBOARD)} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
        </button>
        <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Horários</h2>
        <div className="w-10"></div>
      </header>
      
      <div className="sticky top-[68px] z-10 bg-white dark:bg-surface-dark pt-2 pb-1 border-b border-gray-100 dark:border-white/5">
        <div className="flex overflow-x-auto no-scrollbar px-4 gap-2 pb-2">
          {WEEKLY_SCHEDULE.map((day, idx) => (
             <button
                key={day.day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex min-w-[60px] flex-col items-center justify-center rounded-2xl py-3 px-2 transition-colors group
                ${selectedDayIndex === idx ? 'bg-black text-white shadow-xl shadow-black/20 scale-105' : 'bg-transparent text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
             >
               <span className="text-xs font-bold opacity-70 mb-1">{day.shortDay}</span>
               {/* Mock dates for UI visual */}
               <span className="text-lg font-bold">{10 + idx}</span>
             </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 pb-2">
        <h2 className="text-black dark:text-white tracking-tight text-[28px] font-extrabold leading-tight">Treinos</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">{WEEKLY_SCHEDULE[selectedDayIndex].day}</p>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {todaySessions.length === 0 ? (
           <div className="mt-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center text-center">
             <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">fitness_center</span>
             <p className="text-gray-500 text-sm">Sem treinos hoje. <br/> Descanso também é treino.</p>
           </div>
        ) : (
          todaySessions.map((session, idx) => (
            <div key={session.id} className="relative group overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 p-4 shadow-sm hover:border-black dark:hover:border-white/20 transition-colors">
              <div className="flex flex-col gap-1">
                 <h3 className="text-black dark:text-white text-lg font-bold leading-tight">{session.title}</h3>
                 <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {session.time} • {session.duration}
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                    <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                        {session.instructor.charAt(0)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">{session.instructor}</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNavigation active="agenda" onNavigate={onNavigate} />
    </div>
  );
}

const EvolutionView = ({ user, progress, onNavigate }: { user: User, progress: ProgressState, onNavigate: (view: ViewState) => void }) => {
  const [rankingData, setRankingData] = useState<any[]>([]);
  const totalTechniques = DISCIPLINES.flatMap(d => d.levels.flatMap(l => l.techniques)).length;
  const learned = progress.completedTechniques.length;
  const percentage = totalTechniques > 0 ? Math.round((learned / totalTechniques) * 100) : 0;

  useEffect(() => {
    const data = [];
    // Iterate through localStorage to find all registered users
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
            try {
                const u = JSON.parse(localStorage.getItem(key) || '{}');
                const email = u.email;
                const pKey = `progress_${email}`;
                const p = JSON.parse(localStorage.getItem(pKey) || '{"completedTechniques":[]}');
                
                const userLearned = p.completedTechniques ? p.completedTechniques.length : 0;
                const userPct = totalTechniques > 0 ? Math.round((userLearned / totalTechniques) * 100) : 0;

                // Simple belt logic for display based on percentage
                let beltName = 'Faixa Branca';
                if (userPct >= 80) beltName = 'Faixa Preta';
                else if (userPct >= 60) beltName = 'Faixa Marrom';
                else if (userPct >= 40) beltName = 'Faixa Roxa';
                else if (userPct >= 20) beltName = 'Faixa Azul';

                data.push({
                    name: u.name,
                    avatar: u.avatar || 'https://via.placeholder.com/150',
                    percentage: userPct,
                    belt: beltName,
                    email: u.email
                });
            } catch (e) {
                console.error("Erro ao ler dados do usuário para o ranking", e);
            }
        }
    }
    
    // Sort by percentage descending
    data.sort((a, b) => b.percentage - a.percentage);
    setRankingData(data);
  }, [progress, totalTechniques]);

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col antialiased text-black pb-24 dark:bg-surface-dark dark:text-white">
       <header className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-white/5">
         <h1 className="text-black dark:text-white text-xl font-bold tracking-tight">Evolução</h1>
         <div className="size-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">Z</div>
       </header>

       <main className="p-5 flex flex-col gap-6">
          {/* Main Stats */}
          <div className="bg-black text-white rounded-2xl p-6 shadow-xl shadow-black/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-9xl">emoji_events</span>
             </div>
             <div className="relative z-10">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Domínio Geral</p>
                <div className="flex items-end gap-2 mb-4">
                   <span className="text-5xl font-black tracking-tighter">{percentage}%</span>
                   <span className="mb-2 text-gray-400 font-medium">das técnicas</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                   <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{width: `${percentage}%`}}></div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                   <span className="material-symbols-outlined text-xl">school</span>
                   <span className="text-xs font-bold uppercase">Aprendidas</span>
                </div>
                <p className="text-2xl font-bold text-black dark:text-white">{learned}</p>
             </div>
             <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                   <span className="material-symbols-outlined text-xl">history</span>
                   <span className="text-xs font-bold uppercase">Treinos</span>
                </div>
                <p className="text-2xl font-bold text-black dark:text-white">{progress.attendanceDates.length}</p>
             </div>
          </div>

          {/* Ranking Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500 filled">trophy</span>
                Ranking do Dojo
            </h3>
            {rankingData.length === 0 ? (
                <div className="text-center p-4 text-gray-500 text-sm">Nenhum guerreiro encontrado.</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {rankingData.map((rUser, index) => {
                        const isMe = rUser.email === user.email;
                        return (
                            <div key={index} className={`p-3 rounded-xl flex items-center gap-3 border transition-colors ${isMe ? 'bg-black text-white border-black' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-black dark:text-white'}`}>
                                <div className="w-6 text-center font-bold text-sm opacity-50">#{index + 1}</div>
                                <div className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-white/10" style={{backgroundImage: `url("${rUser.avatar}")`}}></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="font-bold text-sm truncate">{rUser.name} {isMe && '(Você)'}</p>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isMe ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>{rUser.belt}</span>
                                    </div>
                                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isMe ? 'bg-gray-700' : 'bg-gray-100 dark:bg-white/10'}`}>
                                        <div className={`h-full rounded-full ${isMe ? 'bg-green-400' : 'bg-black dark:bg-white'}`} style={{width: `${rUser.percentage}%`}}></div>
                                    </div>
                                </div>
                                <div className="font-bold text-sm w-8 text-right">{rUser.percentage}%</div>
                            </div>
                        );
                    })}
                </div>
            )}
          </div>

          <div>
             <h3 className="text-lg font-bold mb-4">Por Disciplina</h3>
             <div className="flex flex-col gap-4">
                {DISCIPLINES.map(d => {
                   const dTechs = d.levels.flatMap(l => l.techniques);
                   const dCompleted = dTechs.filter(t => progress.completedTechniques.includes(t.id)).length;
                   const dPct = dTechs.length > 0 ? Math.round((dCompleted / dTechs.length) * 100) : 0;
                   
                   return (
                      <div key={d.id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-4 shadow-sm">
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold">{d.name}</h4>
                            <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{dPct}%</span>
                         </div>
                         <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                            <div className="bg-black dark:bg-white h-2 rounded-full" style={{width: `${dPct}%`}}></div>
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>
       </main>
       <BottomNavigation active="evolution" onNavigate={onNavigate} />
    </div>
  )
}

const ProfileView = ({ user, onLogout, onNavigate, onUpdateUser }: { user: User, onLogout: () => void, onNavigate: (view: ViewState) => void, onUpdateUser: (u: Partial<User>) => void }) => {
  const [subView, setSubView] = useState<'main' | 'edit' | 'history' | 'settings'>('main');
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age || '',
    weight: user.weight || '',
    height: user.height || '',
    avatar: user.avatar || ''
  });

  // Settings State
  const [settings, setSettings] = useState({
    notifications: true,
    publicProfile: false,
    darkMode: document.documentElement.classList.contains('dark')
  });

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setSettings(prev => ({ ...prev, darkMode: isDark }));
  };

  const toggleSetting = (key: 'notifications' | 'publicProfile') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetProgress = () => {
    if (confirm('Atenção! Isso apagará todo o seu progresso de técnicas e frequência. Esta ação não pode ser desfeita.')) {
        localStorage.removeItem(`progress_${user.email}`);
        window.location.reload();
    }
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setSubView('main');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (subView === 'edit') {
    return (
      <div className="bg-white dark:bg-surface-dark min-h-screen text-black dark:text-white font-display antialiased flex flex-col">
        <header className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-white/5">
           <button onClick={() => setSubView('main')} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
           </button>
           <h2 className="text-black dark:text-white text-lg font-bold">Editar Perfil</h2>
           <div className="w-10"></div>
        </header>
        <main className="p-6 flex-1 overflow-y-auto pb-24">
           <div className="flex flex-col items-center mb-8">
              <div className="size-24 rounded-full border-4 border-gray-100 dark:border-white/10 shadow-lg bg-gray-200 flex items-center justify-center bg-cover bg-center mb-4" style={{backgroundImage: `url("${formData.avatar || 'https://via.placeholder.com/150'}")`}}>
              </div>
              <p className="text-xs text-gray-500">Cole a URL da imagem abaixo</p>
           </div>

           <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-1">Nome Completo</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-1">URL do Avatar (Imagem)</label>
                <input name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://..." className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-1">Idade</label>
                    <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Anos" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-1">Peso (kg)</label>
                    <input name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="kg" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors" />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-1">Altura (m)</label>
                <input name="height" type="text" value={formData.height} onChange={handleChange} placeholder="1.75" className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors" />
              </div>
           </div>

           <button onClick={handleSave} className="w-full mt-8 bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl shadow-lg shadow-black/20 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95">
              Salvar Alterações
           </button>
        </main>
      </div>
    )
  }

  if (subView === 'history') {
    const belts = [
        { name: 'Faixa Branca', color: 'bg-white border-2 border-gray-200', active: true, date: '10 Jan, 2024', status: 'Concluído' },
        { name: 'Faixa Azul', color: 'bg-blue-600 border-2 border-blue-600', active: false, date: 'Em progresso', status: 'Próximo Objetivo' },
        { name: 'Faixa Roxa', color: 'bg-purple-600 border-2 border-purple-600', active: false, date: 'Bloqueado', status: 'Futuro' },
        { name: 'Faixa Marrom', color: 'bg-[#5d4037] border-2 border-[#5d4037]', active: false, date: 'Bloqueado', status: 'Futuro' },
        { name: 'Faixa Preta', color: 'bg-black border-2 border-black', active: false, date: 'Bloqueado', status: 'Mestre' }
    ];

    return (
        <div className="bg-white dark:bg-surface-dark min-h-screen text-black dark:text-white font-display antialiased flex flex-col">
            <header className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-white/5">
                <button onClick={() => setSubView('main')} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-black dark:text-white text-lg font-bold">Histórico de Graduação</h2>
                <div className="w-10"></div>
            </header>
            <main className="p-6 flex-1 overflow-y-auto pb-24 relative">
                <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-white/10 z-0"></div>
                <div className="space-y-8 relative z-10">
                    {belts.map((belt, index) => (
                        <div key={index} className={`flex gap-4 ${!belt.active && index !== 1 ? 'opacity-50' : ''}`}>
                             <div className={`size-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${belt.color}`}>
                                {belt.active && <span className="material-symbols-outlined text-[16px] text-black">check</span>}
                             </div>
                             <div className="flex-1 pt-1">
                                 <h3 className="font-bold text-lg leading-none mb-1">{belt.name}</h3>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${belt.active ? 'bg-black text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>{belt.status}</span>
                                 </div>
                                 <p className="text-sm text-gray-500">{belt.date}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
  }

  if (subView === 'settings') {
    return (
        <div className="bg-white dark:bg-surface-dark min-h-screen text-black dark:text-white font-display antialiased flex flex-col">
            <header className="sticky top-0 z-20 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-white/5">
                <button onClick={() => setSubView('main')} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-black dark:text-white text-lg font-bold">Configurações</h2>
                <div className="w-10"></div>
            </header>
            <main className="p-6 flex-1 overflow-y-auto pb-24">
                <div className="space-y-8">
                    {/* Appearance Section */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Aparência</h3>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                                        <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                                    </div>
                                    <span className="font-bold">Modo Escuro</span>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${settings.darkMode ? 'bg-black dark:bg-white' : 'bg-gray-300'}`}
                                >
                                    <div className={`size-5 bg-white dark:bg-black rounded-full shadow-sm transition-transform duration-200 ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Notificações</h3>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-black dark:text-white">
                                        <span className="material-symbols-outlined text-[18px]">notifications</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Lembretes de Treino</span>
                                        <span className="text-xs text-gray-500">Notificar 1h antes da aula</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleSetting('notifications')}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${settings.notifications ? 'bg-black dark:bg-white' : 'bg-gray-300'}`}
                                >
                                    <div className={`size-5 bg-white dark:bg-black rounded-full shadow-sm transition-transform duration-200 ${settings.notifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Privacy Section */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Privacidade</h3>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-black dark:text-white">
                                        <span className="material-symbols-outlined text-[18px]">public</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Perfil Público</span>
                                        <span className="text-xs text-gray-500">Permitir que outros vejam seu ranking</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleSetting('publicProfile')}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${settings.publicProfile ? 'bg-black dark:bg-white' : 'bg-gray-300'}`}
                                >
                                    <div className={`size-5 bg-white dark:bg-black rounded-full shadow-sm transition-transform duration-200 ${settings.publicProfile ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Dados</h3>
                        <button onClick={resetProgress} className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl p-4 flex items-center justify-between border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                            <span className="font-bold">Resetar Todo o Progresso</span>
                            <span className="material-symbols-outlined">delete_forever</span>
                        </button>
                        <p className="text-xs text-gray-400 mt-2 text-center">Isso irá apagar seu histórico de check-ins e técnicas.</p>
                    </section>
                </div>
            </main>
        </div>
    )
  }

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col antialiased text-black pb-24 dark:bg-surface-dark dark:text-white">
       <div className="relative bg-black dark:bg-[#1C1C1E] text-white pt-10 pb-16 px-6 rounded-b-[2.5rem] shadow-xl shadow-black/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
             <div className="size-24 rounded-full border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center text-4xl font-bold mb-4 bg-cover bg-center" style={{backgroundImage: `url("${user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3srA55zGUWfg8BxETBFloB9muv6M8nfCIA07QKBPEYjiTkK0Vx-3nTsexLH7ov4KJaJ_k4ZO6cyAIFp4PW4Q-sAJGrrzkJoxbDveyBUhhn5ZHmTYC9obcEj5gKIaDO1t0vsZX_gr-fwB_mHrJPjJUjA5kOE4-BEAELAnGljRYMgNlEw2IMot1Ic-LXmCsuwWB2BcF3aWdhUceKAKo6dUKf2fqNXRXsdIMcd8Z4a-iYZ7mkNGiQ_L8v7V5SP1TnGwx2W1SFlouMg'}")`}}>
             </div>
             <h2 className="text-2xl font-bold">{user.name}</h2>
             <p className="text-gray-400 text-sm mt-1">{user.email}</p>
             <div className="mt-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                Faixa Branca • 1º Grau
             </div>
             <div className="mt-6 grid grid-cols-3 gap-8 w-full max-w-xs border-t border-white/10 pt-4">
                <div>
                   <span className="block text-lg font-bold">{user.age || '--'}</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider">Anos</span>
                </div>
                <div>
                   <span className="block text-lg font-bold">{user.weight || '--'}</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider">kg</span>
                </div>
                <div>
                   <span className="block text-lg font-bold">{user.height || '--'}</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider">m</span>
                </div>
             </div>
          </div>
       </div>

       <main className="flex-1 p-6 -mt-8 relative z-20">
          <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden">
             <button onClick={() => setSubView('edit')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5">
                <div className="size-10 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                   <span className="material-symbols-outlined">person</span>
                </div>
                <div className="flex-1 text-left">
                   <h4 className="font-bold text-sm">Dados Pessoais</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Editar nome, foto, medidas</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
             </button>
             <button onClick={() => setSubView('history')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5">
                <div className="size-10 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                   <span className="material-symbols-outlined">school</span>
                </div>
                <div className="flex-1 text-left">
                   <h4 className="font-bold text-sm">Histórico de Graduação</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Minhas faixas</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
             </button>
             <button onClick={() => setSubView('settings')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5">
                <div className="size-10 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                   <span className="material-symbols-outlined">settings</span>
                </div>
                <div className="flex-1 text-left">
                   <h4 className="font-bold text-sm">Configurações</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Notificações e app</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
             </button>
          </div>

          <button onClick={onLogout} className="w-full mt-6 flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-white/5 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
             <span className="material-symbols-outlined">logout</span>
             Sair da conta
          </button>
       </main>
       <BottomNavigation active="profile" onNavigate={onNavigate} />
    </div>
  )
}

const DisciplineView = ({ discipline, progress, onBack, onSelectLevel }: any) => {
  return (
    <div className="bg-white text-black font-display antialiased pb-24 min-h-screen dark:bg-surface-dark dark:text-white">
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-black dark:border-white/10 px-4 h-14 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <span className="font-bold text-sm tracking-widest uppercase">Zen Jitsu</span>
        <div className="w-10"></div>
      </div>
      
      <div className="w-full h-48 relative border-b border-black dark:border-white/10 overflow-hidden bg-gray-100">
        <img alt="Training" className="w-full h-full object-cover grayscale contrast-125" src={discipline.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-surface-dark dark:via-surface-dark/20"></div>
        <div className="absolute bottom-0 left-0 p-5 w-full">
          <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide mb-2 inline-block">Disciplina</span>
          <h1 className="text-3xl font-black uppercase tracking-tight leading-none text-black dark:text-white drop-shadow-sm">{discipline.name}</h1>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-l-[3px] border-black dark:border-white pl-4 font-medium">
           {discipline.description}
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg p-3 text-center flex flex-col gap-1">
            <span className="block text-xl font-black">{discipline.levels.reduce((acc: number, l: any) => acc + l.techniques.length, 0)}</span>
            <span className="text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold tracking-wider">Técnicas</span>
          </div>
          <div className="bg-surface border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg p-3 text-center flex flex-col gap-1">
            <span className="block text-xl font-black">{discipline.levels.length}</span>
            <span className="text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold tracking-wider">Níveis</span>
          </div>
          <div className="bg-surface border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg p-3 text-center flex flex-col gap-1">
            <span className="block text-xl font-black">--</span>
            <span className="text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold tracking-wider">Horas</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-5">
           <h2 className="text-lg font-bold uppercase flex items-center gap-2">
             <span className="material-symbols-outlined">stairs</span>
             Níveis
           </h2>
        </div>
        
        <div className="space-y-4 relative">
          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-white/10 -z-10"></div>
          
          {discipline.levels.map((level: Level) => {
             const allTechs = level.techniques.length;
             const completed = level.techniques.filter(t => progress.completedTechniques.includes(t.id)).length;
             const pct = allTechs === 0 ? 0 : Math.round((completed/allTechs)*100);

             return (
               <div key={level.id} onClick={() => onSelectLevel(level)} className="cursor-pointer">
                  {/* Active/Unlocked look */}
                   <div className="bg-white dark:bg-surface-dark border-2 border-black dark:border-white rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden z-10 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
                     <div className="flex gap-4">
                       <div className="w-14 h-14 bg-gray-50 dark:bg-white/10 border-2 border-black dark:border-white rounded-lg flex items-center justify-center shrink-0">
                         <div className={`w-10 h-2 ${level.color} border border-gray-300 shadow-sm`}></div>
                       </div>
                       <div className="flex-1 pt-1 z-10">
                         <h3 className="font-bold text-lg leading-none mb-1">{level.name}</h3>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">{level.description}</p>
                         <div className="flex items-center justify-between text-xs font-bold mb-1">
                           <span>Progresso</span>
                           <span>{pct}%</span>
                         </div>
                         <div className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full border border-black dark:border-white overflow-hidden">
                           <div className="h-full bg-black dark:bg-white transition-all duration-500" style={{width: `${pct}%`}}></div>
                         </div>
                       </div>
                     </div>
                   </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}

const LevelView = ({ level, disciplineName, progress, onBack, onToggleTechnique }: any) => {
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');

  const allTechs = level.techniques.length;
  const completed = level.techniques.filter((t: Technique) => progress.completedTechniques.includes(t.id)).length;
  const pct = allTechs === 0 ? 0 : Math.round((completed/allTechs)*100);

  const handleAskSensei = async (tech: Technique) => {
    setActiveTechnique(tech);
    setAiResponse(null);
    setLoadingAi(true);

    const uncompletedTechs = level.techniques
      .filter((t: Technique) => !progress.completedTechniques.includes(t.id))
      .map((t: Technique) => t.title);
      
    const response = await askSensei(tech.title, disciplineName, pct, uncompletedTechs);
    setAiResponse(response);
    setLoadingAi(false);
  };

  const filteredTechniques = level.techniques.filter((t: Technique) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'Todas' || t.category === filter;
      return matchesSearch && matchesFilter;
  });

  const categories = ['Todas', ...Array.from(new Set(level.techniques.map((t: Technique) => t.category || 'Geral')))];

  return (
    <div className="bg-background-light dark:bg-surface-dark text-black dark:text-white font-display antialiased min-h-screen flex flex-col">
       <div className="relative z-50">
        {activeTechnique && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setActiveTechnique(null)}></div>
                <div className="relative w-full max-w-md m-4 bg-black text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-800 to-black opacity-50 z-0"></div>
                    <div className="relative z-10 p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-wider">SENSEI AI</h3>
                            <button onClick={() => setActiveTechnique(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-16 bg-white text-black rounded-2xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-4xl">smart_toy</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold leading-tight">{activeTechnique.title}</h2>
                                <p className="text-gray-400 text-sm">Análise Técnica</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar mb-6">
                            {loadingAi ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                                    <p className="text-gray-400 text-sm animate-pulse">Meditando...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm">
                                    <div className="whitespace-pre-line text-gray-300 leading-relaxed font-medium">
                                        {aiResponse}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setActiveTechnique(null)} className="w-full bg-white text-black font-bold h-14 rounded-2xl uppercase tracking-widest hover:bg-gray-200 transition-colors">
                            Oss
                        </button>
                    </div>
                </div>
            </div>
        )}
       </div>

       <header className="sticky top-0 z-40 flex items-center justify-between px-4 pt-6 pb-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md">
            <button onClick={onBack} className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold uppercase tracking-wide">{level.name}</h1>
            <div className="w-10"></div>
       </header>

       <main className="flex-1 overflow-y-auto px-4 pb-24 z-10">
            <div className="py-6">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progresso do Nível</p>
                        <h2 className="text-2xl font-bold mt-1">{completed}<span className="text-gray-400">/{allTechs}</span> <span className="text-base font-normal text-gray-500">Técnicas</span></h2>
                    </div>
                    <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full border border-black dark:border-white">
                        <span className="font-bold text-sm">{pct}%</span>
                    </div>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white rounded-full" style={{width: `${pct}%`}}></div>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input 
                        className="w-full bg-white dark:bg-[#2C2C2E] border border-gray-200 dark:border-[#3C3C3E] rounded-xl py-3.5 pl-12 pr-4 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all shadow-sm" 
                        placeholder="Buscar técnica (ex: Armlock)" 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide mb-2">
                {categories.map((cat: any) => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-colors
                        ${filter === cat 
                            ? 'bg-black text-white dark:bg-white dark:text-black' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-black dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/30'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {filteredTechniques.map((tech: Technique) => {
                    const isCompleted = progress.completedTechniques.includes(tech.id);
                    return (
                        <div key={tech.id} className="group relative bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-200 dark:border-[#2C2C2E] shadow-sm hover:border-black/30 dark:hover:border-white/30 transition-all duration-300">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-[#2C2C2E] text-gray-500 dark:text-gray-400">{tech.category || 'Geral'}</span>
                                    </div>
                                    <h3 className="text-base font-semibold text-black dark:text-white leading-tight mb-1 truncate">{tech.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tech.description}</p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <button 
                                            onClick={() => handleAskSensei(tech)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-xs font-bold transition-colors"
                                        >
                                            <span className="material-symbols-outlined filled text-[16px]">smart_toy</span>
                                            Sensei AI
                                        </button>
                                        
                                        {tech.videoUrl && (
                                            <a
                                                href={tech.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 text-xs font-bold transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                                                Vídeo Aula
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-start h-full pt-1">
                                    <button 
                                        onClick={() => onToggleTechnique(tech.id)}
                                        className={`w-8 h-8 border-2 rounded-lg transition-all flex items-center justify-center
                                        ${isCompleted ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 hover:border-black dark:border-gray-600 dark:hover:border-white'}`}
                                    >
                                        <span className={`material-symbols-outlined text-white dark:text-black text-[20px] transition-all duration-200 ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
       </main>
    </div>
  );
};

const Dashboard = ({ user, progress, onSelectDiscipline, onNavigate, onLogout }: any) => {
  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col antialiased text-black dark:bg-surface-dark dark:text-white">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/5 transition-colors">
        <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold text-xl shadow-lg shadow-black/10">
                    Z
                </div>
                <h1 className="text-black dark:text-white text-lg font-bold tracking-tight">Zen Jitsu</h1>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onLogout} className="relative p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined text-[24px]">logout</span>
                </button>
            </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-24">
        <section className="p-5 pb-2">
            <div className="flex items-center gap-4 mb-8">
                <div className="relative group cursor-pointer" onClick={() => onNavigate(ViewState.PROFILE)}>
                    <div className="size-16 rounded-full bg-cover bg-center border-2 border-black dark:border-white p-0.5" style={{backgroundImage: `url("${user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3srA55zGUWfg8BxETBFloB9muv6M8nfCIA07QKBPEYjiTkK0Vx-3nTsexLH7ov4KJaJ_k4ZO6cyAIFp4PW4Q-sAJGrrzkJoxbDveyBUhhn5ZHmTYC9obcEj5gKIaDO1t0vsZX_gr-fwB_mHrJPjJUjA5kOE4-BEAELAnGljRYMgNlEw2IMot1Ic-LXmCsuwWB2BcF3aWdhUceKAKo6dUKf2fqNXRXsdIMcd8Z4a-iYZ7mkNGiQ_L8v7V5SP1TnGwx2W1SFlouMg'}")`}}></div>
                    <div className="absolute bottom-0 right-0 size-5 bg-black dark:bg-white border-2 border-white dark:border-[#1C1C1E] rounded-full flex items-center justify-center">
                        <div className="size-2 bg-white dark:bg-black rounded-full"></div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-black dark:text-white text-2xl font-bold leading-tight">Olá, {user.name}</h2>
                    <span className="text-gray-600 dark:text-gray-400 font-medium text-sm tracking-wide uppercase">Faixa Branca • 1º Grau</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div onClick={() => onNavigate(ViewState.EVOLUTION)} className="bg-card-gray dark:bg-white/5 p-5 rounded-xl flex flex-col justify-between h-36 border border-transparent hover:border-black/10 dark:hover:border-white/20 transition-colors group relative overflow-hidden cursor-pointer">
                    <div className="flex justify-between items-start z-10">
                        <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors text-black dark:text-white">
                            <span className="material-symbols-outlined">bar_chart</span>
                        </div>
                        <span className="text-xs font-bold text-black dark:text-white bg-white dark:bg-white/10 px-2 py-1 rounded-full shadow-sm">Ver</span>
                    </div>
                    <div className="z-10">
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Técnicas</p>
                        <p className="text-black dark:text-white text-3xl font-extrabold tracking-tight">{progress.completedTechniques.length}</p>
                    </div>
                </div>
                
                <div onClick={() => onNavigate(ViewState.SCHEDULE)} className="bg-black dark:bg-white p-5 rounded-xl shadow-xl shadow-black/10 flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer group">
                    <div className="absolute -right-6 -top-6 size-32 bg-gray-800 dark:bg-gray-200 rounded-full blur-3xl opacity-50"></div>
                    <div className="flex justify-between items-start z-10">
                        <div className="p-2 bg-white/20 dark:bg-black/10 rounded-lg backdrop-blur-sm text-white dark:text-black">
                            <span className="material-symbols-outlined">schedule</span>
                        </div>
                    </div>
                    <div className="z-10">
                        <p className="text-gray-300 dark:text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">Próxima Aula</p>
                        <p className="text-white dark:text-black text-xl font-bold leading-tight">Hoje, 19:30</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-black dark:text-white text-xl font-bold">Minhas Disciplinas</h3>
                <button className="text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors">Ver todas</button>
            </div>

            <div className="flex flex-col gap-4">
               {DISCIPLINES.map((discipline) => {
                   const allTechs = discipline.levels.flatMap(l => l.techniques);
                   const completed = allTechs.filter(t => progress.completedTechniques.includes(t.id)).length;
                   const pct = allTechs.length === 0 ? 0 : Math.round((completed/allTechs.length)*100);

                   return (
                     <article key={discipline.id} onClick={() => onSelectDiscipline(discipline)} className="bg-card-gray dark:bg-white/5 rounded-2xl p-5 border border-transparent hover:border-black/20 dark:hover:border-white/20 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 shrink-0 rounded-xl bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-300" style={{backgroundImage: `url("${discipline.imageUrl}")`}}></div>
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-black dark:text-white font-bold text-lg leading-tight mb-1">{discipline.name}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{discipline.instructor}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                            <div className="flex justify-between text-xs mb-2 font-medium">
                                <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                                <span className="text-black dark:text-white font-bold">{pct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-500" style={{width: `${pct}%`}}></div>
                            </div>
                        </div>
                     </article>
                   )
               })}
            </div>
        </section>
      </main>
      <BottomNavigation active="home" onNavigate={onNavigate} />
    </div>
  );
};

// --- Main App ---

enum ViewState {
  LOGIN,
  ONBOARDING,
  DASHBOARD,
  DISCIPLINE,
  LEVEL,
  ATTENDANCE,
  SCHEDULE,
  EVOLUTION,
  PROFILE
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOGIN);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [progress, setProgress] = useState<ProgressState>({ completedTechniques: [], attendanceDates: [] });

  useEffect(() => {
    const lastUserEmail = localStorage.getItem('last_user');
    if (lastUserEmail) {
      const stored = localStorage.getItem(`user_${lastUserEmail}`);
      if (stored) {
        const u = JSON.parse(stored);
        handleLogin(u);
      }
    }
  }, []);

  const handleLogin = (u: User) => {
    // Ensure user has default avatar if none provided from older storage
    const userWithAvatar = {
        ...u,
        avatar: u.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3srA55zGUWfg8BxETBFloB9muv6M8nfCIA07QKBPEYjiTkK0Vx-3nTsexLH7ov4KJaJ_k4ZO6cyAIFp4PW4Q-sAJGrrzkJoxbDveyBUhhn5ZHmTYC9obcEj5gKIaDO1t0vsZX_gr-fwB_mHrJPjJUjA5kOE4-BEAELAnGljRYMgNlEw2IMot1Ic-LXmCsuwWB2BcF3aWdhUceKAKo6dUKf2fqNXRXsdIMcd8Z4a-iYZ7mkNGiQ_L8v7V5SP1TnGwx2W1SFlouMg'
    };
    setUser(userWithAvatar);
    localStorage.setItem('last_user', u.email);
    
    // Progress
    const savedProgress = localStorage.getItem(`progress_${u.email}`);
    if (savedProgress) {
      const loaded = JSON.parse(savedProgress);
      setProgress({
        completedTechniques: loaded.completedTechniques || [],
        attendanceDates: loaded.attendanceDates || []
      });
    } else {
      setProgress({ completedTechniques: [], attendanceDates: [] });
    }

    // Check if profile is complete (Onboarding check)
    if (!u.name || !u.age || !u.weight || !u.height || !u.goal) {
        setCurrentView(ViewState.ONBOARDING);
    } else {
        setCurrentView(ViewState.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('last_user');
    setCurrentView(ViewState.LOGIN);
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    
    // Merge updates with existing storage to preserve password
    const storageKey = `user_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
    localStorage.setItem(storageKey, JSON.stringify({ ...existing, ...updatedData }));
  };

  const handleOnboardingComplete = (data: Partial<User>) => {
      handleUpdateUser(data);
      setCurrentView(ViewState.DASHBOARD);
  };

  const updateProgress = (techId: string) => {
    setProgress(prev => {
      const isCompleted = prev.completedTechniques.includes(techId);
      let newCompleted;
      if (isCompleted) {
        newCompleted = prev.completedTechniques.filter(id => id !== techId);
      } else {
        newCompleted = [...prev.completedTechniques, techId];
      }
      const newState = { ...prev, completedTechniques: newCompleted };
      if (user) {
        localStorage.setItem(`progress_${user.email}`, JSON.stringify(newState));
      }
      return newState;
    });
  };

  const markAttendance = (dateStr: string) => {
    setProgress(prev => {
        if (prev.attendanceDates.includes(dateStr)) return prev;
        const newDates = [...prev.attendanceDates, dateStr];
        const newState = { ...prev, attendanceDates: newDates };
        if (user) {
            localStorage.setItem(`progress_${user.email}`, JSON.stringify(newState));
        }
        return newState;
    });
  };

  // Nav Helpers
  const goToDiscipline = (d: Discipline) => {
    setSelectedDiscipline(d);
    setCurrentView(ViewState.DISCIPLINE);
  };

  const goToLevel = (l: Level) => {
    setSelectedLevel(l);
    setCurrentView(ViewState.LEVEL);
  };

  if (currentView === ViewState.LOGIN) return <LoginView onLogin={handleLogin} />;
  if (currentView === ViewState.ONBOARDING && user) return <OnboardingView user={user} onComplete={handleOnboardingComplete} />;
  if (currentView === ViewState.DASHBOARD && user) return <Dashboard user={user} progress={progress} onSelectDiscipline={goToDiscipline} onNavigate={setCurrentView} onLogout={handleLogout} />;
  if (currentView === ViewState.ATTENDANCE) return <AttendanceView progress={progress} onNavigate={setCurrentView} onCheckIn={markAttendance} />;
  if (currentView === ViewState.SCHEDULE) return <ScheduleView onNavigate={setCurrentView} />;
  if (currentView === ViewState.EVOLUTION && user) return <EvolutionView user={user} progress={progress} onNavigate={setCurrentView} />;
  if (currentView === ViewState.PROFILE && user) return <ProfileView user={user} onLogout={handleLogout} onNavigate={setCurrentView} onUpdateUser={handleUpdateUser} />;
  if (currentView === ViewState.DISCIPLINE && selectedDiscipline) return <DisciplineView discipline={selectedDiscipline} progress={progress} onBack={() => setCurrentView(ViewState.DASHBOARD)} onSelectLevel={goToLevel} />;
  if (currentView === ViewState.LEVEL && selectedLevel && selectedDiscipline) return <LevelView level={selectedLevel} disciplineName={selectedDiscipline.name} progress={progress} onBack={() => setCurrentView(ViewState.DISCIPLINE)} onToggleTechnique={updateProgress} />;

  return <div>Erro: Estado inválido</div>;
}