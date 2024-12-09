import { useState } from 'react';
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

const TopTen = ({ addToWishlist, removeFromWishlist, wishlist }) => {
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
      const top4Games = gamesWithImages.slice(0, 4);

      setGames(top4Games);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching the top games.');
    } finally {
      setLoading(false);
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

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={{ base: 1, md: 4 }} >
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
            <>
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
            </>
          )}

          {showTopRated && !loading && !error && (
            <Center mt={4}>
              <HStack>
                <Button
                  onClick={handlePreviousPage}
                  isDisabled={page === 1}
                  colorScheme="blue"
                >
                  Previous
                </Button>
                <Button onClick={handleNextPage} colorScheme="blue">
                  Next
                </Button>
              </HStack>
            </Center>
          )}
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
