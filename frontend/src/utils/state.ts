// PHN State Management
// All reputation data derived from Canopy chain tx history
// localStorage is write-through cache only — chain is source of truth

import { getTxsBySender, getTxsByHeight, getHeight, getAccount } from './rpc';

// ── GET ALL KNOWN USER ADDRESSES ─────────────────────────────────────
// We use phn_profiles as our address registry
// Every signup adds to this registry
function getAllKnownAddresses(): string[] {
    const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
    return Object.keys(profiles);
}

// ── FIX A: VOTE COUNTS FROM CHAIN ────────────────────────────────────
// Query verify_answer txs from ALL users, filter by answerId
export async function getVoteCountsFromChain(answerId: string): Promise<{
    helpful: number;
    accurate: number;
    disputed: number;
}> {
    try {
        const addresses = getAllKnownAddresses();
        let helpful = 0;
        let accurate = 0;
        let disputed = 0;

        // Query each known user's verify_answer txs
        await Promise.all(addresses.map(async (addr) => {
            try {
                const txs = await getTxsBySender(addr, 50);
                txs.forEach((tx: any) => {
                    if (tx.messageType === 'verify_answer') {
                        const msg = tx.transaction?.msg || {};
                        // Match by answerId in msg
                        if (msg.answerId === answerId || 
                            tx.transaction?.msgBytes?.includes(answerId)) {
                            const vote = msg.vote || msg.voteType || '';
                            if (vote === 'helpful') helpful++;
                            else if (vote === 'accurate') accurate++;
                        }
                    }
                    if (tx.messageType === 'dispute_answer') {
                        const msg = tx.transaction?.msg || {};
                        if (msg.answerId === answerId) disputed++;
                    }
                });
            } catch { /* skip failed */ }
        }));

        // Fallback to localStorage if chain returns 0 (msg format may vary)
        // This ensures votes are never lost
        const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
        const answer = answers.find((a: any) => a.id === answerId);
        if (answer) {
            helpful = Math.max(helpful, answer.helpfulVotes || 0);
            accurate = Math.max(accurate, answer.accurateVotes || 0);
        }

        return { helpful, accurate, disputed };
    } catch {
        // Full fallback to localStorage
        const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
        const answer = answers.find((a: any) => a.id === answerId);
        return {
            helpful: answer?.helpfulVotes || 0,
            accurate: answer?.accurateVotes || 0,
            disputed: answer?.isDisputed ? 1 : 0
        };
    }
}

// ── FIX B: CRED FROM CHAIN ───────────────────────────────────────────
// Count reward_reputation txs sent TO this user by querying all known users
export async function calculateCREDFromChain(address: string): Promise<number> {
    try {
        const addresses = getAllKnownAddresses();
        let score = 0;

        // Query reward_reputation txs from all users
        await Promise.all(addresses.map(async (addr) => {
            if (addr === address) return; // skip self
            try {
                const txs = await getTxsBySender(addr, 500);
                txs.forEach((tx: any) => {
                    if (tx.messageType === 'reward_reputation') {
                        // recipient field shows who received the reward
                        if (tx.recipient === address) {
                            score += 5; // each reward = +5 CRED
                        }
                    }
                    if (tx.messageType === 'verify_answer') {
                        // Also count verify_answer txs targeting our answers
                        // recipient of verify_answer is the answer author
                        if (tx.recipient === address) {
                            const msg = tx.transaction?.msg || {};
                            const vote = msg.vote || msg.voteType || '';
                            if (vote === 'helpful' || vote === 'accurate') {
                                score += 5;
                            }
                        }
                    }
                });
            } catch { /* skip */ }
        }));

        // Also check localStorage as floor (chain-backed evidence)
        const localScore = calculateCREDFromLocal(address);
        return Math.max(score, localScore);
    } catch {
        return calculateCREDFromLocal(address);
    }
}

export function calculateCREDFromLocal(address: string): number {
    const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
    const myAnswers = answers.filter((a: any) => a.authorAddress === address);
    let score = 0;
    myAnswers.forEach((a: any) => {
        score += (a.helpfulVotes || 0) * 5;
        score += (a.accurateVotes || 0) * 5;
    });
    return Math.max(0, score);
}

// ── FIX C: TRIBE MEMBERSHIP FROM CHAIN ───────────────────────────────
// Query join_tribe txs from all known users to build real member list
export async function getTribeMembersFromChain(tribeId: string): Promise<string[]> {
    try {
        const addresses = getAllKnownAddresses();
        const members: string[] = [];

        await Promise.all(addresses.map(async (addr) => {
            try {
                const txs = await getTxsBySender(addr, 50);
                const joined = txs.some((tx: any) => {
                    if (tx.messageType === 'join_tribe') {
                        const msg = tx.transaction?.msg || {};
                        return msg.tribeId === tribeId || 
                               tx.transaction?.msgBytes?.includes(tribeId);
                    }
                    if (tx.messageType === 'create_tribe') {
                        const msg = tx.transaction?.msg || {};
                        return msg.tribeId === tribeId ||
                               tx.transaction?.msgBytes?.includes(tribeId);
                    }
                    return false;
                });
                if (joined && !members.includes(addr)) {
                    members.push(addr);
                }
            } catch { /* skip */ }
        }));

        // Also check localStorage as fallback
        const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
        Object.entries(joined).forEach(([addr, tribes]: any) => {
            if (tribes.includes(tribeId) && !members.includes(addr)) {
                members.push(addr);
            }
        });

        return members;
    } catch {
        // Full fallback to localStorage
        const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
        return Object.entries(joined)
            .filter(([_, tribes]: any) => tribes.includes(tribeId))
            .map(([addr]) => addr);
    }
}

// Check if a specific user has joined a tribe from chain
export async function hasJoinedTribeFromChain(address: string, tribeId: string): Promise<boolean> {
    try {
        const txs = await getTxsBySender(address, 50);
        return txs.some((tx: any) => {
            if (tx.messageType === 'join_tribe' || tx.messageType === 'create_tribe') {
                const msg = tx.transaction?.msg || {};
                return msg.tribeId === tribeId ||
                       tx.transaction?.msgBytes?.includes(tribeId);
            }
            return false;
        });
    } catch {
        const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
        return (joined[address] || []).includes(tribeId);
    }
}

// ── BALANCE FROM CHAIN ────────────────────────────────────────────────
export async function getBalanceFromChain(address: string, faucetAmount = 50000): Promise<number> {
    try {
        const account = await getAccount(address);
        const myTxs = await getTxsBySender(address, 100);
        const pluginTxCount = myTxs.filter((tx: any) =>
            tx.messageType !== 'send' && tx.sender === address
        ).length;
        const baseBalance = account.amount > 0 ? account.amount : faucetAmount;
        const feesSpent = pluginTxCount * 1000;
        return Math.max(0, baseBalance - feesSpent);
    } catch {
        const saved = localStorage.getItem('phn_balances');
        if (saved) {
            const balances = JSON.parse(saved);
            if (balances[address] !== undefined) return balances[address];
        }
        return faucetAmount;
    }
}

// ── CHAIN SYNC ────────────────────────────────────────────────────────
export async function syncAllFromChain(): Promise<void> {
    try {
        const height = await getHeight();
        const profiles: any = {};
        const questions: any[] = [];
        const answers: any[] = [];

        // Scan ALL blocks (not just recent 200)
        // Use batch of 1 to catch every tx
        for (let h = 1; h <= height; h++) {
            try {
                const txs = await getTxsByHeight(h);
                if (txs && txs.length > 0) {
                    for (const tx of txs) {
                        await processTx(tx, profiles, questions, answers);
                    }
                }
            } catch { /* skip empty blocks */ }
        }

        mergeToLocalStorage(profiles, questions, answers);
        console.log(`✅ Synced from chain: ${Object.keys(profiles).length} profiles, ${questions.length} questions, ${answers.length} answers`);
    } catch (e) {
        console.error('Chain sync failed:', e);
    }
}

// Sync only using known user addresses (faster)
export async function syncFromKnownUsers(): Promise<void> {
    try {
        const addresses = getAllKnownAddresses();
        const profiles: any = {};
        const questions: any[] = [];
        const answers: any[] = [];

        await Promise.all(addresses.map(async (addr) => {
            try {
                const txs = await getTxsBySender(addr, 500);
                for (const tx of txs) {
                    await processTx(tx, profiles, questions, answers);
                }
            } catch { /* skip */ }
        }));

        mergeToLocalStorage(profiles, questions, answers);
        console.log('✅ Synced from known users');
    } catch (e) {
        console.error('User sync failed:', e);
    }
}

async function processTx(tx: any, profiles: any, questions: any[], answers: any[]) {
    const msg = tx.transaction?.msg || {};
    const type = tx.messageType;
    const sender = tx.sender;
    const txTime = tx.transaction?.time
        ? Math.floor(tx.transaction.time / 1000) // convert microseconds to ms
        : Date.now();

    if (type === 'create_profile') {
        // Full profile data readable from chain
        const username = msg.username || '';
        profiles[sender] = {
            address: sender,
            username,
            bio: msg.bio || '',
            expertiseTags: msg.expertiseTags || msg.tags || [],
            reputationScore: 0,
            createdAt: txTime,
            joinBlock: tx.height
        };
        // Save username->address mapping for login
        if (username) {
            const usernameMap = JSON.parse(localStorage.getItem('phn_usernames') || '{}');
            usernameMap[username.toLowerCase()] = sender;
            localStorage.setItem('phn_usernames', JSON.stringify(usernameMap));
        }
    }
    else if (type === 'update_profile') {
        if (profiles[sender]) {
            profiles[sender].bio = msg.bio || profiles[sender].bio;
            profiles[sender].expertiseTags = msg.expertiseTags || msg.tags || profiles[sender].expertiseTags;
        }
    }
    else if (type === 'create_question') {
        // Full content now stored in tx msg — truly onchain
        // Field mapping: title=field2, content=field3, contentHash=field4, category=field5, tags=field6
        const title = msg.title || msg[2] || '';
        const content = msg.content || msg[3] || '';
        const contentHash = msg.contentHash || msg[4] || '';
        const category = msg.category || msg[5] || 'General';
        const tags = msg.tags || msg[6] || [];
        if (title && !questions.find((q: any) => q.contentHash === contentHash)) {
            questions.push({
                id: `q_${sender.slice(0,8)}_${tx.height}`,
                authorAddress: sender,
                title,
                content,
                contentHash,
                category,
                tags,
                answerCount: 0,
                acceptedAnswerId: '',
                createdAt: txTime,
                height: tx.height,
                fromChain: true
            });
        }
    }
    else if (type === 'submit_answer') {
        // Full content stored in tx msg
        const content = msg.content || msg[3] || '';
        const contentHash = msg.contentHash || msg[4] || '';
        const questionId = msg.questionId || msg[2] || '';
        if (!answers.find((a: any) => a.contentHash === contentHash)) {
            answers.push({
                id: `a_${sender.slice(0,8)}_${tx.height}`,
                questionId,
                authorAddress: sender,
                content,
                contentHash,
                helpfulVotes: 0,
                accurateVotes: 0,
                isAccepted: false,
                isDisputed: false,
                createdAt: txTime,
                height: tx.height,
                fromChain: true
            });
        }
    }
    else if (type === 'accept_answer') {
        const acceptedAnswerId = msg.answerId || '';
        const q = questions.find((q: any) => q.id === msg.questionId);
        if (q) q.acceptedAnswerId = acceptedAnswerId;
        const a = answers.find((a: any) => a.id === acceptedAnswerId);
        if (a) a.isAccepted = true;
    }
    else if (type === 'create_tribe') {
        // Tribe name/description readable from chain msg
        const name = msg.name || msg[2] || '';
        const description = msg.description || msg[3] || '';
        const category = msg.category || msg[4] || 'General';
        if (name) {
            const tribeId = `t_${sender.slice(0,8)}_${tx.height}`;
            const tribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
            const exists = tribes.find((t: any) => t.creatorAddress === sender && t.name === name);
            if (!exists) {
                tribes.push({
                    id: tribeId,
                    creatorAddress: sender,
                    name,
                    description,
                    category,
                    memberCount: 1,
                    createdAt: txTime,
                    height: tx.height,
                    fromChain: true
                });
                localStorage.setItem('phn_tribes', JSON.stringify(tribes));
            }
        }
    }
}

function mergeToLocalStorage(chainProfiles: any, chainQuestions: any[], chainAnswers: any[]) {
    // Profiles — chain is source of truth for username/bio
    const localProfiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
    Object.entries(chainProfiles).forEach(([addr, profile]: any) => {
        if (!localProfiles[addr]) {
            localProfiles[addr] = profile;
        } else {
            // Chain wins for verifiable fields
            localProfiles[addr].username = profile.username || localProfiles[addr].username;
            localProfiles[addr].bio = profile.bio || localProfiles[addr].bio;
            localProfiles[addr].expertiseTags = profile.expertiseTags?.length
                ? profile.expertiseTags
                : localProfiles[addr].expertiseTags;
            localProfiles[addr].joinBlock = profile.joinBlock || localProfiles[addr].joinBlock;
        }
    });
    localStorage.setItem('phn_profiles', JSON.stringify(localProfiles));

    // Questions — merge chain questions with local (chain wins for metadata)
    const localQuestions = JSON.parse(localStorage.getItem('phn_questions') || '[]');
    chainQuestions.forEach(cq => {
        const existing = localQuestions.find((lq: any) =>
            lq.contentHash === cq.contentHash ||
            (lq.authorAddress === cq.authorAddress && lq.title === cq.title)
        );
        if (existing) {
            // Update with chain-verified data
            existing.contentHash = cq.contentHash;
            existing.height = cq.height;
            existing.fromChain = true;
            existing.createdAt = cq.createdAt || existing.createdAt;
        } else if (cq.title) {
            // Add new question from chain
            localQuestions.push(cq);
        }
    });
    localStorage.setItem('phn_questions', JSON.stringify(localQuestions));

    // Answers — merge chain answers with local
    const localAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
    chainAnswers.forEach(ca => {
        const existing = localAnswers.find((la: any) =>
            la.contentHash === ca.contentHash ||
            (la.authorAddress === ca.authorAddress && la.questionId === ca.questionId)
        );
        if (existing) {
            existing.contentHash = ca.contentHash;
            existing.height = ca.height;
            existing.fromChain = true;
            if (ca.isAccepted) existing.isAccepted = true;
        } else if (ca.questionId) {
            localAnswers.push(ca);
        }
    });
    localStorage.setItem('phn_answers', JSON.stringify(localAnswers));
}

// ── EXPORTS ───────────────────────────────────────────────────────────
export async function syncProfileFromChain(addressHex: string): Promise<any | null> {
    try {
        return JSON.parse(localStorage.getItem('phn_profiles') || '{}')[addressHex] || null;
    } catch { return null; }
}

export function calculateCREDScore(address: string): number {
    return calculateCREDFromLocal(address);
}

export async function updateLocalCRED(address: string): Promise<number> {
    const score = await calculateCREDFromChain(address);
    const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
    if (profiles[address]) {
        profiles[address].reputationScore = score;
        localStorage.setItem('phn_profiles', JSON.stringify(profiles));
    }
    return score;
}

export function recordAnswerVote(answerId: string, voteType: 'helpful' | 'accurate'): string {
    const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
    const idx = answers.findIndex((a: any) => a.id === answerId);
    if (idx === -1) return '';
    if (voteType === 'helpful') answers[idx].helpfulVotes = (answers[idx].helpfulVotes || 0) + 1;
    if (voteType === 'accurate') answers[idx].accurateVotes = (answers[idx].accurateVotes || 0) + 1;
    localStorage.setItem('phn_answers', JSON.stringify(answers));
    return answers[idx].authorAddress;
}
