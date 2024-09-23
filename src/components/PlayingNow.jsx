import React from 'react';
import { Box, VStack, Heading } from '@chakra-ui/react';
import GameCard from './GameCard';

const PlayingNow = ({ playingNow, removeFromPlayingNow, addToPlayedGames }) => {
  return (
    <Box p={4}>
      <Heading size="lg" mb={4} textAlign="center">
        Playing Now
      </Heading>
      {playingNow.length > 0 ? (
        <VStack spacing={4}>
          {playingNow.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              hideButtons={true}
              isInPlayingNow={true}
              removeFromPlayingNow={removeFromPlayingNow}
              addToPlayedGames={addToPlayedGames}
              showRemoveButton={true}
            />
          ))}
        </VStack>
      ) : (
        <Box textAlign="center">You are not playing any games right now.</Box>
      )}
    </Box>
  );
};

export default PlayingNow;
