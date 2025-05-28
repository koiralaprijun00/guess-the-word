// WordDifficulty type removed

export type WordDifficulty = 'easy' | 'medium' | 'difficult';

export interface Word {
  id: number;
  nepali: string;
  roman: string;
  meaning_nepali: string;
  meaning_english: string;
  difficulty: WordDifficulty;
}
