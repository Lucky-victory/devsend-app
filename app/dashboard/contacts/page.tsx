"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  MoreHorizontal,
  Mail,
  User,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ImportDialog } from "@/components/contacts/import-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { exportContactsToCSV } from "@/lib/csv-processor";
import { useToast } from "@/components/ui/use-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    tags: "",
  });
  const { toast } = useToast();
  const { currentWorkspace, user } = useAuth();

  const contacts = useQuery(
    api.contacts.getContacts,
    currentWorkspace ? { workspaceId: currentWorkspace._id } : "skip"
  );

  const contactStats = useQuery(
    api.contacts.getContactStats,
    currentWorkspace ? { workspaceId: currentWorkspace._id } : "skip"
  );

  const createContact = useMutation(api.contacts.createContact);
  const deleteContact = useMutation(api.contacts.deleteContact);

  const handleAddContact = async () => {
    if (!currentWorkspace || !newContact.email) return;

    try {
      await createContact({
        workspaceId: currentWorkspace._id,
        email: newContact.email,
        firstName: newContact.firstName || undefined,
        lastName: newContact.lastName || undefined,
        tags: newContact.tags
          ? newContact.tags.split(",").map((t) => t.trim())
          : undefined,
      });

      toast({
        title: "Contact added successfully!",
      });
      setIsAddDialogOpen(false);
      setNewContact({ email: "", firstName: "", lastName: "", tags: "" });
    } catch (error) {
      toast({
        title: "Failed to add contact",
        description:
          error instanceof Error ? error.message : "Failed to add contact",
        variant: "destructive",
      });
    }
  };

  const handleExportContacts = () => {
    if (!contacts) return;

    const csvContent = exportContactsToCSV(contacts);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Contacts exported successfully!",
    });
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact({ contactId: contactId as any });
      toast({
        title: "Contact deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete contact",
        description:
          error instanceof Error ? error.message : "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  if (!currentWorkspace) {
    return <div>Please select a workspace</div>;
  }

  if (!contacts || !contactStats) {
    return <div>Loading contacts...</div>;
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map((contact) => contact._id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "subscribed":
        return "default";
      case "unsubscribed":
        return "secondary";
      case "bounced":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your email subscribers and segments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExportContacts}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                  <DialogDescription>
                    Add a new subscriber to your email list.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={newContact.firstName}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={newContact.lastName}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={newContact.email}
                      onChange={(e) =>
                        setNewContact({ ...newContact, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      placeholder="developer, premium, new"
                      value={newContact.tags}
                      onChange={(e) =>
                        setNewContact({ ...newContact, tags: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddContact}
                    disabled={!newContact.email}
                  >
                    Add Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-4"
        variants={staggerContainer}
      >
        {[
          {
            title: "Total Contacts",
            value: contactStats.total.toLocaleString(),
            change: "+12%",
            icon: User,
          },
          {
            title: "Subscribed",
            value: contactStats.subscribed.toLocaleString(),
            change: "+8%",
            icon: Mail,
          },
          {
            title: "Unsubscribed",
            value: contactStats.unsubscribed.toLocaleString(),
            change: "+2%",
            icon: User,
          },
          {
            title: "Segments",
            value: contactStats.segments.toString(),
            change: "+3",
            icon: Tag,
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Actions */}
      <motion.div variants={fadeInUp}>
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {selectedContacts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedContacts.length} selected
                    </span>
                    <Button size="sm" variant="outline">
                      <Tag className="mr-2 h-4 w-4" />
                      Add Tags
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contacts Table */}
      <motion.div variants={fadeInUp}>
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>All Contacts</CardTitle>
            <CardDescription>
              Manage your email subscribers and their information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedContacts.length === filteredContacts.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact._id)}
                        onCheckedChange={(checked) =>
                          handleSelectContact(contact._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={contact.firstName || contact.email}
                          />
                          <AvatarFallback>
                            {contact.firstName && contact.lastName
                              ? `${contact.firstName[0]}${contact.lastName[0]}`
                              : contact.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {contact.firstName && contact.lastName
                              ? `${contact.firstName} ${contact.lastName}`
                              : contact.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(contact.subscribedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {contact.lastActivityAt
                        ? new Date(contact.lastActivityAt).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                          <DropdownMenuItem>Add Tags</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteContact(contact._id)}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Import Dialog */}
      <ImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        workspaceId={currentWorkspace._id}
      />
    </motion.div>
  );
}
