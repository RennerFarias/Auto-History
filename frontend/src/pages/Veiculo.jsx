import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as veiculoService from '../services/veiculoService';
import * as manutencaoService from '../services/manutencaoService';
import gerarPDF from '../utils/gerarPdf';
import '../assets/css/veiculo.css';

export default function Veiculo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { estaLogado, carregando: carregandoAuth } = useAuth();

    const [veiculo, setVeiculo] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const formVazio = { tipo: '', quilometragem: '', oficina: '', data: '', custo: '', descricao: '' };
    const [form, setForm] = useState(formVazio);

    useEffect(() => {
        if (carregandoAuth) return;
        if (!estaLogado) {
            navigate("/dashboard");
            return;
        }
        carregarDados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, carregandoAuth, estaLogado]);

    async function carregarDados() {
        try {
            const [v, h] = await Promise.all([
                veiculoService.obterVeiculo(id),
                manutencaoService.listarManutencoes(id),
            ]);
            setVeiculo(v);
            setHistorico(h);
            document.title = `${v.modelo} - ${v.marca}`;
        } catch (err) {
            setErro(err.message);
        }
    }

    async function salvarManutencao(e) {
        e.preventDefault();
        try {
            await manutencaoService.criarManutencao(id, form);
            const h = await manutencaoService.listarManutencoes(id);
            setHistorico(h);
            setModalAberto(false);
            setForm(formVazio);
        } catch (err) {
            alert(err.message);
        }
    }

    async function deletarManutencao(manutencaoId) {
        if (!window.confirm("Deseja deletar esta manutenção?")) return;
        try {
            await manutencaoService.excluirManutencao(manutencaoId);
            setHistorico((atual) => atual.filter((m) => m._id !== manutencaoId));
        } catch (err) {
            alert(err.message);
        }
    }

    if (erro) {
        return (
            <div id="pagina-veiculo">
                <p style={{ textAlign: 'center', marginTop: '120px', color: '#e53935' }}>{erro}</p>
                <p style={{ textAlign: 'center' }}><Link to="/dashboard">← Voltar para Meus veículos</Link></p>
            </div>
        );
    }

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
                    {historico.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Nenhuma manutenção registrada</p>
                    ) : (
                        <div className="manutencoes-grid">
                            {historico.map((manutencao) => (
                                <div className="card-manutencao" key={manutencao._id}>
                                    <div className="manutencao-header">
                                        <h4>{manutencao.tipo}</h4>
                                        <span className="data-manutencao">{new Date(manutencao.data).toLocaleDateString("pt-BR")}</span>
                                    </div>
                                    <p className="manutencao-descricao">{manutencao.descricao}</p>
                                    {manutencao.quilometragem ? <p><strong>KM:</strong> {manutencao.quilometragem}</p> : null}
                                    {manutencao.oficina && <p><strong>Oficina:</strong> {manutencao.oficina}</p>}
                                    {manutencao.custo ? <p><strong>Custo:</strong> R$ {parseFloat(manutencao.custo).toFixed(2)}</p> : null}
                                    <button className="btn-deletar" onClick={() => deletarManutencao(manutencao._id)}>Deletar</button>
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
                            <textarea placeholder="Descreva a manutenção" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}></textarea>
                            <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                            <button type="submit" className="btn-salvar">Salvar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
