import React, { useState } from 'react';
import {
  Box,
  Input,
  Heading,
  VStack,
  Spinner,
  Text,
  HStack,
  Button
} from '@chakra-ui/react';
import GameList from './GameList';
import TopTen from './TopTen';

const MainPage = ({ username, setUsername }) => {
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

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={4}>
        <Heading>Welcome, {username}!</Heading>
        <Button onClick={handleLogout}>Logout</Button>
      </HStack>
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
        <TopTen />
      </VStack>
    </Box>
  );
};

export default MainPage;
