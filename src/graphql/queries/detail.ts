import { gql } from '@apollo/client';

/**
 * Récupère une playlist et une page de ses tracks par son identifiant.
 * `Playlist.tracks` est paginé côté serveur (`TrackPage!`, 100 max par
 * appel) — `usePlaylist` enchaîne les pages jusqu'à charger la tracklist complète.
 */
export const GET_PLAYLIST = gql`
  query GetPlaylist($id: ID!, $tracksLimit: Int, $tracksOffset: Int) {
    playlist(id: $id) {
      id
      title
      description
      picture
      duration
      public
      collaborative
      fans
      tracks(limit: $tracksLimit, offset: $tracksOffset) {
        items {
          id
          title
          duration
          isFavorite
          explicitLyrics
          artist {
            id
            name
          }
          album {
            id
            title
            cover
          }
        }
        pagination {
          offset
          limit
          total
        }
      }
    }
  }
`;

/** Récupère un album et ses tracks par son identifiant. */
export const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
      cover
      label
      releaseDate
      nbTracks
      artist {
        id
        name
        picture
      }
      tracks {
        id
        title
        duration
      }
    }
  }
`;

/** Récupère un artiste par son identifiant. */
export const GET_ARTIST = gql`
  query GetArtist($id: ID!) {
    artist(id: $id) {
      id
      name
      picture
      nbAlbum
      nbFan
    }
  }
`;
