"use client"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <main>

      <h1>Points Maxxing</h1>

      <button onClick={handleSignIn}>
        Sign In With Google
      </button>
      
    </main>
  )

}