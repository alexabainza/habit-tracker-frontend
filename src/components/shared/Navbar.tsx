import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { MenuIcon, User2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, MountainIcon, User } from "lucide-react";
import { RootState } from "@/redux/store";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "@/redux/user/userSlice";
import { useFetch } from "@/hooks/use-fetch";
const Navbar: React.FC = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const toggleBurgerMenu = () => setIsBurgerOpen(!isBurgerOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignOut = async () => {
    dispatch(signOutUserStart());

    try {
      const response = await useFetch("/auth/logout", "post");
      const result = response.data;

      if (result.status === 200) {
        dispatch(signOutUserSuccess());
        navigate("/login");
      } else {
        const data = await result.json();
        dispatch(signOutUserFailure(data.message || "Logout failed"));
      }
    } catch (error: any) {
      dispatch(
        signOutUserFailure(error.message || "An unexpected error occurred")
      );
    }
  };
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between text-[var(--color-primary)] bg-white py-3 shadow-sm dark:bg-gray-950 sm:px-6 md:px-8 lg:px-10 px-6">
      <Link
        to={currentUser?.token ? "/dashboard" : "/"}
        className="flex items-center"
      >
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only text-[var(--color-primary)]">Acme Inc</span>
      </Link>
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

      <button
        type="button"
        onClick={toggleBurgerMenu}
        className="lg:hidden p-2"
      >
        <MenuIcon className="h-6 w-6 text-[var(--color-primary)]" />
        <span className="sr-only">Open</span>
      </button>

      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform ${
          isBurgerOpen
            ? "transform translate-x-0"
            : "transform -translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={toggleBurgerMenu}
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

          {currentUser?.token ? (
            <Button className="relative rounded-full hover:bg-gray-200">
              <User2 />
              {currentUser.user.username}
            </Button>
          ) : (
            <Link to="/login" className="flex items-center">
              <Button
                variant="ghost"
                className="rounded-xl mt-4 hover:bg-[var(--color-primary)] hover:text-white"
              >
                <User />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {currentUser?.token ? (
        <div className="items-center hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-12 w-12 rounded-full hover:bg-gray-200">
                <User2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link to="/login" className="items-center hidden lg:block">
          <Button
            variant="ghost"
            className="rounded-xl mt-4 hover:bg-[var(--color-primary)] hover:text-white"
          >
            <User />
            Login
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Navbar;
