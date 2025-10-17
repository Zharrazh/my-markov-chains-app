import { Card, For, Text } from '@chakra-ui/react';
import { TransitionRow } from '@entities/transition';
import type { FC } from 'react';
import type { StateCardProps } from './props';

const MAX_TRANSITIONS_TO_SHOW = 5; // Максимальное количество переходов для показа

export const StateCard: FC<StateCardProps> = ({ state, transitions, onClick }) => {
  const transitionsCount = transitions?.length ?? 0;
  const visibleTransitions = transitions?.slice(0, MAX_TRANSITIONS_TO_SHOW) ?? [];

  return (
    <Card.Root onClick={onClick}>
      <Card.Header>
        <Card.Title>{state.label}</Card.Title>
        <Card.Description>{state.description}</Card.Description>
      </Card.Header>

      <Card.Body>
        {transitions && (
          <>
            <Text mb={1} textStyle={'sm'}>
              Переходы:
            </Text>
            <For each={visibleTransitions} fallback={<Text>Переходов нет</Text>}>
              {(transition) => <TransitionRow key={transition.id} transition={transition} />}
            </For>

            {transitionsCount > MAX_TRANSITIONS_TO_SHOW && (
              <Text>+{transitionsCount - MAX_TRANSITIONS_TO_SHOW} more</Text>
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
};
