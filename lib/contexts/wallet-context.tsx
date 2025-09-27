'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { HederaWallet } from '@/lib/actions/wallet-actions';

interface WalletContextType {
  selectedWallet: HederaWallet | null;
  wallets: HederaWallet[];
  setSelectedWallet: (wallet: HederaWallet) => void;
  setWallets: (wallets: HederaWallet[]) => void;
  updateWalletName: (walletId: string, newName: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [selectedWallet, setSelectedWallet] = useState<HederaWallet | null>(null);
  const [wallets, setWallets] = useState<HederaWallet[]>([]);

  const updateWalletName = (walletId: string, newName: string) => {
    setWallets((prev: HederaWallet[]) => 
      prev.map(wallet => 
        wallet.id === walletId ? { ...wallet, name: newName } : wallet
      )
    );
    
    if (selectedWallet?.id === walletId) {
      setSelectedWallet(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        selectedWallet,
        wallets,
        setSelectedWallet,
        setWallets,
        updateWalletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}