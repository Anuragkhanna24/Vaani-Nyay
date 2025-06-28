
import React from 'react';

interface CharacterBoxesProps {
  text: string;
  maxLength?: number;
  onEdit?: () => void;
}

const CharacterBoxes = ({ text, maxLength = 30, onEdit }: CharacterBoxesProps) => {
  const characters = text.split('');
  const boxes = Array.from({ length: maxLength }, (_, index) => {
    return characters[index] || '';
  });

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {boxes.map((char, index) => (
        <div
          key={index}
          className="w-6 h-8 border border-[#141E28] bg-white flex items-center justify-center text-sm font-mono"
        >
          {char}
        </div>
      ))}
      {onEdit && (
        <button
          onClick={onEdit}
          className="ml-2 text-[#33FEBF] hover:text-[#33FEBF]/80 text-xs underline"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default CharacterBoxes;
