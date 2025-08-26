import React from 'react';
import { Logo } from '../icons';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-brand-secondary" />
              <span className="text-xl font-bold text-white">EasyOrganic</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">Your source for fresh, organic products.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} EasyOrganic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
