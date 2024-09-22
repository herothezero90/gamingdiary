import React, { useState } from 'react';
import { Box, Input, Button, Heading, VStack } from '@chakra-ui/react';
import bgImg from '/public/Designer.jpeg'

const Login = ({ setUsername }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (user) {
      setUsername(user);
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundImage={bgImg}
    >
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

export default Login;
