import React from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Rating = ({ gameId, rating, updateGameRating }) => {
  const handleRating = (newRating) => {
    updateGameRating(gameId, newRating);
  };

  return (
    <HStack>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          icon={<StarIcon />}
          colorScheme={star <= rating ? 'yellow' : 'gray'}
          variant="ghost"
          onClick={() => handleRating(star)}
          aria-label={`${star} Star`}
        />
      ))}
    </HStack>
  );
};

export default Rating;
