'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverGroup,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img
              alt="Shiva Group"
              src="/images/final_logo_png_file-removebg-preview.png"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              Shiva Group
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/" className="text-sm font-semibold text-gray-900 dark:text-white">
            Home
          </Link>
          {user?.isAdmin && (
            <Link to="/add-party" className="text-sm font-semibold text-gray-900 dark:text-white">
              Add Party
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/manage-party" className="text-sm font-semibold text-gray-900 dark:text-white">
              Manage Party
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/manage-users" className="text-sm font-semibold text-gray-900 dark:text-white">
              Manage Users
            </Link>
          )}
          {user && (
            <Link
              to={`/profile/${user?._id}`}
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Profile
            </Link>
          )}
        </PopoverGroup>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="text-gray-900 dark:text-white focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Log Out <span aria-hidden="true">&rarr;</span>
            </button>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-gray-900 dark:text-white">
              Log In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10 bg-gray-900/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img
                alt="Shiva Group"
                src="/images/final_logo_png_file-removebg-preview.png"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                Shiva Group
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <Link to="/" className="block text-base font-semibold text-gray-900 dark:text-white">
              Home
            </Link>
            {user?.isAdmin && (
              <Link
                to="/add-party"
                className="block text-base font-semibold text-gray-900 dark:text-white"
              >
                Add Party
              </Link>
            )}
            {user?.isAdmin && (
              <Link
                to="/manage-party"
                className="block text-base font-semibold text-gray-900 dark:text-white"
              >
                Manage Party
              </Link>
            )}
            {user?.isAdmin && (
              <Link
                to="/manage-users"
                className="block text-base font-semibold text-gray-900 dark:text-white"
              >
                Manage Users
              </Link>
            )}
            {user && (
              <Link
                to={`/profile/${user?._id}`}
                className="block text-base font-semibold text-gray-900 dark:text-white"
              >
                Profile
              </Link>
            )}
          </div>
          <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-6">
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-base font-semibold text-gray-900 dark:text-white"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-base font-semibold text-gray-900 dark:text-white"
              >
                Log In
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;
