'use client'

import CopyButton from './CopyButton'

interface ResultCardProps {
  title: string
  subtitle: string
  content: string
  icon: 'style' | 'lyrics' | 'image'
}

export default function ResultCard({ title, subtitle, content, icon }: ResultCardProps) {
  return (
    <div className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden transition-all duration-300 hover:border-neon-purple/50">
      {/* Header do card */}
      <div className="flex items-center justify-between p-4 border-b border-dark-600">
        <div className="flex items-center gap-3">
          {/* Ícone */}
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${icon === 'style' 
              ? 'bg-gradient-to-br from-neon-purple to-neon-blue' 
              : icon === 'image'
                ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                : 'bg-gradient-to-br from-neon-pink to-neon-purple'
            }
          `}>
            {icon === 'style' ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
                />
              </svg>
            ) : icon === 'image' ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
        
        <CopyButton text={content} />
      </div>
      
      {/* Conteúdo */}
      <div className="p-4">
        <textarea
          readOnly
          value={content}
          className="
            w-full h-48 p-4 rounded-xl resize-none
            bg-dark-900 border border-dark-600
            text-gray-200 text-sm leading-relaxed
            focus:outline-none focus:border-neon-purple/50
            transition-colors duration-300
          "
        />
      </div>
    </div>
  )
}
