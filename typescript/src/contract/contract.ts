/* PHN - Proof of Help Network Contract Implementation */

import Long from 'long';
import { types } from '../proto/types.js';
import {
    IPluginError,
    ErrInsufficientFunds,
    ErrInvalidAddress,
    ErrInvalidAmount,
    ErrInvalidMessageCast,
    ErrTxFeeBelowStateLimit
} from './error.js';
import type { Plugin, Config } from './plugin.js';
import { JoinLenPrefix, FromAny, Unmarshal } from './plugin.js';
import { fileDescriptorProtos } from '../proto/descriptors.js';

export const ContractConfig: any = {
    name: 'go_plugin_contract',
    id: 1,
    version: 1,
    supportedTransactions: [
        'send',
        'create_profile',
        'update_profile',
        'create_question',
        'submit_answer',
        'accept_answer',
        'dispute_answer',
        'verify_answer',
        'stake_reputation',
        'reward_reputation',
        'penalty_reputation',
        'follow_user',
        'endorse_member',
        'create_tribe',
        'join_tribe'
    ],
    transactionTypeUrls: [
        'type.googleapis.com/types.MessageSend',
        'type.googleapis.com/types.MessageCreateProfile',
        'type.googleapis.com/types.MessageUpdateProfile',
        'type.googleapis.com/types.MessageCreateQuestion',
        'type.googleapis.com/types.MessageSubmitAnswer',
        'type.googleapis.com/types.MessageAcceptAnswer',
        'type.googleapis.com/types.MessageDisputeAnswer',
        'type.googleapis.com/types.MessageVerifyAnswer',
        'type.googleapis.com/types.MessageStakeReputation',
        'type.googleapis.com/types.MessageRewardReputation',
        'type.googleapis.com/types.MessagePenaltyReputation',
        'type.googleapis.com/types.MessageFollowUser',
        'type.googleapis.com/types.MessageEndorseMember',
        'type.googleapis.com/types.MessageCreateTribe',
        'type.googleapis.com/types.MessageJoinTribe'
    ],
    eventTypeUrls: [],
    fileDescriptorProtos
};

export class Contract {
    Config: Config;
    FSMConfig: any;
    plugin: Plugin;
    fsmId: Long;

    constructor(config: Config, fsmConfig: any, plugin: Plugin, fsmId: Long) {
        this.Config = config;
        this.FSMConfig = fsmConfig;
        this.plugin = plugin;
        this.fsmId = fsmId;
    }

    Genesis(_request: any): any { return {}; }
    BeginBlock(_request: any): any { return {}; }
    EndBlock(_request: any): any { return {}; }

    // ── SEND ──────────────────────────────────────────────────────────────
    CheckMessageSend(msg: any): any {
        if (!msg.fromAddress || msg.fromAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.toAddress || msg.toAddress.length !== 20) return { error: ErrInvalidAddress() };
        const amount = msg.amount as Long | number | undefined;
        if (!amount || (Long.isLong(amount) ? amount.isZero() : amount === 0)) return { error: ErrInvalidAmount() };
        return { recipient: msg.toAddress, authorizedSigners: [msg.fromAddress] };
    }

    // ── IDENTITY ──────────────────────────────────────────────────────────
    CheckMessageCreateProfile(msg: any): any {
        if (!msg.address || msg.address.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.username || msg.username.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.address, authorizedSigners: [msg.address] };
    }

    CheckMessageUpdateProfile(msg: any): any {
        if (!msg.address || msg.address.length !== 20) return { error: ErrInvalidAddress() };
        return { recipient: msg.address, authorizedSigners: [msg.address] };
    }

    // ── KNOWLEDGE ─────────────────────────────────────────────────────────
    CheckMessageCreateQuestion(msg: any): any {
        if (!msg.authorAddress || msg.authorAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.title || msg.title.length === 0) return { error: ErrInvalidAmount() };
        if (!msg.contentHash || msg.contentHash.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.authorAddress, authorizedSigners: [msg.authorAddress] };
    }

    CheckMessageSubmitAnswer(msg: any): any {
        if (!msg.authorAddress || msg.authorAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.questionId || msg.questionId.length === 0) return { error: ErrInvalidAmount() };
        if (!msg.contentHash || msg.contentHash.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.authorAddress, authorizedSigners: [msg.authorAddress] };
    }

    CheckMessageAcceptAnswer(msg: any): any {
        if (!msg.ownerAddress || msg.ownerAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.questionId || msg.questionId.length === 0) return { error: ErrInvalidAmount() };
        if (!msg.answerId || msg.answerId.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.ownerAddress, authorizedSigners: [msg.ownerAddress] };
    }

    CheckMessageDisputeAnswer(msg: any): any {
        if (!msg.disputerAddress || msg.disputerAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.answerId || msg.answerId.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.disputerAddress, authorizedSigners: [msg.disputerAddress] };
    }

    // ── REPUTATION ────────────────────────────────────────────────────────
    CheckMessageVerifyAnswer(msg: any): any {
        if (!msg.voterAddress || msg.voterAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.answerId || msg.answerId.length === 0) return { error: ErrInvalidAmount() };
        if (!['helpful', 'accurate', 'misleading'].includes(msg.vote)) return { error: ErrInvalidAmount() };
        return { recipient: msg.voterAddress, authorizedSigners: [msg.voterAddress] };
    }

    CheckMessageStakeReputation(msg: any): any {
        if (!msg.address || msg.address.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.answerId || msg.answerId.length === 0) return { error: ErrInvalidAmount() };
        const amount = msg.stakeAmount as Long | number | undefined;
        if (!amount || (Long.isLong(amount) ? amount.isZero() : amount === 0)) return { error: ErrInvalidAmount() };
        return { recipient: msg.address, authorizedSigners: [msg.address] };
    }

    CheckMessageRewardReputation(msg: any): any {
        if (!msg.fromAddress || msg.fromAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.toAddress || msg.toAddress.length !== 20) return { error: ErrInvalidAddress() };
        const points = msg.points as Long | number | undefined;
        if (!points || (Long.isLong(points) ? points.isZero() : points === 0)) return { error: ErrInvalidAmount() };
        return { recipient: msg.toAddress, authorizedSigners: [msg.fromAddress] };
    }

    CheckMessagePenaltyReputation(msg: any): any {
        if (!msg.fromAddress || msg.fromAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.toAddress || msg.toAddress.length !== 20) return { error: ErrInvalidAddress() };
        const points = msg.points as Long | number | undefined;
        if (!points || (Long.isLong(points) ? points.isZero() : points === 0)) return { error: ErrInvalidAmount() };
        return { recipient: msg.toAddress, authorizedSigners: [msg.fromAddress] };
    }

    // ── SOCIAL ────────────────────────────────────────────────────────────
    CheckMessageFollowUser(msg: any): any {
        if (!msg.followerAddress || msg.followerAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.targetAddress || msg.targetAddress.length !== 20) return { error: ErrInvalidAddress() };
        return { recipient: msg.targetAddress, authorizedSigners: [msg.followerAddress] };
    }

    CheckMessageEndorseMember(msg: any): any {
        if (!msg.endorserAddress || msg.endorserAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.targetAddress || msg.targetAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.skill || msg.skill.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.targetAddress, authorizedSigners: [msg.endorserAddress] };
    }

    CheckMessageCreateTribe(msg: any): any {
        if (!msg.creatorAddress || msg.creatorAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.name || msg.name.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.creatorAddress, authorizedSigners: [msg.creatorAddress] };
    }

    CheckMessageJoinTribe(msg: any): any {
        if (!msg.memberAddress || msg.memberAddress.length !== 20) return { error: ErrInvalidAddress() };
        if (!msg.tribeId || msg.tribeId.length === 0) return { error: ErrInvalidAmount() };
        return { recipient: msg.memberAddress, authorizedSigners: [msg.memberAddress] };
    }
}

export class ContractAsync {
    static async CheckTx(contract: Contract, request: any): Promise<any> {
        // validate fee
        const [resp, err] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)), key: KeyForFeeParams() }]
        });
        if (err) return { error: err };
        if (resp?.error) return { error: resp.error };

        const feeParamsBytes = resp?.results?.[0]?.entries?.[0]?.value;
        if (feeParamsBytes && feeParamsBytes.length > 0) {
            const [minFees, unmarshalErr] = Unmarshal(feeParamsBytes, types.FeeParams);
            if (unmarshalErr) return { error: unmarshalErr };
            const txFee = request.tx?.fee as Long | number | undefined;
            const sendFee = (minFees as any)?.sendFee as Long | number | undefined;
            if (txFee !== undefined && sendFee !== undefined) {
                const txFeeNum = Long.isLong(txFee) ? txFee.toNumber() : txFee;
                const sendFeeNum = Long.isLong(sendFee) ? sendFee.toNumber() : sendFee;
                if (txFeeNum < sendFeeNum) return { error: ErrTxFeeBelowStateLimit() };
            }
        }

        const [msg, msgType, msgErr] = FromAny(request.tx?.msg);
        if (msgErr) return { error: msgErr };

        if (msg) {
            switch (msgType) {
                case 'MessageSend': return contract.CheckMessageSend(msg);
                case 'MessageCreateProfile': return contract.CheckMessageCreateProfile(msg);
                case 'MessageUpdateProfile': return contract.CheckMessageUpdateProfile(msg);
                case 'MessageCreateQuestion': return contract.CheckMessageCreateQuestion(msg);
                case 'MessageSubmitAnswer': return contract.CheckMessageSubmitAnswer(msg);
                case 'MessageAcceptAnswer': return contract.CheckMessageAcceptAnswer(msg);
                case 'MessageDisputeAnswer': return contract.CheckMessageDisputeAnswer(msg);
                case 'MessageVerifyAnswer': return contract.CheckMessageVerifyAnswer(msg);
                case 'MessageStakeReputation': return contract.CheckMessageStakeReputation(msg);
                case 'MessageRewardReputation': return contract.CheckMessageRewardReputation(msg);
                case 'MessagePenaltyReputation': return contract.CheckMessagePenaltyReputation(msg);
                case 'MessageFollowUser': return contract.CheckMessageFollowUser(msg);
                case 'MessageEndorseMember': return contract.CheckMessageEndorseMember(msg);
                case 'MessageCreateTribe': return contract.CheckMessageCreateTribe(msg);
                case 'MessageJoinTribe': return contract.CheckMessageJoinTribe(msg);
                default: return { error: ErrInvalidMessageCast() };
            }
        }
        return { error: ErrInvalidMessageCast() };
    }

    static async DeliverTx(contract: Contract, request: any): Promise<any> {
        const [msg, msgType, err] = FromAny(request.tx?.msg);
        if (err) return { error: err };

        if (msg) {
            switch (msgType) {
                case 'MessageSend':
                    return ContractAsync.DeliverMessageSend(contract, msg, request.tx?.fee as Long);
                case 'MessageCreateProfile':
                    return ContractAsync.DeliverMessageCreateProfile(contract, msg);
                case 'MessageUpdateProfile':
                    return ContractAsync.DeliverMessageUpdateProfile(contract, msg);
                case 'MessageCreateQuestion':
                    return ContractAsync.DeliverMessageCreateQuestion(contract, msg);
                case 'MessageSubmitAnswer':
                    return ContractAsync.DeliverMessageSubmitAnswer(contract, msg);
                case 'MessageAcceptAnswer':
                    return ContractAsync.DeliverMessageAcceptAnswer(contract, msg);
                case 'MessageDisputeAnswer':
                    return ContractAsync.DeliverMessageDisputeAnswer(contract, msg);
                case 'MessageVerifyAnswer':
                    return ContractAsync.DeliverMessageVerifyAnswer(contract, msg);
                case 'MessageStakeReputation':
                    return ContractAsync.DeliverMessageStakeReputation(contract, msg);
                case 'MessageRewardReputation':
                    return ContractAsync.DeliverMessageRewardReputation(contract, msg);
                case 'MessagePenaltyReputation':
                    return ContractAsync.DeliverMessagePenaltyReputation(contract, msg);
                case 'MessageFollowUser':
                    return ContractAsync.DeliverMessageFollowUser(contract, msg);
                case 'MessageEndorseMember':
                    return ContractAsync.DeliverMessageEndorseMember(contract, msg);
                case 'MessageCreateTribe':
                    return ContractAsync.DeliverMessageCreateTribe(contract, msg);
                case 'MessageJoinTribe':
                    return ContractAsync.DeliverMessageJoinTribe(contract, msg);
                default:
                    return { error: ErrInvalidMessageCast() };
            }
        }
        return { error: ErrInvalidMessageCast() };
    }

    // ── SEND ──────────────────────────────────────────────────────────────
    static async DeliverMessageSend(contract: Contract, msg: any, fee: Long | number | undefined): Promise<any> {
        const fromQueryId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const toQueryId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const feeQueryId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const fromKey = KeyForAccount(msg.fromAddress!);
        const toKey = KeyForAccount(msg.toAddress!);
        const feePoolKey = KeyForFeePool(Long.fromNumber(contract.Config.ChainId));

        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [
                { queryId: feeQueryId, key: feePoolKey },
                { queryId: fromQueryId, key: fromKey },
                { queryId: toQueryId, key: toKey }
            ]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let fromBytes: Uint8Array | null = null;
        let toBytes: Uint8Array | null = null;
        let feePoolBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const qid = resp.queryId as Long;
            if (qid.equals(fromQueryId)) fromBytes = resp.entries?.[0]?.value || null;
            else if (qid.equals(toQueryId)) toBytes = resp.entries?.[0]?.value || null;
            else if (qid.equals(feeQueryId)) feePoolBytes = resp.entries?.[0]?.value || null;
        }

        const [fromRaw, fromErr] = Unmarshal(fromBytes || new Uint8Array(), types.Account);
        if (fromErr) return { error: fromErr };
        const [toRaw, toErr] = Unmarshal(toBytes || new Uint8Array(), types.Account);
        if (toErr) return { error: toErr };
        const [feePoolRaw, feePoolErr] = Unmarshal(feePoolBytes || new Uint8Array(), types.Pool);
        if (feePoolErr) return { error: feePoolErr };

        const from = fromRaw as any;
        const to = toRaw as any;
        const feePool = feePoolRaw as any;

        const msgAmount = Long.isLong(msg.amount) ? msg.amount : Long.fromNumber((msg.amount as number) || 0);
        const feeAmount = Long.isLong(fee) ? fee : Long.fromNumber((fee as number) || 0);
        const amountToDeduct = msgAmount.add(feeAmount);
        const fromAmount = Long.isLong(from?.amount) ? from.amount : Long.fromNumber((from?.amount as number) || 0);
        if (fromAmount.lessThan(amountToDeduct)) return { error: ErrInsufficientFunds() };

        const isSelfTransfer = Buffer.from(fromKey).equals(Buffer.from(toKey));
        const toAccount = isSelfTransfer ? from : to;
        const newFromAmount = fromAmount.subtract(amountToDeduct);
        const toAmount = Long.isLong(toAccount?.amount) ? toAccount.amount : Long.fromNumber((toAccount?.amount as number) || 0);
        const newToAmount = toAmount.add(msgAmount);
        const poolAmount = Long.isLong(feePool?.amount) ? feePool.amount : Long.fromNumber((feePool?.amount as number) || 0);
        const newPoolAmount = poolAmount.add(feeAmount);

        const updatedFrom = types.Account.create({ address: from?.address, amount: newFromAmount });
        const updatedTo = types.Account.create({ address: toAccount?.address, amount: newToAmount });
        const updatedPool = types.Pool.create({ id: feePool?.id, amount: newPoolAmount });
        const newFromBytes = types.Account.encode(updatedFrom).finish();
        const newToBytes = types.Account.encode(updatedTo).finish();
        const newFeePoolBytes = types.Pool.encode(updatedPool).finish();

        let writeResp: any;
        let writeErr: IPluginError | null;
        if (newFromAmount.isZero()) {
            [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                sets: [{ key: feePoolKey, value: newFeePoolBytes }, { key: toKey, value: newToBytes }],
                deletes: [{ key: fromKey }]
            });
        } else {
            [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                sets: [{ key: feePoolKey, value: newFeePoolBytes }, { key: toKey, value: newToBytes }, { key: fromKey, value: newFromBytes }]
            });
        }
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    // ── IDENTITY ──────────────────────────────────────────────────────────
    static async DeliverMessageCreateProfile(contract: Contract, msg: any): Promise<any> {
        const profileKey = KeyForProfile(msg.address!);
        const profileData = JSON.stringify({
            address: Buffer.from(msg.address).toString('hex'),
            username: msg.username || '',
            bio: msg.bio || '',
            expertiseTags: msg.expertiseTags || [],
            reputationScore: 0,
            questionsAsked: 0,
            answersGiven: 0,
            acceptedAnswers: 0,
            endorsements: 0,
            createdAt: 0
        });
        const profileBytes = Buffer.from(profileData, 'utf8');
        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
            sets: [{ key: profileKey, value: profileBytes }]
        });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    static async DeliverMessageUpdateProfile(contract: Contract, msg: any): Promise<any> {
        const profileKey = KeyForProfile(msg.address!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: profileKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        let profile: any = {};
        if (profileBytes && profileBytes.length > 0) {
            try { profile = JSON.parse(Buffer.from(profileBytes).toString('utf8')); } catch (_) { profile = {}; }
        }
        if (msg.bio) profile.bio = msg.bio;
        if (msg.expertiseTags && msg.expertiseTags.length > 0) profile.expertiseTags = msg.expertiseTags;

        const newProfileBytes = Buffer.from(JSON.stringify(profile), 'utf8');
        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
            sets: [{ key: profileKey, value: newProfileBytes }]
        });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    // ── KNOWLEDGE ─────────────────────────────────────────────────────────
    static async DeliverMessageCreateQuestion(contract: Contract, msg: any): Promise<any> {
        const questionId = `q_${Buffer.from(msg.authorAddress).toString('hex').slice(0, 8)}_${0}`;
        const questionKey = KeyForQuestion(questionId);
        const questionData = JSON.stringify({
            id: questionId,
            authorAddress: Buffer.from(msg.authorAddress).toString('hex'),
            title: msg.title || '',
            contentHash: msg.contentHash || '',
            category: msg.category || 'general',
            tags: msg.tags || [],
            answerCount: 0,
            acceptedAnswerId: '',
            createdAt: 0
        });
        const questionBytes = Buffer.from(questionData, 'utf8');

        // update author profile stats
        const profileKey = KeyForProfile(msg.authorAddress!);
        const profileQid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: profileQid, key: profileKey }]
        });
        if (readErr) return { error: readErr };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(profileQid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        const sets: any[] = [{ key: questionKey, value: questionBytes }];
        if (profileBytes && profileBytes.length > 0) {
            try {
                const profile = JSON.parse(Buffer.from(profileBytes).toString('utf8'));
                profile.questionsAsked = (profile.questionsAsked || 0) + 1;
                sets.push({ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') });
            } catch (_) { /* ignore parse error */ }
        }

        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, { sets });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    static async DeliverMessageSubmitAnswer(contract: Contract, msg: any): Promise<any> {
        const answerId = `a_${Buffer.from(msg.authorAddress).toString('hex').slice(0, 8)}_${0}`;
        const answerKey = KeyForAnswer(answerId);
        const answerData = JSON.stringify({
            id: answerId,
            questionId: msg.questionId || '',
            authorAddress: Buffer.from(msg.authorAddress).toString('hex'),
            contentHash: msg.contentHash || '',
            stakeAmount: msg.stakeAmount || 0,
            helpfulVotes: 0,
            accurateVotes: 0,
            misleadingVotes: 0,
            isAccepted: false,
            isDisputed: false,
            createdAt: 0
        });
        const answerBytes = Buffer.from(answerData, 'utf8');

        // update author profile stats
        const profileKey = KeyForProfile(msg.authorAddress!);
        const profileQid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: profileQid, key: profileKey }]
        });
        if (readErr) return { error: readErr };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(profileQid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        const sets: any[] = [{ key: answerKey, value: answerBytes }];
        if (profileBytes && profileBytes.length > 0) {
            try {
                const profile = JSON.parse(Buffer.from(profileBytes).toString('utf8'));
                profile.answersGiven = (profile.answersGiven || 0) + 1;
                profile.reputationScore = (profile.reputationScore || 0) + 10;
                sets.push({ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') });
            } catch (_) { /* ignore */ }
        }

        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, { sets });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    static async DeliverMessageAcceptAnswer(contract: Contract, msg: any): Promise<any> {
        const answerKey = KeyForAnswer(msg.answerId!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: answerKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let answerBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) answerBytes = resp.entries?.[0]?.value || null;
        }

        const sets: any[] = [];
        if (answerBytes && answerBytes.length > 0) {
            try {
                const answer = JSON.parse(Buffer.from(answerBytes).toString('utf8'));
                answer.isAccepted = true;

                // reward answer author reputation
                const profileKey = KeyForProfile(Buffer.from(answer.authorAddress, 'hex'));
                const profileQid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
                const [profResp, profErr] = await contract.plugin.StateRead(contract, {
                    keys: [{ queryId: profileQid, key: profileKey }]
                });
                if (!profErr && profResp && !profResp.error) {
                    let profBytes: Uint8Array | null = null;
                    for (const r of profResp?.results || []) {
                        const q = r.queryId as Long;
                        if (q.equals(profileQid)) profBytes = r.entries?.[0]?.value || null;
                    }
                    if (profBytes && profBytes.length > 0) {
                        const profile = JSON.parse(Buffer.from(profBytes).toString('utf8'));
                        profile.acceptedAnswers = (profile.acceptedAnswers || 0) + 1;
                        profile.reputationScore = (profile.reputationScore || 0) + 50;
                        sets.push({ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') });
                    }
                }
                sets.push({ key: answerKey, value: Buffer.from(JSON.stringify(answer), 'utf8') });
            } catch (_) { /* ignore */ }
        }

        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, { sets });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    static async DeliverMessageDisputeAnswer(contract: Contract, msg: any): Promise<any> {
        const answerKey = KeyForAnswer(msg.answerId!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: answerKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let answerBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) answerBytes = resp.entries?.[0]?.value || null;
        }

        if (answerBytes && answerBytes.length > 0) {
            try {
                const answer = JSON.parse(Buffer.from(answerBytes).toString('utf8'));
                answer.isDisputed = true;
                answer.disputeReason = msg.reasonHash || '';
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                    sets: [{ key: answerKey, value: Buffer.from(JSON.stringify(answer), 'utf8') }]
                });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }

    // ── REPUTATION ────────────────────────────────────────────────────────
    static async DeliverMessageVerifyAnswer(contract: Contract, msg: any): Promise<any> {
        const answerKey = KeyForAnswer(msg.answerId!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: answerKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let answerBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) answerBytes = resp.entries?.[0]?.value || null;
        }

        if (answerBytes && answerBytes.length > 0) {
            try {
                const answer = JSON.parse(Buffer.from(answerBytes).toString('utf8'));
                if (msg.vote === 'helpful') answer.helpfulVotes = (answer.helpfulVotes || 0) + 1;
                else if (msg.vote === 'accurate') answer.accurateVotes = (answer.accurateVotes || 0) + 1;
                else if (msg.vote === 'misleading') answer.misleadingVotes = (answer.misleadingVotes || 0) + 1;

                // update answer author reputation
                const sets: any[] = [{ key: answerKey, value: Buffer.from(JSON.stringify(answer), 'utf8') }];
                const profileKey = KeyForProfile(Buffer.from(answer.authorAddress, 'hex'));
                const profileQid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
                const [profResp, profErr] = await contract.plugin.StateRead(contract, {
                    keys: [{ queryId: profileQid, key: profileKey }]
                });
                if (!profErr && profResp && !profResp.error) {
                    let profBytes: Uint8Array | null = null;
                    for (const r of profResp?.results || []) {
                        const q = r.queryId as Long;
                        if (q.equals(profileQid)) profBytes = r.entries?.[0]?.value || null;
                    }
                    if (profBytes && profBytes.length > 0) {
                        const profile = JSON.parse(Buffer.from(profBytes).toString('utf8'));
                        if (msg.vote === 'misleading') {
                            profile.reputationScore = Math.max(0, (profile.reputationScore || 0) - 5);
                        } else {
                            profile.reputationScore = (profile.reputationScore || 0) + 5;
                        }
                        sets.push({ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') });
                    }
                }
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, { sets });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }

    static async DeliverMessageStakeReputation(contract: Contract, msg: any): Promise<any> {
        const profileKey = KeyForProfile(msg.address!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: profileKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        if (profileBytes && profileBytes.length > 0) {
            try {
                const profile = JSON.parse(Buffer.from(profileBytes).toString('utf8'));
                const stakeAmount = Long.isLong(msg.stakeAmount)
                    ? msg.stakeAmount.toNumber()
                    : (msg.stakeAmount as number) || 0;
                profile.stakedReputation = (profile.stakedReputation || 0) + stakeAmount;
                profile.reputationScore = Math.max(0, (profile.reputationScore || 0) - stakeAmount);
                profile.activeStake = { answerId: msg.answerId, amount: stakeAmount };
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                    sets: [{ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') }]
                });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }

    static async DeliverMessageRewardReputation(contract: Contract, msg: any): Promise<any> {
        const profileKey = KeyForProfile(msg.toAddress!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: profileKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        if (profileBytes && profileBytes.length > 0) {
            try {
                const profile = JSON.parse(Buffer.from(profileBytes).toString('utf8'));
                const points = Long.isLong(msg.points)
                    ? msg.points.toNumber()
                    : (msg.points as number) || 0;
                profile.reputationScore = (profile.reputationScore || 0) + points;
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                    sets: [{ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') }]
                });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }

    static async DeliverMessagePenaltyReputation(contract: Contract, msg: any): Promise<any> {
        const profileKey = KeyForProfile(msg.toAddress!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: profileKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        if (profileBytes && profileBytes.length > 0) {
            try {
                const profile = JSON.parse(Buffer.from(profileBytes).toString('utf8'));
                const points = Long.isLong(msg.points)
                    ? msg.points.toNumber()
                    : (msg.points as number) || 0;
                profile.reputationScore = Math.max(0, (profile.reputationScore || 0) - points);
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                    sets: [{ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') }]
                });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }

    // ── SOCIAL ────────────────────────────────────────────────────────────
    static async DeliverMessageFollowUser(contract: Contract, msg: any): Promise<any> {
        const followKey = KeyForFollow(msg.followerAddress!, msg.targetAddress!);
        const followData = JSON.stringify({
            follower: Buffer.from(msg.followerAddress).toString('hex'),
            target: Buffer.from(msg.targetAddress).toString('hex'),
            createdAt: 0
        });
        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
            sets: [{ key: followKey, value: Buffer.from(followData, 'utf8') }]
        });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    static async DeliverMessageEndorseMember(contract: Contract, msg: any): Promise<any> {
        const profileKey = KeyForProfile(msg.targetAddress!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: profileKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let profileBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) profileBytes = resp.entries?.[0]?.value || null;
        }

        if (profileBytes && profileBytes.length > 0) {
            try {
                const profile = JSON.parse(Buffer.from(profileBytes).toString('utf8'));
                profile.endorsements = (profile.endorsements || 0) + 1;
                profile.reputationScore = (profile.reputationScore || 0) + 15;
                if (!profile.endorsedSkills) profile.endorsedSkills = {};
                profile.endorsedSkills[msg.skill] = (profile.endorsedSkills[msg.skill] || 0) + 1;
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                    sets: [{ key: profileKey, value: Buffer.from(JSON.stringify(profile), 'utf8') }]
                });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }

    static async DeliverMessageCreateTribe(contract: Contract, msg: any): Promise<any> {
        const tribeId = `t_${Buffer.from(msg.creatorAddress).toString('hex').slice(0, 8)}_${0}`;
        const tribeKey = KeyForTribe(tribeId);
        const tribeData = JSON.stringify({
            id: tribeId,
            creatorAddress: Buffer.from(msg.creatorAddress).toString('hex'),
            name: msg.name || '',
            description: msg.description || '',
            category: msg.category || 'general',
            memberCount: 1,
            createdAt: 0
        });
        const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
            sets: [{ key: tribeKey, value: Buffer.from(tribeData, 'utf8') }]
        });
        if (writeErr) return { error: writeErr };
        if (writeResp?.error) return { error: writeResp.error };
        return {};
    }

    static async DeliverMessageJoinTribe(contract: Contract, msg: any): Promise<any> {
        const tribeKey = KeyForTribe(msg.tribeId!);
        const qid = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const [response, readErr] = await contract.plugin.StateRead(contract, {
            keys: [{ queryId: qid, key: tribeKey }]
        });
        if (readErr) return { error: readErr };
        if (response?.error) return { error: response.error };

        let tribeBytes: Uint8Array | null = null;
        for (const resp of response?.results || []) {
            const q = resp.queryId as Long;
            if (q.equals(qid)) tribeBytes = resp.entries?.[0]?.value || null;
        }

        if (tribeBytes && tribeBytes.length > 0) {
            try {
                const tribe = JSON.parse(Buffer.from(tribeBytes).toString('utf8'));
                tribe.memberCount = (tribe.memberCount || 0) + 1;
                const memberKey = KeyForTribeMember(msg.tribeId!, msg.memberAddress!);
                const memberData = JSON.stringify({
                    tribeId: msg.tribeId,
                    member: Buffer.from(msg.memberAddress).toString('hex'),
                    joinedAt: 0
                });
                const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
                    sets: [
                        { key: tribeKey, value: Buffer.from(JSON.stringify(tribe), 'utf8') },
                        { key: memberKey, value: Buffer.from(memberData, 'utf8') }
                    ]
                });
                if (writeErr) return { error: writeErr };
                if (writeResp?.error) return { error: writeResp.error };
            } catch (_) { /* ignore */ }
        }
        return {};
    }
}

// ── STATE KEY PREFIXES ────────────────────────────────────────────────────
const accountPrefix  = Buffer.from([1]);
const poolPrefix     = Buffer.from([2]);
const paramsPrefix   = Buffer.from([7]);
const profilePrefix  = Buffer.from([10]);
const questionPrefix = Buffer.from([11]);
const answerPrefix   = Buffer.from([12]);
const followPrefix   = Buffer.from([13]);
const tribePrefix    = Buffer.from([14]);
const tribeMemberPrefix = Buffer.from([15]);

export function KeyForAccount(addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(accountPrefix, Buffer.from(addr));
}
export function KeyForFeeParams(): Uint8Array {
    return JoinLenPrefix(paramsPrefix, Buffer.from('/f/'));
}
export function KeyForFeePool(chainId: Long): Uint8Array {
    return JoinLenPrefix(poolPrefix, formatUint64(chainId));
}
export function KeyForProfile(addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(profilePrefix, Buffer.from(addr));
}
export function KeyForQuestion(questionId: string): Uint8Array {
    return JoinLenPrefix(questionPrefix, Buffer.from(questionId, 'utf8'));
}
export function KeyForAnswer(answerId: string): Uint8Array {
    return JoinLenPrefix(answerPrefix, Buffer.from(answerId, 'utf8'));
}
export function KeyForFollow(follower: Uint8Array, target: Uint8Array): Uint8Array {
    return JoinLenPrefix(followPrefix, Buffer.from(follower), Buffer.from(target));
}
export function KeyForTribe(tribeId: string): Uint8Array {
    return JoinLenPrefix(tribePrefix, Buffer.from(tribeId, 'utf8'));
}
export function KeyForTribeMember(tribeId: string, member: Uint8Array): Uint8Array {
    return JoinLenPrefix(tribeMemberPrefix, Buffer.from(tribeId, 'utf8'), Buffer.from(member));
}

function formatUint64(u: Long): Buffer {
    const b = Buffer.alloc(8);
    b.writeBigUInt64BE(BigInt(u.toString()));
    return b;
}
