'use client'

import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Center,
  Spinner,
  Button,
  Text,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import GameCard from './GameCard';
import InfiniteScroll from 'react-infinite-scroll-component'; // Import the InfiniteScroll component

const TopTen = ({ addToWishlist, removeFromWishlist, wishlist }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTopRated, setShowTopRated] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if more games are available

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

      // Assuming the API returns a 'results' array and a 'next' URL for pagination
      const gamesWithImages = data.results.filter((game) => game.background_image);
      const newGames = gamesWithImages.slice(0, 4); // Adjust as needed

      setGames((prevGames) => [...prevGames, ...newGames]);

      // Determine if more games are available
      if (!data.next || newGames.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching the top games.');
      setHasMore(false); // Stop further fetch attempts on error
    } finally {
      setLoading(false);
    }
  };

  const handleShowTopRated = () => {
    setShowTopRated(true);
    setPage(1);
    setGames([]); // Clear existing games if any
    setHasMore(true); // Reset hasMore flag
    fetchTopGames(1);
  };

  const handleHideTopRated = () => {
    setShowTopRated(false);
    setGames([]);
    setPage(1);
    setHasMore(true); // Reset for future showTopRated actions
  };

  const fetchMoreGames = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTopGames(nextPage);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={{ base: 1, md: 4 }}>
      <Center p='2'>
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

      {showTopRated && (
        <Box mt={4}>
          {error && (
            <Text color="red.500" mt={4}>
              {error}
            </Text>
          )}

          {/* InfiniteScroll Component */}
          <InfiniteScroll
            dataLength={games.length} // This is important field to render the next data
            next={fetchMoreGames} // Function to fetch more data
            hasMore={hasMore} // Boolean indicating if there's more data to load
            loader={
              loading && (
                <VStack mt={4}>
                  <Spinner />
                </VStack>
              )
            }
            endMessage={
              !loading && !error && (
                <Text textAlign="center" mt={4}>
                  You have seen all top-rated games!
                </Text>
              )
            }
            style={{ overflow: 'visible' }} // To allow Chakra UI components to render properly
          >
            {isMobile ? (
              <Flex overflowX="auto" pb={4}>
                <HStack spacing={4}>
                  {games.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      addToWishlist={addToWishlist}
                      removeFromWishlist={removeFromWishlist}
                      isInWishlist={wishlist.some((g) => g.id === game.id)}
                      size="small" // Smaller size on mobile
                    />
                  ))}
                </HStack>
              </Flex>
            ) : (
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 4 }}
                spacing={4}
                px={{ base: 2, md: 20 }}
              >
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    addToWishlist={addToWishlist}
                    removeFromWishlist={removeFromWishlist}
                    isInWishlist={wishlist.some((g) => g.id === game.id)}
                    size="medium" // Default size on larger screens
                  />
                ))}
              </SimpleGrid>
            )}
          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
};

TopTen.propTypes = {
  addToWishlist: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired,
};

export default TopTen;
