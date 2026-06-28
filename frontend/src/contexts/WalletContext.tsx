import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react';
import { getAccount, getHeight } from '../utils/rpc';

async function fetchChainProfile(address: string): Promise<any> {
    try {
        const res = await fetch('http://localhost:50002/v1/query/account', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        return await res.json();
    } catch { return null; }
}
import { updateLocalCRED, getBalanceFromChain, syncFromKnownUsers, syncAllFromChain } from '../utils/state';

interface WalletState {
    address: string;
    publicKey: string;
    privateKey: string;
    username: string;
    balance: number;
    trustScore: number;
    isConnected: boolean;
}

interface WalletContextType {
    wallet: WalletState;
    setWallet: (wallet: WalletState) => void;
    updateBalance: () => Promise<void>;
    disconnect: () => void;
    blockHeight: number;
    deductFee: (amount?: number) => void;
    isLoading: boolean;
}

const defaultWallet: WalletState = {
    address: '',
    publicKey: '',
    privateKey: '',
    username: '',
    balance: 0,
    trustScore: 0,
    isConnected: false
};

const WalletContext = createContext<WalletContextType>({
    wallet: defaultWallet,
    setWallet: () => {},
    updateBalance: async () => {},
    disconnect: () => {},
    blockHeight: 0,
    deductFee: () => {},
    isLoading: true
});

export function WalletProvider({ children }: { children: ReactNode }) {
    const [wallet, setWalletState] = useState<WalletState>(defaultWallet);
    const [blockHeight, setBlockHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load wallet from localStorage on startup + sync from chain
    useEffect(() => {
        const saved = localStorage.getItem('phn_wallet');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                parsed.trustScore = 0; // always reset — chain sets the real value
                setWalletState(parsed);
            } catch { /* ignore */ }
        }
        setIsLoading(false);
        // Check if this is a fresh browser (no profiles in localStorage)
        const hasProfiles = Object.keys(JSON.parse(localStorage.getItem('phn_profiles') || '{}')).length > 0;
        if (hasProfiles) {
            // Fast sync using known users
            syncFromKnownUsers().catch(() => {});
        } else {
            // Full block scan for fresh browser
            syncAllFromChain().catch(() => {});
        }
    }, []);

    // Poll block height every 5 seconds
    useEffect(() => {
        const fetchHeight = async () => {
            try {
                const h = await getHeight();
                setBlockHeight(h);
            } catch { /* ignore */ }
        };
        fetchHeight();
        const interval = setInterval(fetchHeight, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch chain-derived balance + CRED every 10s
    useEffect(() => {
        if (!wallet.isConnected || !wallet.address) return;
        const fetchChainState = async () => {
            try {
                // Get real balance from chain tx history
                const chainBalance = await getBalanceFromChain(wallet.address, 50000);
                // Get CRED from chain tx history
                const credScore = await updateLocalCRED(wallet.address);
                const credNumber = typeof credScore === 'number' ? credScore : 0;
                setWalletState(prev => {
                    const updated = {
                        ...prev,
                        balance: chainBalance,
                        trustScore: credNumber
                    };
                    localStorage.setItem('phn_wallet', JSON.stringify(updated));
                    // Save per-address balance
                    const balances = JSON.parse(localStorage.getItem('phn_balances') || '{}');
                    balances[wallet.address] = chainBalance;
                    localStorage.setItem('phn_balances', JSON.stringify(balances));
                    return updated;
                });
            } catch { /* ignore */ }
        };
        fetchChainState();
        const interval = setInterval(fetchChainState, 10000);
        return () => clearInterval(interval);
    }, [wallet.isConnected, wallet.address]);

    const setWallet = (newWallet: WalletState) => {
        setWalletState(newWallet);
        localStorage.setItem('phn_wallet', JSON.stringify(newWallet));
    };

    const deductFee = (amount = 1000) => {
        setWalletState(prev => {
            const newBalance = Math.max(0, prev.balance - amount);
            const updated = { ...prev, balance: newBalance };
            localStorage.setItem('phn_wallet', JSON.stringify(updated));
            // Save per-address balance
            const balances = JSON.parse(localStorage.getItem('phn_balances') || '{}');
            balances[prev.address] = newBalance;
            localStorage.setItem('phn_balances', JSON.stringify(balances));
            return updated;
        });
    };

    const updateBalance = async () => {
        if (!wallet.address) return;
        try {
            const account = await getAccount(wallet.address);
            const credScore = updateLocalCRED(wallet.address);
            setWalletState(prev => {
                const updated = {
                    ...prev,
                    balance: typeof account.amount === 'number' ? account.amount : prev.balance,
                    trustScore: typeof credScore === 'number' ? credScore : 0
                };
                localStorage.setItem('phn_wallet', JSON.stringify(updated));
                return updated;
            });
        } catch { /* ignore */ }
    };

    const disconnect = () => {
        setWalletState(defaultWallet);
        localStorage.removeItem('phn_wallet');
    };

    return (
        <WalletContext.Provider value={{ wallet, setWallet, updateBalance, disconnect, blockHeight, deductFee, isLoading }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}
