import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from 'next-themes'
import React from 'react'

function SecuredLayout(
    props: React.PropsWithChildren
) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {props.children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default SecuredLayout
