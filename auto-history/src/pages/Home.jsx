import { Link } from 'react-router-dom';
import '../assets/css/home.css';

export default function Home() {
    return (
        <div className="home-page">
            <section className="inicio">
                <p className="etiqueta">Informação confiável para decisões melhores</p>

                <h1>Mais clareza na compra e venda<br /><span>de veículos usados</span></h1>

                <p className="texto-inicial">
                    O Auto History foi pensado para organizar registros importantes do veículo,
                    reunir dados de manutenção e tornar o histórico mais acessível, confiável e útil
                    para quem vende, compra ou acompanha a vida útil do automóvel.
                </p>

                <section className="acoes-inicio">
                    <Link to="/dashboard" className="btn-principal" style={{ width: 'auto', padding: '14px 28px', display: 'inline-block', textAlign: 'center' }}>
                        Começar Agora
                    </Link>
                </section>

                <section className="numeros">
                    <article className="numero-item">
                        <h3>Mais segurança</h3>
                        <p>para consultar informações</p>
                    </article>

                    <article className="numero-item">
                        <h3>Mais confiança</h3>
                        <p>durante a negociação</p>
                    </article>

                    <article className="numero-item">
                        <h3>Mais organização</h3>
                        <p>no histórico do veículo</p>
                    </article>
                </section>
            </section>

            <section id="funcionalidades" className="secao">
                <p className="titulo-pequeno">Recursos</p>
                <h2 className="titulo-secao">O que a plataforma oferece</h2>
                <p className="texto-secao">
                    A proposta do sistema é concentrar informações relevantes do veículo
                    em um ambiente mais claro, validado e fácil de consultar.
                </p>

                <section className="grade-cards">
                    <article className="card">
                        <h3>Registro do Histórico</h3>
                        <p>Armazena dados de manutenção, peças trocadas e ocorrências importantes relacionadas ao veículo.</p>
                    </article>

                    <article className="card">
                        <h3>Comprovação por Arquivos</h3>
                        <p>Permite anexar fotos e documentos para fortalecer a veracidade dos registros realizados.</p>
                    </article>

                    <article className="card">
                        <h3>Participação das Oficinas</h3>
                        <p>Oficinas cadastradas podem inserir informações diretamente no sistema, aumentando a confiança nos dados.</p>
                    </article>

                    <article className="card">
                        <h3>Compartilhamento Facilitado</h3>
                        <p>O histórico pode ser consultado e futuramente compartilhado com mais praticidade em negociações.</p>
                    </article>
                </section>
            </section>

            <section id="comofunciona" className="secao secao-escura">
                <p className="titulo-pequeno">Etapas</p>
                <h2 className="titulo-secao">Como o sistema funciona</h2>
                <p className="texto-secao">
                    O uso da plataforma foi pensado para ser simples e útil no acompanhamento do histórico do veículo.
                </p>

                <section className="grade-etapas">
                    <article className="etapa">
                        <span className="numero-etapa">01</span>
                        <h3>Identificação do veículo</h3>
                        <p>O veículo é relacionado ao sistema por informações como chassi e placa, criando um perfil para reunir os dados.</p>
                    </article>

                    <article className="etapa">
                        <span className="numero-etapa">02</span>
                        <h3>Inclusão de registros</h3>
                        <p>São adicionados dados como manutenções, peças, imagens e documentos importantes.</p>
                    </article>

                    <article className="etapa">
                        <span className="numero-etapa">03</span>
                        <h3>Consulta das informações</h3>
                        <p>O histórico reunido pode ser visualizado de forma mais organizada, apoiando análises e negociações.</p>
                    </article>
                </section>
            </section>
        </div>
    );
}