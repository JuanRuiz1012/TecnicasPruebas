import React, { useState } from "react";
import { DashboardGrid } from "./components/dashboard/DashboardGrid";
import { PredictorWidget } from "./components/dashboard/PredictorWidget";
import {
  AppDashboardShell,
  BrandMark,
  IconButton,
} from "./components/ui/app-dashboard-shell";
import {
  loginUser,
  getToken,
  getSession,
  logoutUser,
} from "./services/authService";
import {
  BookOpen,
  BrainCircuit,
  ChartNoAxesCombined,
  Lock,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./hooks/useTheme";

const API_DOCS_URL = "http://127.0.0.1:8000/docs";

const VIEWS = {
  overview: {
    label: "Resumen",
    subtitle:
      "Indicadores y distribución de siniestros viales · datos históricos consolidados",
  },
  predict: {
    label: "Predicción ML",
    subtitle: "Simulador de severidad con Random Forest e informe gerencial",
  },
};

function buildNav(rol) {
  const analysis = [
    { id: "overview", label: VIEWS.overview.label, icon: ChartNoAxesCombined },
  ];
  // El rol ciudadano no accede a predicciones (requerimiento de roles)
  if (rol !== "ciudadano")
    analysis.push({
      id: "predict",
      label: VIEWS.predict.label,
      icon: BrainCircuit,
      badge: "ML",
    });
  return [
    { label: "Análisis", items: analysis },
    {
      label: "Recursos",
      items: [
        {
          id: "docs",
          label: "Documentación API",
          icon: BookOpen,
          href: API_DOCS_URL,
        },
      ],
    },
  ];
}

const fieldClass =
  "h-10 w-full rounded-[9px] border border-[color:var(--bjork-border)] bg-[var(--bjork-field)] pl-9 pr-3 text-[13.5px] text-[color:var(--bjork-text)] shadow-[var(--bjork-shadow-soft)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[color:var(--bjork-text-soft)] focus-visible:border-[color:var(--bjork-accent)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--bjork-accent-soft)]";

function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <IconButton
      label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      onClick={toggleTheme}
    >
      {isDark ? <Sun /> : <Moon />}
    </IconButton>
  );
}

function LoginScreen({ onLogin, theme }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const success = await loginUser(username, password);
    setLoading(false);
    if (success) onLogin();
    else setErrorMsg("Usuario o contraseña inválidos.");
  };

  return (
    <div className="grid min-h-screen bg-[var(--bjork-bg)] text-[color:var(--bjork-text)] lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-[14px] font-semibold">AccidentAPP</span>
        </div>
        <div className="max-w-[460px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--bjork-accent-ink)]">
            Universidad del Valle
          </p>
          <h2 className="mt-3 font-display text-[44px] italic leading-[1.05] tracking-[-0.01em]">
            Datos para decidir dónde y cuándo intervenir la malla vial.
          </h2>
          <ul className="mt-8 space-y-3 text-[13.5px] text-[color:var(--bjork-text-medium)]">
            <li className="flex items-center gap-2.5">
              <ChartNoAxesCombined
                size={16}
                className="text-[color:var(--bjork-accent)]"
                aria-hidden="true"
              />{" "}
              Analisis Descriptivo y predictivo{" "}
            </li>
            <li className="flex items-center gap-2.5">
              <BrainCircuit
                size={16}
                className="text-[color:var(--bjork-accent)]"
                aria-hidden="true"
              />{" "}
              Predicción de severidad con Machine Learning
            </li>
            {/* <li className="flex items-center gap-2.5"><Lock size={16} className="text-[color:var(--bjork-accent)]" aria-hidden="true" /> Acceso por roles: admin, analista y ciudadano</li> */}
          </ul>
        </div>
        <p className="font-mono text-[11.5px] tabular-nums text-[color:var(--bjork-text-soft)]">
          1.1M+ registros · 5 ciudades
        </p>
      </section>

      <section className="relative flex items-center justify-center p-4 sm:p-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle {...theme} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="surface-card w-full max-w-[380px] p-6 sm:p-7"
        >
          <div className="mb-6">
            <div className="mb-4 lg:hidden">
              <BrandMark size={36} />
            </div>
            <h1 className="font-display text-[30px] italic leading-none">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-[13px] text-[color:var(--bjork-text-muted)]">
              Sistema de monitoreo de siniestralidad vial
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mb-4 rounded-[9px] bg-[var(--bjork-error-soft)] px-3 py-2 text-[12.5px] text-[color:var(--bjork-error)]"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-user"
                className="mb-1.5 block text-[12.5px] font-medium text-[color:var(--bjork-text-medium)]"
              >
                Usuario
              </label>
              <div className="relative">
                <User
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--bjork-text-soft)]"
                />
                <input
                  id="login-user"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="login-pass"
                className="mb-1.5 block text-[12.5px] font-medium text-[color:var(--bjork-text-medium)]"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--bjork-text-soft)]"
                />
                <input
                  id="login-pass"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-accent focus-ring h-10 w-full cursor-pointer rounded-[9px] text-[13.5px] font-semibold"
            >
              {loading ? "Ingresando…" : "Ingresar al dashboard"}
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getToken()),
  );
  const [view, setView] = useState("overview");
  const theme = useTheme();

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={() => {
          setView("overview");
          setIsAuthenticated(true);
        }}
        theme={theme}
      />
    );
  }

  const session = getSession();
  const current =
    view === "predict" && session.rol === "ciudadano" ? "overview" : view;

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  return (
    <AppDashboardShell
      nav={buildNav(session.rol)}
      active={current}
      onNavigate={setView}
      user={{ name: session.username || "Usuario", rol: session.rol }}
      title={VIEWS[current].label}
      subtitle={VIEWS[current].subtitle}
      actions={
        <>
          <ThemeToggle {...theme} />
          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] px-3 text-[12.5px] font-medium text-[color:var(--bjork-text-medium)] shadow-[var(--bjork-shadow-soft)] transition-colors hover:text-[color:var(--bjork-text)]"
          >
            <LogOut size={14} aria-hidden="true" /> Salir
          </button>
        </>
      }
    >
      {current === "overview" ? (
        <DashboardGrid />
      ) : (
        <div className="min-h-[420px]">
          <PredictorWidget />
        </div>
      )}
    </AppDashboardShell>
  );
}

export default App;
