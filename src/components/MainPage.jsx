import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Text,
  Spinner,
  Switch,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import GameList from './GameList';
import TopTen from './TopTen';
import Wishlist from './Wishlist';
import SearchBar from './SearchBar';
import PropTypes from 'prop-types';

const MainPage = ({ username, setUsername }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [games, setGames] = useState([]);
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const toast = useToast();
  const pendingToast = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('myWishlist');
      console.log('On mount, loaded raw wishlist from localStorage:', savedWishlist);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('Parsed wishlist from localStorage:', parsedWishlist);
          if (Array.isArray(parsedWishlist)) {
            setWishlist(parsedWishlist);
            console.log('Wishlist successfully set from localStorage:', parsedWishlist);
          } else {
            console.log('Parsed wishlist is not an array, ignoring.');
          }
        } catch (err) {
          console.error('Error parsing wishlist from localStorage:', err);
        }
      } else {
        console.log('No saved wishlist found in localStorage.');
      }
      setWishlistLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (wishlistLoaded) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('myWishlist', JSON.stringify(wishlist));
        console.log('Wishlist saved to localStorage:', wishlist);
      }

      if (pendingToast.current) {
        const { id, title, status, duration } = pendingToast.current;
        if (!toast.isActive(id)) {
          console.log(`Showing pending toast: ${title}`);
          toast({
            id,
            title,
            status,
            duration,
            isClosable: true,
            position: 'top',
          });
        }
        pendingToast.current = null;
      }
    }
  }, [wishlist, toast, wishlistLoaded]);

  const addToWishlist = (game) => {
    console.log(`Attempting to add "${game.name}" to wishlist.`);
    setWishlist((prevWishlist) => {
      const alreadyInWishlist = prevWishlist.some((g) => g.id === game.id);
      if (!alreadyInWishlist) {
        const updatedWishlist = [...prevWishlist, game];
        const toastId = `add-${game.id}`;
        pendingToast.current = {
          id: toastId,
          title: `${game.name} added to Wishlist.`,
          status: 'success',
          duration: 2000,
        };
        return updatedWishlist;
      } else {
        console.log(`"${game.name}" is already in the wishlist, no update.`);
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (gameId) => {
    console.log(`Attempting to remove game with ID ${gameId} from wishlist.`);
    setWishlist((prevWishlist) => {
      const gameToRemove = prevWishlist.find((g) => g.id === gameId);
      if (gameToRemove) {
        const updatedWishlist = prevWishlist.filter((game) => game.id !== gameId);
        const toastId = `remove-${gameToRemove.id}`;
        pendingToast.current = {
          id: toastId,
          title: `${gameToRemove.name} removed from Wishlist.`,
          status: 'info',
          duration: 3000,
        };
        return updatedWishlist;
      } else {
        console.log(`Game with ID ${gameId} not found in wishlist, no update.`);
      }
      return prevWishlist;
    });
  };

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <Box p={4} maxW="100vw" overflowX="hidden" minH="100vh">
      <VStack spacing={4} align="stretch">
        <HStack justifyContent="space-between" flexWrap="wrap" w="100%">
          <Heading size={{ base: 'md', md: 'lg' }} isTruncated>
            Welcome, {username}!
          </Heading>
          <Button onClick={handleLogout} mt={[2, 0]}>
            Logout
          </Button>
          <HStack>
            <Text>{colorMode === 'light' ? 'Light Mode' : 'Dark Mode'}</Text>
            <Switch
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </HStack>
        </HStack>
        <SearchBar setGames={setGames} setError={setError} />
        {loading && <Spinner />}
        {error && <Text color="red.500">{error}</Text>}
        <GameList
          games={games}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
          wishlist={wishlist}
        />
        <TopTen
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
          wishlist={wishlist}
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
