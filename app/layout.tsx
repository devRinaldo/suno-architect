import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'MusicaIA - Gerador de Música Automático com IA | Crie Letras e Melodias',
  description: 'Crie músicas profissionais automaticamente com inteligência artificial. Gere letras em 8 idiomas, escolha entre 100+ gêneros musicais. Grátis! Pagode, Sertanejo, Reggaeton, K-Pop, Rock e muito mais.',
  keywords: [
    'musicaia', 'gerador de música', 'criar música com ia', 'inteligência artificial música',
    'gerador de letras', 'criar letra de música', 'suno ai', 'música automática',
    'pagode', 'sertanejo', 'funk', 'reggaeton', 'k-pop', 'rock', 'pop',
    'letra de música grátis', 'compor música online', 'ai music generator',
    'tags para youtube', 'tags para tiktok', 'tags para reels'
  ],
  authors: [{ name: 'Jose Rinaldo de Vasconcelos Filho' }],
  creator: 'Jose Rinaldo de Vasconcelos Filho',
  publisher: 'MusicaIA',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://suno-architect-five.vercel.app',
    title: 'MusicaIA - Gerador de Música Automático com IA',
    description: 'Crie músicas profissionais automaticamente com inteligência artificial. Gere letras, estilos e tags para redes sociais.',
    siteName: 'MusicaIA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MusicaIA - Gerador de Música Automático com IA',
    description: 'Crie músicas profissionais automaticamente com inteligência artificial.',
  },
  alternates: {
    canonical: 'https://suno-architect-five.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google AdSense - Substitua data-ad-client pelo seu ID quando tiver aprovação */}
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        /> */}
        
        {/* Google Analytics - Adicione seu ID quando criar */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script> */}

        {/* Schema.org para SEO */}
        <Script id="schema-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'MusicaIA',
            description: 'Gerador de música automático com inteligência artificial',
            url: 'https://suno-architect-five.vercel.app',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'BRL',
            },
            creator: {
              '@type': 'Person',
              name: 'Jose Rinaldo de Vasconcelos Filho',
            },
          })}
        </Script>
      </head>
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
