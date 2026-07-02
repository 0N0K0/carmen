import { SegmentedControl } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

/**
 * Toggle segmenté permettant à l'utilisateur de choisir le schéma de couleurs.
 * La préférence est persistée via le colorSchemeManager configuré dans main.tsx.
 * @returns {JSX.Element} Un SegmentedControl avec les options light, auto (system) et dark.
 */
export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={(value) => setColorScheme(value as 'light' | 'auto' | 'dark')}
      data={[
        { label: 'Light', value: 'light' },
        { label: 'System', value: 'auto' },
        { label: 'Dark', value: 'dark' },
      ]}
    />
  );
}
