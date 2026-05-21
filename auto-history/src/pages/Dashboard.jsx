import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gerarPDF from '../utils/gerarPdf';
import logoEntrar from '../assets/img/logoEntrar.png';
import '../assets/css/dashboard.css';

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const veioDoLogin = searchParams.get("login");
    const usuarioSalvo = localStorage.getItem("usuario");

    const [logado, setLogado] = useState(!!usuarioSalvo && !veioDoLogin);

    return (
        <div className="dashboard-page">
            {logado ? (
                <TelaUsuario onLogout={() => setLogado(false)} />
            ) : (
                <TelaLogin onLogin={() => setLogado(true)} />
            )}
        </div>
    );
}

function TelaLogin({ onLogin }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [modoCadastro, setModoCadastro] = useState(false);

    function handleLogin() {
        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioEncontrado = usuarios.find(
            u => u.email === email.trim() && u.senha === senha.trim()
        );

        if (!usuarioEncontrado) {
            alert("Email ou senha incorretos");
            return;
        }

        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
        onLogin();
    }

    function handleCadastro() {
        if (!nome || !email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const existe = usuarios.find(u => u.email === email.trim());

        if (existe) {
            alert("Usuário já cadastrado!");
            return;
        }

        const novoUsuario = {
            nome: nome.trim(),
            email: email.trim(),
            senha: senha.trim()
        };

        usuarios.push(novoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Cadastro realizado!");

        setNome("");
        setEmail("");
        setSenha("");
        setModoCadastro(false);
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>
                    <img src={logoEntrar} alt="Logo Auto History" />
                    {modoCadastro ? "Cadastro" : "Entrar"}
                </h1>

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
                    <button className="btn-principal" onClick={handleCadastro}>Cadastrar</button>
                ) : (
                    <button className="btn-principal" onClick={handleLogin}>Entrar</button>
                )}

                <button className="btn-secundario" onClick={() => setModoCadastro(!modoCadastro)}>
                    {modoCadastro ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se"}
                </button>
            </div>
        </div>
    );
}

function TelaUsuario({ onLogout }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return <p style={{ marginTop: '120px', textAlign: 'center' }}>A carregar...</p>;

    const chaveVeiculos = `veiculos_${usuario.email}`;
    const [veiculos, setVeiculos] = useState(JSON.parse(localStorage.getItem(chaveVeiculos)) || []);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editandoIndex, setEditandoIndex] = useState(null);

    const [form, setForm] = useState({
        placa: "", modelo: "", marca: "", cor: "", ano: "", chassi: "", km: "", renavam: ""
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function salvarVeiculo() {
        if (!form.placa || !form.modelo || !form.marca) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        let listaAtualizada;
        if (editandoIndex !== null) {
            listaAtualizada = veiculos.map((v, i) =>
                i === editandoIndex ? { ...form, historico: v.historico || [] } : v
            );
        } else {
            listaAtualizada = [...veiculos, { ...form, historico: [] }];
        }

        setVeiculos(listaAtualizada);
        localStorage.setItem(chaveVeiculos, JSON.stringify(listaAtualizada));

        setForm({ placa: "", modelo: "", marca: "", cor: "", ano: "", chassi: "", km: "", renavam: "" });
        setMostrarForm(false);
        setEditandoIndex(null);
    }

    function editarVeiculo(index) {
        setForm(veiculos[index]);
        setMostrarForm(true);
        setEditandoIndex(index);
    }

    function excluirVeiculo(index) {
        if (!confirm("Tem certeza que deseja excluir este veículo?")) return;
        const novaLista = veiculos.filter((_, i) => i !== index);
        setVeiculos(novaLista);
        localStorage.setItem(chaveVeiculos, JSON.stringify(novaLista));
    }

    return (
        <div className="dashboard">
            <div className="topo">
                <h1>Olá, {usuario.nome || usuario.email} 👋</h1>
                <button className="btn-sair" onClick={() => { localStorage.removeItem("usuario"); onLogout(); }}>Sair</button>
            </div>

            <button className="btn-principal" onClick={() => { setMostrarForm(!mostrarForm); setEditandoIndex(null); }}>
                + Cadastrar Veículo
            </button>

            {mostrarForm && (
                <div className="card form-veiculo">
                    <h3>{editandoIndex !== null ? "Editar Veículo" : "Novo Veículo"}</h3>
                    <input name="placa" placeholder="Placa *" value={form.placa} onChange={handleChange} />
                    <input name="modelo" placeholder="Modelo *" value={form.modelo} onChange={handleChange} />
                    <input name="marca" placeholder="Marca *" value={form.marca} onChange={handleChange} />
                    <input name="cor" placeholder="Cor" value={form.cor} onChange={handleChange} />
                    <input name="ano" placeholder="Ano" value={form.ano} onChange={handleChange} />
                    <input name="chassi" placeholder="Chassi" value={form.chassi} onChange={handleChange} />
                    <input name="km" placeholder="Quilometragem" value={form.km} onChange={handleChange} />
                    <input name="renavam" placeholder="Renavam" value={form.renavam} onChange={handleChange} />

                    <div className="acoes-form">
                        <button className="btn-principal" onClick={salvarVeiculo}>
                            {editandoIndex !== null ? "Salvar Alterações" : "Salvar"}
                        </button>
                        <button className="btn-secundario" onClick={() => { setMostrarForm(false); setEditandoIndex(null); }}>Cancelar</button>
                    </div>
                </div>
            )}

            <div className="cards" style={{ marginTop: "30px" }}>
                {veiculos.length === 0 ? (
                    <p>Nenhum veículo cadastrado</p>
                ) : (
                    veiculos.map((v, index) => (
                        <div className="card" key={index}>
                            <Link to={`/veiculo/${index}`}>
                                <h3>{v.modelo} - {v.marca}</h3>
                                <p><strong>Placa:</strong> {v.placa}</p>
                                <p><strong>Cor:</strong> {v.cor}</p>
                                <p><strong>Ano:</strong> {v.ano}</p>
                                <p><strong>KM:</strong> {v.km}</p>
                            </Link>

                            <div className="acoes-card">
                                <button className="btn-editar" onClick={() => editarVeiculo(index)}>Editar</button>
                                <button className="btn-excluir" onClick={() => excluirVeiculo(index)}>Excluir</button>
                                <button className="btn-pdf" onClick={() => gerarPDF(v)}>PDF</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}