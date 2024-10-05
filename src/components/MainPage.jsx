import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  Spinner,
  Text,
  HStack,
  Heading,
  List,
  ListItem,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import GameList from './GameList';
import TopTen from './TopTen';
import Wishlist from './Wishlist';
import PropTypes from 'prop-types';


const MainPage = ({ username, setUsername }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 1) {
      setLoadingSuggestions(true);
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `/.netlify/functions/fetchGames?search=${encodeURIComponent(query)}&page_size=5`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched suggestions:', data.results);
      setSuggestions(data.results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  const handleSuggestionClick = (game) => {
    setSearchQuery('');
    setSuggestions([]);
    setGames([game]);
  };

  const fetchGameById = async (gameId) => {
    console.log('Fetching game by ID:', gameId);
    setLoading(true);
    setError(null);
    setGames([]);

    try {
      const response = await fetch(`/.netlify/functions/fetchGameById?id=${gameId}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGames([data]);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching the game.');
    } finally {
      setLoading(false);
    }
  };

  const executeSearch = async () => {
    if (searchQuery.trim() === '') return;

    setLoading(true);
    setError(null);
    setGames([]);
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `/.netlify/functions/fetchGames?search=${encodeURIComponent(searchQuery)}&page_size=10`
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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        prevIndex + 1 < suggestions.length ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSuggestionClick(suggestions[highlightedIndex].id);
      } else {
        executeSearch();
      }
    }
  };

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <Box
      p={4}
      maxW="100vw"
      overflowX="hidden"
      bg="#E6DEE8"
      color="white"
      minH="100vh"
    >
      <VStack spacing={4} align="stretch">
        <HStack justifyContent="space-between" flexWrap="wrap" w="100%">
          <Heading size={{ base: 'md', md: 'lg' }} isTruncated>
            Welcome, {username}!
          </Heading>
          <Button onClick={handleLogout} mt={[2, 0]}>
            Logout
          </Button>
        </HStack>
        <Box position="relative" width="100%" maxWidth="500px" mx="auto" ref={wrapperRef}>
          <InputGroup>
            <Input
              placeholder="Search for a game"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <InputRightElement width="4.5rem">
              {loadingSuggestions ? (
                <Spinner size="sm" />
              ) : (
                <Button h="1.75rem" size="sm" onClick={executeSearch}>
                  Search
                </Button>
              )}
            </InputRightElement>
          </InputGroup>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Box
              position="absolute"
              width="100%"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              mt={2}
              zIndex={10}
            >
              <List spacing={0}>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={suggestion.id}
                    px={4}
                    py={2}
                    cursor="pointer"
                    backgroundColor={highlightedIndex === index ? 'gray.200' : 'white'}
                    _hover={{ backgroundColor: 'gray.100' }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
        {loading && <Spinner />}
        {error && <Text color="red.500">{error}</Text>}
        <GameList
          games={games}
          addToWishlist={addToWishlist}
        />
        <TopTen
          addToWishlist={addToWishlist}
        />
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
