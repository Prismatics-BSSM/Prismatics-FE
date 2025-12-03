import { useLayoutEffect } from 'react';
import './ElementCard.css';
import elementData from './elementData.js';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function ElementCard({ element, selected, onClick }) {
  if (!element) return null;

  return (
    <div
      className={`ElementCard ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="ElementCardName">
        <p>{element.symbol}</p>
      </div>
    </div>
  );
}
