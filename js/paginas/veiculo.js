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

function renderBotoes() {
    const botoes = document.getElementById("botoes");

    botoes.innerHTML = `
        <button id="btn-registrar">+ Registrar Manutenção</button>
        <button id="btn-pdf">Gerar PDF</button>
    `;

    // 🔥 AGORA O BOTÃO EXISTE
    const btnRegistrar = document.getElementById("btn-registrar");
    const btnPdf = document.getElementById("btn-pdf");

    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", abrirModal);
    }

    if (btnPdf) {
        btnPdf.addEventListener("click", () => {
            alert("PDF ainda não implementado");
        });
    }
}

function renderizar() {
    renderBotoes();
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
    abrirModal();
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

window.onload = function () {
    renderizar();
};


function abrirModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
    document.getElementById("modal").classList.add("hidden");
}

function salvarManutencao(event) {
    event.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const km = document.getElementById("km").value;
    const local = document.getElementById("local").value;
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;

    if (!tipo || !data) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    fecharModal();  

    document.getElementById("tipo").value = "";
    document.getElementById("km").value = "";
    document.getElementById("local").value = "";
    document.getElementById("data").value = "";
    document.getElementById("descricao").value = "";
}

window.remover = remover;
window.salvarManutencao = salvarManutencao;
window.fecharModal = fecharModal;