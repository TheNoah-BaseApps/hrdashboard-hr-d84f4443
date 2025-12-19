'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  UserCheck, 
  ClipboardList, 
  Briefcase,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Heart,
  Users
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Access Management', href: '/access-management', icon: UserCheck },
  { name: 'Employee Onboarding', href: '/employee-onboarding', icon: ClipboardList },
  { name: 'Employee Staffing', href: '/employee-staffing', icon: Briefcase },
  { name: 'Compensation Planning', href: '/compensation-planning', icon: DollarSign },
  { name: 'Culture & Experience', href: '/culture-experience', icon: Heart },
  { name: 'Employee Engagement', href: '/employee-engagement', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapse button - desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center p-3 border-t border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </aside>
    </>
  );
}