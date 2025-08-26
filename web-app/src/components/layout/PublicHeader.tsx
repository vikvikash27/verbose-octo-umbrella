
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo, ChevronDownIcon, UserIcon, LogoutIcon, ShoppingCartIcon } from '../icons';
import { useCart } from '../../hooks/useCart';
import { useLocation } from '../../hooks/useLocation';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import LocationSelectorModal from '../LocationSelectorModal';
import Button from '../ui/Button';
import ProductMegaMenu from '../ProductMegaMenu';

const PublicHeader: React.FC = () => {
    const { cartCount } = useCart();
    const { selectedCity, selectCity } = useLocation();
    const { customer, logout } = useCustomerAuth();
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isProductsMenuOpen, setProductsMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const productsMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setUserMenuOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProductsMenuEnter = () => {
        clearTimeout(productsMenuTimeoutRef.current);
        setProductsMenuOpen(true);
    };

    const handleProductsMenuLeave = () => {
        productsMenuTimeoutRef.current = setTimeout(() => {
            setProductsMenuOpen(false);
        }, 300);
    };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Left Side */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <Logo className="h-10 w-10 text-brand-primary" />
              </Link>
              <div className="h-10 border-l border-slate-200"></div>
              <button onClick={() => setLocationModalOpen(true)} className="flex items-center gap-2">
                  <div className="text-left">
                      <span className="text-xs text-slate-500">Deliver In</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800">{selectedCity}</span>
                        <ChevronDownIcon className="w-4 h-4 text-slate-600" />
                      </div>
                  </div>
              </button>
            </div>

            {/* Center Nav */}
            <nav className="hidden lg:flex items-center gap-6">
                <div className="py-2" onMouseEnter={handleProductsMenuEnter} onMouseLeave={handleProductsMenuLeave}>
                  <NavLink 
                    to="/products" 
                    className={({isActive}) => `text-slate-600 hover:text-brand-primary font-medium flex items-center gap-1 ${(isActive || isProductsMenuOpen) && 'text-brand-primary'}`}
                  >
                    Products
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180' : ''}`} />
                  </NavLink>
                </div>
                <a href="#" className="text-slate-600 hover:text-brand-primary font-medium">Reviews</a>
                <a href="#" className="text-slate-600 hover:text-brand-primary font-medium">Product Quality Report</a>
                <a href="#" className="text-slate-600 hover:text-brand-primary font-medium">Milk Testing Kit</a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <div className="hidden xl:block">
                  <Button variant="success" size="md">Download the App & Claim Offer Now</Button>
              </div>
              <NavLink to="/cart" className="relative text-slate-600 hover:text-brand-primary p-2">
                <ShoppingCartIcon />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              <div className="h-8 border-l border-slate-200"></div>
              
              {customer ? (
                <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
                        <span className="bg-slate-200 rounded-full p-1.5 text-slate-600">
                            <UserIcon className="w-5 h-5" />
                        </span>
                        <span className="hidden md:inline font-semibold text-slate-700">Hi, {customer.name.split(' ')[0]}</span>
                        <ChevronDownIcon className="w-4 h-4 text-slate-600" />
                    </button>
                    {isUserMenuOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-40">
                            <Link to="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">My Account</Link>
                            <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Order History</Link>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogoutIcon className="h-5 w-5"/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
              ) : (
                <Link to="/login">
                    <Button variant='primary' size='md'>Login</Button>
                </Link>
              )}

            </div>
          </div>
        </div>
         {isProductsMenuOpen && <ProductMegaMenu onMouseEnter={handleProductsMenuEnter} onMouseLeave={handleProductsMenuLeave} onClose={() => setProductsMenuOpen(false)} />}
      </header>
      <LocationSelectorModal 
        isOpen={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelectCity={selectCity}
        selectedCity={selectedCity}
      />
    </>
  );
};

export default PublicHeader;
