import React from 'react';
import { Box, VStack, Heading } from '@chakra-ui/react';
import GameCard from './GameCard';

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

export default Wishlist;
