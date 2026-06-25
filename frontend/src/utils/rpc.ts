const QUERY_RPC = 'http://localhost:50002';
const ADMIN_RPC = 'http://localhost:50003';

async function post(url: string, body: any): Promise<any> {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const text = await response.text();
    if (response.status >= 400) throw new Error(`RPC Error ${response.status}: ${text}`);
    try { return JSON.parse(text); } catch { return text; }
}

export async function getHeight(): Promise<number> {
    const result = await post(`${QUERY_RPC}/v1/query/height`, {});
    return result.height || 0;
}

export async function getAccount(address: string): Promise<{ address: string; amount: number }> {
    try {
        const result = await post(`${QUERY_RPC}/v1/query/account`, { address });
        return { 
            address: result.address || address, 
            amount: typeof result.amount === 'number' ? result.amount : 0 
        };
    } catch {
        return { address, amount: 0 };
    }
}

export async function getTxsBySender(address: string, perPage = 20): Promise<ChainTxResult[]> {
    const result = await post(`${QUERY_RPC}/v1/query/txs-by-sender`, { address, perPage });
    return result.results || [];
}

export async function getTxsByHeight(height: number): Promise<ChainTxResult[]> {
    const result = await post(`${QUERY_RPC}/v1/query/txs-by-height`, { height });
    return result.results || [];
}

export async function submitTx(tx: any): Promise<string> {
    const result = await post(`${QUERY_RPC}/v1/tx`, tx);
    return typeof result === 'string' ? result : result.hash || result;
}

export async function keystoreNewKey(nickname: string, password: string): Promise<string> {
    const result = await post(`${ADMIN_RPC}/v1/admin/keystore-new-key`, { nickname, password });
    return typeof result === 'string' ? result : result.address || result;
}

export async function keystoreGetKey(address: string, password: string): Promise<{ address: string; publicKey: string; privateKey: string }> {
    const result = await post(`${ADMIN_RPC}/v1/admin/keystore-get`, { address, password });
    return {
        address: result.address || result.Address || address,
        publicKey: result.publicKey || result.PublicKey || result.public_key || '',
        privateKey: result.privateKey || result.PrivateKey || result.private_key || ''
    };
}

export async function waitForTx(senderAddr: string, txHash: string, timeoutMs = 60000): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const txs = await getTxsBySender(senderAddr, 20);
            if (txs.some((tx: any) => tx.txHash === txHash)) return true;
        } catch { /* retry */ }
        await new Promise(r => setTimeout(r, 2000));
    }
    return false;
}

interface ChainTxResult {
    txHash: string;
    height: number;
    messageType: string;
    sender: string;
    recipient: string;
    transaction: any;
}
