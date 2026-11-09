import React, { useEffect, useRef, useState } from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, TriangleAlert, X } from 'lucide-react';

/*
 * Shell de la app: sidebar colapsable (>= md), drawer en móvil, header con breadcrumb y acciones.
 * Adaptado de "app-dashboard-shell" (bjork) a JSX y al dominio de AccidentAPP.
 */

export function IconButton({ label, children, className = '', size = 'md', ...props }) {
  const box = size === 'sm' ? 'size-7 [&>svg]:size-[15px]' : 'size-8 [&>svg]:size-[17px]';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[9px] text-[color:var(--bjork-text-muted)] transition-colors duration-150 hover:bg-[var(--bjork-surface-hover)] hover:text-[color:var(--bjork-text)] disabled:pointer-events-none disabled:opacity-40 ${box} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function InitialsAvatar({ name = '', size = 28 }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full bg-[var(--bjork-accent-soft)] font-semibold text-[color:var(--bjork-accent-ink)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

export function BrandMark({ size = 32 }) {
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-[9px] bg-[var(--bjork-accent)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.2)]"
      style={{ width: size, height: size }}
    >
      <TriangleAlert size={size * 0.55} strokeWidth={2.2} />
    </span>
  );
}

function SidebarContent({ mode, collapsed, nav, active, onNavigate, user, onToggleCollapsed, onClose, closeRef }) {
  return (
    <>
      <div className={`flex h-14 shrink-0 items-center gap-2 border-b border-[color:var(--bjork-border)] ${collapsed ? 'justify-center px-2' : 'px-3'}`}>
        <div className="flex min-w-0 flex-1 items-center gap-2.5 p-1.5" title={collapsed ? 'AccidentAPP' : undefined}>
          <BrandMark />
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold leading-tight">AccidentAPP</span>
              <span className="block truncate text-[11.5px] leading-tight text-[color:var(--bjork-text-muted)]">Univalle · Siniestralidad vial</span>
            </span>
          )}
        </div>
        {mode === 'drawer' && (
          <IconButton label="Cerrar navegación" size="sm" onClick={onClose} ref={closeRef}>
            <X />
          </IconButton>
        )}
      </div>

      <nav aria-label="Principal" className={`flex-1 overflow-y-auto py-3 ${collapsed ? 'px-2' : 'px-2.5'}`}>
        {nav.map((group, gi) => (
          <div key={group.label ?? gi} className={gi > 0 ? 'mt-5' : ''}>
            {group.label &&
              (collapsed ? (
                <div aria-hidden="true" className="mx-auto mb-2 h-px w-6 bg-[var(--bjork-border)]" />
              ) : (
                <h2 className="mb-1.5 px-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--bjork-text-soft)]">{group.label}</h2>
              ))}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = item.id === active;
                const Icon = item.icon;
                const external = Boolean(item.href);
                return (
                  <li key={item.id}>
                    <a
                      href={item.href ?? `#${item.id}`}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      onClick={(e) => {
                        if (external) return;
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`focus-ring group relative flex h-9 items-center gap-2.5 rounded-[9px] text-[13.5px] transition-colors duration-150 ${collapsed ? 'justify-center px-0' : 'px-2.5'} ${
                        isActive
                          ? 'bg-[var(--bjork-surface)] font-medium text-[color:var(--bjork-text)] shadow-[var(--bjork-shadow-soft),0_0_0_1px_var(--bjork-border)]'
                          : 'text-[color:var(--bjork-text-medium)] hover:bg-[var(--bjork-surface-hover)] hover:text-[color:var(--bjork-text)]'
                      }`}
                    >
                      {isActive && <span aria-hidden="true" className="absolute -left-2.5 top-2 h-5 w-[3px] rounded-r-full bg-[var(--bjork-accent)]" />}
                      <Icon
                        aria-hidden="true"
                        className={`size-[17px] shrink-0 ${isActive ? 'text-[color:var(--bjork-accent-ink)]' : 'text-[color:var(--bjork-text-muted)]'}`}
                      />
                      {collapsed ? (
                        <span className="sr-only">{item.label}</span>
                      ) : (
                        <>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-[6px] bg-[var(--bjork-accent-soft)] px-1.5 py-px font-mono text-[11px] text-[color:var(--bjork-accent-ink)]">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={`shrink-0 border-t border-[color:var(--bjork-border)] p-2.5 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <div className="surface-card mb-2.5 p-3 !rounded-[12px] !shadow-[var(--bjork-shadow-soft)]">
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="font-medium">Base de datos</span>
              <span className="font-mono tabular-nums text-[color:var(--bjork-text-muted)]">MongoDB</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-snug text-[color:var(--bjork-text-muted)]">
              1.1M+ registros históricos de 5 ciudades de Colombia.
            </p>
          </div>
        )}
        <div className={`flex items-center gap-1 ${collapsed ? 'flex-col' : ''}`}>
          <div className={`flex min-w-0 items-center gap-2.5 p-1.5 ${collapsed ? 'flex-none' : 'flex-1'}`} title={collapsed ? user.name : undefined}>
            <InitialsAvatar name={user.name} size={28} />
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium capitalize leading-tight">{user.name}</span>
                <span className="block truncate text-[11.5px] capitalize leading-tight text-[color:var(--bjork-text-muted)]">{user.rol || 'Usuario'}</span>
              </span>
            )}
          </div>
          {mode === 'rail' && (
            <IconButton
              label={collapsed ? 'Expandir menú' : 'Contraer menú'}
              size="sm"
              onClick={onToggleCollapsed}
              aria-expanded={!collapsed}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
}

export function AppDashboardShell({ nav, active, onNavigate, user, title, subtitle, actions, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const opener = menuRef.current;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [drawerOpen]);

  const navigate = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  const shared = { nav, active, onNavigate: navigate, user };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bjork-bg)] text-[color:var(--bjork-text)]">
      <aside
        aria-label="Barra lateral"
        className={`relative z-20 hidden h-full shrink-0 flex-col border-r border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] transition-[width] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none md:flex ${collapsed ? 'w-[64px]' : 'w-[244px]'}`}
      >
        <SidebarContent {...shared} mode="rail" collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col" inert={drawerOpen || undefined}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[color:var(--bjork-border)] px-3 md:px-5">
          <IconButton label="Abrir navegación" className="md:hidden" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} ref={menuRef}>
            <Menu />
          </IconButton>
          <nav aria-label="Ruta" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <li className="hidden truncate text-[color:var(--bjork-text-muted)] sm:block">AccidentAPP</li>
              <li aria-hidden="true" className="hidden text-[color:var(--bjork-text-faint)] sm:block">/</li>
              <li aria-current="page" className="truncate font-medium">{title}</li>
            </ol>
          </nav>
          <div className="ml-auto flex items-center gap-1.5">{actions}</div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-3 pb-10 pt-5 md:gap-5 md:px-6 md:pt-6">
            <div>
              <h1 className="font-display text-[28px] italic leading-none tracking-[-0.01em] md:text-[34px]">{title}</h1>
              {subtitle && <p className="mt-2 text-[13px] text-[color:var(--bjork-text-muted)]">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navegación">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative flex h-full w-[270px] max-w-[85vw] flex-col border-r border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] shadow-[var(--bjork-shadow-menu)]">
            <SidebarContent {...shared} mode="drawer" collapsed={false} onClose={() => setDrawerOpen(false)} closeRef={closeRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppDashboardShell;
