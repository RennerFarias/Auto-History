import { useState, useEffect } from 'react';
import * as oficinaService from '../services/oficinaService';
import '../assets/css/oficinasStyle.css';

function ItemGaveta({ dados }) {
    const [aberta, setAberta] = useState(false);

    return (
        <li>
            <div className="gaveta">
                <button className="gaveta-botao" onClick={() => setAberta(!aberta)}>
                    <span className="gaveta-titulo">{dados.nome}</span>
                    <span className="gaveta-descricao">{dados.descricao}</span>
                </button>

                <div className={`gaveta-conteudo ${aberta ? 'ativo' : ''}`}>
                    <p><strong>Localização:</strong> {dados.localizacao}</p>
                    <p><strong>Contato:</strong> {dados.contato}</p>
                    <p><strong>Horário de atendimento:</strong> {dados.horario}</p>
                    <p><strong>Serviços oferecidos:</strong> {dados.servicos}</p>
                </div>
            </div>
        </li>
    );
}

export default function Oficinas() {
    const [oficinas, setOficinas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        oficinaService
            .listarOficinas()
            .then(setOficinas)
            .catch((err) => setErro(err.message))
            .finally(() => setCarregando(false));
    }, []);

    return (
        <div className="cont-principal">
            <div className="inicio">
                <h1>Oficinas parceiras</h1>
                <p>Oferecemos uma rede de oficinas confiáveis e qualificadas para cuidar do seu carro. Encontre a oficina mais próxima de você e agende seu serviço com facilidade.</p>
            </div>

            {carregando && <p style={{ textAlign: 'center' }}>Carregando oficinas...</p>}
            {erro && <p style={{ textAlign: 'center', color: '#e53935' }}>{erro}</p>}

            <ul className="listagem">
                {oficinas.map((oficina) => (
                    <ItemGaveta key={oficina._id} dados={oficina} />
                ))}
            </ul>
        </div>
    );
}
