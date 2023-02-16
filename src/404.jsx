import { MantineProvider } from '@mantine/core';
import { NothingFoundBackground } from './nothing_found.jsx'
import React from 'react';
import ReactDOM from 'react-dom';

const theme = {
    colors: {
        brand: 
        [
          '#fffedc',
          '#fff8af',
          '#fff37e',
          '#ffee4d',
          '#ffe91e',
          '#e6cf08',
          '#b3a100',
          '#807300',
          '#4d4500',
          '#1b1700',
        ]
    },
    primaryColor: 'brand',
    colorScheme: 'dark'
};

function NotFoundPage() {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <NothingFoundBackground />
        </MantineProvider>
    )
}

ReactDOM.render(<NotFoundPage />, document.getElementById('app'));