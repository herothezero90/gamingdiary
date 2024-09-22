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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [criterion, setCriterion] = useState(null);

  const fetchTopTenGames = async (selectedCriterion) => {
    setLoading(true);
    setError(false);
    try {
      let collectedGames = [];
      let page = 1;
      const pageSize = 20;

      while (collectedGames.length < 10) {
        let url = `/.netlify/functions/fetchGames?page_size=${pageSize}&page=${page}`;

        if (selectedCriterion === 'date') {
          const currentYear = new Date().getFullYear();
          url += `&dates=${currentYear - 1}-01-01,${currentYear}-12-31&ordering=-released`;
        } else if (selectedCriterion === 'score') {
          url += '&ordering=-metacritic';
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const gamesWithImages = data.results.filter(
          (game) => game.background_image
        );

        collectedGames = [...collectedGames, ...gamesWithImages];

        if (!data.next) {
          break;
        }

        page += 1;
      }

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
    setGames([]);
    fetchTopTenGames(newCriterion);
  };

  const handleHideTopTen = () => {
    setCriterion(null);
    setGames([]);
  };

  return (
    <Box w="100%" mt={8}>
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        What to play next?
      </Heading>
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
