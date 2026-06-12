import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { MaterialIcon } from '../common/MaterialIcon';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../lib/constants';

export type SidebarNavId = 'files' | 'shared' | 'analytics' | 'settings' | 'upload';

interface NavItem {
  id: SidebarNavId;
  label: string;
  icon: string;
  href: string;
  filled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'files', label: 'My Files', icon: 'folder', href: ROUTES.DASHBOARD, filled: true },
  { id: 'shared', label: 'Shared', icon: 'group', href: `${ROUTES.DASHBOARD}?tab=shared` },
  { id: 'analytics', label: 'Analytics', icon: 'insights', href: ROUTES.ANALYTICS },
  { id: 'settings', label: 'Settings', icon: 'settings', href: ROUTES.PROFILE },
];

interface SidebarProps {
  activeNav?: SidebarNavId;
}

export const Sidebar = ({ activeNav = 'files' }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const resolveActive = (item: NavItem): boolean => {
    if (activeNav) return item.id === activeNav;
    return location.pathname === item.href.split('?')[0];
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const initials = user?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r border-outline-variant bg-surface-container-low py-md">
      <div className="mb-xl px-md">
        <div className="mb-lg flex items-center gap-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MaterialIcon name="cloud" className="text-on-primary" size={20} filled />
          </div>
          <span className="text-headline-md font-bold text-primary">DevShare</span>
        </div>

        {user && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-high p-sm">
            <div className="flex items-center gap-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed-dim text-xs font-bold text-primary">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-bold text-on-surface">{user.displayName}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
                  Free Plan
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-sm mb-lg">
        <button
          type="button"
          onClick={() => navigate(ROUTES.UPLOAD)}
          className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary py-sm px-md text-body-sm font-medium text-on-primary transition-opacity hover:opacity-90 active:scale-95"
        >
          <MaterialIcon name="add" size={20} />
          Upload File
        </button>
      </div>

      <nav className="flex-1 space-y-xs px-xs">
        {NAV_ITEMS.map((item) => {
          const isActive = resolveActive(item);
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'stitch-nav-item',
                isActive && 'stitch-nav-active'
              )}
            >
              <MaterialIcon name={item.icon} size={20} filled={isActive && item.filled} />
              <span className="text-body-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-xs border-t border-outline-variant px-xs pt-md">
        <a href="#" className="stitch-nav-item px-sm">
          <MaterialIcon name="help" size={20} />
          <span className="text-body-sm">Help</span>
        </a>
        <button type="button" onClick={handleLogout} className="stitch-nav-item w-full px-sm">
          <MaterialIcon name="logout" size={20} />
          <span className="text-body-sm">Logout</span>
        </button>
        {user && (
          <div className="flex items-center gap-sm px-md py-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-secondary">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-label-md font-bold text-primary">{user.displayName}</p>
              <p className="truncate text-[10px] text-on-surface-variant">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
