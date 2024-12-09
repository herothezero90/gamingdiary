// theme.js
import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light', 
    useSystemColorMode: false,  
  },
  fonts: {
    body: 'Kanit, sans-serif',     
    heading: 'Lalezar, system-ui',  
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('#E5E5E5', '#121212')(props), 
        color: mode('black', 'white')(props),
        fontFamily: 'Kanit, sans-serif',
        transition: 'background-color 0.5s ease, color 0.5s ease', 
      },
    }),
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'Lalezar, system-ui', 
      },
      sizes: {
        xl: {
          fontSize: ['2xl', '3xl', '4xl'],
        },
        lg: {
          fontSize: ['xl', '2xl', '3xl'],
        },
        md: {
          fontSize: ['lg', 'xl', '2xl'],
        },
        sm: {
          fontSize: ['md', 'lg', 'xl'],
        },
      },
    },
  },
});

export default theme;
