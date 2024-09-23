import React from 'react';
import { Box, VStack, Heading } from '@chakra-ui/react';
import GameCard from './GameCard';

const PlayedGames = ({ playedGames, removeFromPlayedGames, updateGameRating }) => {
  return (
    <Box p={4}>
      <Heading size="lg" mb={4} textAlign="center">
        Played Games
      </Heading>
      {playedGames.length > 0 ? (
        <VStack spacing={4}>
          {playedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              hideButtons={true}
              isInPlayedGames={true}
              removeFromPlayedGames={removeFromPlayedGames}
              updateGameRating={updateGameRating}
              showRemoveButton={true}
            />
          ))}
        </VStack>
      ) : (
        <Box textAlign="center">You haven't played any games yet.</Box>
      )}
    </Box>
  );
};

export default PlayedGames;
