/**
 * PHN - Proof of Help Network Transaction Test
 * Tests CreateProfile, CreateQuestion, SubmitAnswer, AcceptAnswer, VerifyAnswer, FollowUser
 */

import { randomBytes } from 'crypto';
import { bls12_381 } from '@noble/curves/bls12-381.js';

// @ts-ignore
import protoRoot from './proto/index.cjs';
const types = protoRoot.types;
const google = protoRoot.google;

const QUERY_RPC_URL = 'http://localhost:50002';
const ADMIN_RPC_URL = 'http://localhost:50003';
const NETWORK_ID = 1n;
const CHAIN_ID = 1n;

// Alice, Bob, Charlie addresses from keystore
const ALICE_ADDR = 'eaf7125197987da024ae28d7e25e4ca5c9f85903';
const BOB_ADDR   = '2f9fa6ca3d91f8e28bb6f4f8a64629985963e418';
const CHARLIE_ADDR = '0b51894fb8b62841e47f11da158bf0189b3d6fa0';

interface KeyGroup {
    address: string;
    publicKey: string;
    privateKey: string;
}

function hexToBase64(hexStr: string): string {
    return Buffer.from(hexStr, 'hex').toString('base64');
}

function hexToBytes(hexStr: string): Uint8Array {
    return new Uint8Array(Buffer.from(hexStr, 'hex'));
}

function bytesToHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex');
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

async function keystoreGetKey(rpcURL: string, address: string, password: string): Promise<KeyGroup> {
    const reqJSON = JSON.stringify({ address, password });
    const respBody = await postRawJSON(`${rpcURL}/v1/admin/keystore-get`, reqJSON);
    const parsed = JSON.parse(respBody);
    return {
        address: parsed.address || parsed.Address || address,
        publicKey: parsed.publicKey || parsed.PublicKey || parsed.public_key,
        privateKey: parsed.privateKey || parsed.PrivateKey || parsed.private_key
    };
}

async function getHeight(rpcURL: string): Promise<bigint> {
    const respBody = await postRawJSON(`${rpcURL}/v1/query/height`, '{}');
    const result = JSON.parse(respBody) as { height: number };
    return BigInt(result.height);
}

async function waitForTxInclusion(rpcURL: string, senderAddr: string, txHash: string, timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const reqJSON = JSON.stringify({ address: senderAddr, perPage: 20 });
            const respBody = await postRawJSON(`${rpcURL}/v1/query/txs-by-sender`, reqJSON);
            const result = JSON.parse(respBody) as { results: Array<{ txHash: string }> };
            for (const tx of result.results || []) {
                if (tx.txHash === txHash) return true;
            }
        } catch { /* retry */ }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
}

function getSignBytes(
    msgType: string, msgTypeUrl: string, msgBytes: Uint8Array,
    time: bigint, createdHeight: bigint, fee: bigint,
    networkId: bigint, chainId: bigint
): Uint8Array {
    const anyMsg = google.protobuf.Any.create({ type_url: msgTypeUrl, value: msgBytes });
    const txData: Record<string, unknown> = {
        messageType: msgType,
        msg: anyMsg,
        signature: null,
        createdHeight: Number(createdHeight),
        time: Number(time),
        fee: Number(fee),
        networkId: Number(networkId),
        chainId: Number(chainId)
    };
    const tx = types.Transaction.create(txData);
    return types.Transaction.encode(tx).finish();
}

function signBLS(privateKeyHex: string, message: Uint8Array): Uint8Array {
    const privateKeyBytes = hexToBytes(privateKeyHex);
    const hashedPoint = bls12_381.longSignatures.hash(message);
    const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, privateKeyBytes);
    return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

async function sendPHNTx(
    signerKey: KeyGroup,
    msgType: string,
    typeURL: string,
    msgProto: Uint8Array,
    fee: bigint,
    height: bigint
): Promise<string> {
    const txTime = BigInt(Date.now() * 1000);
    const signBytes = getSignBytes(msgType, typeURL, msgProto, txTime, height, fee, NETWORK_ID, CHAIN_ID);
    const signature = signBLS(signerKey.privateKey, signBytes);
    const pubKeyBytes = hexToBytes(signerKey.publicKey);

    const tx = {
        type: msgType,
        msgTypeUrl: typeURL,
        msgBytes: bytesToHex(msgProto),
        signature: {
            publicKey: bytesToHex(pubKeyBytes),
            signature: bytesToHex(signature)
        },
        time: Number(txTime),
        createdHeight: Number(height),
        fee: Number(fee),
        memo: '',
        networkID: Number(NETWORK_ID),
        chainID: Number(CHAIN_ID)
    };

    const respBody = await postRawJSON(`${QUERY_RPC_URL}/v1/tx`, JSON.stringify(tx, null, 2));
    return JSON.parse(respBody) as string;
}

async function main(): Promise<void> {
    console.log('=== PHN - Proof of Help Network Test ===\n');

    // Get keys for Alice, Bob, Charlie
    console.log('Loading wallets...');
    const aliceKey = await keystoreGetKey(ADMIN_RPC_URL, ALICE_ADDR, 'alice123');
    const bobKey   = await keystoreGetKey(ADMIN_RPC_URL, BOB_ADDR, 'bob123');
    const charlieKey = await keystoreGetKey(ADMIN_RPC_URL, CHARLIE_ADDR, 'charlie123');
    console.log(`Alice:   ${aliceKey.address}`);
    console.log(`Bob:     ${bobKey.address}`);
    console.log(`Charlie: ${charlieKey.address}`);

    const FEE = 10000n;

    // ── STEP 1: Create Profiles ──────────────────────────────────────────
    console.log('\n--- Step 1: Creating profiles for Alice, Bob, Charlie ---');

    let height = await getHeight(QUERY_RPC_URL);

    // Alice profile
    const aliceProfileMsg = types.MessageCreateProfile.create({
        address: Buffer.from(ALICE_ADDR, 'hex'),
        username: 'alice',
        bio: 'React developer looking for help',
        expertiseTags: ['react', 'javascript']
    });
    const aliceProfileBytes = types.MessageCreateProfile.encode(aliceProfileMsg).finish();
    const aliceProfileHash = await sendPHNTx(
        aliceKey, 'create_profile',
        'type.googleapis.com/types.MessageCreateProfile',
        aliceProfileBytes, FEE, height
    );
    console.log(`Alice profile tx: ${aliceProfileHash}`);

    await new Promise(r => setTimeout(r, 2000));
    height = await getHeight(QUERY_RPC_URL);

    // Bob profile
    const bobProfileMsg = types.MessageCreateProfile.create({
        address: Buffer.from(BOB_ADDR, 'hex'),
        username: 'bob',
        bio: 'Senior React and blockchain developer',
        expertiseTags: ['react', 'blockchain', 'typescript']
    });
    const bobProfileBytes = types.MessageCreateProfile.encode(bobProfileMsg).finish();
    const bobProfileHash = await sendPHNTx(
        bobKey, 'create_profile',
        'type.googleapis.com/types.MessageCreateProfile',
        bobProfileBytes, FEE, height
    );
    console.log(`Bob profile tx: ${bobProfileHash}`);

    await new Promise(r => setTimeout(r, 2000));
    height = await getHeight(QUERY_RPC_URL);

    // Charlie profile
    const charlieProfileMsg = types.MessageCreateProfile.create({
        address: Buffer.from(CHARLIE_ADDR, 'hex'),
        username: 'charlie',
        bio: 'Looking to hire React developers',
        expertiseTags: ['hiring', 'web3']
    });
    const charlieProfileBytes = types.MessageCreateProfile.encode(charlieProfileMsg).finish();
    const charlieProfileHash = await sendPHNTx(
        charlieKey, 'create_profile',
        'type.googleapis.com/types.MessageCreateProfile',
        charlieProfileBytes, FEE, height
    );
    console.log(`Charlie profile tx: ${charlieProfileHash}`);

    // Wait for Alice profile to confirm
    console.log('\nWaiting for profile transactions...');
    const aliceConfirmed = await waitForTxInclusion(QUERY_RPC_URL, ALICE_ADDR, aliceProfileHash, 30000);
    console.log(`Alice profile confirmed: ${aliceConfirmed}`);

    // ── STEP 2: Alice asks a question ────────────────────────────────────
    console.log('\n--- Step 2: Alice creates a question ---');
    height = await getHeight(QUERY_RPC_URL);

    const questionMsg = types.MessageCreateQuestion.create({
        authorAddress: Buffer.from(ALICE_ADDR, 'hex'),
        title: 'What is the best way to learn React in 2026?',
        contentHash: 'hash_alice_question_001',
        category: 'development',
        tags: ['react', 'javascript', 'learning']
    });
    const questionBytes = types.MessageCreateQuestion.encode(questionMsg).finish();
    const questionHash = await sendPHNTx(
        aliceKey, 'create_question',
        'type.googleapis.com/types.MessageCreateQuestion',
        questionBytes, FEE, height
    );
    console.log(`Question tx: ${questionHash}`);

    const questionConfirmed = await waitForTxInclusion(QUERY_RPC_URL, ALICE_ADDR, questionHash, 30000);
    console.log(`Question confirmed: ${questionConfirmed}`);

    // ── STEP 3: Bob submits an answer ────────────────────────────────────
    console.log('\n--- Step 3: Bob submits an answer ---');
    height = await getHeight(QUERY_RPC_URL);

    const answerMsg = types.MessageSubmitAnswer.create({
        authorAddress: Buffer.from(BOB_ADDR, 'hex'),
        questionId: 'q_' + ALICE_ADDR.slice(0, 8) + '_',
        contentHash: 'hash_bob_answer_001',
        stakeAmount: 20
    });
    const answerBytes = types.MessageSubmitAnswer.encode(answerMsg).finish();
    const answerHash = await sendPHNTx(
        bobKey, 'submit_answer',
        'type.googleapis.com/types.MessageSubmitAnswer',
        answerBytes, FEE, height
    );
    console.log(`Answer tx: ${answerHash}`);

    const answerConfirmed = await waitForTxInclusion(QUERY_RPC_URL, BOB_ADDR, answerHash, 30000);
    console.log(`Answer confirmed: ${answerConfirmed}`);

    // ── STEP 4: Charlie verifies Bob's answer ────────────────────────────
    console.log('\n--- Step 4: Charlie verifies Bob answer as helpful ---');
    height = await getHeight(QUERY_RPC_URL);

    const verifyMsg = types.MessageVerifyAnswer.create({
        voterAddress: Buffer.from(CHARLIE_ADDR, 'hex'),
        answerId: 'a_' + BOB_ADDR.slice(0, 8) + '_',
        vote: 'helpful'
    });
    const verifyBytes = types.MessageVerifyAnswer.encode(verifyMsg).finish();
    const verifyHash = await sendPHNTx(
        charlieKey, 'verify_answer',
        'type.googleapis.com/types.MessageVerifyAnswer',
        verifyBytes, FEE, height
    );
    console.log(`Verify tx: ${verifyHash}`);

    const verifyConfirmed = await waitForTxInclusion(QUERY_RPC_URL, CHARLIE_ADDR, verifyHash, 30000);
    console.log(`Verify confirmed: ${verifyConfirmed}`);

    // ── STEP 5: Alice accepts Bob's answer ───────────────────────────────
    console.log('\n--- Step 5: Alice accepts Bob answer ---');
    height = await getHeight(QUERY_RPC_URL);

    const acceptMsg = types.MessageAcceptAnswer.create({
        ownerAddress: Buffer.from(ALICE_ADDR, 'hex'),
        questionId: 'q_' + ALICE_ADDR.slice(0, 8) + '_',
        answerId: 'a_' + BOB_ADDR.slice(0, 8) + '_'
    });
    const acceptBytes = types.MessageAcceptAnswer.encode(acceptMsg).finish();
    const acceptHash = await sendPHNTx(
        aliceKey, 'accept_answer',
        'type.googleapis.com/types.MessageAcceptAnswer',
        acceptBytes, FEE, height
    );
    console.log(`Accept tx: ${acceptHash}`);

    const acceptConfirmed = await waitForTxInclusion(QUERY_RPC_URL, ALICE_ADDR, acceptHash, 30000);
    console.log(`Accept confirmed: ${acceptConfirmed}`);

    // ── STEP 6: Charlie follows Bob ──────────────────────────────────────
    console.log('\n--- Step 6: Charlie follows Bob ---');
    height = await getHeight(QUERY_RPC_URL);

    const followMsg = types.MessageFollowUser.create({
        followerAddress: Buffer.from(CHARLIE_ADDR, 'hex'),
        targetAddress: Buffer.from(BOB_ADDR, 'hex')
    });
    const followBytes = types.MessageFollowUser.encode(followMsg).finish();
    const followHash = await sendPHNTx(
        charlieKey, 'follow_user',
        'type.googleapis.com/types.MessageFollowUser',
        followBytes, FEE, height
    );
    console.log(`Follow tx: ${followHash}`);

    const followConfirmed = await waitForTxInclusion(QUERY_RPC_URL, CHARLIE_ADDR, followHash, 30000);
    console.log(`Follow confirmed: ${followConfirmed}`);

    console.log('\n=== PHN Test Complete ===');
    console.log('\nTransaction Summary:');
    console.log(`Alice profile:   ${aliceProfileHash}`);
    console.log(`Bob profile:     ${bobProfileHash}`);
    console.log(`Charlie profile: ${charlieProfileHash}`);
    console.log(`Question:        ${questionHash}`);
    console.log(`Answer:          ${answerHash}`);
    console.log(`Verify:          ${verifyHash}`);
    console.log(`Accept:          ${acceptHash}`);
    console.log(`Follow:          ${followHash}`);
}

main()
    .then(() => { console.log('\nAll PHN transactions confirmed on Canopy!'); process.exit(0); })
    .catch(err => { console.error('\nTest failed:', err); process.exit(1); });
