import React from 'react';
import { SHOP_ITEMS } from '../utils/shopItems';

interface CharacterAvatarProps {
  characterId: string;
  hatId: string;
  glassesId: string;
  petId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPet?: boolean;
  animate?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  hatId,
  glassesId,
  petId,
  size = 'md',
  showPet = true,
  animate = false,
}) => {
  const character = SHOP_ITEMS.find((i) => i.id === characterId) || SHOP_ITEMS[0];
  const hat = SHOP_ITEMS.find((i) => i.id === hatId);
  const glasses = SHOP_ITEMS.find((i) => i.id === glassesId);
  const pet = petId ? SHOP_ITEMS.find((i) => i.id === petId) : null;

  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-36 h-36 text-7xl',
  };

  const hatSizeClasses = {
    sm: 'text-sm -top-3',
    md: 'text-xl -top-5',
    lg: 'text-3xl -top-7',
    xl: 'text-5xl -top-10',
  };

  const glassesSizeClasses = {
    sm: 'text-xs top-2',
    md: 'text-lg top-3',
    lg: 'text-2xl top-5',
    xl: 'text-4xl top-8',
  };

  const petSizeClasses = {
    sm: 'text-xs -bottom-1 -right-1',
    md: 'text-base -bottom-2 -right-2',
    lg: 'text-2xl -bottom-3 -right-3',
    xl: 'text-4xl -bottom-4 -right-4',
  };

  return (
    <div className="relative inline-flex items-center justify-center select-none" id="avatar-container">
      {/* Main Avatar Bubble */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/20 ${
          sizeClasses[size]
        } ${animate ? 'hover:scale-105 transition-transform' : ''}`}
      >
        {/* Character Base */}
        <span className="leading-none filter drop-shadow-md">{character.icon}</span>

        {/* Hat Layer */}
        {hat && hat.icon !== '🚫' && (
          <span
            className={`absolute left-1/2 -translate-x-1/2 pointer-events-none filter drop-shadow-lg ${
              hatSizeClasses[size]
            }`}
          >
            {hat.icon}
          </span>
        )}

        {/* Glasses Layer */}
        {glasses && glasses.icon !== '🚫' && (
          <span
            className={`absolute left-1/2 -translate-x-1/2 pointer-events-none filter drop-shadow-md z-10 ${
              glassesSizeClasses[size]
            }`}
          >
            {glasses.icon}
          </span>
        )}
      </div>

      {/* Pet Companion */}
      {showPet && pet && pet.icon !== '🚫' && (
        <div
          className={`absolute rounded-full bg-white/20 backdrop-blur-md border border-white/40 p-1 shadow-md z-20 animate-bounce ${
            petSizeClasses[size]
          }`}
          title={pet.name}
        >
          <span>{pet.icon}</span>
        </div>
      )}
    </div>
  );
};
