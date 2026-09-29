import React, { useState, useEffect } from 'react';
import { DashboardGrid } from './components/dashboard/DashboardGrid';
import { loginUser, getToken, logoutUser } from './services/authService';
import { LogOut, Lock, User, TriangleAlert, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './hooks/useTheme';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const token = getToken();
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = await loginUser(username, password);
    if (success) {
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Usuario o contraseña inválidos.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  // Blobs luminosos de fondo estilo iOS
  const backgroundBlobs = (
    <>
      <div className="blob" style={{ width: '600px', height: '600px', background: '#0a84ff', left: '-100px', top: '-120px' }}></div>
      <div className="blob" style={{ width: '550px', height: '550px', background: '#bf5af2', right: '-100px', top: '200px' }}></div>
      <div className="blob" style={{ width: '500px', height: '500px', background: '#ff375f', left: '400px', bottom: '-200px', opacity: 0.25 }}></div>
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {backgroundBlobs}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-8 space-y-6 relative z-10"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#64d2ff] via-[#0a84ff] to-[#bf5af2] flex items-center justify-center shadow-[0_10px_30px_rgba(10,132,255,0.5)]">
              <TriangleAlert size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)]">AccidentAPP · Univalle</h1>
            <p className="text-xs text-[var(--text-muted)]">Sistema de Monitoreo de Siniestralidad Vial</p>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Usuario</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-accent-blue)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-accent-blue)]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-11 rounded-xl font-bold text-sm bg-gradient-to-b from-[#4da3ff] via-[#0a84ff] to-[#5e5ce6] text-white shadow-[0_8px_24px_rgba(10,132,255,0.5)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Ingresar al Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {backgroundBlobs}
      <div className="w-full max-w-[1600px] mx-auto space-y-6 relative z-10">
        
        {/* Header Estilo iOS */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#64d2ff] via-[#0a84ff] to-[#bf5af2] flex items-center justify-center shadow-[0_10px_30px_rgba(10,132,255,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]">
              <TriangleAlert size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">AccidentAPP</h1>
              <p className="text-sm text-[var(--text-muted)]">Monitoreo gerencial de accidentes de tránsito (1.1M+ registros)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-lg"
              title="Cambiar Tema"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>

            <button 
              onClick={handleLogout}
              className="h-11 px-5 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 hover:bg-red-500/25 transition-colors flex items-center gap-2 font-semibold text-sm cursor-pointer shadow-lg"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </motion.header>

        {/* Dashboard Grid Redimensionable y Fluido */}
        <DashboardGrid />

      </div>
    </div>
  );
}

export default App;