import React, { useState } from 'react';
import {
  Box,
  Input,
  Heading,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import GameList from './GameList';

const MainPage = ({ username }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/.netlify/functions/fetchGames?query=${encodeURIComponent(
            searchQuery
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred while fetching games.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4} textAlign="center">
        Welcome, {username}!
      </Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Search for a game"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          width="100%"
          maxWidth="500px"
        />
        {loading && <Spinner />}
        {error && <Text color="red.500">{error}</Text>}
        <GameList games={games} />
      </VStack>
    </Box>
  );
};

export default MainPage;