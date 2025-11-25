export default function Privacidade() {
  return (
    <main className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-neon-purple">Política de Privacidade</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Informações que Coletamos</h2>
            <p>O MusicaIA coleta informações mínimas necessárias para o funcionamento do serviço:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Dados de uso anônimos via Google Analytics</li>
              <li>Cookies para melhorar a experiência do usuário</li>
              <li>Informações técnicas como navegador e sistema operacional</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Como Usamos suas Informações</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Melhorar a qualidade do serviço</li>
              <li>Analisar padrões de uso</li>
              <li>Exibir anúncios relevantes via Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies</h2>
            <p>Utilizamos cookies para:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Lembrar suas preferências</li>
              <li>Analisar tráfego do site</li>
              <li>Personalizar anúncios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Google AdSense</h2>
            <p>Este site usa Google AdSense para exibir anúncios. O Google pode usar cookies para personalizar anúncios com base em visitas anteriores.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Seus Direitos</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Acessar seus dados</li>
              <li>Solicitar exclusão de dados</li>
              <li>Desativar cookies no navegador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Contato</h2>
            <p>Para questões sobre privacidade:</p>
            <div className="mt-2 space-y-2">
              <p>📧 Email: <a href="mailto:mundial.cel11@gmail.com" className="text-neon-purple hover:underline">mundial.cel11@gmail.com</a></p>
              <p>📱 WhatsApp: <a href="https://wa.me/5561985552211" className="text-neon-purple hover:underline" target="_blank" rel="noopener noreferrer">+55 61 98555-2211</a></p>
            </div>
          </section>

          <p className="text-sm text-gray-500 mt-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="mt-8">
          <a href="/" className="text-neon-purple hover:underline">← Voltar para o início</a>
        </div>
      </div>
    </main>
  )
}
