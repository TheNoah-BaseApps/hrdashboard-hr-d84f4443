'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  ClipboardListIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'HR Workflows',
    icon: UsersIcon,
    children: [
      { name: 'Employee Onboarding', href: '/employee-onboarding', icon: UserPlusIcon },
      { name: 'Employee Staffing', href: '/employee-staffing', icon: UserGroupIcon },
      { name: 'Talent Mapping', href: '/talent-mapping', icon: UsersIcon },
      { name: 'Pre Hire Management', href: '/pre-hire-management', icon: UserPlusIcon },
      { name: 'Recruitment / ATS', href: '/recruitment-ats', icon: ClipboardListIcon },
      { name: 'Talent Development', href: '/talent-development', icon: AcademicCapIcon },
    ],
  },
  {
    name: 'Performance',
    icon: ChartBarIcon,
    children: [
      { name: 'Performance Reviews', href: '/performance-reviews', icon: ClipboardDocumentCheckIcon },
      { name: 'Goals & OKRs', href: '/goals', icon: ChartBarIcon },
    ],
  },
  {
    name: 'Time & Attendance',
    href: '/time-attendance',
    icon: ClockIcon,
  },
  {
    name: 'Payroll',
    href: '/payroll',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Benefits',
    href: '/benefits',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: DocumentTextIcon,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Organization',
    href: '/organization',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isActive = (href) => {
    return pathname === href;
  };

  const isParentActive = (children) => {
    return children?.some((child) => pathname === child.href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">HRMS Pro</h1>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.name];
            const parentActive = hasChildren && isParentActive(item.children);
            const itemActive = !hasChildren && isActive(item.href);

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        parentActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActive(child.href)
                                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <child.icon className="w-4 h-4 mr-3" />
                              <span>{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      itemActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}