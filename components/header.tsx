 'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/lib/contexts/wallet-context';
import { getHardcodedWallets } from '@/lib/actions/wallet-actions';
// Utility function moved here temporarily
const truncateAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Wallet } from 'lucide-react';

export function Header() {
  const { selectedWallet, wallets, setSelectedWallet, setWallets, updateWalletName } = useWallet();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [walletToRename, setWalletToRename] = useState<string | null>(null);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);

  useEffect(() => {
    // Load hardcoded wallets on component mount
    const loadWallets = async () => {
      setIsLoadingWallets(true);
      try {
        const hardcodedWallets = await getHardcodedWallets();
        setWallets(hardcodedWallets);
        
        // Set first wallet as default
        if (hardcodedWallets.length > 0 && !selectedWallet) {
          setSelectedWallet(hardcodedWallets[0]);
        }
      } catch (error) {
        console.error('Failed to load wallets:', error);
      } finally {
        setIsLoadingWallets(false);
      }
    };
    
    loadWallets();
  }, [setWallets, setSelectedWallet, selectedWallet]);

  const handleWalletChange = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (wallet) {
      setSelectedWallet(wallet);
    }
  };

  const openRenameDialog = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (wallet) {
      setWalletToRename(walletId);
      setNewName(wallet.name);
      setIsRenameDialogOpen(true);
    }
  };

  const handleRename = () => {
    if (walletToRename && newName.trim()) {
      updateWalletName(walletToRename, newName.trim());
      setIsRenameDialogOpen(false);
      setWalletToRename(null);
      setNewName('');
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">AI Agent Network</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
            <a href="/create-campaign" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Create Campaign
            </a>
            <a href="/hcs-messages" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              HCS Messages
            </a>
            <a href="/validator" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Validator
            </a>
          </nav>
        </div>

        {/* Wallet Selector */}
        <div className="flex items-center space-x-4">
          {selectedWallet && (
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-medium">{selectedWallet.name}</div>
                <div className="text-gray-500 text-xs">
                  {truncateAddress(selectedWallet.accountIdString)}
                </div>
                {selectedWallet.balance && (
                  <div className="text-green-600 text-xs font-medium">
                    {selectedWallet.balance}
                  </div>
                )}
              </div>
            </div>
          )}

          <Select value={selectedWallet?.id || ''} onValueChange={handleWalletChange} disabled={isLoadingWallets}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder={isLoadingWallets ? "Loading wallets..." : "Select wallet"} />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="font-medium">{wallet.name}</div>
                      <div className="text-xs text-gray-500">
                        {truncateAddress(wallet.accountIdString)}
                      </div>
                      {wallet.balance && (
                        <div className="text-green-600 text-xs font-medium">
                          {wallet.balance}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openRenameDialog(wallet.id);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new wallet name"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}