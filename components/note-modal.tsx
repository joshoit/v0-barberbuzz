"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useToast } from "./ui/use-toast"
import { updateFeedbackNote } from "@/app/actions"

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  feedbackId: string
  customerName: string
  initialNote?: string
  onNoteUpdated: () => void
}

export function NoteModal({
  isOpen,
  onClose,
  feedbackId,
  customerName,
  initialNote = "",
  onNoteUpdated,
}: NoteModalProps) {
  const [note, setNote] = useState(initialNote)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await updateFeedbackNote(feedbackId, note)

      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      })

      onNoteUpdated()
      onClose()
    } catch (error) {
      console.error("Error saving note:", error)
      toast({
        title: "Failed to save note",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note for {customerName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Add your private note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
