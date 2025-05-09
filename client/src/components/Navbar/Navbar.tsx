import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/interview", label: "Mock Interview" },
  { href: "/interview-help", label: "Interview AI Assistant" },
  { href: "/quiz", label: "Quiz" },
  { href: "/resume", label: "Resume Evaluator" },
  { href: "/pdf-chat", label: "Pdf Chat" },
  { href: "/insights", label: "Insights" },
  { href: "/your-interviews", label: "Your Interviews" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("/");
  const [scrolled, setScrolled] = useState<boolean>(false);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const logo = "src/assets/image.png";

  const NavLink = ({
    href,
    label,
    isActive,
    onClick,
  }: {
    href: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <Link
      to={href}
      className="relative px-4 py-2 group overflow-hidden rounded-lg"
      onClick={onClick}
    >
      <motion.span
        className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
          isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"
        }`}
      >
        {label}
      </motion.span>

      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <motion.div
        className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ zIndex: -1 }}
      />
    </Link>
  );

  const MobileNavLink = ({
    href,
    label,
    isActive,
    onClick,
  }: {
    href: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={href}
        onClick={onClick}
        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        {label}
      </Link>
    </motion.div>
  );

  const UserMenuContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </motion.div>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-blue-500 transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  {user?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 overflow-hidden rounded-xl p-1 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user}</p>
              <p className="text-xs text-gray-500 mt-0.5">Active now</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-150 py-2"
            >
              <User className="mr-2 h-4 w-4 text-blue-600" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-150 py-2"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span>Log out</span>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <motion.header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                src={logo}
                alt="NEXT HIRE"
                className="h-20 w-20 object-contain"
              />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={activeLink === link.href}
                onClick={() => setActiveLink(link.href)}
              />
            ))}
          </nav>

          <div className="flex items-center">
            <UserMenuContent />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative md:hidden ml-3"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 bg-white border-l border-gray-100 w-[85vw] max-w-[320px]"
              >
                <div className="flex flex-col h-full">
                  <motion.div
                    className="p-4 border-b flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <img src={logo} alt="NEXT HIRE" className="h-8 w-auto" />
                      <p className="mt-2 text-sm text-gray-500">
                        Revolutionizing Placement Preparation with AI
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>

                  <motion.div
                    className="flex-1 p-4 overflow-y-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      {navLinks.map((link) => (
                        <MobileNavLink
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          isActive={activeLink === link.href}
                          onClick={() => {
                            setActiveLink(link.href);
                            setIsOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 border-t"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {!isLoggedIn ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            navigate("/login");
                            setIsOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                          onClick={() => {
                            navigate("/signup");
                            setIsOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center mb-4">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-500">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                              {user?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="text-base font-medium text-gray-800">
                              {user}
                            </p>
                            <p className="text-xs text-gray-500">Active now</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="w-full justify-center"
                            onClick={() => {
                              navigate("/profile");
                              setIsOpen(false);
                            }}
                          >
                            Profile
                          </Button>
                          <Button
                            variant="destructive"
                            className="w-full justify-center"
                            onClick={() => {
                              handleLogout();
                              setIsOpen(false);
                            }}
                          >
                            Log out
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
