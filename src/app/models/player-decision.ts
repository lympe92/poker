export interface PlayerDecision {
  type: 'fold' | 'call' | 'raise';
  amount: number;
  updatePlayer: () => void;
}
