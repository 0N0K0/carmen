import { gql } from '@apollo/client';

/** Synchronise une playlist Deezer (et ses tracks) dans la base de données. */
export const SYNC_PLAYLIST = gql`
  mutation SyncPlaylist($deezerId: ID!) {
    syncPlaylist(deezerId: $deezerId) {
      id
      title
    }
  }
`;

/** Synchronise un album Deezer (et ses tracks) dans la base de données. */
export const SYNC_ALBUM = gql`
  mutation SyncAlbum($deezerId: ID!) {
    syncAlbum(deezerId: $deezerId) {
      id
      title
    }
  }
`;

/** Synchronise un artiste Deezer (et ses top tracks) dans la base de données. */
export const SYNC_ARTIST = gql`
  mutation SyncArtist($deezerId: ID!, $limit: Int) {
    syncArtist(deezerId: $deezerId, limit: $limit) {
      id
      name
    }
  }
`;

/**
 * Synchronise en une seule fois toutes les playlists, albums et artistes
 * favoris Deezer de l'utilisateur. Chaque élément est synchronisé
 * indépendamment : un échec isolé apparaît dans `errors` sans interrompre les autres.
 */
export const SYNC_USER_LIBRARY = gql`
  mutation SyncUserLibrary($limit: Int) {
    syncUserLibrary(limit: $limit) {
      playlistsSynced
      albumsSynced
      artistsSynced
      errors {
        type
        deezerId
        message
      }
    }
  }
`;
