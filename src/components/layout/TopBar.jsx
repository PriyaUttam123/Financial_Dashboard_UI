import { useState, useRef, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ChevronDown,
  Shield,
  Eye,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const mobileNavItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Transactions', label: 'Transactions', icon: ArrowLeftRight },
];

export default function TopBar() {
  const { userRole, setUserRole, filters, setFilters, activePage, setActivePage } = useGlobalContext();
  const { logout, user } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    { value: 'Admin', icon: Shield, color: 'text-primary-400', bg: 'bg-primary-500/15' },
    { value: 'Viewer', icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  ];

  const currentRole = roles.find((r) => r.value === userRole);
  const CurrentRoleIcon = currentRole.icon;

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700/50 transition-colors duration-300">
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-surface-400 hover:bg-surface-800 hover:text-surface-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold gradient-text">Financial Dashboard</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                id="search-input"
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field w-full pl-10 text-sm"
              />
            </div>
          </div>

          {/* Right Section: Theme + Role + Logout */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Role Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="role-switcher"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-200
                  ${roleDropdownOpen
                    ? 'bg-surface-100 dark:bg-surface-800 border-primary-500/40 shadow-lg shadow-primary-500/10'
                    : 'bg-surface-50/50 dark:bg-surface-800/60 border-surface-200 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600/50'
                  }`}
              >
                <div className={`w-7 h-7 rounded-lg ${currentRole.bg} flex items-center justify-center`}>
                  <CurrentRoleIcon className={`w-3.5 h-3.5 ${currentRole.color}`} />
                </div>
                <span className="hidden sm:block text-sm font-medium text-surface-700 dark:text-surface-200">{userRole}</span>
                <ChevronDown
                  className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${
                    roleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-surface-800/95 backdrop-blur-xl border border-surface-200 dark:border-surface-700/50 rounded-xl shadow-glass-lg overflow-hidden animate-slide-up z-30">
                  <div className="px-3 py-2 border-b border-surface-100 dark:border-surface-700/50">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Switch Role</p>
                  </div>
                  {roles.map((role) => {
                    const RoleIcon = role.icon;
                    const isActive = userRole === role.value;
                    return (
                      <button
                        key={role.value}
                        id={`role-option-${role.value.toLowerCase()}`}
                        onClick={() => {
                          setUserRole(role.value);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-150
                          ${isActive
                            ? 'bg-primary-600/10 text-primary-600 dark:text-primary-300'
                            : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${role.bg} flex items-center justify-center`}>
                          <RoleIcon className={`w-4 h-4 ${role.color}`} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{role.value}</p>
                          <p className="text-xs text-surface-500">
                            {role.value === 'Admin' ? 'Full access' : 'Read-only'}
                          </p>
                        </div>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary-400"></div>
                        )}
                      </button>
                    );
                  })}
                  <div className="border-t border-surface-100 dark:border-surface-700/50">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-3 text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-surface-900/95 backdrop-blur-xl border-r border-surface-700/50 animate-slide-in">
            {/* Mobile Nav Header */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-700/50">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Financial Dashboard</span>
            </div>

            {/* Mobile Search */}
            <div className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  id="mobile-search-input"
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input-field w-full pl-10 text-sm"
                />
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="px-3 py-2 space-y-1">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                        : 'text-surface-400 hover:bg-surface-800/80 hover:text-surface-200 border border-transparent'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
