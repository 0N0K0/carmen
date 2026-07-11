import { Box, Stack, Tabs, Text, Title } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLibraryStats } from '../../hooks/useLibrary';
import { formatDuration, formatLibraryTitle } from './utils';

/** Onglets de navigation de la bibliothèque, dans l'ordre d'affichage. */
const LIBRARY_NAV_ITEMS = [
  { value: 'overview', label: "Vue d'ensemble" },
  { value: 'loved', label: 'Coups de cœur' },
  { value: 'playlists', label: 'Playlists' },
  { value: 'albums', label: 'Albums' },
  { value: 'artists', label: 'Artistes' },
];

/**
 * Layout partagé des pages de bibliothèque : titre "Bibliothèque" et menu de
 * navigation (vue d'ensemble / favoris / playlists / albums / artistes) sous
 * le titre, contenu de la page active rendu via `<Outlet />`.
 * @returns {JSX.Element} Layout de la section bibliothèque.
 */
export function LibraryLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { stats } = useLibraryStats();

  const segment = location.pathname.replace(/^\/library\/?/, '');
  const activeSegment = segment === '' ? 'overview' : segment;

  return (
    <Box p="md">
      <Stack gap="xl">
        <Stack gap="sm">
          <Title order={1}>Bibliothèque</Title>
          {stats && (
            <Text c="dimmed">
              {formatLibraryTitle(stats.tracksTotal, 'titre', '')} |{' '}
              {formatDuration(stats.totalDurationMs)}
            </Text>
          )}
          <Tabs
            value={activeSegment}
            onChange={(v) =>
              v !== null &&
              navigate(v === 'overview' ? '/library' : `/library/${v}`)
            }
          >
            <Tabs.List>
              {LIBRARY_NAV_ITEMS.map((item) => (
                <Tabs.Tab key={item.value} value={item.value}>
                  {item.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Stack>

        <Outlet />
      </Stack>
    </Box>
  );
}
