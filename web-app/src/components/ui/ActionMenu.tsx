import React, { useState, useRef, useEffect } from 'react';
import { MoreVerticalIcon } from '../icons';
import Button from './Button';

interface Action {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
}

interface ActionMenuProps {
  actions: Action[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="secondary" className="px-2 py-1" onClick={() => setIsOpen(!isOpen)}>
        <MoreVerticalIcon className="h-5 w-5" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left block px-4 py-2 text-sm ${
                action.isDanger
                  ? 'text-red-700 hover:bg-red-100'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
