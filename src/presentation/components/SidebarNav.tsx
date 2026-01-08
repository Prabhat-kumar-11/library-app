import React from 'react';

interface NavLink {
  label: string;
  page: 'available' | 'borrowed' | 'inventory' | 'tracking';
  icon: string;
  adminOnly?: boolean;
}

interface SidebarNavProps {
  isAdmin: boolean;
  currentPage: string;
  onNavigate: (page: 'available' | 'borrowed' | 'inventory' | 'tracking') => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isAdmin,
  currentPage,
  onNavigate,
}) => {
  const navLinks: NavLink[] = [
    {
      label: 'Available Books',
      page: 'available',
      icon: '📚',
    },
    {
      label: 'My Books',
      page: 'borrowed',
      icon: '📖',
    },
  ];

  if (isAdmin) {
    navLinks.push(
      {
        label: 'Inventory',
        page: 'inventory',
        icon: '📦',
        adminOnly: true,
      },
      {
        label: 'Borrowing Tracking',
        page: 'tracking',
        icon: '👥',
        adminOnly: true,
      }
    );
  }

  return (
    <nav className="space-y-2">
      {navLinks.map((link) => {
        const isActive = currentPage === link.page;
        return (
          <button
            key={link.page}
            onClick={() => onNavigate(link.page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
              isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
