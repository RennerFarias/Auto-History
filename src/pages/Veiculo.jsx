import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gerarPDF from '../utils/gerarPdf';
import '../assets/css/veiculo.css';

export default function Veiculo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [veiculo, setVeiculo] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [form, setForm] = useState({ tipo: '', quilometragem: '', oficina: '', data: '', custo: '', descricao: '' });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return navigate("/dashboard");

        const chave = `veiculos_${usuario.email}`;
        const veiculos = JSON.parse(localStorage.getItem(chave)) || [];
        const v = veiculos[Number(id)];

        if (!v) {
            alert("Veículo não encontrado");
            return navigate("/dashboard");
        }

        if (!v.historico) v.historico = [];
        setVeiculo(v);
        document.title = `${v.modelo} - ${v.marca}`;
    }, [id, navigate]);

    const salvarManutencao = (e) => {
        e.preventDefault();
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const chave = `veiculos_${usuario.email}`;
        const veiculos = JSON.parse(localStorage.getItem(chave)) || [];
        
        veiculo.historico.push(form);
        veiculos[Number(id)] = veiculo;
        
        localStorage.setItem(chave, JSON.stringify(veiculos));
        setVeiculo({ ...veiculo }); // Força re-render
        setModalAberto(false);
        setForm({ tipo: '', quilometragem: '', oficina: '', data: '', custo: '', descricao: '' });
        alert("Manutenção registrada!");
    };

    const deletarManutencao = (index) => {
        if (window.confirm("Deseja deletar esta manutenção?")) {
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            const chave = `veiculos_${usuario.email}`;
            const veiculos = JSON.parse(localStorage.getItem(chave)) || [];
            
            veiculo.historico.splice(index, 1);
            veiculos[Number(id)] = veiculo;
            
            localStorage.setItem(chave, JSON.stringify(veiculos));
            setVeiculo({ ...veiculo });
        }
    };

    if (!veiculo) return <div id="pagina-veiculo">Carregando...</div>;

    return (
        <div id="pagina-veiculo">
            <div id="geral">
                <div id="container-1">
                    <button><Link className="retornar_veiculos" to="/dashboard">← Meus veículos</Link></button>
                </div>
                
                <div id="detalhes-veiculo">
                    <h2>{veiculo.modelo} {veiculo.marca}</h2>
                    <p>{veiculo.ano} • {veiculo.cor} • {veiculo.km} km</p>
                    <p><strong>Placa:</strong> {veiculo.placa}</p>
                    <p><strong>Chassi:</strong> {veiculo.chassi}</p>
                    <p><strong>Renavam:</strong> {veiculo.renavam}</p>
                </div>

                <div id="botoes">
                    <button onClick={() => setModalAberto(true)}>+ Registrar Manutenção</button>
                    <button onClick={() => gerarPDF(veiculo)}>Gerar PDF</button>
                </div>

                <div id="lista-manutencoes">
                    <h3>Histórico de Manutenções</h3>
                    {veiculo.historico.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Nenhuma manutenção registrada</p>
                    ) : (
                        <div className="manutencoes-grid">
                            {veiculo.historico.map((manutencao, index) => (
                                <div className="card-manutencao" key={index}>
                                    <div className="manutencao-header">
                                        <h4>{manutencao.tipo}</h4>
                                        <span className="data-manutencao">{new Date(manutencao.data).toLocaleDateString("pt-BR")}</span>
                                    </div>
                                    <p className="manutencao-descricao">{manutencao.descricao}</p>
                                    {manutencao.quilometragem && <p><strong>KM:</strong> {manutencao.quilometragem}</p>}
                                    {manutencao.oficina && <p><strong>Oficina:</strong> {manutencao.oficina}</p>}
                                    {manutencao.custo && <p><strong>Custo:</strong> R$ {parseFloat(manutencao.custo).toFixed(2)}</p>}
                                    <button className="btn-deletar" onClick={() => deletarManutencao(index)}>Deletar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {modalAberto && (
                <div className="modal">
                    <div className="modal-conteudo">
                        <h2 className="titulo-modal">Nova Manutenção</h2>
                        <form id="form-manutencao" onSubmit={salvarManutencao}>
                            <input type="text" placeholder="Tipo de Manutenção" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} required />
                            <input type="number" placeholder="Quilometragem" value={form.quilometragem} onChange={e => setForm({...form, quilometragem: e.target.value})} required />
                            <input type="text" placeholder="Oficina" value={form.oficina} onChange={e => setForm({...form, oficina: e.target.value})} required />
                            <input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} required />
                            <input type="number" placeholder="Custo (opcional)" step="0.01" value={form.custo} onChange={e => setForm({...form, custo: e.target.value})} />
                            <textarea placeholder="Descreva a manutenção" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} required></textarea>
                            <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                            <button type="submit" className="btn-salvar">Salvar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}