import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as veiculoService from '../services/veiculoService';
import gerarPDF from '../utils/gerarPdf';
import logoEntrar from '../assets/img/logoEntrar.png';
import '../assets/css/dashboard.css';

export default function Dashboard() {
    const { estaLogado, carregando, sair } = useAuth();

    if (carregando) {
        return <p style={{ marginTop: '120px', textAlign: 'center' }}>Carregando...</p>;
    }

    return (
        <div className="dashboard-page">
            {estaLogado ? <TelaUsuario onLogout={sair} /> : <TelaLogin />}
        </div>
    );
}

function TelaLogin() {
    const { entrar, cadastrar } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [modoCadastro, setModoCadastro] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleLogin() {
        setErro("");
        if (!email || !senha) {
            setErro("Preencha todos os campos!");
            return;
        }

        try {
            setCarregando(true);
            await entrar({ email, senha });
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    async function handleCadastro() {
        setErro("");
        if (!nome || !email || !senha) {
            setErro("Preencha todos os campos!");
            return;
        }
        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            setCarregando(true);
            await cadastrar({ nome, email, senha });
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>
                    <img src={logoEntrar} alt="Logo Auto History" />
                    {modoCadastro ? "Cadastro" : "Entrar"}
                </h1>

                {erro && <p style={{ color: '#e53935', fontSize: '14px' }}>{erro}</p>}

                {modoCadastro && (
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {modoCadastro ? (
                    <button className="btn-principal" onClick={handleCadastro} disabled={carregando}>
                        {carregando ? "Enviando..." : "Cadastrar"}
                    </button>
                ) : (
                    <button className="btn-principal" onClick={handleLogin} disabled={carregando}>
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                )}

                <button className="btn-secundario" onClick={() => { setModoCadastro(!modoCadastro); setErro(""); }}>
                    {modoCadastro ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se"}
                </button>
            </div>
        </div>
    );
}

function TelaUsuario({ onLogout }) {
    const { usuario } = useAuth();

    const [veiculos, setVeiculos] = useState([]);
    const [carregandoLista, setCarregandoLista] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [erro, setErro] = useState("");

    const formVazio = { placa: "", modelo: "", marca: "", cor: "", ano: "", chassi: "", km: "", renavam: "" };
    const [form, setForm] = useState(formVazio);

    useEffect(() => {
        carregarVeiculos();
    }, []);

    async function carregarVeiculos() {
        try {
            setCarregandoLista(true);
            const lista = await veiculoService.listarVeiculos();
            setVeiculos(lista);
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregandoLista(false);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function salvarVeiculo() {
        setErro("");
        if (!form.placa || !form.modelo || !form.marca) {
            setErro("Preencha os campos obrigatórios!");
            return;
        }

        try {
            if (editandoId) {
                await veiculoService.atualizarVeiculo(editandoId, form);
            } else {
                await veiculoService.criarVeiculo(form);
            }
            await carregarVeiculos();
            setForm(formVazio);
            setMostrarForm(false);
            setEditandoId(null);
        } catch (err) {
            setErro(err.message);
        }
    }

    function editarVeiculo(veiculo) {
        setForm({
            placa: veiculo.placa || "",
            modelo: veiculo.modelo || "",
            marca: veiculo.marca || "",
            cor: veiculo.cor || "",
            ano: veiculo.ano || "",
            chassi: veiculo.chassi || "",
            km: veiculo.km || "",
            renavam: veiculo.renavam || "",
        });
        setMostrarForm(true);
        setEditandoId(veiculo._id);
    }

    async function excluirVeiculo(id) {
        if (!confirm("Tem certeza que deseja excluir este veículo? O histórico de manutenções também será apagado.")) return;
        try {
            await veiculoService.excluirVeiculo(id);
            await carregarVeiculos();
        } catch (err) {
            setErro(err.message);
        }
    }

    return (
        <div className="dashboard">
            <div className="topo">
                <h1>Olá, {usuario.nome || usuario.email} 👋</h1>
                <button className="btn-sair" onClick={onLogout}>Sair</button>
            </div>

            {erro && <p style={{ color: '#e53935' }}>{erro}</p>}

            <button className="btn-principal" onClick={() => { setMostrarForm(!mostrarForm); setEditandoId(null); setForm(formVazio); }}>
                + Cadastrar Veículo
            </button>

            {mostrarForm && (
                <div className="card form-veiculo">
                    <h3>{editandoId ? "Editar Veículo" : "Novo Veículo"}</h3>
                    <input name="placa" placeholder="Placa *" value={form.placa} onChange={handleChange} />
                    <input name="modelo" placeholder="Modelo *" value={form.modelo} onChange={handleChange} />
                    <input name="marca" placeholder="Marca *" value={form.marca} onChange={handleChange} />
                    <input name="cor" placeholder="Cor" value={form.cor} onChange={handleChange} />
                    <input name="ano" placeholder="Ano" type="number" value={form.ano} onChange={handleChange} />
                    <input name="chassi" placeholder="Chassi" value={form.chassi} onChange={handleChange} />
                    <input name="km" placeholder="Quilometragem" type="number" value={form.km} onChange={handleChange} />
                    <input name="renavam" placeholder="Renavam" value={form.renavam} onChange={handleChange} />

                    <div className="acoes-form">
                        <button className="btn-principal" onClick={salvarVeiculo}>
                            {editandoId ? "Salvar Alterações" : "Salvar"}
                        </button>
                        <button className="btn-secundario" onClick={() => { setMostrarForm(false); setEditandoId(null); }}>Cancelar</button>
                    </div>
                </div>
            )}

            <div className="cards" style={{ marginTop: "30px" }}>
                {carregandoLista ? (
                    <p>Carregando veículos...</p>
                ) : veiculos.length === 0 ? (
                    <p>Nenhum veículo cadastrado</p>
                ) : (
                    veiculos.map((v) => (
                        <div className="card" key={v._id}>
                            <Link to={`/veiculo/${v._id}`}>
                                <h3>{v.modelo} - {v.marca}</h3>
                                <p><strong>Placa:</strong> {v.placa}</p>
                                <p><strong>Cor:</strong> {v.cor}</p>
                                <p><strong>Ano:</strong> {v.ano}</p>
                                <p><strong>KM:</strong> {v.km}</p>
                            </Link>

                            <div className="acoes-card">
                                <button className="btn-editar" onClick={() => editarVeiculo(v)}>Editar</button>
                                <button className="btn-excluir" onClick={() => excluirVeiculo(v._id)}>Excluir</button>
                                <button className="btn-pdf" onClick={() => gerarPDF(v)}>PDF</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
