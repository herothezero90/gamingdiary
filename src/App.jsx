import { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './components/Login';
import MainPage from './components/MainPage';
import theme from '../theme';

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  return (
    <ChakraProvider theme={theme}>
      {username ? (
        <MainPage username={username} setUsername={setUsername} />
      ) : (
        <Login setUsername={setUsername} />
      )}
    </ChakraProvider>
  );
}

export default App;
