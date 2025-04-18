"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import type { Feedback, Store } from "@/lib/airtable"
import { StarRating } from "./star-rating"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { NoteModal } from "./note-modal"
import { useToast } from "./ui/use-toast"
import { Mail, Phone, Download, MessageSquare, RotateCcw, StickyNote } from "lucide-react"
import { sendMessage, resetMessageTimer } from "@/app/actions"

interface DashboardTableProps {
  feedback: Feedback[]
  store: Store
}

export function DashboardTable({ feedback, store }: DashboardTableProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>(feedback)
  const [filters, setFilters] = useState({
    rating: 0,
    visitAgain: "All",
    optIn: "All",
  })
  const { toast } = useToast()

  // Apply filters when they change or when feedback changes
  React.useEffect(() => {
    let result = [...feedback]

    if (filters.rating > 0) {
      result = result.filter((item) => item.rating === filters.rating)
    }

    if (filters.visitAgain !== "All") {
      result = result.filter((item) => item.visitAgain === filters.visitAgain)
    }

    if (filters.optIn !== "All") {
      result = result.filter((item) => (filters.optIn === "Yes" ? item.optIn : !item.optIn))
    }

    setFilteredFeedback(result)
  }, [feedback, filters])

  const handleOpenNoteModal = (item: Feedback) => {
    setSelectedFeedback(item)
    setIsNoteModalOpen(true)
  }

  const handleSendMessage = async (item: Feedback) => {
    if (!item.contact) {
      toast({
        title: "Cannot send message",
        description: "No contact information provided.",
        variant: "destructive",
      })
      return
    }

    try {
      await sendMessage(item.id)
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResetTimer = async (item: Feedback) => {
    try {
      await resetMessageTimer(item.id)
      toast({
        title: "Timer reset",
        description: "The message timer has been reset.",
      })
    } catch (error) {
      console.error("Error resetting timer:", error)
      toast({
        title: "Failed to reset timer",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportToCsv = () => {
    setIsExporting(true)

    try {
      // Create CSV content
      const headers = ["Date", "Customer", "Rating", "Visit Again", "Contact", "Opt-In", "Comments", "Private Note"]
      const csvContent = [
        headers.join(","),
        ...filteredFeedback.map((item) =>
          [
            format(new Date(item.createdTime), "yyyy-MM-dd"),
            `"${item.customerName.replace(/"/g, '""')}"`,
            item.rating,
            item.visitAgain,
            `"${(item.contact || "").replace(/"/g, '""')}"`,
            item.optIn ? "Yes" : "No",
            `"${(item.comments || "").replace(/"/g, '""')}"`,
            `"${(item.privateNote || "").replace(/"/g, '""')}"`,
          ].join(","),
        ),
      ].join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${store.name}-feedback-${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Export failed",
        description: "Failed to export feedback data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const isEmail = (contact: string) => {
    return /\S+@\S+\.\S+/.test(contact)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Feedback</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportToCsv}
              disabled={isExporting || filteredFeedback.length === 0}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <select
              className="border rounded p-2"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <select
              className="border rounded p-2"
              value={filters.visitAgain}
              onChange={(e) => setFilters({ ...filters, visitAgain: e.target.value })}
            >
              <option value="All">All Visit Again</option>
              <option value="Yes">Yes</option>
              <option value="Maybe">Maybe</option>
              <option value="No">No</option>
            </select>

            <select
              className="border rounded p-2"
              value={filters.optIn}
              onChange={(e) => setFilters({ ...filters, optIn: e.target.value })}
            >
              <option value="All">All Opt-In</option>
              <option value="Yes">Opted In</option>
              <option value="No">Not Opted In</option>
            </select>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No feedback received yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Visit Again</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Opt-In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{format(new Date(item.createdTime), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.customerName}</div>
                        {item.comments && (
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{item.comments}</div>
                        )}
                        {item.privateNote && (
                          <Badge variant="outline" className="mt-1 flex items-center gap-1">
                            <StickyNote className="h-3 w-3" />
                            <span className="text-xs">Has note</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <StarRating value={item.rating} onChange={() => {}} readOnly size="sm" />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.visitAgain === "Yes"
                              ? "default"
                              : item.visitAgain === "Maybe"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {item.visitAgain}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.contact ? (
                          <div className="flex items-center gap-1">
                            {isEmail(item.contact) ? <Mail className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                            <span>{item.contact}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.optIn ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenNoteModal(item)}
                            title="Add Note"
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendMessage(item)}
                            disabled={!item.contact}
                            title="Send Message"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResetTimer(item)}
                            title="Reset Timer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFeedback && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          feedbackId={selectedFeedback.id}
          customerName={selectedFeedback.customerName}
          initialNote={selectedFeedback.privateNote}
          onNoteUpdated={() => {
            // Refresh data would happen here in a real app
          }}
        />
      )}
    </>
  )
}
