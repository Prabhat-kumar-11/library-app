import React from 'react';
import { useLocation } from 'react-router-dom';

interface NavLink {
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}

interface SidebarNavProps {
  isAdmin: boolean;
  onNavigate?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ isAdmin, onNavigate }) => {
  const location = useLocation();

  const navLinks: NavLink[] = [
    {
      label: 'Available Books',
      path: '/',
      icon: '📚',
    },
    {
      label: 'My Books',
      path: '/borrowed',
      icon: '📖',
    },
  ];

  if (isAdmin) {
    navLinks.push(
      {
        label: 'Inventory',
        path: '/inventory',
        icon: '📦',
        adminOnly: true,
      },
      {
        label: 'Borrowing Tracking',
        path: '/tracking',
        icon: '👥',
        adminOnly: true,
      }
    );
  }

  return (
    <nav className="space-y-2">
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <a
            key={link.path}
            href={link.path}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', link.path);
              window.dispatchEvent(new PopStateEvent('popstate'));
              onNavigate?.();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
};
