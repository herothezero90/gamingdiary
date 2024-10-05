import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const GameCard = ({ game, addToWishlist }) => {
  const platformsList = game.platforms
    ? game.platforms.map((platform) => platform.platform.name).join(', ')
    : 'Unknown platforms';

  const genresList = game.genres
    ? game.genres.map((genre) => genre.name).join(', ')
    : 'Unknown genres';

  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={0}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${game.background_image || 'https://via.placeholder.com/230'})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={game.background_image || 'https://via.placeholder.com/230'}
            alt={game.name}
          />
        </Box>

        <Stack pt={6} align={'center'}>
          <Heading fontSize={'xl'} fontFamily={'body'} fontWeight={500} noOfLines={1}>
            {game.name}
          </Heading>
        </Stack>

        <Stack align={'center'} mt={4}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Genres: {genresList}
          </Text>
          <Text color={'gray.500'} fontSize={'sm'}>
            Platforms: {platformsList}
          </Text>
          <Text color={'gray.500'} fontSize={'sm'}>
            Metascore: {game.metacritic !== null ? game.metacritic : 'N/A'}
          </Text>
        </Stack>

        <Stack direction={'row'} align={'center'} mt={6}>
          <Button
            bg="black"
            color="white"
            _hover={{ bg: 'gray.700' }}
            onClick={() => addToWishlist(game)}
            width="full"
            rounded="md"
          >
            Add to Wishlist
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

// PropTypes validation
GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    background_image: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    platforms: PropTypes.arrayOf(PropTypes.shape({ platform: PropTypes.shape({ name: PropTypes.string }) })),
    metacritic: PropTypes.number,
  }).isRequired,
  addToWishlist: PropTypes.func.isRequired,
};

export default GameCard;
