export default function Sobre() {
  return (
    <main className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-neon-purple">Sobre o MusicaIA</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">🎵 O que é o MusicaIA?</h2>
            <p>O MusicaIA é um gerador automático de música com inteligência artificial. Nossa missão é democratizar a criação musical, permitindo que qualquer pessoa crie letras e estilos profissionais em segundos.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">✨ Recursos</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>8 Idiomas:</strong> Português, Espanhol, Inglês, Francês, Italiano, Alemão, Japonês, Coreano</li>
              <li><strong>100+ Gêneros:</strong> Pagode, Sertanejo, Funk, Reggaeton, K-Pop, Rock, Pop e muito mais</li>
              <li><strong>Autocomplete de Artistas:</strong> Sugestões baseadas no gênero escolhido</li>
              <li><strong>Tags para Redes Sociais:</strong> YouTube, Instagram Reels e TikTok</li>
              <li><strong>100% Gratuito:</strong> Sem limites, sem cadastro</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">🚀 Tecnologia</h2>
            <p>Utilizamos as mais avançadas tecnologias de IA:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li><strong>Groq API:</strong> Llama 3.3 70B para geração de conteúdo</li>
              <li><strong>Next.js 14:</strong> Framework moderno e rápido</li>
              <li><strong>Vercel:</strong> Hospedagem de alta performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">👨‍💻 Criador</h2>
            <p><strong>Jose Rinaldo de Vasconcelos Filho</strong></p>
            <p className="mt-2">Desenvolvedor Full-Stack apaixonado por música e tecnologia.</p>
            <p className="mt-2">
              GitHub: <a href="https://github.com/devRinaldo" className="text-neon-purple hover:underline" target="_blank" rel="noopener noreferrer">@devRinaldo</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">🎯 Missão</h2>
            <p>Tornar a criação musical acessível para todos, independente de conhecimento técnico ou musical. Acreditamos que a IA pode ser uma ferramenta poderosa para democratizar a arte.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">📧 Contato</h2>
            <p>Sugestões, parcerias ou dúvidas?</p>
            <p className="mt-2">Entre em contato via GitHub: <a href="https://github.com/devRinaldo/suno-architect" className="text-neon-purple hover:underline" target="_blank" rel="noopener noreferrer">github.com/devRinaldo/suno-architect</a></p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">💜 Agradecimentos</h2>
            <p>Obrigado a todos que usam e compartilham o MusicaIA. Vocês tornam este projeto possível!</p>
          </section>
        </div>

        <div className="mt-8">
          <a href="/" className="text-neon-purple hover:underline">← Voltar para o início</a>
        </div>
      </div>
    </main>
  )
}
