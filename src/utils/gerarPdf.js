import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function gerarPDF(veiculo) {
    if (!veiculo) {
        alert("Erro: nenhum veículo encontrado.");
        return;
    }

    try {
        const doc = new jsPDF();
        // Cole AQUI exatamente o mesmo código que estava dentro da sua função original gerarPDF.
        // A lógica do layout (cores, retângulos, text, autoTable) continua 100% igual!
        // ... (resto do seu código)
        
        const nomeArquivo = `prontuario_${(veiculo.placa || "veiculo").replace(/\s/g, "_").toLowerCase()}.pdf`;
        doc.save(nomeArquivo);

    } catch (erro) {
        console.error("Erro ao gerar PDF:", erro);
        alert("Erro ao gerar PDF: " + erro.message);
    }
}