"use client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { convex } from "@/lib/convex-client";
import { authClient } from "@/lib/auth-client";

// interface User {
//   _id: Id<"users">
//   email: string
//   firstName: string
//   lastName: string
//   avatar?: string
//   emailVerified: boolean
// }

// interface Workspace {
//   _id: Id<"workspaces">
//   name: string
//   slug: string
//   ownerId: Id<"users">
//   fromName: string
//   fromEmail: string
//   replyToEmail: string
//   role: "owner" | "admin" | "editor" | "viewer"
// }

// interface AuthContextType {
//   user: User | null
//   workspaces: Workspace[]
//   currentWorkspace: Workspace | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<void>
//   signup: (email: string, firstName: string, lastName: string, password: string) => Promise<void>
//   logout: () => void
//   setCurrentWorkspace: (workspace: Workspace) => void
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<User | null>(null)
  // const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  // const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  // const [isLoading, setIsLoading] = useState(true)
  // const convex = useConvex()

  // useEffect(() => {
  //   // Check for existing session
  //   const storedUser = localStorage.getItem("devsend_user")
  //   const storedWorkspace = localStorage.getItem("devsend_workspace")

  //   if (storedUser) {
  //     const userData = JSON.parse(storedUser)
  //     setUser(userData)

  //     // Load user workspaces
  //     convex
  //       .query(api.auth.getUserWorkspaces, { userId: userData._id })
  //       .then((workspaces) => {
  //         setWorkspaces(workspaces as Workspace[])

  //         if (storedWorkspace) {
  //           const workspace = workspaces.find((w: any) => w._id === JSON.parse(storedWorkspace)._id)
  //           if (workspace) {
  //             setCurrentWorkspace(workspace as Workspace)
  //           }
  //         } else if (workspaces.length > 0) {
  //           setCurrentWorkspace(workspaces[0] as Workspace)
  //         }
  //       })
  //       .finally(() => setIsLoading(false))
  //   } else {
  //     setIsLoading(false)
  //   }
  // }, [convex])

  // const login = async (email: string, password: string) => {
  //   setIsLoading(true)
  //   try {
  //     // For demo purposes, we'll simulate login
  //     // In production, you'd validate credentials
  //     const userData = await convex.query(api.auth.getUserByEmail, { email })

  //     if (!userData) {
  //       throw new Error("Invalid credentials")
  //     }

  //     setUser(userData as User)
  //     localStorage.setItem("devsend_user", JSON.stringify(userData))

  //     // Load workspaces
  //     const userWorkspaces = await convex.query(api.auth.getUserWorkspaces, { userId: userData._id })
  //     setWorkspaces(userWorkspaces as Workspace[])

  //     if (userWorkspaces.length > 0) {
  //       const workspace = userWorkspaces[0] as Workspace
  //       setCurrentWorkspace(workspace)
  //       localStorage.setItem("devsend_workspace", JSON.stringify(workspace))
  //     }
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const signup = async (email: string, firstName: string, lastName: string, password: string) => {
  //   setIsLoading(true)
  //   try {
  //     const result = await convex.mutation(api.auth.createUser, {
  //       email,
  //       firstName,
  //       lastName,
  //     })

  //     const userData = {
  //       _id: result.userId,
  //       email,
  //       firstName,
  //       lastName,
  //       emailVerified: false,
  //     }

  //     setUser(userData as User)
  //     localStorage.setItem("devsend_user", JSON.stringify(userData))

  //     // Load workspaces
  //     const userWorkspaces = await convex.query(api.auth.getUserWorkspaces, { userId: result.userId })
  //     setWorkspaces(userWorkspaces as Workspace[])

  //     if (userWorkspaces.length > 0) {
  //       const workspace = userWorkspaces[0] as Workspace
  //       setCurrentWorkspace(workspace)
  //       localStorage.setItem("devsend_workspace", JSON.stringify(workspace))
  //     }
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const logout = () => {
  //   setUser(null)
  //   setWorkspaces([])
  //   setCurrentWorkspace(null)
  //   localStorage.removeItem("devsend_user")
  //   localStorage.removeItem("devsend_workspace")
  // }

  // const handleSetCurrentWorkspace = (workspace: Workspace) => {
  //   setCurrentWorkspace(workspace)
  //   localStorage.setItem("devsend_workspace", JSON.stringify(workspace))
  // }

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
