import { useState, useEffect } from 'react';
import { Box, Input, Button, Heading, VStack, useDisclosure } from '@chakra-ui/react';
import bgImg from '/public/Designer2.png'
import InfoModal from './InfoModal';
import PropTypes from 'prop-types';

const Login = ({ setUsername }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogin = () => {
    if (user) {
      setUsername(user);
    }
  };

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundImage={`url(${bgImg})`}
      backgroundSize="contain"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundColor="black"
    >
      <InfoModal isOpen={isOpen} onClose={onClose} />
      <VStack spacing={4}>
        <Heading>Login</Heading>
        <Input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
      </VStack>
    </Box>
  );
};

Login.propTypes = {
  setUsername: PropTypes.func.isRequired,
};

export default Login;
