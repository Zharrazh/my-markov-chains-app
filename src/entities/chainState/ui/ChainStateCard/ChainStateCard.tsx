import { Box, Heading, Text, VStack, HStack, HTMLChakraProps, Card, Stat } from '@chakra-ui/react';
import type { FC, PropsWithChildren } from 'react';
import type { ChainStateCardProps } from './props';
import { TransitionEntity } from '@entities/transition';
import { StateCard } from '@entities/state';

const Section: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <Box mb={4}>
    <Heading size="sm" mb={2} color="gray.700">
      {title}
    </Heading>
    {children}
  </Box>
);

const TransitionItem: FC<{ transition: TransitionEntity }> = ({ transition }) => (
  <HStack gap={2} fontSize="sm">
    <Text fontWeight="medium" whiteSpace="nowrap">
      {transition.label ?? transition.id}
    </Text>
    <Text>(p={transition.probability.toFixed(2)})</Text>
  </HStack>
);

const CardContainer: FC<HTMLChakraProps<'div'>> = ({ children }) => (
  <Card.Root>{children}</Card.Root>
);

export const ChainStateCard: FC<ChainStateCardProps> = ({ state }) => {
  switch (state.type) {
    case 'AtState':
      return (
        <CardContainer>
          <Card.Header>
            <Card.Title>Состояние: {state.state.label}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Description>{state.state.description}</Card.Description>
          </Card.Body>
        </CardContainer>
      );

    case 'SelectingTransition':
      return (
        <CardContainer>
          <Card.Header>
            <Card.Title>Выбор перехода</Card.Title>
          </Card.Header>
          <Card.Body>
            <Section title="Все доступные переходы">
              <VStack gap={2} pl={2} align="stretch">
                {state.availableTransitions.map((transition) => (
                  <TransitionItem key={transition.id} transition={transition} />
                ))}
              </VStack>
            </Section>

            <Section title="Подкидываем кубик">
              <Stat.Root>
                <Stat.ValueText>{state.rolledNumber.toFixed(3)}</Stat.ValueText>
              </Stat.Root>
            </Section>

            <Section title="Выбран переход">
              <TransitionItem transition={state.chosenTransition} />
            </Section>
          </Card.Body>
        </CardContainer>
      );

    case 'Terminated':
      return (
        <CardContainer textAlign="center">
          <Card.Header>
            <Card.Title>Цепь завершена</Card.Title>
          </Card.Header>
          <Card.Body>
            <Section
              title="Финальное состояние:
"
            >
              <StateCard state={state.terminalState} />
            </Section>
          </Card.Body>
        </CardContainer>
      );

    default:
      return (
        <CardContainer textAlign="center" color="gray.400">
          <Text>Неизвестное состояние</Text>
        </CardContainer>
      );
  }
};
