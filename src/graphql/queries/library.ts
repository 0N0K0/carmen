import { gql } from '@apollo/client';

/** Récupère les playlists synchronisées en base, paginées. */
export const GET_PLAYLISTS = gql`
  query GetPlaylists($limit: Int, $offset: Int) {
    playlists(limit: $limit, offset: $offset) {
      items {
        id
        title
        picture
        public
      }
      pagination {
        offset
        limit
        total
      }
    }
  }
`;

/** Récupère les albums favoris synchronisés en base, paginés. */
export const GET_ALBUMS = gql`
  query GetAlbums($limit: Int, $offset: Int) {
    albums(limit: $limit, offset: $offset, favoritesOnly: true) {
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

/** Récupère les artistes favoris synchronisés en base, paginés. */
export const GET_ARTISTS = gql`
  query GetArtists($limit: Int, $offset: Int) {
    artists(limit: $limit, offset: $offset, favoritesOnly: true) {
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
