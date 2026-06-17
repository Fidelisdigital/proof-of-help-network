/**
 * Fund Alice, Bob, Charlie wallets from validator
 */

import { bls12_381 } from '@noble/curves/bls12-381.js';

// @ts-ignore
import protoRoot from './proto/index.cjs';
const types = protoRoot.types;
const google = protoRoot.google;

const QUERY_RPC_URL = 'http://localhost:50002';
const NETWORK_ID = 1n;
const CHAIN_ID = 1n;

const VALIDATOR_ADDR = 'c0d8caf3fc48cbcc685a6a0b3004eaf28a23663b';
const VALIDATOR_PRIVKEY = '0d0b5e14f54243c6d2028b54baacb15b35dbd6f57bf01dc2b4ae3945d5262293';

const ALICE_ADDR   = 'eaf7125197987da024ae28d7e25e4ca5c9f85903';
const BOB_ADDR     = '2f9fa6ca3d91f8e28bb6f4f8a64629985963e418';
const CHARLIE_ADDR = '0b51894fb8b62841e47f11da158bf0189b3d6fa0';

function hexToBytes(hexStr: string): Uint8Array {
    return new Uint8Array(Buffer.from(hexStr, 'hex'));
}
function bytesToHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex');
}
function hexToBase64(hexStr: string): string {
    return Buffer.from(hexStr, 'hex').toString('base64');
}

async function postRawJSON(url: string, jsonBody: string): Promise<string> {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody
    });
    const respBody = await response.text();
    if (response.status >= 400) throw new Error(`HTTP ${response.status}: ${respBody}`);
    return respBody;
}

async function getHeight(): Promise<bigint> {
    const respBody = await postRawJSON(`${QUERY_RPC_URL}/v1/query/height`, '{}');
    const result = JSON.parse(respBody) as { height: number };
    return BigInt(result.height);
}

async function getBalance(address: string): Promise<bigint> {
    const respBody = await postRawJSON(`${QUERY_RPC_URL}/v1/query/account`, JSON.stringify({ address }));
    const result = JSON.parse(respBody) as { amount?: number };
    return BigInt(result.amount || 0);
}

async function waitForTx(senderAddr: string, txHash: string): Promise<boolean> {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
        try {
            const respBody = await postRawJSON(`${QUERY_RPC_URL}/v1/query/txs-by-sender`, JSON.stringify({ address: senderAddr, perPage: 20 }));
            const result = JSON.parse(respBody) as { results: Array<{ txHash: string }> };
            for (const tx of result.results || []) {
                if (tx.txHash === txHash) return true;
            }
        } catch { /* retry */ }
        await new Promise(r => setTimeout(r, 1000));
    }
    return false;
}

const VALIDATOR_PUBKEY = "8005e611147deb44add125de30d285f145bfadbd5573e31726f9c69ef9c5967b48e917dbf9b3bbb3b145905191e95a07";
function getPublicKey(_privateKeyHex: string): Uint8Array {
    return hexToBytes(VALIDATOR_PUBKEY);
}

function signBLS(privateKeyHex: string, message: Uint8Array): Uint8Array {
    const privateKeyBytes = hexToBytes(privateKeyHex);
    const hashedPoint = bls12_381.longSignatures.hash(message);
    const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, privateKeyBytes);
    return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

async function sendFunds(toAddr: string, amount: bigint, height: bigint): Promise<string> {
    const txTime = BigInt(Date.now() * 1000);
    const fee = 10000n;

    const fromAddrBytes = Buffer.from(VALIDATOR_ADDR, 'hex');
    const toAddrBytes = Buffer.from(toAddr, 'hex');

    // Build send message
    const sendMsg = types.MessageSend.create({
        fromAddress: fromAddrBytes,
        toAddress: toAddrBytes,
        amount: Number(amount)
    });
    const msgBytes = types.MessageSend.encode(sendMsg).finish();
    const typeURL = 'type.googleapis.com/types.MessageSend';

    // Build tx for signing
    const anyMsg = google.protobuf.Any.create({ type_url: typeURL, value: msgBytes });
    const txData: Record<string, unknown> = {
        messageType: 'send',
        msg: anyMsg,
        signature: null,
        createdHeight: Number(height),
        time: Number(txTime),
        fee: Number(fee),
        networkId: Number(NETWORK_ID),
        chainId: Number(CHAIN_ID)
    };
    const tx = types.Transaction.create(txData);
    const signBytes = types.Transaction.encode(tx).finish();

    // Sign
    const signature = signBLS(VALIDATOR_PRIVKEY, signBytes);
    const pubKey = getPublicKey(VALIDATOR_PRIVKEY);

    // Submit
    const txJSON = {
        type: 'send',
        msg: {
            fromAddress: hexToBase64(VALIDATOR_ADDR),
            toAddress: hexToBase64(toAddr),
            amount: Number(amount)
        },
        signature: {
            publicKey: bytesToHex(pubKey),
            signature: bytesToHex(signature)
        },
        time: Number(txTime),
        createdHeight: Number(height),
        fee: Number(fee),
        memo: '',
        networkID: Number(NETWORK_ID),
        chainID: Number(CHAIN_ID)
    };

    const respBody = await postRawJSON(`${QUERY_RPC_URL}/v1/tx`, JSON.stringify(txJSON, null, 2));
    return JSON.parse(respBody) as string;
}

async function main(): Promise<void> {
    console.log('=== Funding Alice, Bob, Charlie ===\n');

    const FUND_AMOUNT = 100000n;

    let height = await getHeight();
    console.log(`Current height: ${height}`);
    console.log(`Validator balance: ${await getBalance(VALIDATOR_ADDR)}`);

    // Fund Alice
    console.log('\nFunding Alice...');
    height = await getHeight();
    const aliceHash = await sendFunds(ALICE_ADDR, FUND_AMOUNT, height);
    console.log(`Alice funding tx: ${aliceHash}`);
    const aliceOk = await waitForTx(VALIDATOR_ADDR, aliceHash);
    console.log(`Alice funded: ${aliceOk}`);

    // Fund Bob
    console.log('\nFunding Bob...');
    height = await getHeight();
    const bobHash = await sendFunds(BOB_ADDR, FUND_AMOUNT, height);
    console.log(`Bob funding tx: ${bobHash}`);
    const bobOk = await waitForTx(VALIDATOR_ADDR, bobHash);
    console.log(`Bob funded: ${bobOk}`);

    // Fund Charlie
    console.log('\nFunding Charlie...');
    height = await getHeight();
    const charlieHash = await sendFunds(CHARLIE_ADDR, FUND_AMOUNT, height);
    console.log(`Charlie funding tx: ${charlieHash}`);
    const charlieOk = await waitForTx(VALIDATOR_ADDR, charlieHash);
    console.log(`Charlie funded: ${charlieOk}`);

    // Check balances
    console.log('\n=== Final Balances ===');
    console.log(`Alice:   ${await getBalance(ALICE_ADDR)}`);
    console.log(`Bob:     ${await getBalance(BOB_ADDR)}`);
    console.log(`Charlie: ${await getBalance(CHARLIE_ADDR)}`);
}

main()
    .then(() => { console.log('\nFunding complete!'); process.exit(0); })
    .catch(err => { console.error('\nFunding failed:', err); process.exit(1); });
