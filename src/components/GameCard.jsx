import React, { useState } from 'react';
import { Box, Image, Text, Button, VStack, HStack } from '@chakra-ui/react';
import Rating from './Rating';

const GameCard = ({
  game,
  addToWishlist,
  addToPlayingNow,
  addToPlayedGames,
  removeFromPlayingNow,
  removeFromWishlist,
  removeFromPlayedGames,
  hideButtons = false,
  isInWishlist,
  isInPlayingNow,
  isInPlayedGames,
  showRemoveButton = false,
  actionType,
  updateGameRating,
}) => {
  const handleAddToList = (listType) => {
    if (listType === 'To Buy' && addToWishlist) {
      addToWishlist(game);
    } else if (listType === 'Playing' && addToPlayingNow) {
      addToPlayingNow(game);
    } else if (listType === 'Played' && addToPlayedGames) {
      addToPlayedGames(game);
    }
  };

  const handleRemove = () => {
    if (removeFromWishlist) {
      removeFromWishlist(game.id);
    }
    if (removeFromPlayingNow) {
      removeFromPlayingNow(game.id);
    }
    if (removeFromPlayedGames) {
      removeFromPlayedGames(game.id);
    }
  };

  return (
    <Box
      bg="gray.800"
      color="white"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      w="100%"
      maxW="lg"
      boxShadow="lg"
    >
      <VStack spacing={4} align="center">
        <Image
          src={game.background_image}
          alt={game.name}
          boxSize="200px"
          objectFit="cover"
          borderRadius="md"
        />
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {game.name}
        </Text>
        <Text textAlign="center">Metascore: {game.metacritic || 'N/A'}</Text>

        {/* Action Buttons */}
        {!hideButtons && (
          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={() => handleAddToList('To Buy')}>
              To Buy
            </Button>
            <Button colorScheme="green" onClick={() => handleAddToList('Played')}>
              Played
            </Button>
            <Button colorScheme="orange" onClick={() => handleAddToList('Playing')}>
              Playing
            </Button>
          </HStack>
        )}

        {/* Remove Button */}
        {showRemoveButton && (
          <Button colorScheme="red" onClick={handleRemove}>
            Remove
          </Button>
        )}

        {/* Rating Component for Played Games */}
        {isInPlayedGames && updateGameRating && (
          <Rating
            gameId={game.id}
            rating={game.rating}
            updateGameRating={updateGameRating}
          />
        )}
        {/* Remove Button */}
        {showRemoveButton && (
          <Button colorScheme="red" onClick={handleRemove}>
            Remove
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default GameCard;
