import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"

interface GiveUpProps {
    handleGiveUp: () => void
}

export function GiveUp({handleGiveUp}: GiveUpProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button
        className="justify-self-end text-background dark:text-foreground"
        variant="destructive"
            >
            Desistir
    </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tem certeza que quer desistir?</DialogTitle>
        </DialogHeader>
        
        <DialogFooter>
            <DialogClose asChild>
                <Button type="submit" className="text-destructive ring-1 ring-destructive hover:bg-destructive/20 hover:text-destructive" variant="outline" onClick={() => {
                  handleGiveUp()
                  window.location.reload()
                }}>Desistir</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button type="submit" className="bg-success text-background font-semibold hover:bg-success/90">Não quero Desistir</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
