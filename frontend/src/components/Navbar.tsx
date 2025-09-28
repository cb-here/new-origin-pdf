import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  FileText,
  FileX,
  FileSignature,
  Home,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Navbar = () => {
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: "nav",
        start: "bottom top",
      },
    });

    navTween.fromTo(
      "nav",
      {
        background: "transparent",
      },
      {
        background: "#ffffff50",
        backgroundFilter: "blur(10px)",
        duration: 1,
        ease: "power1.inOut",
      }
    );
  });

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/esoc", label: "E-SOC", icon: FileText },
    { href: "/nomnc", label: "NOMNC", icon: FileX },
    { href: "/patient-consent", label: "Consent", icon: FileSignature },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 ">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
          }}
        />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <nav
          className={cn(
            "mx-auto max-w-7xl transition-all duration-300 ease-out rounded-xl",
            isScrolled
              ? "bg-white/90 backdrop-blur-lg border border-gray-200/30 shadow-lg"
              : "bg-white/70 backdrop-blur-md border border-gray-200/20 shadow-md"
          )}
        >
          <div className="relative px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="rounded-lg bg-gray-50 p-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
                    <img src="logo.png" className="w-8 h-8" alt="Logo" />
                    <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
                  </div>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    Gravita Forms
                  </span>
                  <span className="text-xs text-gray-500 font-medium uppercase">
                    Make form filling easy
                  </span>
                </div>
              </Link>

              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList className="flex space-x-2 p-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <NavigationMenuItem key={item.href}>
                        <Link to={item.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "relative h-10 px-4 text-sm font-medium rounded-lg transition-all duration-200",
                              active
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                            )}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {active && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                            )}
                          </Button>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-10 w-10 rounded-full hover:bg-blue-50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </Button>
            </div>

            <div
              className={cn(
                "lg:hidden transition-all duration-300 ease-out",
                isMobileMenuOpen ? "max-h-80 opacity-100 pb-5" : "max-h-0 opacity-0"
              )}
            >
              <div className="pt-4 space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                      style={{
                        transform: isMobileMenuOpen
                          ? "translateY(0)"
                          : "translateY(-20px)",
                        opacity: isMobileMenuOpen ? 1 : 0,
                        transition: `all 0.3s ease-out ${index * 100}ms`,
                      }}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-12 px-4 rounded-lg transition-all duration-200",
                          active
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <div className="font-medium">{item.label}</div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
