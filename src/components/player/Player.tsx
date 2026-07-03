import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ActionIcon, Box, Flex, Image, Slider, Text, Tooltip } from '@mantine/core';
import {
  EqualizerIcon,
  HeartIcon,
  MicrophoneStageIcon,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  QueueIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerNoneIcon,
} from '@phosphor-icons/react';
import { GET_STREAM_URL } from '../../graphql/mutations/track';
import { usePlayerStore } from '../../store/player';

/**
 * Formate un nombre de secondes en chaîne lisible (m:ss ou h:mm:ss).
 * @param {number} seconds Durée en secondes.
 * @returns {string} Durée formatée.
 */
function formatTime(seconds: number): string {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/**
 * Lecteur audio persistant.
 *
 * Gère un élément `<audio>` natif, synchronisé avec le store Zustand.
 * Résout l'URL de stream via la mutation `getStreamUrl` à chaque changement de piste.
 * En cas d'échec, se rabat sur l'URL de preview.
 *
 * @returns {JSX.Element} Interface complète du player (sans AppShell.Footer).
 */
export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const prevVolumeRef = useRef(1);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const pause = usePlayerStore((s) => s.pause);
  const resume = usePlayerStore((s) => s.resume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const [getStreamUrl] = useMutation<{ getStreamUrl: string }>(GET_STREAM_URL);

  // Keep isPlayingRef in sync for use inside effects without re-triggering them.
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // On track change: resolve stream URL, load audio, play if needed.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let cancelled = false;

    const startAudio = (url: string) => {
      if (cancelled) return;
      audio.src = url;
      audio.load();
      if (isPlayingRef.current) {
        audio.play().catch(() => {});
      }
    };

    getStreamUrl({ variables: { trackId: currentTrack.id } })
      .then(({ data }) => startAudio(data?.getStreamUrl ?? currentTrack.audioUrl))
      .catch(() => startAudio(currentTrack.audioUrl));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Sync play/pause state with the audio element.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume with the audio element.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /**
   * Effectue un seek sur l'élément audio et met à jour le store.
   * @param {number} time Position en secondes.
   */
  const handleSeek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
      setCurrentTime(time);
    },
    [setCurrentTime],
  );

  /**
   * Revient au début si > 3 s écoulées, sinon piste précédente.
   */
  const handlePrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      previous();
    }
  }, [previous, setCurrentTime]);

  /**
   * Bascule entre muet et volume précédent.
   */
  const handleVolumeToggle = useCallback(() => {
    if (volume > 0) {
      prevVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(prevVolumeRef.current);
    }
  }, [volume, setVolume]);

  const VolumeIcon =
    volume === 0 ? SpeakerNoneIcon : volume < 0.5 ? SpeakerLowIcon : SpeakerHighIcon;

  const displayTime = isSeeking ? seekValue : currentTime;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (!isSeeking && audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={next}
      />

      <Flex h="100%" align="center" justify="space-between" px="md" gap="md">
        {/* Zone gauche : piste en cours */}
        <Flex align="center" gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Box
            w={48}
            h={48}
            style={{
              borderRadius: 4,
              flexShrink: 0,
              overflow: 'hidden',
              background: 'var(--onoko-color-default-border)',
            }}
          >
            {currentTrack?.artworkUrl && (
              <Image src={currentTrack.artworkUrl} w={48} h={48} fit="cover" alt="" />
            )}
          </Box>
          <Box style={{ minWidth: 0 }}>
            <Text size="sm" fw={500} truncate>
              {currentTrack?.title ?? 'Titre de la piste'}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {currentTrack?.artist ?? 'Artiste'}
            </Text>
          </Box>
          <Tooltip label="J'aime" position="top">
            <ActionIcon variant="subtle" aria-label="J'aime" disabled={!currentTrack}>
              <HeartIcon weight="regular" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Ajouter à une playlist" position="top">
            <ActionIcon
              variant="subtle"
              aria-label="Ajouter à une playlist"
              disabled={!currentTrack}
            >
              <PlusCircleIcon weight="regular" />
            </ActionIcon>
          </Tooltip>
        </Flex>

        {/* Zone centrale : contrôles + progression */}
        <Flex direction="column" align="center" gap={4} style={{ flex: 2 }}>
          <Flex align="center" gap="xs">
            <Tooltip label="Lecture aléatoire" position="top">
              <ActionIcon variant="subtle" aria-label="Lecture aléatoire">
                <ShuffleIcon weight="regular" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Précédent" position="top">
              <ActionIcon
                variant="subtle"
                aria-label="Précédent"
                onClick={handlePrevious}
                disabled={!currentTrack}
              >
                <SkipBackIcon weight="fill" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={isPlaying ? 'Pause' : 'Lecture'} position="top">
              <ActionIcon
                variant="filled"
                radius="xl"
                size="lg"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
                onClick={isPlaying ? pause : resume}
                disabled={!currentTrack}
              >
                {isPlaying ? <PauseIcon weight="fill" /> : <PlayIcon weight="fill" />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Suivant" position="top">
              <ActionIcon
                variant="subtle"
                aria-label="Suivant"
                onClick={next}
                disabled={!currentTrack}
              >
                <SkipForwardIcon weight="fill" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Répétition" position="top">
              <ActionIcon variant="subtle" aria-label="Répétition">
                <RepeatIcon weight="regular" />
              </ActionIcon>
            </Tooltip>
          </Flex>

          <Flex align="center" gap="xs" w="100%" style={{ maxWidth: '28rem' }}>
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
              {formatTime(displayTime)}
            </Text>
            <Slider
              style={{ flex: 1 }}
              value={displayTime}
              max={duration || 1}
              min={0}
              step={0.1}
              size="xs"
              label={(v) => formatTime(v)}
              onChange={(v) => {
                setIsSeeking(true);
                setSeekValue(v);
              }}
              onChangeEnd={(v) => {
                setIsSeeking(false);
                handleSeek(v);
              }}
              disabled={!currentTrack || !duration}
            />
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
              {formatTime(duration)}
            </Text>
          </Flex>
        </Flex>

        {/* Zone droite : outils */}
        <Flex align="center" gap="xs" justify="flex-end" style={{ flex: 1 }}>
          <Tooltip label="Paroles" position="top">
            <ActionIcon variant="subtle" aria-label="Paroles">
              <MicrophoneStageIcon weight="regular" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="File d'attente" position="top">
            <ActionIcon variant="subtle" aria-label="File d'attente">
              <QueueIcon weight="regular" />
            </ActionIcon>
          </Tooltip>
          <Flex align="center" gap={4}>
            <Tooltip label="Volume" position="top">
              <ActionIcon
                variant="subtle"
                aria-label={volume > 0 ? 'Couper le son' : 'Rétablir le son'}
                onClick={handleVolumeToggle}
              >
                <VolumeIcon weight="regular" />
              </ActionIcon>
            </Tooltip>
            <Slider
              w={80}
              value={volume * 100}
              min={0}
              max={100}
              step={1}
              size="xs"
              thumbSize={12}
              label={(v) => `${v}%`}
              onChange={(v) => setVolume(v / 100)}
            />
          </Flex>
          <Tooltip label="Égaliseur" position="top">
            <ActionIcon variant="subtle" aria-label="Égaliseur">
              <EqualizerIcon weight="regular" />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}
