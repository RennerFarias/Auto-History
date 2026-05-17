const oficinas = [
    {
        id: 1,
        nome: "Oficina AutoTech",
        descricao: "Especializada em manutenção de veículos modernos, a AutoTech oferece serviços de alta qualidade para garantir o desempenho do seu carro.",
        localizacao: "Rua das Flores, 123 - Centro",
        contato: "(11) 1234-5678",
        horario: "Segunda a sexta, das 8h às 18h",
        servicos: "Revisão geral, troca de óleo, alinhamento e balanceamento, diagnóstico eletrônico, entre outros."
    }, 
    {
        id: 2,
        nome: "Oficina Mecânica Rápida",
        descricao: "Com uma equipe experiente, a Oficina Mecânica Rápida é conhecida por sua eficiência e atendimento ágil, ideal para quem precisa de reparos rápidos.",
        localizacao: "Rua das Flores, 123 - Centro",
        contato: "(11) 1234-5678",
        horario: "Segunda a sexta, das 8h às 18h",
        servicos: "Revisão geral, troca de óleo, alinhamento e balanceamento, diagnóstico eletrônico, entre outros."
    },
    {
        id: 3,
        nome: "Oficina AutoMaster",
        descricao: "A AutoMaster é uma oficina de confiança, oferecendo uma ampla gama de serviços para manter seu veículo em perfeito estado.",
        localizacao: "Rua das Flores, 123 - Centro",
        contato: "(11) 1234-5678",
        horario: "Segunda a sexta, das 8h às 18h",
        servicos: "Revisão geral, troca de óleo, alinhamento e balanceamento, diagnóstico eletrônico, entre outros."

    }

];


function ItemGaveta({ dados }) {
    const [aberta, setAberta] = React.useState(false);

    return (
        <li>
            <div className="gaveta">
                <button className="gaveta-botao" onClick={() => setAberta(!aberta)}>
                    <span className="gaveta-titulo">{dados.nome}</span>
                    <span className="gaveta-descricao">{dados.descricao}</span>
                </button>

                <div className={`gaveta-conteudo ${aberta ? 'ativo' : ''}`}>
                    <p>Localização: {dados.localizacao}</p>
                    <p>Contato: {dados.contato}</p>
                    <p>Horário de atendimento: {dados.horario}</p>
                    <p>Serviços oferecidos: {dados.servicos}</p>
                </div>
            </div>
        </li>
    );
}

function ListarOficinas() {
    return (
        <ul className="listagem">
            {oficinas.map((oficina) => (
                <ItemGaveta key={oficina.id} dados={oficina} />
            ))}
        </ul>
    );
}

const elementoLista = document.getElementById('lista-oficinas');
const raizLista = ReactDOM.createRoot(elementoLista);
raizLista.render(<ListarOficinas />);

