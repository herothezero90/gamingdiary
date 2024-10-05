import { VStack } from '@chakra-ui/react';
import GameCard from './GameCard';
import PropTypes from 'prop-types';

const GameList = ({
  games,
  addToWishlist
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
            hideButtons={false}
          />
        ))}
    </VStack>
  );
};

GameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      background_image: PropTypes.string,
      metacritic: PropTypes.number,
    })
  ).isRequired,
  addToWishlist: PropTypes.func.isRequired,
};


export default GameList;
