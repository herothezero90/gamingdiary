import React, { useState } from 'react';
import { VStack, Select } from '@chakra-ui/react';
import GameCard from './GameCard';

const GameList = ({ games }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSelect = (e) => {
    const game = games.find(
      (game) => game.id === parseInt(e.target.value)
    );
    setSelectedGame(game);
  };

  return (
    <VStack spacing={4}>
      {games.length > 0 && (
        <Select placeholder="Select a game" onChange={handleSelect}>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </Select>
      )}
      {selectedGame && <GameCard game={selectedGame} />}
    </VStack>
  );
};

export default GameList;
