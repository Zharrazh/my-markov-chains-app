import { fireEvent, render, screen } from '@testing-library/react';
import { StateCard } from './StateCard';
import type { State } from '../../types';
import type { Transition } from '@entities/transition';

// Создаём состояния как экземпляры классов
const mockState: State = {
  id: 'state1',
  label: 'Start State',
  description: 'This is the starting state',
};
const state2: State = {
  id: 'state2',
  label: 'Next State',
  description: 'Next state description',
};

// Создаём переход как экземпляр класса Transition
const transitions: Transition[] = [
  {
    id: 'trans1',
    fromStateId: mockState.id,
    toStateId: state2.id,
    probability: 1,
    label: 'to next',
  },
];

describe('StateCard', () => {
  test('renders state info', () => {
    render(<StateCard state={mockState} associatedTranslations={transitions} />);
    expect(screen.getByText('Start State')).toBeInTheDocument();
    expect(screen.getByText('This is the starting state')).toBeInTheDocument();
    expect(screen.getByText('Transitions: 1')).toBeInTheDocument();
  });

  test('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<StateCard state={mockState} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
