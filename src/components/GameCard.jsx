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

// Define size options for the GameCard
const sizeOptions = {
  small: {
    cardWidth: '200px',
    cardHeight: '300px',
    imageHeight: '100px',
    headingFontSize: 'md',
    metaFontSize: '10px',
  },
  medium: {
    cardWidth: '250px',
    cardHeight: '400px',
    imageHeight: '150px',
    headingFontSize: 'lg',
    metaFontSize: 'sm',
  },
  large: {
    cardWidth: '300px',
    cardHeight: '500px',
    imageHeight: '200px',
    headingFontSize: 'xl',
    metaFontSize: 'md',
  },
};

const GameCard = ({ game, addToWishlist, size = 'medium' }) => {
  const platformsList = game.platforms
    ? game.platforms.map((platform) => platform.platform.name).join(', ')
    : 'Unknown platforms';

  const genresList = game.genres
    ? game.genres.map((genre) => genre.name).join(', ')
    : 'Unknown genres';

  const { cardWidth, cardHeight, imageHeight, headingFontSize, metaFontSize } =
    sizeOptions[size];

  return (
    <Center py={4}>
      <Box
        role={'group'}
        p={4}
        maxW={cardWidth}
        w={'full'}
        h={cardHeight}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
        overflow={'hidden'}
      >
        <Box
          rounded={'lg'}
          pos={'relative'}
          height={imageHeight}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 1,
            left: 1,
            bottom: 1,
            right: 1,
            backgroundImage: `url(${game.background_image || 'https://via.placeholder.com/230'})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <Image
            rounded={'lg'}
            height={imageHeight}
            width={'full'}
            objectFit={'cover'}
            src={game.background_image || 'https://via.placeholder.com/230'}
            alt={game.name}
          />
        </Box>

        <Stack pt={4} align={'center'}>
          <Heading
            fontSize={headingFontSize}
            fontFamily={'body'}
            fontWeight={500}
            noOfLines={1}
            color="black"
          >
            {game.name}
          </Heading>
        </Stack>

        <Stack align={'center'} mt={2} spacing={1}>
          <Text color={'gray.500'} fontSize={metaFontSize}>
            Genres: {genresList}
          </Text>
          <Text color={'gray.500'} fontSize={metaFontSize}>
            Platforms: {platformsList}
          </Text>
          <Text color={'gray.500'} fontSize={metaFontSize}>
            Metascore: {game.metacritic !== null ? game.metacritic : 'N/A'}
          </Text>
        </Stack>

        <Button
          bg="black"
          color="white"
          _hover={{ bg: 'gray.700' }}
          onClick={() => addToWishlist(game)}
          mt={4}
          width="full"
          rounded="md"
          size="sm"
        >
          Add to Wishlist
        </Button>
      </Box>
    </Center>
  );
};

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
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default GameCard;
