import { AppShell } from '@mantine/core';
import { Player } from '../player/Player';

/**
 * Pied de page fixe contenant le lecteur audio persistant.
 * @returns Footer de l'AppShell.
 */
export function Footer() {
  return (
    <AppShell.Footer>
      <Player />
    </AppShell.Footer>
  );
}
