import { buildTxJson, hexToBytes, bytesToHex } from './signing';
import { submitTx, getHeight } from './rpc';

// ── PROTOBUF MANUAL ENCODING ─────────────────────────────────────────────

function encodeVarint(value: number): Uint8Array {
    const bytes: number[] = [];
    let v = value;
    while (v > 127) {
        bytes.push((v & 0x7f) | 0x80);
        v = Math.floor(v / 128);
    }
    bytes.push(v & 0x7f);
    return new Uint8Array(bytes);
}

function encodeString(fieldNumber: number, value: string): Uint8Array {
    if (!value) return new Uint8Array(0);
    const strBytes = new TextEncoder().encode(value);
    const tag = encodeVarint((fieldNumber << 3) | 2);
    const len = encodeVarint(strBytes.length);
    return concat(tag, len, strBytes);
}

function encodeBytes(fieldNumber: number, value: Uint8Array): Uint8Array {
    if (!value || value.length === 0) return new Uint8Array(0);
    const tag = encodeVarint((fieldNumber << 3) | 2);
    const len = encodeVarint(value.length);
    return concat(tag, len, value);
}

function encodeUint64(fieldNumber: number, value: number): Uint8Array {
    if (value === 0) return new Uint8Array(0);
    const tag = encodeVarint((fieldNumber << 3) | 0);
    const val = encodeVarint(value);
    return concat(tag, val);
}

function concat(...arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((s, a) => s + a.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const arr of arrays) { result.set(arr, offset); offset += arr.length; }
    return result;
}

// ── MESSAGE ENCODERS ──────────────────────────────────────────────────────

function encodeCreateProfile(address: string, username: string, bio: string, tags: string[]): Uint8Array {
    const addrBytes = hexToBytes(address);
    const parts = [
        encodeBytes(1, addrBytes),
        encodeString(2, username),
        encodeString(3, bio),
        ...tags.map(tag => encodeString(4, tag))
    ];
    return concat(...parts);
}

function encodeUpdateProfile(address: string, bio: string, tags: string[]): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(address)),
        encodeString(2, bio),
        ...tags.map(tag => encodeString(3, tag))
    );
}

function encodeCreateQuestion(authorAddress: string, title: string, contentHash: string, category: string, tags: string[]): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(authorAddress)),
        encodeString(2, title),
        encodeString(3, contentHash),
        encodeString(4, category),
        ...tags.map(tag => encodeString(5, tag))
    );
}

function encodeSubmitAnswer(authorAddress: string, questionId: string, contentHash: string, stakeAmount: number): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(authorAddress)),
        encodeString(2, questionId),
        encodeString(3, contentHash),
        encodeUint64(4, stakeAmount)
    );
}

function encodeAcceptAnswer(ownerAddress: string, questionId: string, answerId: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(ownerAddress)),
        encodeString(2, questionId),
        encodeString(3, answerId)
    );
}

function encodeDisputeAnswer(disputerAddress: string, answerId: string, reasonHash: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(disputerAddress)),
        encodeString(2, answerId),
        encodeString(3, reasonHash)
    );
}

function encodeVerifyAnswer(voterAddress: string, answerId: string, vote: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(voterAddress)),
        encodeString(2, answerId),
        encodeString(3, vote)
    );
}

function encodeStakeReputation(address: string, answerId: string, stakeAmount: number): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(address)),
        encodeString(2, answerId),
        encodeUint64(3, stakeAmount)
    );
}

function encodeRewardReputation(fromAddress: string, toAddress: string, points: number, reason: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(fromAddress)),
        encodeBytes(2, hexToBytes(toAddress)),
        encodeUint64(3, points),
        encodeString(4, reason)
    );
}

function encodePenaltyReputation(fromAddress: string, toAddress: string, points: number, reason: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(fromAddress)),
        encodeBytes(2, hexToBytes(toAddress)),
        encodeUint64(3, points),
        encodeString(4, reason)
    );
}

function encodeFollowUser(followerAddress: string, targetAddress: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(followerAddress)),
        encodeBytes(2, hexToBytes(targetAddress))
    );
}

function encodeEndorseMember(endorserAddress: string, targetAddress: string, skill: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(endorserAddress)),
        encodeBytes(2, hexToBytes(targetAddress)),
        encodeString(3, skill)
    );
}

function encodeCreateTribe(creatorAddress: string, name: string, description: string, category: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(creatorAddress)),
        encodeString(2, name),
        encodeString(3, description),
        encodeString(4, category)
    );
}

function encodeJoinTribe(memberAddress: string, tribeId: string): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(memberAddress)),
        encodeString(2, tribeId)
    );
}

// ── SEND TRANSACTION (standard PROOFH transfer) ─────────────────────────────

function encodeSend(fromAddress: string, toAddress: string, amount: number): Uint8Array {
    return concat(
        encodeBytes(1, hexToBytes(fromAddress)),
        encodeBytes(2, hexToBytes(toAddress)),
        encodeUint64(3, amount)
    );
}

// ── TRANSACTION BUILDERS ──────────────────────────────────────────────────

async function sendTx(
    msgType: string,
    typeUrl: string,
    msgBytes: Uint8Array,
    publicKey: string,
    privateKey: string
): Promise<string> {
    const height = await getHeight();
    const tx = buildTxJson(msgType, typeUrl, msgBytes, publicKey, privateKey, height);
    return submitTx(tx);
}

export async function txCreateProfile(address: string, username: string, bio: string, tags: string[], publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeCreateProfile(address, username, bio, tags);
    return sendTx('create_profile', 'type.googleapis.com/types.MessageCreateProfile', msgBytes, publicKey, privateKey);
}

export async function txUpdateProfile(address: string, bio: string, tags: string[], publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeUpdateProfile(address, bio, tags);
    return sendTx('update_profile', 'type.googleapis.com/types.MessageUpdateProfile', msgBytes, publicKey, privateKey);
}

export async function txCreateQuestion(authorAddress: string, title: string, content: string, category: string, tags: string[], publicKey: string, privateKey: string, tribeId = ''): Promise<string> {
    const contentHash = `hash_${Date.now()}_${authorAddress.slice(0, 8)}`;
    const msgBytes = encodeCreateQuestion(authorAddress, title, contentHash, category, tags);
    // Store content locally
    const questions = JSON.parse(localStorage.getItem('phn_questions') || '[]');
    const questionId = `q_${authorAddress.slice(0, 8)}_${Date.now()}`;
    questions.push({ id: questionId, authorAddress, title, content, contentHash, category, tags, tribeId, answerCount: 0, acceptedAnswerId: '', createdAt: Date.now() });
    localStorage.setItem('phn_questions', JSON.stringify(questions));
    return sendTx('create_question', 'type.googleapis.com/types.MessageCreateQuestion', msgBytes, publicKey, privateKey);
}

export async function txSubmitAnswer(authorAddress: string, questionId: string, content: string, stakeAmount: number, publicKey: string, privateKey: string): Promise<string> {
    const contentHash = `hash_ans_${Date.now()}_${authorAddress.slice(0, 8)}`;
    const msgBytes = encodeSubmitAnswer(authorAddress, questionId, contentHash, stakeAmount);
    // Store answer locally
    const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
    const answerId = `a_${authorAddress.slice(0, 8)}_${Date.now()}`;
    answers.push({ id: answerId, questionId, authorAddress, content, contentHash, stakeAmount, helpfulVotes: 0, accurateVotes: 0, misleadingVotes: 0, isAccepted: false, isDisputed: false, createdAt: Date.now() });
    localStorage.setItem('phn_answers', JSON.stringify(answers));
    return sendTx('submit_answer', 'type.googleapis.com/types.MessageSubmitAnswer', msgBytes, publicKey, privateKey);
}

export async function txAcceptAnswer(ownerAddress: string, questionId: string, answerId: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeAcceptAnswer(ownerAddress, questionId, answerId);
    return sendTx('accept_answer', 'type.googleapis.com/types.MessageAcceptAnswer', msgBytes, publicKey, privateKey);
}

export async function txDisputeAnswer(disputerAddress: string, answerId: string, reason: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeDisputeAnswer(disputerAddress, answerId, reason);
    return sendTx('dispute_answer', 'type.googleapis.com/types.MessageDisputeAnswer', msgBytes, publicKey, privateKey);
}

export async function txVerifyAnswer(voterAddress: string, answerId: string, vote: 'helpful' | 'accurate' | 'misleading', publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeVerifyAnswer(voterAddress, answerId, vote);
    return sendTx('verify_answer', 'type.googleapis.com/types.MessageVerifyAnswer', msgBytes, publicKey, privateKey);
}

export async function txStakeReputation(address: string, answerId: string, stakeAmount: number, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeStakeReputation(address, answerId, stakeAmount);
    return sendTx('stake_reputation', 'type.googleapis.com/types.MessageStakeReputation', msgBytes, publicKey, privateKey);
}

export async function txRewardReputation(fromAddress: string, toAddress: string, points: number, reason: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeRewardReputation(fromAddress, toAddress, points, reason);
    return sendTx('reward_reputation', 'type.googleapis.com/types.MessageRewardReputation', msgBytes, publicKey, privateKey);
}

export async function txPenaltyReputation(fromAddress: string, toAddress: string, points: number, reason: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodePenaltyReputation(fromAddress, toAddress, points, reason);
    return sendTx('penalty_reputation', 'type.googleapis.com/types.MessagePenaltyReputation', msgBytes, publicKey, privateKey);
}

export async function txFollowUser(followerAddress: string, targetAddress: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeFollowUser(followerAddress, targetAddress);
    return sendTx('follow_user', 'type.googleapis.com/types.MessageFollowUser', msgBytes, publicKey, privateKey);
}

export async function txEndorseMember(endorserAddress: string, targetAddress: string, skill: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeEndorseMember(endorserAddress, targetAddress, skill);
    return sendTx('endorse_member', 'type.googleapis.com/types.MessageEndorseMember', msgBytes, publicKey, privateKey);
}

export async function txCreateTribe(creatorAddress: string, name: string, description: string, category: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeCreateTribe(creatorAddress, name, description, category);
    return sendTx('create_tribe', 'type.googleapis.com/types.MessageCreateTribe', msgBytes, publicKey, privateKey);
}

export async function txJoinTribe(memberAddress: string, tribeId: string, publicKey: string, privateKey: string): Promise<string> {
    const msgBytes = encodeJoinTribe(memberAddress, tribeId);
    return sendTx('join_tribe', 'type.googleapis.com/types.MessageJoinTribe', msgBytes, publicKey, privateKey);
}

export async function txSendPROOFH(fromAddress: string, toAddress: string, amount: number, publicKey: string, privateKey: string): Promise<string> {
    const height = await getHeight();
    const txTime = Date.now() * 1000;
    const fee = 10000;

    // Encode msg as protobuf bytes for signing (matching rpc_test.ts pattern)
    const msgBytes = encodeSend(fromAddress, toAddress, amount);
    const typeUrl = 'type.googleapis.com/types.MessageSend';

    // Build sign bytes using the same encoder as all other txs (signing.ts buildTxJson)
    const tx = buildTxJson('send', typeUrl, msgBytes, publicKey, privateKey, height, 1, 1, 1000);

    // For send, Canopy expects msg as JSON object (not msgBytes) — override those fields
    tx.msg = {
        fromAddress: Buffer.from(fromAddress, 'hex').toString('base64'),
        toAddress: Buffer.from(toAddress, 'hex').toString('base64'),
        amount: amount
    };
    delete tx.msgTypeUrl;
    delete tx.msgBytes;

    return submitTx(tx);
}

// Faucet - sends PROOFH from validator to new user
export async function claimFaucet(recipientAddress: string): Promise<string> {
    const FAUCET_ADDR = 'c0d8caf3fc48cbcc685a6a0b3004eaf28a23663b';
    const FAUCET_PRIVKEY = '0d0b5e14f54243c6d2028b54baacb15b35dbd6f57bf01dc2b4ae3945d5262293';
    const FAUCET_PUBKEY = '8005e611147deb44add125de30d285f145bfadbd5573e31726f9c69ef9c5967b48e917dbf9b3bbb3b145905191e95a07';
    const FAUCET_AMOUNT = 50000;
    return txSendPROOFH(FAUCET_ADDR, recipientAddress, FAUCET_AMOUNT, FAUCET_PUBKEY, FAUCET_PRIVKEY);
}
