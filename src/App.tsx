import '@mantine/core/styles.css';

import { AppShell, Center, MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <AppShell>
        <AppShell.Main>
          <Center style={{ height: '100dvh' }}>
            <Router />
          </Center>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
