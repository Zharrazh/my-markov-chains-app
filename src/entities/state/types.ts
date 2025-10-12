import { TransitionDTO } from '@entities/transition';

export interface StateDTO {
  id: string;
  label: string;
  description?: string;
}

export class StateEntity {
  private dto: StateDTO;
  private _transitions: TransitionDTO[];

  constructor(dto: StateDTO, transitions: TransitionDTO[]) {
    this.dto = dto;
    this._transitions = transitions;
  }

  get id(): string {
    return this.dto.id;
  }

  get label(): string {
    return this.dto.label;
  }

  set label(value: string) {
    this.dto.label = value.trim();
  }

  get description(): string | undefined {
    return this.dto.description;
  }

  get transitions(): TransitionDTO[] {
    return this._transitions;
  }

  set description(value: string | undefined) {
    this.dto.description = value;
  }

  rename(newLabel: string) {
    this.label = newLabel;
  }

  toDTO(): StateDTO {
    return { ...this.dto };
  }
}
