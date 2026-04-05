import { useGlobalContext } from '../../context/GlobalContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

const navItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'Insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, setSidebarCollapsed } = useGlobalContext();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30
          bg-white dark:bg-surface-900/90 backdrop-blur-xl border-r border-surface-200 dark:border-surface-700/50
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-100 dark:border-surface-700/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold gradient-text whitespace-nowrap">
              Financial Dashboard
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}`}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm shadow-primary-500/5'
                      : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/80 hover:text-surface-900 dark:hover:text-surface-200 border border-transparent'
                  }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 pb-6">
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
              text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/80 hover:text-surface-900 dark:hover:text-surface-200
              transition-all duration-200 border border-surface-200 dark:border-surface-700/30"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse Content</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
