import React from "react";
import { Link } from "react-router-dom";
import { MountainIcon } from "lucide-react";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between text-[var(--color-primary)] bg-white py-3 shadow-sm dark:bg-gray-950 sm:px-6 md:px-8 lg:px-10">
      <Link to="#" className="flex items-center">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only text-[var(--color-primary)]">Acme Inc</span>
      </Link>
      <nav className="flex-1 flex items-center justify-center gap-6 text-sm font-medium ">
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
      <Link to="#" className="flex items-center ">
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
