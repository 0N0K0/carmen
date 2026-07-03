import { gql } from '@apollo/client';

/** Récupère l'URL de stream sécurisée pour une piste. */
export const GET_STREAM_URL = gql`
  mutation GetStreamUrl($trackId: ID!) {
    getStreamUrl(trackId: $trackId)
  }
`;
