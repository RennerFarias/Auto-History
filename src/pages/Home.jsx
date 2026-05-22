import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/home.css'

const RECURSOS = [
  { emoji: '📋', titulo: 'Registro do Histórico', desc: 'Armazena dados de manutenção, peças trocadas e ocorrências importantes relacionadas ao veículo.' },
  { emoji: '📎', titulo: 'Comprovação por Arquivos', desc: 'Permite anexar fotos e documentos para fortalecer a veracidade dos registros realizados.' },
  { emoji: '🏪', titulo: 'Participação das Oficinas', desc: 'Oficinas cadastradas podem inserir informações diretamente no sistema, aumentando a confiança nos dados.' },
  { emoji: '🔗', titulo: 'Compartilhamento Facilitado', desc: 'O histórico pode ser consultado e futuramente compartilhado com mais praticidade em negociações.' },
]

const ETAPAS = [
  { emoji: '🔍', label: 'Etapa 01', titulo: 'Identifique o veículo', desc: 'Informe o chassi ou placa do veículo para criar o perfil no sistema.' },
  { emoji: '📄', label: 'Etapa 02', titulo: 'Adicione os registros', desc: 'Insira manutenções, peças trocadas, imagens e documentos importantes.' },
  { emoji: '✅', label: 'Etapa 03', titulo: 'Consulte e decida', desc: 'Visualize o histórico completo e tome decisões com mais segurança.' },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuDark, setMenuDark] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero')
      if (!hero) return
      setMenuDark(window.scrollY > hero.offsetHeight - 60)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <main className="home-page">
        {/* HERO - SEÇÃO COMPLETA DE PONTA A PONTA */}
        <section id="hero" className="hero">
          <div className="hero-conteudo">
            <p className="hero-etiqueta">Relatórios de histórico de veículos</p>
            <h1>Todo carro tem <span>uma história.</span><br />Saiba disso.</h1>
            <p className="hero-subtitulo">
              Relatórios completos do histórico do veículo.<br />
              Tome decisões seguras antes de comprar seu próximo veículo.
            </p>
            <Link to="/dashboard" className="hero-btn">Ver histórico</Link>
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="recursos">
          <p className="secao-label">O que você recebe ao usar o nosso sistema</p>
          <h2 className="secao-titulo">Tudo o que você precisa saber</h2>
          <div className="recursos-grid">
            {RECURSOS.map((r, i) => (
              <div className="recurso-item" key={i}>
                <div className="recurso-icone">{r.emoji}</div>
                <div className="recurso-texto">
                  <h3>{r.titulo}</h3>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="como-funciona">
          <p className="secao-label">Como funciona</p>
          <h2 className="secao-titulo secao-titulo--simple">
            Apenas três passos simples
          </h2>
          <h3>Entenda como todo nosso processo funciona de forma simples e eficaz</h3>
          <div className="etapas-container">
            {ETAPAS.map((e, i) => (
              <div className="etapa" key={i}>
                <div className="etapa-linha" />
                <div className="etapa-circulo">{e.emoji}</div>
                <p className="etapa-label">{e.label}</p>
                <h3>{e.titulo}</h3>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}