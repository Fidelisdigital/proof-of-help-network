export interface Wallet {
    address: string;
    publicKey: string;
    privateKey: string;
}

export interface Profile {
    address: string;
    username: string;
    bio: string;
    expertiseTags: string[];
    reputationScore: number;
    questionsAsked: number;
    answersGiven: number;
    acceptedAnswers: number;
    endorsements: number;
    endorsedSkills: Record<string, number>;
    createdAt: number;
}

export interface Question {
    id: string;
    authorAddress: string;
    title: string;
    contentHash: string;
    content: string;
    category: string;
    tags: string[];
    answerCount: number;
    acceptedAnswerId: string;
    createdAt: number;
}

export interface Answer {
    id: string;
    questionId: string;
    authorAddress: string;
    contentHash: string;
    content: string;
    stakeAmount: number;
    helpfulVotes: number;
    accurateVotes: number;
    misleadingVotes: number;
    isAccepted: boolean;
    isDisputed: boolean;
    createdAt: number;
}

export interface TxResult {
    hash: string;
    height?: number;
    confirmed: boolean;
}

export interface ChainTx {
    sender: string;
    recipient: string;
    messageType: string;
    height: number;
    txHash: string;
    transaction: any;
}
