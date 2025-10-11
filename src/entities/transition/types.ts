export interface Transition {
  id: string;
  fromStateId: string;
  toStateId: string;
  probability: number;
  label?: string;
}
