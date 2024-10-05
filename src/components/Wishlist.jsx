import { Box, VStack, Heading } from '@chakra-ui/react';
import GameCard from './GameCard';
import PropTypes from 'prop-types';

const Wishlist = ({ wishlist, removeFromWishlist }) => {
  return (
    <Box p={4}>
      <Heading size="lg" mb={4} textAlign="center">
        Wishlist
      </Heading>
      {wishlist.length > 0 ? (
        <VStack spacing={4}>
          {wishlist.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              hideButtons={true}
              isInWishlist={true}
              removeFromWishlist={removeFromWishlist}
              showRemoveButton={true}
            />
          ))}
        </VStack>
      ) : (
        <Box textAlign="center">Your wishlist is empty.</Box>
      )}
    </Box>
  );
};

Wishlist.propTypes = {
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      background_image: PropTypes.string,
      metacritic: PropTypes.number,
    })
  ).isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
};

export default Wishlist;
