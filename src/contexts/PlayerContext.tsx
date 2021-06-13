import { createContext, ReactNode, useState } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    togglePlay: () => void;
    setPlayingState: (playingState: boolean) => void;
    play: (episode: Episode) => void; //function returning void
    playList: (list: Episode[], index: number) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) { //children is being destructured from props
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function setPlayingState(playingState: boolean) {
        setIsPlaying(playingState);
    }

    return (
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            play,
            togglePlay, 
            setPlayingState,
            playList, 
        }}>
            {children}
        </PlayerContext.Provider>
    ); // "{children}" is passing all react elements/components from <PlayerContextProvider>...
}