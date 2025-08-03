"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Mail } from "lucide-react"
import { useParams } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function UnsubscribePage() {
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [reasons, setReasons] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const params = useParams()

  useEffect(() => {
    // In a real app, you'd decode the token and get the email
    // For demo purposes, we'll simulate this
    setEmail("user@example.com")
  }, [params.token])

  const handleUnsubscribe = async () => {
    // In a real app, you'd call your API to unsubscribe the user
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUnsubscribed(true)
  }

  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setReasons([...reasons, reason])
    } else {
      setReasons(reasons.filter((r) => r !== reason))
    }
  }

  const unsubscribeReasons = [
    "Too many emails",
    "Content not relevant",
    "Never signed up",
    "Emails too frequent",
    "Found a better alternative",
    "Other",
  ]

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="glassmorphism text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">You're Unsubscribed</h1>
              <p className="text-muted-foreground mb-6">
                We've successfully removed <strong>{email}</strong> from our mailing list.
              </p>
              <p className="text-sm text-muted-foreground">
                You won't receive any more emails from us. If you change your mind, you can always subscribe again.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div initial="initial" animate="animate" variants={fadeInUp} className="w-full max-w-md">
        <Card className="glassmorphism">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Unsubscribe</CardTitle>
            <CardDescription>
              We're sorry to see you go. You're about to unsubscribe <strong>{email}</strong> from our mailing list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Feedback Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Why are you unsubscribing? (Optional)</Label>
              <div className="space-y-2">
                {unsubscribeReasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <Checkbox
                      id={reason}
                      checked={reasons.includes(reason)}
                      onCheckedChange={(checked) => handleReasonChange(reason, checked as boolean)}
                    />
                    <Label htmlFor={reason} className="text-sm font-normal">
                      {reason}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Feedback */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Additional feedback (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us how we can improve..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={handleUnsubscribe} className="w-full" variant="destructive">
                Confirm Unsubscribe
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => window.history.back()}>
                Keep Me Subscribed
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              If you unsubscribe, you won't receive any more emails from us. You can resubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
