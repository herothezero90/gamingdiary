import React from 'react';
import { VStack } from '@chakra-ui/react';
import GameCard from './GameCard';

const GameList = ({
  games,
  addToWishlist,
  addToPlayingNow,
  addToPlayedGames,
}) => {
  return (
    <VStack
      w="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      {games.length > 0 &&
        games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            addToWishlist={addToWishlist}
            addToPlayingNow={addToPlayingNow}
            addToPlayedGames={addToPlayedGames}
            hideButtons={false}
          />
        ))}
    </VStack>
  );
};

export default GameList;
