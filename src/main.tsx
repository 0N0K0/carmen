import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import { localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { API_BASE_URL } from './config.ts';
import { resolver, theme } from './theme/theme.ts';

const colorSchemeManager = localStorageColorSchemeManager({ key: 'carmen-color-scheme' });

const client = new ApolloClient({
  uri: `${API_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider
        theme={theme}
        cssVariablesResolver={resolver}
        colorSchemeManager={colorSchemeManager}
        classNamesPrefix="onoko"
        defaultColorScheme="auto"
      >
        <Notifications />
        <App />
      </MantineProvider>
    </ApolloProvider>
  </StrictMode>,
);
