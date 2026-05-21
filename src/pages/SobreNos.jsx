import instagramIcon from '../assets/img/instagram.svg';
import githubIcon from '../assets/img/github.svg';
import '../assets/css/sobreNos.css';

const integrantes = [
    {
        nome: "Elian Barros",
        cargo: "Co-Fundador e CEO",
        descricao: "Apaixonado por carros e tecnologia. Com uma visão inovadora, ele lidera a equipe para garantir que os nossos clientes tenham a melhor experiência possível.",
        github: "https://github.com/Elian-BSiqueira"
    },
    {
        nome: "Jose Artur",
        cargo: "Co-Fundador e CFO",
        descricao: "Especialista em manutenção de veículos. Com uma abordagem técnica e profissional, ele está sempre pronto para ajudar os nossos clientes com as suas dúvidas e necessidades.",
        github: "https://github.com/Jose-si"
    },
    {
        nome: "Igor",
        cargo: "Co-Fundador e CTO",
        descricao: "Especialista em tecnologia e desenvolvimento de software. Com uma abordagem inovadora, ele lidera a equipa de tecnologia para garantir uma plataforma estável.",
        github: "https://github.com/Igor3k21"
    },
    {
        nome: "Rafael Barbosa",
        cargo: "Especialista de Atendimento",
        descricao: "O nosso especialista em atendimento ao cliente. Com uma abordagem amigável e profissional, ele está sempre pronto para tirar dúvidas e prestar suporte.",
        github: "https://github.com/RafaelBarbosa-git"
    },
    {
        nome: "Renner Farias",
        cargo: "Co-Fundador e CMO",
        descricao: "Especialista em marketing e comunicação. Com uma abordagem estratégica, ele lidera as iniciativas de crescimento e divulgação do sistema.",
        github: "https://github.com/RennerFarias"
    }
];

export default function SobreNos() {
    return (
        <div className="cont-principal">
            <div className="inicio">
                <h1>Sobre nós</h1>
                <p>Somos uma empresa dedicada a oferecer serviços de qualidade para o seu veículo. Com anos de experiência no mercado, comprometemo-nos em atender os nossos clientes com excelência e confiança.</p>

                <div className="integrantes">
                    {integrantes.map((membro, index) => (
                        <div className="gaveta" key={index}>
                            <div className="integrante">
                                <h2>{membro.nome}</h2>
                                <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#1f1f1f' }}>{membro.cargo}</p>
                                <p>{membro.descricao}</p>
                                <div className="redes-sociais">
                                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                                        <img src={instagramIcon} alt="Instagram" />
                                    </a>
                                    <a href={membro.github} target="_blank" rel="noreferrer">
                                        <img src={githubIcon} alt="GitHub" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}