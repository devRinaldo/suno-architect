export default function Termos() {
  return (
    <main className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-neon-purple">Termos de Uso</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Aceitação dos Termos</h2>
            <p>Ao usar o MusicaIA, você concorda com estes termos de uso.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Uso do Serviço</h2>
            <p>O MusicaIA é uma ferramenta gratuita para gerar prompts musicais com IA. Você pode:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Gerar letras e estilos musicais</li>
              <li>Usar o conteúdo gerado livremente</li>
              <li>Compartilhar os resultados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Propriedade Intelectual</h2>
            <p>O conteúdo gerado pela IA é de sua propriedade. Você pode usar comercialmente sem restrições.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Limitações</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Não garantimos 100% de originalidade do conteúdo gerado</li>
              <li>O serviço é fornecido "como está"</li>
              <li>Podemos limitar o uso em caso de abuso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Proibições</h2>
            <p>É proibido:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Usar o serviço para fins ilegais</li>
              <li>Tentar hackear ou sobrecarregar o sistema</li>
              <li>Revender o acesso ao serviço</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Modificações</h2>
            <p>Podemos modificar estes termos a qualquer momento. Mudanças significativas serão notificadas no site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Contato</h2>
            <p>Dúvidas? Entre em contato via GitHub: <a href="https://github.com/devRinaldo" className="text-neon-purple hover:underline">@devRinaldo</a></p>
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
