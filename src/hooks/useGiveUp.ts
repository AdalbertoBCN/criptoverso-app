import { useLocalStorage } from "usehooks-ts";

export default function useGiveUp(isGospel: boolean) {
    const [giveUp, setGiveUp] = useLocalStorage(isGospel ? "giveUpGospel" : "giveUp", "false");

    const handleGiveUp = () => {
        setGiveUp("true");
    };

    const removeGiveUp = async () => {
        setGiveUp("false");
    };

    return {
        giveUp: giveUp === "true",
        handleGiveUp,
        removeGiveUp,
    };
}