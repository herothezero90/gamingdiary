import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Text,
  Spinner,
} from '@chakra-ui/react';
import GameList from './GameList';
import TopTen from './TopTen';
import Wishlist from './Wishlist';
import SearchBar from './SearchBar';
import PropTypes from 'prop-types';

const MainPage = ({ username, setUsername }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (game) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.find((g) => g.id === game.id)) {
        return [...prevWishlist, game];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (gameId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((game) => game.id !== gameId));
  };

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <Box p={4} maxW="100vw" overflowX="hidden" bg="white" color="white" minH="100vh">
      <VStack spacing={4} align="stretch">
        <HStack justifyContent="space-between" flexWrap="wrap" w="100%">
          <Heading size={{ base: 'md', md: 'lg' }} isTruncated>
            Welcome, {username}!
          </Heading>
          <Button onClick={handleLogout} mt={[2, 0]}>
            Logout
          </Button>
        </HStack>
        <SearchBar setGames={setGames} setError={setError} />
        {loading && <Spinner />}
        {error && <Text color="red.500">{error}</Text>}
        <GameList games={games} addToWishlist={addToWishlist} />
        <TopTen addToWishlist={addToWishlist} />
        <Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} />
      </VStack>
    </Box>
  );
};

MainPage.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
};

export default MainPage;
