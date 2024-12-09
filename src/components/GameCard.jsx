'use client'

import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { BsHeartFill, BsHeart } from 'react-icons/bs'
import PropTypes from 'prop-types'

const GameCard = ({ game, addToWishlist, removeFromWishlist, isInWishlist = false }) => {
  const platformsList = game.platforms
    ? game.platforms.map((p) => p.platform.name).join(', ')
    : 'Unknown platforms'

  const genresList = game.genres
    ? game.genres.map((genre) => genre.name).join(', ')
    : 'Unknown genres'


  const bgColor = useColorModeValue('#ECC94B', '#ECC94B')
  const borderColor = useColorModeValue('black', 'black')
  const textColor = useColorModeValue('gray.700', 'gray.700')
  const headingColor = useColorModeValue('black', 'black')
  const tagBgColor = useColorModeValue('#E5E5E5', '#E5E5E5')
  const tagTextColor = useColorModeValue('black', 'black')
  const boxShadowValue = useColorModeValue('6px 6px 0 black', '6px 6px 0 #E5E5E5')

  const handleHeartClick = () => {
    if (isInWishlist) {
      removeFromWishlist(game.id)
    } else {
      addToWishlist(game)
    }
  }

  return (
    <Center py={{ base: 2, md: 4 }}>
      <Box
        w={['200px', 'xs']}
        h={['50vh', '400px']}
        rounded="xl"
        my={5}
        mx={[0, 5]}
        overflow="hidden"
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        boxShadow={boxShadowValue}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        transition="width 0.3s ease, height 0.3s ease"
      >
        <Box h={['160px', '200px']} borderBottom="1px" borderColor={borderColor}>
          <Img
            src={game.background_image || 'https://via.placeholder.com/230'}
            roundedTop="sm"
            objectFit="cover"
            h="full"
            w="full"
            alt={game.name}
          />
        </Box>

        <Box p={4} flex="1" display="flex" flexDirection="column" justifyContent="flex-start">
          <Box
            bg={tagBgColor}
            color={tagTextColor}
            display="inline-block"
            px={2}
            py={1}
            mb={2}
            ml={-1}
            rounded="xl"
            width="fit-content"
          >
            <Text fontSize={{ base: 'xs', md: 'xs', xl: 'md' }} fontWeight="medium" noOfLines={1}>
              {genresList}
            </Text>
          </Box>

          <Heading
            color={headingColor}
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            noOfLines={2}
          >
            {game.name}
          </Heading>

          <Text
            color={textColor}
            fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
            noOfLines={2}
            mt={2}
          >
            {platformsList}
          </Text>
        </Box>

        <HStack borderTop="1px" borderColor={borderColor} color={headingColor}>
          <Flex
            p={4}
            alignItems="center"
            justifyContent="space-between"
            roundedBottom="sm"
            w="full"
          >
            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="semibold">
              Metascore: {game.metacritic !== null ? game.metacritic : 'N/A'}
            </Text>
          </Flex>

          <Flex
            p={4}
            alignItems="center"
            justifyContent="space-between"
            roundedBottom="sm"
            borderLeft="1px"
            borderColor={borderColor}
            cursor="pointer"
            onClick={handleHeartClick}
          >
            {isInWishlist ? (
              <BsHeartFill fill="red" fontSize={'20px'} />
            ) : (
              <BsHeart fontSize={'20px'} />
            )}
          </Flex>
        </HStack>
      </Box>
    </Center>
  )
}

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    background_image: PropTypes.string,
    genres: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string })
    ),
    platforms: PropTypes.arrayOf(
      PropTypes.shape({ platform: PropTypes.shape({ name: PropTypes.string }) })
    ),
    metacritic: PropTypes.number,
  }).isRequired,
  addToWishlist: PropTypes.func,
  removeFromWishlist: PropTypes.func,
  isInWishlist: PropTypes.bool,
}

export default GameCard
