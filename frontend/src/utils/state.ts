// PHN State Management
// CRED rules: +5 for helpful vote, +5 for accurate vote. Nothing else.

export async function syncProfileFromChain(addressHex: string): Promise<any | null> {
    try {
        const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        return profiles[addressHex] || null;
    } catch { return null; }
}

export function calculateCREDScore(address: string): number {
    const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
    const myAnswers = answers.filter((a: any) => a.authorAddress === address);
    let score = 0;
    myAnswers.forEach((a: any) => {
        score += (a.helpfulVotes || 0) * 5;
        score += (a.accurateVotes || 0) * 5;
    });
    return Math.max(0, score);
}

export function updateLocalCRED(address: string): number {
    const score = calculateCREDScore(address);
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
