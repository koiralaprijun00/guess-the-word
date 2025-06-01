"use client";

import React from 'react';
import { GameStateProvider } from "./context";
import { VocabGameApp } from "./VocabGameApp";
import { WordMasterErrorBoundary } from "./components/WordMasterErrorBoundary"; // Updated path

export default function NepaliWordMasterPage() {
  return (
    <WordMasterErrorBoundary>
      <VocabGameApp />
    </WordMasterErrorBoundary>
  );
} 