import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import Spinner from "./spinner"; // Importe o spinner aqui

interface SubmitInputProps {
  handleFormSubmit: (formData: FormData) => Promise<void>;
  inputWord: string;
  setInputWord: Dispatch<SetStateAction<string>>;
  win?: boolean;
  giveUp: boolean;
  isPending: boolean;  // Receba o estado isPending
  setIsPending: Dispatch<SetStateAction<boolean>>;
}

export default function SubmitInput({
  handleFormSubmit,
  setInputWord,
  inputWord,
  win,
  giveUp,
  isPending,  // Adicione o estado isPending aqui
  setIsPending,
}: SubmitInputProps) {
  return (
    <>
      {!win && !giveUp && (
        <>
          
            <form
              className="flex gap-2 justify-self-end"
              onSubmit={(e) => {
                e.preventDefault();
                if(inputWord.trim() === "") return;
                const formData = new FormData(e.currentTarget);
                setIsPending(true);  // Inicie o spinner ao enviar
                setInputWord("");
                handleFormSubmit(formData);
              }}
            >
                <div className="relative">
                <Input
                  type="text"
                  onChange={(e) => setInputWord(e.currentTarget.value)}
                  value={inputWord}
                  placeholder="Faça uma tentativa..."
                  className="max-w-xs focus-visible:ring-foreground"
                  name="word"
                  disabled={isPending}
                />
                {isPending && <Spinner className="absolute right-0.5 top-0.5 mt-2 mr-2 z-10 size-min scale-90 "/>}  {/* Exiba o spinner aqui */}
                </div>
              <Button
                disabled={isPending}
                className="bg-foreground text-background hover:bg-foreground/90 aspect-square"
                size="icon"
              >
                <Send className="size-5 stroke-2" />
              </Button>
            </form>
          
        </>
      )}
    </>
  );
}
