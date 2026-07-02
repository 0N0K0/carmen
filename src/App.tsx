import { Stack, Text } from '@mantine/core';
import { ColorSchemeToggle } from './components/ui/ColorSchemeToggle';

export default function App() {
  return (
    <Stack p="md">
      <Text>Carmen</Text>
      <ColorSchemeToggle />
    </Stack>
  );
}
