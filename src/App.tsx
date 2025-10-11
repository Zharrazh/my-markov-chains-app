import { StateCard, type State } from '@entities/state';
import type { Transition } from '@entities/transition';

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

const associatedTranslations: Transition[] = [
  {
    id: 'trans1',
    fromStateId: mockState.id,
    toStateId: state2.id,
    probability: 1,
    label: 'to next',
  },
];

function App() {
  return <StateCard state={mockState} associatedTranslations={associatedTranslations} />;
}

export default App;
