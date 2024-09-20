import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './components/Login';
import MainPage from './components/MainPage';

function App() {
  const [username, setUsername] = useState('');

  return (
    <ChakraProvider>
      {username ? (
        <MainPage username={username} />
      ) : (
        <Login setUsername={setUsername} />
      )}
    </ChakraProvider>
  );
}

export default App;
