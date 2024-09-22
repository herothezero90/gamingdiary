import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  VStack,
  Button,
  HStack,
  SimpleGrid,
  Text,
  Heading,
  Spinner,
  Center
} from '@chakra-ui/react';

const TopTen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false); // Initially not loading
  const [error, setError] = useState(false);

  const [criterion, setCriterion] = useState(null); // Start with no criterion selected

  const fetchTopTenGames = async (selectedCriterion) => {
    setLoading(true);
    setError(false);
    try {
      let collectedGames = [];
      let page = 1;
      const pageSize = 20; // Fetch more games per page to reduce API calls

      while (collectedGames.length < 10) {
        let url = `/.netlify/functions/fetchGames?page_size=${pageSize}&page=${page}`;

        // Adjust the API call based on the selected criterion
        if (selectedCriterion === 'date') {
          // Fetch games released in the last year
          const currentYear = new Date().getFullYear();
          url += `&dates=${currentYear - 1}-01-01,${currentYear}-12-31&ordering=-released`;
        } else if (selectedCriterion === 'score') {
          // Fetch top-rated games
          url += '&ordering=-metacritic';
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter out games without a cover image
        const gamesWithImages = data.results.filter(
          (game) => game.background_image
        );

        // Add filtered games to the collectedGames array
        collectedGames = [...collectedGames, ...gamesWithImages];

        // Check if there are no more games to fetch
        if (!data.next) {
          break; // Exit the loop if there are no more pages
        }

        page += 1; // Move to the next page
      }

      // Limit the collectedGames to the top 10
      setGames(collectedGames.slice(0, 10));
    } catch (error) {
      console.error('Fetch error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCriterionChange = (newCriterion) => {
    setCriterion(newCriterion);
    setGames([]); // Clear previous games
    fetchTopTenGames(newCriterion);
  };

  const handleHideTopTen = () => {
    setCriterion(null); // Hide Top 10 section by resetting the criterion
    setGames([]); // Clear the displayed games
  };

  return (
    <Box w="100%" mt={8}>
      {/* Centered Title */}
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        What to play next?
      </Heading>
      {/* Buttons to select criterion */}
      <HStack spacing={4} mb={4} justifyContent="center">
        <Button
          onClick={() => handleCriterionChange('date')}
          variant={criterion === 'date' ? 'solid' : 'outline'}
        >
          TOP 10 by Date
        </Button>
        <Button
          onClick={() => handleCriterionChange('score')}
          variant={criterion === 'score' ? 'solid' : 'outline'}
        >
          TOP 10 by Score
        </Button>
        {criterion && (
          <Button colorScheme="blue" onClick={handleHideTopTen}>
            Hide Top 10
          </Button>
        )}
      </HStack>
      {/* Display games only if a criterion is selected */}
      {criterion && (
        <>
          {loading ? (
            <Box textAlign="center" mt={4}>
              <Spinner thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='lg'
                mt='20'
              />
              <Text>Loading top 10 games...</Text>
            </Box>
          ) : error ? (
            <Box textAlign="center" mt={4}>
              <Text color="red.500">Error loading top 10 games. Please try again later.</Text>
            </Box>
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 5 }}
              rows={{ base: 1, lg: 5 }}
              spacing={4}
            >
              {games.map((game) => (
                <Box key={game.id}>
                  <VStack spacing={2}>
                    <Image
                      src={game.background_image}
                      alt={game.name}
                      objectFit="cover"
                      w="100%"
                      h="150px"
                      borderRadius="md"
                    />
                    <Text fontSize="md" fontWeight="bold" textAlign="center">
                      {game.name}
                    </Text>
                    {/* Conditionally render the score based on the criterion */}
                    {criterion === 'score' && (
                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        Score: {game.metacritic || 'N/A'}
                      </Text>
                    )}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
          {criterion && (
            <Center mt={4}>
              <Button
                colorScheme="blue"
                onClick={handleHideTopTen}
                display={{ base: 'flex', lg: 'none' }}
              >
                Hide Top 10
              </Button>
            </Center>
          )}
        </>
      )}
    </Box>
  );
};

export default TopTen;
