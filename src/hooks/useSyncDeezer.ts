import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import {
  SYNC_ALBUM,
  SYNC_ARTIST,
  SYNC_PLAYLIST,
  SYNC_USER_LIBRARY,
} from '../graphql/mutations/sync';

/** Type d'élément Deezer concerné par une erreur de synchronisation de bibliothèque. */
export type SyncErrorType = 'playlist' | 'album' | 'artist';

/** Erreur de synchronisation isolée pour un élément de la bibliothèque. */
export interface SyncLibraryError {
  type: SyncErrorType;
  deezerId: string;
  message: string;
}

/** Résultat de la synchronisation complète de la bibliothèque Deezer. */
export interface SyncLibraryResult {
  playlistsSynced: number;
  albumsSynced: number;
  artistsSynced: number;
  errors: SyncLibraryError[];
}

/**
 * Affiche un toast de succès pour une synchronisation Deezer unitaire.
 * @param {string} label Nom de l'élément synchronisé (titre, nom d'artiste...).
 * @returns {void}
 */
function notifySuccess(label: string) {
  notifications.show({
    color: 'success',
    title: 'Synchronisation réussie',
    message: `« ${label} » a été synchronisé(e).`,
    autoClose: 4000,
  });
}

/**
 * Affiche un toast d'erreur persistant pour un échec de synchronisation Deezer.
 * @param {unknown} err Erreur levée par la mutation Apollo.
 * @returns {void}
 */
function notifyError(err: unknown) {
  const message = err instanceof Error ? err.message : 'Erreur inconnue.';
  notifications.show({
    color: 'error',
    title: 'Échec de la synchronisation',
    message,
    autoClose: false,
  });
}

/**
 * Affiche un toast résumant le résultat de la synchronisation complète de la
 * bibliothèque : succès si aucune erreur, avertissement persistant en cas
 * d'échecs partiels, erreur persistante si rien n'a pu être synchronisé.
 * @param {SyncLibraryResult} result Résultat renvoyé par `syncUserLibrary`.
 * @returns {void}
 */
function notifyLibrarySummary(result: SyncLibraryResult) {
  const synced = result.playlistsSynced + result.albumsSynced + result.artistsSynced;
  const total = synced + result.errors.length;

  if (result.errors.length === 0) {
    notifications.show({
      color: 'success',
      title: 'Bibliothèque synchronisée',
      message: `${synced} élément(s) synchronisé(s).`,
      autoClose: 4000,
    });
    return;
  }

  notifications.show({
    color: synced === 0 ? 'error' : 'warning',
    title: 'Synchronisation partielle',
    message: `${synced}/${total} élément(s) synchronisé(s), ${result.errors.length} erreur(s).`,
    autoClose: false,
  });
}

/**
 * Encapsule les mutations Apollo de synchronisation Deezer : `syncUserLibrary`
 * (sync complète en un clic) et `syncPlaylist`/`syncAlbum`/`syncArtist`
 * (resync unitaire, notamment pour rejouer un élément en erreur).
 *
 * Expose un état `loading`/`error` agrégé sur les quatre mutations, et déclenche
 * un toast à l'issue de chaque appel.
 *
 * @returns {{
 *   syncLibrary: (limit?: number) => Promise<SyncLibraryResult | undefined>,
 *   syncPlaylist: (deezerId: string) => Promise<{ id: string; title: string } | undefined>,
 *   syncAlbum: (deezerId: string) => Promise<{ id: string; title: string } | undefined>,
 *   syncArtist: (deezerId: string, limit?: number) => Promise<{ id: string; name: string } | undefined>,
 *   loading: boolean,
 *   error: Error | undefined,
 * }} API de synchronisation Deezer.
 */
export function useSyncDeezer() {
  const [syncUserLibraryMutation, syncUserLibraryState] = useMutation(SYNC_USER_LIBRARY);
  const [syncPlaylistMutation, syncPlaylistState] = useMutation(SYNC_PLAYLIST);
  const [syncAlbumMutation, syncAlbumState] = useMutation(SYNC_ALBUM);
  const [syncArtistMutation, syncArtistState] = useMutation(SYNC_ARTIST);

  /**
   * Synchronise en une fois toutes les playlists, albums et artistes favoris.
   * @param {number} [limit] Nombre maximum d'éléments par catégorie. Optionnel (défaut serveur : 50).
   * @returns {Promise<SyncLibraryResult | undefined>} Résumé de la synchronisation.
   */
  async function syncLibrary(limit?: number) {
    try {
      const { data } = await syncUserLibraryMutation({ variables: { limit } });
      if (data?.syncUserLibrary) notifyLibrarySummary(data.syncUserLibrary);
      return data?.syncUserLibrary;
    } catch (err) {
      notifyError(err);
      throw err;
    }
  }

  /**
   * Synchronise une playlist Deezer par son identifiant.
   * @param {string} deezerId Identifiant Deezer de la playlist.
   * @returns {Promise<{ id: string; title: string } | undefined>} Playlist synchronisée.
   */
  async function syncPlaylist(deezerId: string) {
    try {
      const { data } = await syncPlaylistMutation({ variables: { deezerId } });
      if (data?.syncPlaylist) notifySuccess(data.syncPlaylist.title);
      return data?.syncPlaylist;
    } catch (err) {
      notifyError(err);
      throw err;
    }
  }

  /**
   * Synchronise un album Deezer par son identifiant.
   * @param {string} deezerId Identifiant Deezer de l'album.
   * @returns {Promise<{ id: string; title: string } | undefined>} Album synchronisé.
   */
  async function syncAlbum(deezerId: string) {
    try {
      const { data } = await syncAlbumMutation({ variables: { deezerId } });
      if (data?.syncAlbum) notifySuccess(data.syncAlbum.title);
      return data?.syncAlbum;
    } catch (err) {
      notifyError(err);
      throw err;
    }
  }

  /**
   * Synchronise un artiste Deezer par son identifiant.
   * @param {string} deezerId Identifiant Deezer de l'artiste.
   * @param {number} [limit] Nombre maximum de top tracks à synchroniser. Optionnel.
   * @returns {Promise<{ id: string; name: string } | undefined>} Artiste synchronisé.
   */
  async function syncArtist(deezerId: string, limit?: number) {
    try {
      const { data } = await syncArtistMutation({ variables: { deezerId, limit } });
      if (data?.syncArtist) notifySuccess(data.syncArtist.name);
      return data?.syncArtist;
    } catch (err) {
      notifyError(err);
      throw err;
    }
  }

  return {
    syncLibrary,
    syncPlaylist,
    syncAlbum,
    syncArtist,
    loading:
      syncUserLibraryState.loading ||
      syncPlaylistState.loading ||
      syncAlbumState.loading ||
      syncArtistState.loading,
    error:
      syncUserLibraryState.error ??
      syncPlaylistState.error ??
      syncAlbumState.error ??
      syncArtistState.error,
  };
}
