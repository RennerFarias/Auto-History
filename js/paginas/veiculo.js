const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "dashboard.html";
}

const chave = `veiculos_${usuario.email}`;
const veiculos = JSON.parse(localStorage.getItem(chave)) || [];

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const veiculo = veiculos[id];

if (!veiculo) {
    alert("Veículo não encontrado");
    window.location.href = "dashboard.html";
}

if (!veiculo.historico) {
    veiculo.historico = [];
}

document.title = `${veiculo.modelo} - ${veiculo.marca}`;

const detalhes = document.getElementById("detalhes-veiculo");

detalhes.innerHTML = `
    <h2>${veiculo.modelo} ${veiculo.marca}</h2>
    <p>${veiculo.ano} • ${veiculo.cor} • ${veiculo.km} km</p>

    <p><strong>Placa:</strong> ${veiculo.placa}</p>
    <p><strong>Chassi:</strong> ${veiculo.chassi}</p>
    <p><strong>Renavam:</strong> ${veiculo.renavam}</p>
`;

const botoes = document.getElementById("botoes");

botoes.innerHTML = `
    <button onclick="registrar()">+ Registrar Manutenção</button>
    <button>Gerar PDF</button>
`;

function renderizar() {
    const lista = document.getElementById("lista-manutencoes");

    lista.innerHTML = "<h3>Histórico de Manutenções</h3>";

    if (veiculo.historico.length === 0) {
        lista.innerHTML += "<p>Nenhuma manutenção registrada</p>";
        return;
    }

    veiculo.historico.forEach(item => {
        lista.innerHTML += `
            <div class="card">
                <strong>${item.descricao}</strong>
                <p>${item.data} • ${item.km} km • ${item.local}</p>
                <button onclick="remover(${item.id})">Remover</button>
            </div>
        `;
    });
}

function registrar() {
    const descricao = prompt("Descrição da manutenção:");
    const data = prompt("Data:");
    const km = prompt("KM:");
    const local = prompt("Local:");

    if (!descricao || !data) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    const nova = {
        id: Date.now(),
        descricao,
        data,
        km,
        local
    };

    veiculo.historico.push(nova);

    salvar();
    renderizar();
}

function remover(idManutencao) {
    veiculo.historico = veiculo.historico.filter(
        m => m.id !== idManutencao
    );

    salvar();
    renderizar();
}

function salvar() {
    veiculos[id] = veiculo;

    localStorage.setItem(chave, JSON.stringify(veiculos));
}

renderizar();

function voltar() {
    if (document.referrer.includes("dashboard")) {
        history.back();
    } else {
        window.location.href = "dashboard.html";
    }
}