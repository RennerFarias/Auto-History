function gerarPDF(veiculo) {
    if (!window.jspdf) {
        alert("Erro: biblioteca jsPDF não carregada. Verifique sua conexão com a internet.");
        return;
    }

    if (!veiculo) {
        alert("Erro: nenhum veículo encontrado.");
        return;
    }

    try {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const W = doc.internal.pageSize.getWidth();

    // ── Paleta 
    const AZUL      = [18, 52, 120];
    const AZUL_LIG  = [235, 241, 255];
    const CINZA_ESC = [45, 45, 45];
    const CINZA_MED = [110, 110, 110];
    const CINZA_LIG = [220, 220, 220];
    const BRANCO    = [255, 255, 255];
    const VERDE     = [30, 140, 80];

    // ── Cabeçalho azul 
    doc.setFillColor(...AZUL);
    doc.rect(0, 0, W, 42, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...BRANCO);
    doc.text("Prontuário do Veículo", 14, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR");
    doc.text(`Gerado em ${dataFormatada} às ${horaFormatada}`, 14, 28);

    const score = veiculo.score !== undefined ? veiculo.score : 0;
    doc.text(`Score do proprietário: ${Number(score).toFixed(1)} / 5.0`, 14, 36);

    // ── Bloco de dados do veículo 
    let y = 52;

    doc.setFillColor(...AZUL_LIG);
    doc.roundedRect(10, y, W - 20, 48, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...CINZA_ESC);
    doc.text(`${veiculo.modelo || "—"} ${veiculo.ano || ""}`, 16, y + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...CINZA_MED);

    const linha1 = [
        `Placa: ${veiculo.placa || "—"}`,
        `Ano: ${veiculo.ano || "—"}`,
        `Cor: ${veiculo.cor || "—"}`
    ].join("   •   ");

    const linha2 = [
        `Chassi: ${veiculo.chassi || "—"}`,
        `RENAVAM: ${veiculo.renavam || "—"}`,
        `KM: ${veiculo.km ? Number(veiculo.km).toLocaleString("pt-BR") : "—"}`
    ].join("   •   ");

    doc.text(linha1, 16, y + 22);
    doc.text(linha2, 16, y + 31);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...AZUL);
    const proprietarios = veiculo.proprietarios || 1;
    doc.text(`Proprietários: ${proprietarios}`, 16, y + 41);

    // ── Título da tabela 
    y += 62;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...CINZA_ESC);
    doc.text("Histórico de Manutenções", 14, y);

    doc.setDrawColor(...CINZA_LIG);
    doc.setLineWidth(0.4);
    doc.line(14, y + 3, W - 14, y + 3);

    y += 10;

    // ── Tabela 
    const historico = veiculo.historico || [];

    const linhas = historico.length > 0
        ? historico.map(h => [
            h.data        || "—",
            h.tipo        || "—",
            h.descricao   || "—",
            h.km          ? `${Number(h.km).toLocaleString("pt-BR")} km` : "—",
            h.oficina || h.local || "—",
            h.verificado  ? "Sim" : "Não",
            h.anexos      || "—"
          ])
        : [["—", "—", "Nenhum registro encontrado", "—", "—", "—", "—"]];

    doc.autoTable({
        startY: y,
        head: [["Data", "Tipo", "Descrição", "KM", "Oficina", "Verificado", "Anexos"]],
        body: linhas,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            textColor: CINZA_ESC,
            lineColor: CINZA_LIG,
            lineWidth: 0.3,
            overflow: "linebreak"
        },
        headStyles: {
            fillColor: AZUL,
            textColor: BRANCO,
            fontStyle: "bold",
            halign: "left"
        },
        alternateRowStyles: {
            fillColor: [248, 249, 255]
        },
        columnStyles: {
            0: { cellWidth: 22 },  // Data
            1: { cellWidth: 24 },  // Tipo
            2: { cellWidth: 50 },  // Descrição
            3: { cellWidth: 22 },  // KM
            4: { cellWidth: 28 },  // Oficina
            5: { cellWidth: 20 },  // Verificado
            6: { cellWidth: 20 }   // Anexos
        },
        didParseCell: (data) => {
            // Coluna "Verificado": verde se Sim
            if (data.section === "body" && data.column.index === 5) {
                if (data.cell.raw === "Sim") {
                    data.cell.styles.textColor = VERDE;
                    data.cell.styles.fontStyle = "bold";
                }
            }
        },
        margin: { left: 14, right: 14 }
    });

    // ── Rodapé 
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        const altPagina = doc.internal.pageSize.getHeight();
        doc.setFillColor(...CINZA_LIG);
        doc.rect(0, altPagina - 12, W, 12, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...CINZA_MED);
        doc.text("Auto History — Documento gerado automaticamente", 14, altPagina - 4.5);
        doc.text(`Página ${i} de ${totalPaginas}`, W - 14, altPagina - 4.5, { align: "right" });
    }

    // ── Salvar 
    const nomeArquivo = `prontuario_${(veiculo.placa || "veiculo").replace(/\s/g, "_").toLowerCase()}.pdf`;
    doc.save(nomeArquivo);

    } catch (erro) {
        console.error("Erro ao gerar PDF:", erro);
        alert("Erro ao gerar PDF: " + erro.message);
    }
}