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
    <button id="btn-registrar">+ Registrar Manutenção</button>
    <button id="btn-pdf">Gerar PDF</button>
`;

const btnRegistrar = document.getElementById("btn-registrar");
const btnPdf = document.getElementById("btn-pdf");

if (btnRegistrar) {
    btnRegistrar.addEventListener("click", abrirModal);
}

if (btnPdf) {
    btnPdf.addEventListener("click", () => gerarPDF(veiculo));
}

// Renderizar lista de manutenções
function renderizarManutencoes() {
    const listaDiv = document.getElementById("lista-manutencoes");
    
    if (veiculo.historico.length === 0) {
        listaDiv.innerHTML = "<p style='text-align: center; color: #999; margin-top: 20px;'>Nenhuma manutenção registrada</p>";
        return;
    }
    
    let html = "<h3>Histórico de Manutenções</h3>";
    html += "<div class='manutencoes-grid'>";
    
    veiculo.historico.forEach((manutencao, index) => {
        const dataFormatada = new Date(manutencao.data).toLocaleDateString("pt-BR");
        html += `
            <div class="card-manutencao">
                <div class="manutencao-header">
                    <h4>${manutencao.tipo}</h4>
                    <span class="data-manutencao">${dataFormatada}</span>
                </div>
                <p class="manutencao-descricao">${manutencao.descricao}</p>
                ${manutencao.quilometragem ? `<p><strong>Quilometragem:</strong> ${manutencao.quilometragem} km</p>` : ""}
                ${manutencao.oficina ? `<p><strong>Oficina:</strong> ${manutencao.oficina}</p>` : ""}
                ${manutencao.custo ? `<p><strong>Custo:</strong> R$ ${parseFloat(manutencao.custo).toFixed(2)}</p>` : ""}
                <button class="btn-deletar" onclick="deletarManutencao(${index})">Deletar</button>
            </div>
        `;
    });
    
    html += "</div>";
    listaDiv.innerHTML = html;
}

// Deletar manutenção
function deletarManutencao(index) {
    if (confirm("Deseja deletar esta manutenção?")) {
        veiculo.historico.splice(index, 1);
        localStorage.setItem(chave, JSON.stringify(veiculos));
        renderizarManutencoes();
    }
}

// Validar formulário
function validarFormulario() {
    const tipo = document.getElementById("tipo").value.trim();
    const quilometragem = document.getElementById("quilometragem").value.trim();
    const oficina = document.getElementById("oficina").value.trim();
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value.trim();
    
    const erros = [];
    
    if (!tipo) erros.push("Tipo de manutenção é obrigatório");
    if (!data) erros.push("Data é obrigatória");
    if (!descricao) erros.push("Descrição é obrigatória");
    
    if (quilometragem && isNaN(quilometragem)) {
        erros.push("Quilometragem deve ser um número válido");
    }
    
    if (erros.length > 0) {
        alert("Erros no formulário:\n" + erros.join("\n"));
        return false;
    }
    
    return true;
}

function abrirModal() {
    document.getElementById("modal").classList.remove("hidden");
    atualizarTooltips();
}

function fecharModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("form-manutencao").reset();
    atualizarTooltips();
}

function atualizarTooltips() {
    const inputs = document.querySelectorAll("#form-manutencao input, #form-manutencao textarea");
    inputs.forEach((input) => {
        if (input.placeholder) {
            input.setAttribute("title", input.placeholder);
        }
    });
}

// Eventos do modal
const modal = document.getElementById("modal");
const cancelarBtn = document.querySelector(".btn-cancelar");
const formManutencao = document.getElementById("form-manutencao");

if (cancelarBtn) {
    cancelarBtn.addEventListener("click", fecharModal);
}

// Fechar ao clicar fora do modal
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        fecharModal();
    }
});

// Salvar manutenção
if (formManutencao) {
    formManutencao.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }
        
        const novaManutencao = {
            tipo: document.getElementById("tipo").value.trim(),
            quilometragem: document.getElementById("quilometragem").value.trim(),
            oficina: document.getElementById("oficina").value.trim(),
            data: document.getElementById("data").value,
            descricao: document.getElementById("descricao").value.trim(),
            custo: document.getElementById("custo").value.trim() || null
        };
        
        veiculo.historico.push(novaManutencao);
        localStorage.setItem(chave, JSON.stringify(veiculos));
        
        alert("Manutenção registrada com sucesso!");
        fecharModal();
        renderizarManutencoes();
    });
}

// Renderizar manutenções ao carregar
renderizarManutencoes();
