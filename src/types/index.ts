export type WordDifficulty = 'easy' | 'intermediate' | 'difficult';

export interface Word {
  id: number;
  nepali: string;
  roman: string;
  meaning_nepali: string;
  meaning_english: string;
  difficulty?: WordDifficulty; // To be populated by AI
}
