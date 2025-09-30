import type { ReactNode } from "react";
import '@/app/(root)/globals.css'

export default function SuccessLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" >
      <body>
        {children}
      </body>
    </html>
  );
}
