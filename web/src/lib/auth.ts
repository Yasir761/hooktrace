import { cookies } from "next/headers"
 
export type User = {
  id: string
  email: string
  avatar_url?: string
  name?: string
}
 
// export async function getCurrentUser(): Promise<User | null> {
//   const cookieStore = await cookies()
//   const accessToken = cookieStore.get("access_token")
 
//   if (!accessToken) {
//     return null
//   }
 
//   try {
//     // Call your backend to verify token and get user
//     const response = await fetch("http://localhost:3001/auth/me", {
//       headers: {
//         Cookie: `access_token=${accessToken.value}`,
//       },
//       credentials: "include",
//     })
 
//     if (!response.ok) {
//       return null
//     }
 
//     const user = await response.json()
//     return user
//   } catch (error) {
//     console.error("Failed to get current user:", error)
//     return null
//   }
// }




// export async function getCurrentUser(): Promise<User | null> {
//     try {
//       const cookieHeader = cookies().toString()
  
//       const response = await fetch("http://localhost:3001/auth/me", {
//         headers: {
//           cookie: cookieHeader,
//         },
//         cache: "no-store",
//       })
  
//       if (!response.ok) return null
  
//       return await response.json()
//     } catch (err) {
//       console.error(err)
//       return null
//     }
//   }









export async function getCurrentUser(): Promise<User | null> {
    try {
      const cookieStore = await cookies()
  
      const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ")
  
      const response = await fetch("http://localhost:3001/auth/me", {
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      })
  
      if (!response.ok) return null
  
      return await response.json()
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }