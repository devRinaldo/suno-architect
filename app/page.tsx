'use client'

import { useState, useEffect } from 'react'
import ResultCard from './components/ResultCard'
import CopyButton from './components/CopyButton'
// import AdBanner from './components/AdBanner' // Descomente quando tiver AdSense aprovado

// Componente de botão de copiar para tags
function CopyTagButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-2 py-1 rounded-lg transition-all ${
        copied 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-dark-600 text-gray-400 hover:text-white'
      }`}
    >
      {copied ? '✓' : 'Copiar'}
    </button>
  )
}

interface GenerationResult {
  title: string
  style: string
  lyrics: string
  tagsYoutube: string
  tagsReels: string
  tagsTiktok: string
}

// Idiomas disponíveis
const IDIOMAS = [
  { value: 'portugues', label: '🇧🇷 Português', pais: 'Brasil' },
  { value: 'espanhol', label: '🇪🇸 Espanhol', pais: 'Espanha/Latino' },
  { value: 'ingles', label: '🇺🇸 Inglês', pais: 'EUA/UK' },
  { value: 'frances', label: '🇫🇷 Francês', pais: 'França' },
  { value: 'italiano', label: '🇮🇹 Italiano', pais: 'Itália' },
  { value: 'alemao', label: '🇩🇪 Alemão', pais: 'Alemanha' },
  { value: 'japones', label: '🇯🇵 Japonês', pais: 'Japão' },
  { value: 'coreano', label: '🇰🇷 Coreano', pais: 'Coreia' },
]

// Artistas por gênero para autocomplete
const ARTISTAS_POR_GENERO: Record<string, string[]> = {
  // Brasileiros
  'Pagode': ['Exaltasamba', 'Grupo Revelação', 'Thiaguinho', 'Péricles', 'Sorriso Maroto', 'Turma do Pagode', 'Dilsinho', 'Ferrugem', 'Menos é Mais', 'Pixote'],
  'Samba': ['Zeca Pagodinho', 'Beth Carvalho', 'Martinho da Vila', 'Jorge Aragão', 'Alcione', 'Diogo Nogueira', 'Maria Rita', 'Arlindo Cruz', 'Fundo de Quintal'],
  'Sertanejo': ['Gusttavo Lima', 'Marília Mendonça', 'Jorge e Mateus', 'Henrique e Juliano', 'Maiara e Maraisa', 'Zé Neto e Cristiano', 'Leonardo', 'Bruno e Marrone'],
  'Sertanejo Universitário': ['Luan Santana', 'Wesley Safadão', 'Michel Teló', 'Lucas Lucco', 'Gustavo Mioto', 'Hugo e Guilherme', 'Matheus e Kauan'],
  'Forró': ['Luiz Gonzaga', 'Dominguinhos', 'Falamansa', 'Aviões do Forró', 'Wesley Safadão', 'Xand Avião', 'Solange Almeida', 'Calcinha Preta'],
  'Axé': ['Ivete Sangalo', 'Claudia Leitte', 'Bell Marques', 'Chiclete com Banana', 'Banda Eva', 'Harmonia do Samba', 'Léo Santana', 'Psirico'],
  'MPB': ['Caetano Veloso', 'Gilberto Gil', 'Chico Buarque', 'Djavan', 'Milton Nascimento', 'Elis Regina', 'Maria Bethânia', 'Gal Costa', 'Marisa Monte'],
  'Bossa Nova': ['Tom Jobim', 'João Gilberto', 'Vinícius de Moraes', 'Nara Leão', 'Astrud Gilberto', 'Stan Getz', 'Toquinho', 'Bebel Gilberto'],
  'Funk Brasileiro': ['Anitta', 'Ludmilla', 'MC Kevinho', 'Pedro Sampaio', 'Dennis DJ', 'MC Don Juan', 'Livinho', 'MC Cabelinho', 'Gloria Groove'],
  'Piseiro': ['João Gomes', 'Vitor Fernandes', 'Tarcísio do Acordeon', 'Zé Vaqueiro', 'Mari Fernandez', 'Nattan', 'Os Barões da Pisadinha'],
  
  // Espanhol
  'Reggaeton': ['Bad Bunny', 'J Balvin', 'Daddy Yankee', 'Ozuna', 'Maluma', 'Anuel AA', 'Karol G', 'Nicky Jam', 'Rauw Alejandro', 'Myke Towers'],
  'Salsa': ['Marc Anthony', 'Celia Cruz', 'Héctor Lavoe', 'Rubén Blades', 'Willie Colón', 'Oscar D León', 'Gilberto Santa Rosa', 'Victor Manuelle'],
  'Bachata': ['Romeo Santos', 'Prince Royce', 'Aventura', 'Juan Luis Guerra', 'Frank Reyes', 'Toby Love', 'Daniel Santacruz'],
  'Cumbia': ['Selena', 'Los Ángeles Azules', 'Grupo Cañaveral', 'La Sonora Dinamita', 'Celso Piña', 'Los Palmeras', 'Damas Gratis'],
  'Flamenco': ['Paco de Lucía', 'Camarón de la Isla', 'Rosalía', 'Ketama', 'Diego El Cigala', 'Niña Pastori', 'Estrella Morente'],
  'Trap Latino': ['Bad Bunny', 'Anuel AA', 'Arcángel', 'Bryant Myers', 'Noriel', 'Jhay Cortez', 'Eladio Carrión'],
  
  // Inglês
  'Pop': ['Taylor Swift', 'Ed Sheeran', 'Dua Lipa', 'The Weeknd', 'Harry Styles', 'Ariana Grande', 'Bruno Mars', 'Billie Eilish', 'Olivia Rodrigo'],
  'Rock': ['Queen', 'Led Zeppelin', 'The Beatles', 'Pink Floyd', 'Nirvana', 'Foo Fighters', 'Coldplay', 'U2', 'Red Hot Chili Peppers'],
  'Hip Hop': ['Drake', 'Kendrick Lamar', 'Eminem', 'Jay-Z', 'Kanye West', 'Travis Scott', 'J. Cole', 'Post Malone', '21 Savage'],
  'R&B': ['The Weeknd', 'SZA', 'Frank Ocean', 'Beyoncé', 'Usher', 'Chris Brown', 'H.E.R.', 'Daniel Caesar', 'Summer Walker'],
  'Country': ['Luke Combs', 'Morgan Wallen', 'Chris Stapleton', 'Carrie Underwood', 'Blake Shelton', 'Luke Bryan', 'Dolly Parton', 'Johnny Cash'],
  'Jazz': ['Miles Davis', 'John Coltrane', 'Louis Armstrong', 'Ella Fitzgerald', 'Duke Ellington', 'Billie Holiday', 'Charlie Parker'],
  'Blues': ['B.B. King', 'Muddy Waters', 'Robert Johnson', 'Stevie Ray Vaughan', 'Eric Clapton', 'John Lee Hooker', 'Buddy Guy'],
  'EDM': ['Calvin Harris', 'David Guetta', 'Martin Garrix', 'Marshmello', 'Tiësto', 'Avicii', 'Skrillex', 'Deadmau5', 'Zedd'],
  'Indie': ['Arctic Monkeys', 'Tame Impala', 'The Strokes', 'Vampire Weekend', 'Mac DeMarco', 'Bon Iver', 'Phoebe Bridgers'],
  'Metal': ['Metallica', 'Iron Maiden', 'Black Sabbath', 'Slipknot', 'Avenged Sevenfold', 'System of a Down', 'Pantera'],
  
  // Japonês
  'J-Pop': ['YOASOBI', 'Ado', 'Kenshi Yonezu', 'LiSA', 'Official HIGE DANdism', 'King Gnu', 'Aimer', 'Hikaru Utada'],
  'J-Rock': ['ONE OK ROCK', 'X Japan', 'L Arc-en-Ciel', 'Asian Kung-Fu Generation', 'RADWIMPS', 'Bump of Chicken'],
  'City Pop': ['Tatsuro Yamashita', 'Mariya Takeuchi', 'Anri', 'Toshiki Kadomatsu', 'Taeko Onuki'],
  
  // Coreano
  'K-Pop': ['BTS', 'BLACKPINK', 'Stray Kids', 'TWICE', 'aespa', 'NewJeans', 'IVE', 'LE SSERAFIM', 'SEVENTEEN', 'NCT'],
  'K-Hip Hop': ['Jay Park', 'Zico', 'Epik High', 'BewhY', 'pH-1', 'Jessi', 'CL'],
  'K-Ballad': ['IU', 'Taeyeon', 'Chen', 'Baekhyun', 'Davichi', 'Paul Kim', 'Lee Hi'],
}

// Gêneros por idioma/região
const GENEROS_POR_IDIOMA: Record<string, { locais: string[], internacionais: string[] }> = {
  portugues: {
    locais: [
      'Pagode', 'Samba', 'Sertanejo', 'Sertanejo Universitário', 'Forró', 
      'Axé', 'MPB', 'Bossa Nova', 'Funk Brasileiro', 'Piseiro', 
      'Arrocha', 'Brega', 'Tecnobrega', 'Samba Rock', 'Maracatu',
      'Frevo', 'Baião', 'Xote', 'Lambada', 'Manguebeat'
    ],
    internacionais: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'EDM', 'Reggae', 'Jazz', 'Blues']
  },
  espanhol: {
    locais: [
      'Reggaeton', 'Salsa', 'Bachata', 'Cumbia', 'Merengue', 'Tango',
      'Flamenco', 'Ranchera', 'Corrido', 'Norteño', 'Banda', 'Vallenato',
      'Bolero', 'Son Cubano', 'Mambo', 'Rumba', 'Dembow', 'Trap Latino'
    ],
    internacionais: ['Pop Latino', 'Rock en Español', 'Hip Hop Latino', 'R&B', 'EDM']
  },
  ingles: {
    locais: [
      'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Jazz', 'Blues',
      'Soul', 'Funk', 'Disco', 'Indie', 'Alternative', 'Punk', 'Metal',
      'Folk', 'Gospel', 'Trap', 'Drill', 'Grunge', 'Emo'
    ],
    internacionais: ['EDM', 'House', 'Techno', 'Dubstep', 'Drum and Bass', 'Lo-Fi']
  },
  frances: {
    locais: [
      'Chanson Française', 'French Pop', 'French House', 'Raï', 'Zouk',
      'Musette', 'Yé-yé', 'French Hip Hop', 'Variété Française'
    ],
    internacionais: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'EDM', 'Jazz']
  },
  italiano: {
    locais: [
      'Canzone Italiana', 'Italian Pop', 'Tarantella', 'Opera Pop',
      'Italo Disco', 'Italian Hip Hop', 'Napolitana', 'Melodico'
    ],
    internacionais: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'EDM', 'Jazz']
  },
  alemao: {
    locais: [
      'Schlager', 'Volksmusik', 'German Hip Hop', 'Neue Deutsche Welle',
      'Krautrock', 'German Techno', 'Deutschrock', 'German Metal'
    ],
    internacionais: ['Pop', 'Rock', 'Hip Hop', 'EDM', 'Techno', 'Trance']
  },
  japones: {
    locais: [
      'J-Pop', 'J-Rock', 'Enka', 'Visual Kei', 'City Pop', 'Anime OST',
      'Japanese Hip Hop', 'Shibuya-kei', 'Kayōkyoku', 'Vocaloid'
    ],
    internacionais: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'EDM', 'Jazz']
  },
  coreano: {
    locais: [
      'K-Pop', 'K-Hip Hop', 'K-R&B', 'K-Rock', 'K-Indie', 'Trot',
      'K-Ballad', 'Korean Hip Hop', 'K-Dance'
    ],
    internacionais: ['Pop', 'Rock', 'Hip Hop', 'R&B', 'EDM']
  }
}

export default function Home() {
  const [idioma, setIdioma] = useState('portugues')
  const [genero, setGenero] = useState('')
  const [artista, setArtista] = useState('')
  const [showSugestoes, setShowSugestoes] = useState(false)
  const [assunto, setAssunto] = useState('')
  const [assuntoAuto, setAssuntoAuto] = useState(false)
  
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Quando muda o idioma, limpa o gênero selecionado
  useEffect(() => {
    setGenero('')
    setArtista('')
  }, [idioma])

  // Quando muda o gênero, limpa o artista
  useEffect(() => {
    setArtista('')
  }, [genero])

  // Pega sugestões de artistas baseado no gênero e no que foi digitado
  const artistasSugeridos = genero && ARTISTAS_POR_GENERO[genero] 
    ? ARTISTAS_POR_GENERO[genero].filter(a => 
        artista.length >= 2 && a.toLowerCase().includes(artista.toLowerCase())
      )
    : []

  // Pega os gêneros do idioma atual
  const generosAtuais = GENEROS_POR_IDIOMA[idioma] || GENEROS_POR_IDIOMA['portugues']
  const idiomaAtual = IDIOMAS.find(i => i.value === idioma)

  const handleGenerate = async () => {
    if (!genero) {
      setError('Selecione um gênero musical.')
      return
    }
    if (!assuntoAuto && !assunto.trim()) {
      setError('Descreva o assunto da música ou marque "Criar automático".')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const idiomaTexto = idiomaAtual?.label.split(' ')[1] || 'Português'
    
    let prompt = `Crie uma música no estilo ${genero}, com letra em ${idiomaTexto}.`
    
    if (artista.trim()) {
      prompt += ` Use como referência o estilo do artista/banda: ${artista}. Pesquise as características musicais desse artista.`
    }
    
    if (assuntoAuto) {
      prompt += ` Crie um tema/assunto criativo e original que combine perfeitamente com o gênero ${genero}. Seja criativo e surpreendente!`
    } else {
      prompt += ` O tema/assunto da música é: ${assunto}`
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar conteúdo')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-animated">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue shadow-lg shadow-neon-purple/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-neon-purple to-neon-blue bg-clip-text text-transparent">
            MusicaIA
          </h1>
          
          <p className="text-gray-400 text-lg">
            Seu gerador de música automático com inteligência artificial
          </p>
        </header>

        {/* Anúncio Topo - Descomente quando tiver AdSense aprovado */}
        {/* <AdBanner dataAdSlot="1234567890" dataAdFormat="horizontal" /> */}

        {/* Formulário */}
        <section className="mb-10">
          <div className="bg-dark-800 rounded-2xl border border-dark-600 p-6 space-y-6">
            
            {/* Linha 1: Idioma e Gênero */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Idioma */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🌍 Idioma da Letra
                </label>
                <select
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  className="w-full p-3 rounded-xl bg-dark-900 border border-dark-600 text-white focus:outline-none focus:border-neon-purple transition-colors"
                  disabled={loading}
                >
                  {IDIOMAS.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>

              {/* Gênero - Muda conforme o idioma */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎵 Gênero Musical *
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full p-3 rounded-xl bg-dark-900 border border-dark-600 text-white focus:outline-none focus:border-neon-purple transition-colors"
                  disabled={loading}
                >
                  <option value="">Selecione um gênero...</option>
                  
                  <optgroup label={`🎶 ${idiomaAtual?.pais || 'Locais'}`}>
                    {generosAtuais.locais.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="🌎 Internacionais">
                    {generosAtuais.internacionais.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Artista de Referência com Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎤 Artista de Referência <span className="text-gray-500">(opcional)</span>
              </label>
              <input
                type="text"
                value={artista}
                onChange={(e) => {
                  setArtista(e.target.value)
                  setShowSugestoes(true)
                }}
                onFocus={() => setShowSugestoes(true)}
                onBlur={() => setTimeout(() => setShowSugestoes(false), 200)}
                placeholder={genero ? `Digite para buscar artistas de ${genero}...` : 'Selecione um gênero primeiro...'}
                className="w-full p-3 rounded-xl bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors"
                disabled={loading || !genero}
              />
              
              {/* Lista de sugestões */}
              {showSugestoes && artistasSugeridos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-600 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {artistasSugeridos.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setArtista(a)
                        setShowSugestoes(false)
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-neon-purple/20 hover:text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      🎤 {a}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Dica de artistas disponíveis */}
              {genero && ARTISTAS_POR_GENERO[genero] && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Digite 2+ letras para ver sugestões de artistas de {genero}
                </p>
              )}
              {!genero && (
                <p className="text-xs text-gray-500 mt-1">
                  Selecione um gênero para ver sugestões de artistas
                </p>
              )}
            </div>

            {/* Assunto */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  💭 Assunto da Música {!assuntoAuto && '*'}
                </label>
                
                {/* Checkbox Criar Automático */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={assuntoAuto}
                    onChange={(e) => setAssuntoAuto(e.target.checked)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-neon-purple focus:ring-neon-purple focus:ring-offset-0 cursor-pointer"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-400 group-hover:text-neon-purple transition-colors">
                    🎲 Criar automático
                  </span>
                </label>
              </div>
              
              {!assuntoAuto ? (
                <>
                  <textarea
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    placeholder="Ex: Saudade de um amor de verão, festa com os amigos, superação..."
                    className="w-full h-24 p-3 rounded-xl bg-dark-900 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors resize-none"
                    disabled={loading}
                    maxLength={500}
                  />
                  <span className="text-xs text-gray-500">{assunto.length}/500</span>
                </>
              ) : (
                <div className="w-full h-24 p-3 rounded-xl bg-dark-900/50 border border-neon-purple/30 flex items-center justify-center">
                  <p className="text-gray-400 text-sm text-center">
                    🎲 A IA vai criar um tema criativo baseado no gênero <span className="text-neon-purple">{genero || '...'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Botão */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !genero || (!assuntoAuto && !assunto.trim())}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg shadow-neon-purple/25 hover:shadow-neon-purple/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Gerando...
                  </>
                ) : (
                  <>✨ Gerar Música</>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Anúncio Meio - Descomente quando tiver AdSense aprovado */}
        {/* {result && <AdBanner dataAdSlot="0987654321" />} */}

        {/* Results */}
        {result && (
          <section className="space-y-6">
            {/* Título da música */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">🎵 Sua música está pronta!</p>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                "{result.title}"
              </h2>
            </div>
            
            {/* Estilo e Letra */}
            <div className="grid md:grid-cols-2 gap-6">
              <ResultCard title="Estilo Musical" subtitle="Copie para o 'Song Description' do Suno" content={result.style} icon="style" />
              <ResultCard title="Letra" subtitle="Copie para o 'Lyrics' do Suno" content={result.lyrics} icon="lyrics" />
            </div>

            {/* Tags para Redes Sociais */}
            <div className="bg-dark-800 rounded-2xl border border-dark-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">📱 Tags para Redes Sociais</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* YouTube */}
                <div className="bg-dark-900 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-red-400">▶️ YouTube</span>
                    <CopyTagButton text={result.tagsYoutube || ''} />
                  </div>
                  <p className="text-xs text-gray-400 break-words leading-relaxed">{result.tagsYoutube}</p>
                </div>

                {/* Reels */}
                <div className="bg-dark-900 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-pink-400">📸 Reels</span>
                    <CopyTagButton text={result.tagsReels || ''} />
                  </div>
                  <p className="text-xs text-gray-400 break-words leading-relaxed">{result.tagsReels}</p>
                </div>

                {/* TikTok */}
                <div className="bg-dark-900 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-cyan-400">🎵 TikTok</span>
                    <CopyTagButton text={result.tagsTiktok || ''} />
                  </div>
                  <p className="text-xs text-gray-400 break-words leading-relaxed">{result.tagsTiktok}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-center">
              <p className="text-sm text-gray-300">
                💡 Acesse <a href="https://suno.com" target="_blank" rel="noopener noreferrer" className="text-neon-purple hover:underline">suno.com</a> e cole os resultados!
              </p>
            </div>
          </section>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm space-y-4">
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="/sobre" className="hover:text-neon-purple transition-colors">Sobre</a>
            <a href="/termos" className="hover:text-neon-purple transition-colors">Termos de Uso</a>
            <a href="/privacidade" className="hover:text-neon-purple transition-colors">Privacidade</a>
            <a href="https://github.com/devRinaldo/suno-architect" target="_blank" rel="noopener noreferrer" className="hover:text-neon-purple transition-colors">GitHub</a>
          </div>
          <p>Feito com 💜 para criadores musicais</p>
          <p className="text-xs">© {new Date().getFullYear()} MusicaIA - Todos os direitos reservados</p>
        </footer>
      </div>
    </main>
  )
}
