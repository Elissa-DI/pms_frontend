
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, Shield, Users, Layers, Calendar } from 'lucide-react';
import { logout } from '@/lib/auth';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const customerNavItems = [
    { to: '/slots', label: 'Available Slots' },
    { to: '/bookings', label: 'My Bookings' },
    { to: '/profile', label: 'Profile' },
  ];

  const adminNavItems = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/slots', label: 'Slots' },
    { to: '/admin/bookings', label: 'Bookings' },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">PMS</span>
          </Link>
          
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <span className="hidden md:flex items-center mr-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </span>
              )}
              <Button asChild variant="ghost" size="icon" className="hidden md:flex">
                <Link to={isAdmin ? "/admin/dashboard" : "/profile"}>
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="h-5 w-5" />
              </Button>

              {/* Mobile menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>PMS</SheetTitle>
                    {isAdmin && (
                      <span className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin Mode
                      </span>
                    )}
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="text-sm font-medium py-2 flex items-center"
                        onClick={closeMobileMenu}
                      >
                        {item.label === 'Dashboard' && <Shield className="mr-2 h-4 w-4" />}
                        {item.label === 'Users' && <Users className="mr-2 h-4 w-4" />}
                        {item.label === 'Slots' && <Layers className="mr-2 h-4 w-4" />}
                        {item.label === 'Bookings' && <Calendar className="mr-2 h-4 w-4" />}
                        {item.label === 'Available Slots' && <Layers className="mr-2 h-4 w-4" />}
                        {item.label === 'My Bookings' && <Calendar className="mr-2 h-4 w-4" />}
                        {item.label === 'Profile' && <User className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Link>
                    ))}
                    <Button variant="outline" onClick={handleLogout} className="mt-4">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
