import { gql } from '@apollo/client';

/**
 * Récupère les totaux réels de la bibliothèque Deezer directement depuis
 * l'API (favoris tracks/albums/artistes, nombre de playlists) — indépendant
 * de ce qui est effectivement synchronisé en base (ex. une playlist tronquée
 * lors de la sync n'affecte pas ce total).
 */
export const GET_LIBRARY_STATS = gql`
  query GetLibraryStats {
    libraryStats {
      tracksTotal
      favoriteTracksTotal
      playlistsTotal
      favoriteArtistsTotal
      favoriteAlbumsTotal
      totalDurationMs
    }
  }
`;

/** Récupère les playlists synchronisées en base, paginées et triées par titre. */
export const GET_PLAYLISTS = gql`
  query GetPlaylists($limit: Int, $offset: Int, $orderBy: SortOrder) {
    playlists(limit: $limit, offset: $offset, orderBy: $orderBy) {
      items {
        id
        title
        picture
        public
        isLovedTrack
      }
      pagination {
        offset
        limit
        total
      }
    }
  }
`;

/** Récupère les albums favoris synchronisés en base, paginés et triés par titre. */
export const GET_ALBUMS = gql`
  query GetAlbums($limit: Int, $offset: Int, $orderBy: SortOrder) {
    albums(limit: $limit, offset: $offset, favoritesOnly: true, orderBy: $orderBy) {
      items {
        id
        title
        cover
        artist {
          id
          name
        }
      }
      pagination {
        offset
        limit
        total
      }
    }
  }
`;

/** Récupère les artistes favoris synchronisés en base, paginés et triés par nom. */
export const GET_ARTISTS = gql`
  query GetArtists($limit: Int, $offset: Int, $orderBy: SortOrder) {
    artists(limit: $limit, offset: $offset, favoritesOnly: true, orderBy: $orderBy) {
      items {
        id
        name
        picture
        nbAlbum
      }
      pagination {
        offset
        limit
        total
      }
    }
  }
`;
