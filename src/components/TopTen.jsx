import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Image, Button, Spinner, Text, VStack, HStack } from '@chakra-ui/react';

const TopTen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showTopRated, setShowTopRated] = useState(false);
  const [page, setPage] = useState(1);
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
      const gamesWithImages = data.results.filter((game) => game.background_image);

      if (gamesWithImages.length < 10 && data.next) {
        const nextPageNumber = pageNumber + 1;
        const nextPageGames = await fetchNextPage(nextPageNumber, gamesWithImages.length);
        setGames(nextPageGames);
      } else {
        setGames(gamesWithImages);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching the top games.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPage = async (pageNumber, currentGameCount) => {
    try {
      const response = await fetch(
        `/.netlify/functions/fetchGames?page_size=10&ordering=-metacritic&page=${pageNumber}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const gamesWithImages = data.results.filter((game) => game.background_image);

      const combinedGames = [...games, ...gamesWithImages];

      if (combinedGames.length >= 10 || !data.next) {
        return combinedGames.slice(0, 10);
      } else {
        return await fetchNextPage(pageNumber + 1, combinedGames.length);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching the top games.');
      return games;
    }
  };

  const handleShowTopRated = () => {
    setShowTopRated(true);
    setPage(1);
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
      {!showTopRated && (
        <Button onClick={handleShowTopRated} colorScheme="blue">
          Show Top Rated Games
        </Button>
      )}

      {showTopRated && (
        <Box>
          <HStack justifyContent="space-between" mt={4} mb={4} flexWrap="wrap">
            <Button onClick={handleHideTopRated} colorScheme="blue" mb={[2, 0]}>
              Hide Top Rated Games
            </Button>
            <HStack>
              <Button onClick={handlePreviousPage} isDisabled={page === 1} colorScheme="blue">
                Previous
              </Button>
              <Button onClick={handleNextPage} colorScheme="blue">
                Next
              </Button>
            </HStack>
          </HStack>

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
            <SimpleGrid columns={{ base: 2, lg: 5 }} spacing={4}>
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
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TopTen;
