import { gql } from '@apollo/client';

/** Récupère une playlist et ses tracks par son identifiant. */
export const GET_PLAYLIST = gql`
  query GetPlaylist($id: ID!) {
    playlist(id: $id) {
      id
      title
      description
      picture
      public
      collaborative
      fans
      tracks {
        id
        title
        duration
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
