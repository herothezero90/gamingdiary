import React, { useState, useEffect } from 'react';
import { Box, Image, HStack, VStack, Button, SimpleGrid } from '@chakra-ui/react';

const TopTen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [criterion, setCriterion] = useState('platform'); // Default criterion

  const fetchTopTenGames = async () => {
    setLoading(true);
    setError(false);
    try {
      let url = '/.netlify/functions/fetchGames?page_size=10';

      // Adjust the API call based on the selected criterion
      if (criterion === 'platform') {
        // For demonstration, let's use PC platform (platform ID: 4)
        url += '&platforms=4&ordering=-added';
      } else if (criterion === 'date') {
        // Fetch games released in the last year
        const currentYear = new Date().getFullYear();
        url += `&dates=${currentYear - 1}-01-01,${currentYear}-12-31&ordering=-released`;
      } else if (criterion === 'score') {
        // Fetch top-rated games
        url += '&ordering=-metacritic';
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGames(data.results);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopTenGames();
  }, [criterion]);

  const handleCriterionChange = (newCriterion) => {
    setCriterion(newCriterion);
  };

  if (loading) {
    return <Box>Loading top 10 games...</Box>;
  }

  if (error) {
    return <Box>Error loading top 10 games.</Box>;
  }

  return (
    <Box w="100%" mt={8}>
      <HStack spacing={4} mb={4} justifyContent="center">
        <Button
          onClick={() => handleCriterionChange('platform')}
          variant={criterion === 'platform' ? 'solid' : 'outline'}
        >
          By Platform
        </Button>
        <Button
          onClick={() => handleCriterionChange('date')}
          variant={criterion === 'date' ? 'solid' : 'outline'}
        >
          By Date
        </Button>
        <Button
          onClick={() => handleCriterionChange('score')}
          variant={criterion === 'score' ? 'solid' : 'outline'}
        >
          By Score
        </Button>
      </HStack>
      <SimpleGrid columns={[2, 3, 5]} spacing={4}>
        {games.map((game) => (
          <Box key={game.id}>
            <Image
              src={game.background_image}
              alt={game.name}
              objectFit="cover"
              w="100%"
              h="150px"
              borderRadius="md"
              _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default TopTen;
