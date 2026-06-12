import type { ReactNode } from 'react';
import { Sidebar, type SidebarNavId } from './Sidebar';
import { AppFooter } from './AppFooter';

interface DashboardLayoutProps {
  children: ReactNode;
  activeNav?: SidebarNavId;
  showFooter?: boolean;
  compactFooter?: boolean;
  className?: string;
}

export const DashboardLayout = ({
  children,
  activeNav = 'files',
  showFooter = true,
  compactFooter = false,
  className = '',
}: DashboardLayoutProps) => (
  <div className={`flex min-h-screen bg-background ${className}`}>
    <Sidebar activeNav={activeNav} />
    <div className="ml-60 flex min-h-screen min-w-0 flex-1 flex-col">
      {children}
      {showFooter && (
        <AppFooter compact={compactFooter} className={compactFooter ? 'mt-auto' : 'px-margin-desktop'} />
      )}
    </div>
  </div>
);

export default DashboardLayout;
