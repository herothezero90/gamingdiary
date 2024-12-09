import { Box, SimpleGrid, Heading } from '@chakra-ui/react';
import GameCard from './GameCard';
import PropTypes from 'prop-types';

const Wishlist = ({ wishlist, removeFromWishlist }) => {
  return (
    <Box p={4}>
      <Heading size="lg" mb={4} textAlign="center">
        Wishlist
      </Heading>
      {wishlist.length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 3, xl: 4 }} spacing={4} >
          {wishlist.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              hideButtons={true}
              isInWishlist={true}
              removeFromWishlist={removeFromWishlist}
              showRemoveButton={true}
              size="large"
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center">Your wishlist is empty.</Box>
      )}
    </Box>
  );
};

Wishlist.propTypes = {
  wishlist: PropTypes.array.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
};

export default Wishlist;
