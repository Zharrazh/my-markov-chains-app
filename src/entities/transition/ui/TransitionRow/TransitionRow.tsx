import { HStack, Text } from '@chakra-ui/react';
import { TransitionDTO } from '@entities/transition/types';
import type { FC } from 'react';

export const TransitionRow: FC<{ transition: TransitionDTO }> = ({ transition }) => (
  <HStack gap={2} fontSize="sm">
    <Text fontWeight="medium" whiteSpace="nowrap">
      {transition.label ?? transition.id}
    </Text>
    <Text>(p={transition.probability.toFixed(2)})</Text>
  </HStack>
);
