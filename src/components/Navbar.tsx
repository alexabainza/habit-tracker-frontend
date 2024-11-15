import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MountainIcon } from "lucide-react";
import { Button } from "./ui/button";
import { MenuIcon, XIcon } from "lucide-react"; // Import icons for the hamburger and close icons

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu visibility on small screens
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu explicitly
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between text-[var(--color-primary)] bg-white py-3 shadow-sm dark:bg-gray-950 sm:px-6 md:px-8 lg:px-10">
      <Link to="#" className="flex items-center">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only text-[var(--color-primary)]">Acme Inc</span>
      </Link>

      {/* Navbar Links */}
      <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 text-sm font-medium">
        <Link to="#" className="hover:underline hover:underline-offset-4">
          Home
        </Link>
        <Link to="#" className="hover:underline hover:underline-offset-4">
          About
        </Link>
        <Link to="#" className="hover:underline hover:underline-offset-4">
          Services
        </Link>
        <Link to="#" className="hover:underline hover:underline-offset-4">
          Contact
        </Link>
      </nav>

      <button onClick={toggleMenu} className="lg:hidden p-2">
        {isOpen ? (
          <XIcon className="h-6 w-6 text-[var(--color-primary)]" />
        ) : (
          <MenuIcon className="h-6 w-6 text-[var(--color-primary)]" />
        )}
      </button>

      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {/* Add a button to explicitly close the menu */}
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 p-2 text-xl font-bold text-[var(--color-primary)]"
          >
            X
          </button>

          <Link
            to="#"
            className="py-3 text-xl font-medium hover:underline hover:underline-offset-4"
          >
            Home
          </Link>
          <Link
            to="#"
            className="py-3 text-xl font-medium hover:underline hover:underline-offset-4"
          >
            About
          </Link>
          <Link
            to="#"
            className="py-3 text-xl font-medium hover:underline hover:underline-offset-4"
          >
            Services
          </Link>
          <Link
            to="#"
            className="py-3 text-xl font-medium hover:underline hover:underline-offset-4"
          >
            Contact
          </Link>
          <Link to="#" className="flex items-center">
            <Button
              variant="outline"
              className="rounded-xl mt-4 hover:bg-[var(--color-primary)] hover:text-white"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop Login Button */}
      <Link to="#" className="hidden lg:flex items-center">
        <Button
          variant="outline"
          className="rounded-xl hover:bg-[var(--color-primary)] hover:text-white"
        >
          Login
        </Button>
      </Link>
    </header>
  );
};

export default Navbar;
