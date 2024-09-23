import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Center,
  Spinner
} from '@chakra-ui/react';

const TopTen = ({ addToWishlist, addToPlayingNow, addToPlayedGames }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showTopRated, setShowTopRated] = useState(false); // Controls visibility of the section
  const [page, setPage] = useState(1); // For pagination

  const fetchTopGames = async (pageNumber) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/.netlify/functions/fetchGames?page_size=10&ordering=-metacritic&page=${pageNumber}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Filter games with cover images
      const gamesWithImages = data.results.filter((game) => game.background_image);

      setGames(gamesWithImages);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching the top games.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowTopRated = () => {
    setShowTopRated(true);
    setPage(1); // Reset to first page
    fetchTopGames(1);
  };

  const handleHideTopRated = () => {
    setShowTopRated(false);
    setGames([]);
    setPage(1);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTopGames(nextPage);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchTopGames(prevPage);
    }
  };

  return (
    <Box p={4}>
      {/* Centering Show/Hide Button */}
      <Center>
        {!showTopRated && (
          <Button onClick={handleShowTopRated} colorScheme="blue">
            Show Top Rated Games
          </Button>
        )}

        {showTopRated && (
          <Button onClick={handleHideTopRated} colorScheme="blue">
            Hide Top Rated Games
          </Button>
        )}
      </Center>

      {/* Games Grid */}
      {showTopRated && (
        <Box mt={4}>
          {loading && (
            <VStack mt={4}>
              <Spinner />
            </VStack>
          )}

          {error && (
            <Text color="red.500" mt={4}>
              {error}
            </Text>
          )}

          {!loading && !error && (
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
              {games.map((game) => (
                <Box key={game.id} textAlign="center">
                  <Image
                    src={game.background_image}
                    alt={game.name}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                    mb={2}
                    borderRadius="md"
                  />
                  <Text fontWeight="bold">{game.name}</Text>
                  <Text>Metascore: {game.metacritic}</Text>

                  {/* Action Buttons */}
                  <HStack spacing={2} mt={2} justifyContent="center">
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => addToWishlist(game)}
                    >
                      To Buy
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => addToPlayedGames(game)}
                    >
                      Played
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      onClick={() => addToPlayingNow(game)}
                    >
                      Playing
                    </Button>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          )}

          {/* Centering Next/Previous Buttons */}
          <Center mt={4}>
            <HStack>
              <Button onClick={handlePreviousPage} isDisabled={page === 1} colorScheme="blue">
                Previous
              </Button>
              <Button onClick={handleNextPage} colorScheme="blue">
                Next
              </Button>
            </HStack>
          </Center>
        </Box>
      )}
    </Box>
  );
};

export default TopTen;
