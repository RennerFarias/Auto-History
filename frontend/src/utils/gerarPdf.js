import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function gerarPDF(veiculo) {
    if (!veiculo) {
        alert("Erro: nenhum veículo encontrado.");
        return;
    }

    try {
        const doc = new jsPDF();

        const W = doc.internal.pageSize.getWidth();

        
        const AZUL = [18, 52, 120];
        const AZUL_LIG = [235, 241, 255];
        const CINZA_ESC = [45, 45, 45];
        const CINZA = [120, 120, 120];
        const BRANCO = [255, 255, 255];
        const VERDE = [30, 140, 80];

        doc.setFillColor(...AZUL);
        doc.rect(0, 0, W, 42, "F");

        doc.setTextColor(...BRANCO);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Prontuário do Veículo", 14, 15);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString("pt-BR");
        const horaFormatada = agora.toLocaleTimeString("pt-BR");

        doc.text(`Gerado em ${dataFormatada} às ${horaFormatada}`, 14, 28);

        const score = veiculo.score !== undefined ? veiculo.score : 0;
        doc.text(
            `Score do proprietário: ${Number(score).toFixed(1)} / 5.0`,
            14,
            36
        );

        let y = 52;

        doc.setFillColor(...AZUL_LIG);
        doc.roundedRect(12, y, 186, 46, 3, 3, "F");

        doc.setTextColor(...CINZA_ESC);
        doc.setFont("helvetica", "bold");
        doc.text("Dados do veículo", 16, y + 8);

        doc.setFont("helvetica", "normal");

        const dados = [
            ["Placa", veiculo.placa || "—"],
            ["Modelo", veiculo.modelo || "—"],
            ["Marca", veiculo.marca || "—"],
            ["Ano", veiculo.ano || "—"],
            ["Cor", veiculo.cor || "—"],
            ["KM", veiculo.km ? `${Number(veiculo.km).toLocaleString("pt-BR")} km` : "—"]
        ];

        let linha = y + 16;

        dados.forEach(([titulo, valor]) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${titulo}:`, 16, linha);

            doc.setFont("helvetica", "normal");
            doc.text(String(valor), 42, linha);

            linha += 6;
        });

        y += 58;

        if (veiculo.historico?.length) {

            doc.autoTable({
                startY: y,
                head: [[
                    "Data",
                    "Tipo",
                    "Descrição",
                    "KM",
                    "Oficina",
                    "Verificado",
                    "Anexos"
                ]],
                body: veiculo.historico.map(h => [
                    h.data || "—",
                    h.tipo || "—",
                    h.descricao || "—",
                    h.km
                        ? `${Number(h.km).toLocaleString("pt-BR")} km`
                        : "—",
                    h.oficina || h.local || "—",
                    h.verificado ? "Sim" : "Não",
                    h.anexos || "—"
                ])
            });

        } else {

            doc.text("Nenhuma manutenção cadastrada.", 14, y);

        }

        const nomeArquivo =
            `prontuario_${(veiculo.placa || "veiculo")
                .replace(/\s/g, "_")
                .toLowerCase()}.pdf`;

        doc.save(nomeArquivo);

    } catch (erro) {
        console.error("Erro ao gerar PDF:", erro);
        alert("Erro ao gerar PDF: " + erro.message);
    }
}