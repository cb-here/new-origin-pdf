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
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      gradient: "from-emerald-400 to-cyan-500",
      hoverGradient: "from-emerald-500 to-cyan-600",
    },
    {
      href: "/esoc",
      label: "E-SOC",
      icon: FileText,
      gradient: "from-blue-500 to-purple-600",
      hoverGradient: "from-blue-600 to-purple-700",
    },
    {
      href: "/nomnc",
      label: "NOMNC",
      icon: FileX,
      gradient: "from-orange-400 to-red-500",
      hoverGradient: "from-orange-500 to-red-600",
    },
    {
      href: "/patient-consent",
      label: "Consent",
      icon: FileSignature,
      gradient: "from-pink-500 to-violet-600",
      hoverGradient: "from-pink-600 to-violet-700",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Dynamic mesh gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x * 0.1}% ${
              mousePosition.y * 0.1
            }%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x * 0.05}% ${
              mousePosition.y * 0.08
            }%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)
            `,
            transition: "background 0.3s ease",
          }}
        />
      </div>

      {/* Floating navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <nav
          className={cn(
            "mx-auto max-w-7xl transition-all duration-700 ease-out",
            isScrolled
              ? "bg-white/80 backdrop-blur-2xl border border-gray-200/20 shadow-2xl shadow-black/10 rounded-2xl"
              : "bg-white/60 backdrop-blur-xl border border-gray-200/10 shadow-xl shadow-black/5 rounded-3xl"
          )}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative px-6 lg:px-8">
            <div className="flex h-16 lg:h-18 items-center justify-between">
              <Link
                to="/"
                className="group flex items-center space-x-3 relative z-10"
              >
                <div className="relative">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <img
                      src="logo.png"
                      className="w-8 h-8  text-white relative z-10"
                    />
                    <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-bounce" />
                    <div className="absolute inset-0 -top-2 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:left-full transition-all duration-1000" />
                  </div>
                </div>

                <div className="hidden sm:flex flex-col">
                  <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                    Gravita Forms
                  </span>
                  <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                    Make the forms filling easy
                  </span>
                </div>
              </Link>

              {/* Futuristic desktop navigation */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList className="flex space-x-1 bg-gray-50/50 backdrop-blur-sm rounded-full p-1 border border-gray-200/50">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <NavigationMenuItem key={item.href}>
                        <Link to={item.href}>
                          <div className="relative group/item">
                            <Button
                              variant="ghost"
                              className={cn(
                                "relative h-12 px-6 text-sm font-semibold transition-all duration-300 rounded-full border-0 overflow-hidden",
                                active
                                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-black/20 scale-105`
                                  : "text-gray-600 group-hover/item:text-white group-hover/item:shadow-lg group-hover/item:scale-105",
                                !active &&
                                  item.gradient ===
                                    "from-emerald-400 to-cyan-500" &&
                                  "group-hover/item:bg-gradient-to-r group-hover/item:from-emerald-500 group-hover/item:to-cyan-600",
                                !active &&
                                  item.gradient ===
                                    "from-blue-500 to-purple-600" &&
                                  "group-hover/item:bg-gradient-to-r group-hover/item:from-blue-600 group-hover/item:to-purple-700",
                                !active &&
                                  item.gradient ===
                                    "from-orange-400 to-red-500" &&
                                  "group-hover/item:bg-gradient-to-r group-hover/item:from-orange-500 group-hover/item:to-red-600",
                                !active &&
                                  item.gradient ===
                                    "from-pink-500 to-violet-600" &&
                                  "group-hover/item:bg-gradient-to-r group-hover/item:from-pink-600 group-hover/item:to-violet-700"
                              )}
                            >
                              {/* Animated background for active state */}
                              {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                              )}

                              <div className="flex items-center space-x-2 relative z-10">
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </div>

                              {/* Hover glow effect */}
                              <div
                                className={cn(
                                  "absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-full blur-sm",
                                  `bg-gradient-to-r ${item.gradient}`
                                )}
                              />
                            </Button>

                            {/* Active indicator dot */}
                            {active && (
                              <div
                                className={cn(
                                  "absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full animate-pulse",
                                  `bg-gradient-to-r ${item.gradient}`
                                )}
                              />
                            )}
                          </div>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Premium mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden relative overflow-hidden h-12 w-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300/50 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-110"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="relative z-10">
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700 transition-transform duration-300" />
                  )}
                </div>

                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </Button>
            </div>

            {/* Futuristic mobile navigation */}
            <div
              className={cn(
                "lg:hidden overflow-hidden transition-all duration-500 ease-out",
                isMobileMenuOpen
                  ? "max-h-80 opacity-100 pb-6"
                  : "max-h-0 opacity-0"
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
                          ? "translateX(0)"
                          : "translateX(-100px)",
                        opacity: isMobileMenuOpen ? 1 : 0,
                        transitionDelay: `${index * 100}ms`,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <div className="relative group/mobile">
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-14 px-6 text-left rounded-xl transition-all duration-300 border overflow-hidden",
                            active
                              ? `bg-gradient-to-r ${item.gradient} text-white border-transparent shadow-lg`
                              : "text-gray-600 border-gray-200/50 group-hover/mobile:border-gray-300 group-hover/mobile:text-white",
                            !active &&
                              item.gradient ===
                                "from-emerald-400 to-cyan-500" &&
                              "group-hover/mobile:bg-gradient-to-r group-hover/mobile:from-emerald-500 group-hover/mobile:to-cyan-600",
                            !active &&
                              item.gradient === "from-blue-500 to-purple-600" &&
                              "group-hover/mobile:bg-gradient-to-r group-hover/mobile:from-blue-600 group-hover/mobile:to-purple-700",
                            !active &&
                              item.gradient === "from-orange-400 to-red-500" &&
                              "group-hover/mobile:bg-gradient-to-r group-hover/mobile:from-orange-500 group-hover/mobile:to-red-600",
                            !active &&
                              item.gradient === "from-pink-500 to-violet-600" &&
                              "group-hover/mobile:bg-gradient-to-r group-hover/mobile:from-pink-600 group-hover/mobile:to-violet-700"
                          )}
                        >
                          <div className="flex items-center space-x-4 relative z-10">
                            <div
                              className={cn(
                                "p-2 rounded-lg transition-colors duration-200",
                                active
                                  ? "bg-white/20"
                                  : "bg-gray-100 group-hover/mobile:bg-white/20"
                              )}
                            ></div>
                            <div>
                              <div className="font-semibold">{item.label}</div>
                              <div
                                className={cn(
                                  "text-xs transition-colors duration-200",
                                  active
                                    ? "text-white/80"
                                    : "text-gray-400 group-hover/mobile:text-white/80"
                                )}
                              >
                                Navigate to {item.label.toLowerCase()}
                              </div>
                            </div>
                          </div>

                          {/* Mobile item glow effect */}
                          <div
                            className={cn(
                              "absolute inset-0 opacity-0 group-hover/mobile:opacity-20 transition-opacity duration-300",
                              `bg-gradient-to-r ${item.gradient}`
                            )}
                          />
                        </Button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-24" />
    </>
  );
};

export default Navbar;
