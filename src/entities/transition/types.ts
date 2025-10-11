export interface TransitionDTO {
  id: string;
  fromStateId: string;
  toStateId: string;
  probability: number;
  label?: string;
}

export class TransitionEntity {
  private dto: TransitionDTO;

  constructor(dto: TransitionDTO) {
    this.dto = dto;
  }

  get id(): string {
    return this.dto.id;
  }

  get fromStateId(): string {
    return this.dto.fromStateId;
  }

  get toStateId(): string {
    return this.dto.toStateId;
  }

  get probability(): number {
    return this.dto.probability;
  }
  set probability(value: number) {
    if (value < 0 || value > 1) {
      throw new Error('Probability must be between 0 and 1');
    }
    this.dto.probability = value;
  }

  get label(): string | undefined {
    return this.dto.label;
  }
  set label(value: string | undefined) {
    this.dto.label = value;
  }

  toDTO(): TransitionDTO {
    return { ...this.dto };
  }
}
