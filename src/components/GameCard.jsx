import React, { useState } from 'react';
import { Box, Image, Text, Button, VStack, HStack } from '@chakra-ui/react';

const GameCard = ({ game }) => {
  const [status, setStatus] = useState('');

  const handleAddToList = (listType) => {
    setStatus(listType);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      w="100%"
      maxW="lg"
    >
      <VStack spacing={4} align="center">
        <Image
          src={game.background_image}
          alt={game.name}
          boxSize="200px"
          objectFit="cover"
        />
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {game.name}
        </Text>
        <Text textAlign="center">Metascore: {game.metacritic || 'N/A'}</Text>
        <HStack spacing={4}>
          <Button onClick={() => handleAddToList('To Buy')}>To Buy</Button>
          <Button onClick={() => handleAddToList('Played')}>Played</Button>
          <Button onClick={() => handleAddToList('Playing')}>Playing</Button>
        </HStack>
        {status && (
          <Text mt={2} textAlign="center">
            Added to your "{status}" list.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default GameCard;
