// types.ts
export interface Card {
  suit: string;
  value: number;
  show: boolean;
  img: string;
}

export interface HandScore {
  name: string;
  rank: number;
}
