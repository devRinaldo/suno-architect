import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Suno Architect - Gerador de Prompts Musicais com IA',
  description: 'Transforme suas ideias musicais em prompts otimizados para o Suno AI. Gere estilos e letras profissionais com inteligência artificial.',
  keywords: ['suno', 'ai', 'música', 'gerador', 'prompts', 'letras'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
