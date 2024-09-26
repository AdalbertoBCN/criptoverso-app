"use client"
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

interface SubmitInputProps {
  handleFormSubmit: (formData: FormData) => Promise<void>;
  inputWord: string;
  setInputWord: Dispatch<SetStateAction<string>>;
  win?: boolean;
}

export default function SubmitInput({
  handleFormSubmit,
  setInputWord,
  inputWord,
  win
}: SubmitInputProps) {
  return (
    <>
    {!win ? <form className="flex gap-2" action={handleFormSubmit}>
      <Input
        type="text"
        onChange={(e) => setInputWord(e.currentTarget.value)}
        value={inputWord}
        placeholder="Faça uma tentativa..."
        className=" max-w-xs focus-visible:ring-foreground"
        name="word"
        />
      <Button className="bg-foreground text-background hover:bg-foreground/90 aspect-square" size="icon"><Send className="size-5 stroke-2" /></Button>
    </form> : <p className="text-lg font-semibold h-16">Parabéns! Você acertou!</p>}
        </>
  );
}
