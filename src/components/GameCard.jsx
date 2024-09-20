import React, { useState } from 'react';
import { Box, Image, Text, Button, HStack } from '@chakra-ui/react';

const GameCard = ({ game }) => {
  const [status, setStatus] = useState('');

  const handleAddToList = (listType) => {
    setStatus(listType);
    // Implement functionality to save this status
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      w="100%"
      maxWidth="500px"
    >
      <HStack spacing={4}>
        <Image
          src={game.background_image}
          alt={game.name}
          boxSize="150px"
          objectFit="cover"
        />
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {game.name}
          </Text>
          <Text>Metascore: {game.metacritic || 'N/A'}</Text>
          <HStack mt={2}>
            <Button onClick={() => handleAddToList('To Buy')}>
              To Buy
            </Button>
            <Button onClick={() => handleAddToList('Played')}>
              Played
            </Button>
            <Button onClick={() => handleAddToList('Playing')}>
              Playing
            </Button>
          </HStack>
          {status && <Text mt={2}>Added to your "{status}" list.</Text>}
        </Box>
      </HStack>
    </Box>
  );
};

export default GameCard;
