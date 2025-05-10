import { NavLink } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  ArrowUpTrayIcon,
  HomeIcon,
  DocumentArrowUpIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Upload Resume',
    to: '/dashboard/upload',
    icon: DocumentArrowUpIcon,
  },
  {
    name: 'Editor',
    to: '/dashboard/editor',
    icon: DocumentTextIcon,
  },
  {
    name: 'History',
    to: '/dashboard/history',
    icon: ClockIcon,
  },
  {
    name: 'Profile',
    to: '/dashboard/profile',
    icon: UserIcon,
  },
  {
    name: 'Billing',
    to: '/dashboard/billing',
    icon: CreditCardIcon,
  },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
} 