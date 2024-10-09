import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Spinner,
  List,
  ListItem,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

const SearchBar = ({ setGames, setError }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

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

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `/.netlify/functions/fetchGames?search=${encodeURIComponent(query)}&page_size=5`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching suggestions.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

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

  const handleSuggestionClick = (game) => {
    setSearchQuery('');
    setSuggestions([]);
    setGames([game]);
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
        handleSuggestionClick(suggestions[highlightedIndex]);
      } else {
        executeSearch();
      }
    }
  };

  const executeSearch = async () => {
    if (searchQuery.trim() === '') return;

    setLoadingSuggestions(true);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `/.netlify/functions/fetchGames?search=${encodeURIComponent(searchQuery)}&page_size=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGames(data.results); // Update games in the MainPage
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching games.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
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

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          width="100%"
          bg="white"
          boxShadow="md"
          borderRadius="md"
          mt={2}
          zIndex={10}
          color={"black"}
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
  );
};

SearchBar.propTypes = {
  setGames: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default SearchBar;
