import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';

interface VideoPlayerProps {
    uri: string;
    shouldPlay: boolean;
}

export default function VideoPlayer({ uri, shouldPlay }: VideoPlayerProps) {
    const player = useVideoPlayer(uri, (player) => {
        player.loop = false;
        player.muted = false;
    });

    useEffect(() => {
        if (shouldPlay) {
            player.play();
        } else {
            player.pause();
        }
    }, [shouldPlay, player]);

    return (
        <VideoView
            style={{
                width: '100%',
                height: '100%',
            }}
            player={player}
            allowsPictureInPicture
            fullscreenOptions={{
                enable: true,
                orientation: 'landscape',
            }}
        />
    );
}
