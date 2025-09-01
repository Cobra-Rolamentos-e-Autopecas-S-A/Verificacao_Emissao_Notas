/**
 * 
 * @param {any} valor Valor que pode ser Date, string ou vazio
 * @returns {Date|null} Data válida ou null se não conseguir converter
 */
// Função principal que verifica notas atrasadas na planilha "Contratos 2025"
function atrasosNF() { 

    // fafadfrszfdsfs

 // Executa apenas se for Segunda (1), Quarta (3) ou Sexta (5)

  const hoje = new Date();
  const diaDaSemana = hoje.getDay(); // pega o dia atual, indice (0 , 1 .....)
  if (![1, 3, 5].includes(diaDaSemana)) { 
    Logger.log("🚫 Script não executado hoje (fora dos dias permitidos).");
    return;
  } 

  // CONFIGURAÇÕES INICIAIS
  const NOME_DA_PLANILHA = "Contratos 2025";                                                           // Nome da aba da planilha
  const COLUNA_EMISSAO = 59;                                                                           // Coluna emissão do mês atual - Coluna BG -Variavel
  const COLUNA_NOTA = 58;                                                                              // Coluna nota do mês atual - Coluna BF - Variavel 
  const COLUNA_FORNECEDOR = 4;                                                                         // Coluna D - Num Fornecedor
  const COLUNA_NOME = 6;                                                                               // Coluna G - Nome da empresa
  const COLUNA_CONTATO = 5;                                                                            // Coluna F - Contanto da empresa 
  const COLUNA_SERVICO = 7;                                                                            // Coluna H - Serviço 
  const DESTINATARIOS = [                                                                              // E-mails que receberam o aviso 
  "cpagar.ti@cobrarolamentos.com.br",
  "dauernetto@cobrarolamentos.com.br"
  ];
  const ASSUNTO_EMAIL = " Pendência: Emissão de Notas Fiscais em atraso ⚠️";                            // Titulo do e-mail

  //  ABRINDO A PLANILHA
  const planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_DA_PLANILHA);               // acha a planilha e acessa
  if (!planilha) {
    Logger.log("❌ Planilha não encontrada.");                                                          // log se n achar a planilha
    return;
  }

  // CONFIGURAÇÃO DE INTERVALO DE VERIFICAÇÃO
  const ultimaLinha = 40;                                                                              // Altere conforme a quantidade de registros atual 
  const diaAtual = hoje.getDate();                                                                     // Dia  
  const mesPassado = hoje.getMonth();                                                                   // Mês (inidice)       
  

  let alertas = [];                                                                                     // Linhas que devem ir para o e-mail

  //  LOOP PELAS LINHAS DA PLANILHA
  for (let i = 3; i <= ultimaLinha; i++) {
    const dataEmissao = planilha.getRange(i, COLUNA_EMISSAO).getValue();                                //  Data de emissão na coluna BG - VARIAVEL (MÊS ATUAL)
    const notas = planilha.getRange(i, COLUNA_NOTA).getValue();                                         // Nota na coluna BF - VARIAVEL (MÊS ATUAL)
    const fornecedor = planilha.getRange(i, COLUNA_FORNECEDOR).getValue();                              // Fornecedor na coluna D  - FIXO
    const contato = planilha.getRange(i , COLUNA_CONTATO).getValue();                                   // Contato na coluna F - FIXO
    const nome = planilha.getRange(i, COLUNA_NOME).getValue();                                          // Nome na coluna G - FIXO
    const servico = planilha.getRange(i, COLUNA_SERVICO).getValue();                                    // Serviço da coluna H - FIXO

    const dataRef = tentarConverterParaData(dataEmissao); 
    if (!dataRef) continue;                                                                             // Conversão segura de data
    const diaData = dataRef.getDate();                                                                   // Converte a data referencia 

    

    //  CASO A DATA DE EMISSÃO TENHA DIA MENOR QUE O DIA ATUAL → PINTA DE AMARELO
    

      if (diaData < diaAtual && (!notas || notas === "")) {
        planilha.getRange(i, COLUNA_NOTA).setBackground("#FFEB3B");               
        alertas.push({
          linha: i,
          nome: nome || "(sem nome)",
          servico: servico || "(sem nome)",
          fornecedor: fornecedor || "(sem fornecedor)",
          data: Utilities.formatDate(dataRef, SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), "dd/MM/yyyy")
        });
      }

    //   const limite = diaData + 3;

    // FUTURO ENVIO DE E-MAIL PARA EMPRESAS CONTRATADAS  ****

  //     if (diaAtual > dataEmissao && notas === "" && contato && contato.includes("@")) {
  //    const dataFormatada = Utilities.formatDate(dataRef, SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), "dd/MM/yyyy");

  //     GmailApp.sendEmail(
  //     contato,
  //     "Pedencia no envio de nota Fiscal ⚠️",
  //     "",
  //     {
  //       htmlBody: `
  //         <p>Olá, <b>${nome}</b></p>

  //         <p>Conforme o nosso controle interno, até o momento não identificamos a emissão da nota fiscal prevista para o dia  <b>${dataFormatada}</b>.</p>
  //         <p>Solicitamos, por gentileza, que verifique esta pendência e realize o envio ou reenvio da nota fiscal.</p>
  //         <p>Esta cobrança refere-se à prestação de serviços ou fornecimento realizados para a empresa <b>Cobra Rolamentos S/A</b>, inscrita no CNPJ: <b>58.248.352/0001-40</b>.</p>
  //         <p>Desde já agradeçemos.</p>
  //         <p>Atenciosamente,<br><b>Sistema de Monitoramento</b></p>`
  //     }
  //   );

  //   Logger.log(`📩 E-mail enviado para o contato da linha ${i}: ${contato}`);
  // }

     // ****

  }



  //  ENVIO DE E-MAIL COM ALERTAS
  if (alertas.length > 0) {
    let html = `
      <p>Olá,</p>
      <p>Identificamos notas fiscais com atraso na emissão na planilha <b>${NOME_DA_PLANILHA}</b>.</p>
      <p>Segue abaixo o resumo:</p>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;">
        <thead style="background-color:#000000; color:#FFFFFF;">
          <tr>
            <th> Linha </th>
            <th> Empresa </th>
            <th> Descrição do produto </th>
            <th> Fornecedor </th>
            <th> Data esperada de emissão </th>
          </tr>
        </thead>
        <tbody>`;

    // Adiciona as linhas no HTML
    alertas.forEach(item => {
      html += `
        <tr>
          <td><b>${item.linha}</b></td>
          <td><b>${item.nome}</b></td>
          <td><b>${item.servico}</b></td>
          <td><b>${item.fornecedor}</b></td>
          <td><b>${item.data}</b></td>
        </tr>`;
    });

    html += `
        </tbody>
      </table>
      <p><br>Por favor, verifique e atualize a planilha.</p>
      <p>Atenciosamente,<br><b>Sistema de Monitoramento</b></p>`;

    // Envia o e-mail com corpo HTML
    GmailApp.sendEmail(DESTINATARIOS.join(","), ASSUNTO_EMAIL, "", {
      htmlBody: html
    });

    Logger.log("✅ E-mail com tabela enviado para " + DESTINATARIOS.join(", "));
  } else  {
    const mensagemOk = `
      <p>Bom Dia ! </p>
      <p>Todas as emissões de notas fiscais estão em dia até o momento </p>
      <p>Planilha: ${NOME_DA_PLANILHA}</p>
      <p>Atenciosamente,<br><b>Sistema de Monitoramento</b></p>`;

    GmailApp.sendEmail(DESTINATARIOS.join(","), " Relatório: Nenhuma pendência de emissão de nota fiscal ✅ ", "", {
      htmlBody: mensagemOk
    });

    Logger.log("✅ Todas as emissões estão em dia. E-mail de confirmação enviado.");

  }
}

/**
 * Tenta converter um valor em um objeto Date válido.
 * @param {any} valor Valor que pode ser Date, string ou vazio
 * @returns {Date|null} Data válida ou null se não conseguir converter
 */
// Função para tentar converter um valor em uma data real com segurança
function tentarConverterParaData(valor) {
    if (!valor) return null; // Se o valor for nulo ou indefinido, retorna null

  // Se já for um objeto Date, verifica se é válido
  if (valor instanceof Date && !isNaN(valor.getTime())) return valor;
  // Se já for uma data válida, retorna como está
  if (Object.prototype.toString.call(valor) === "[object Date]" && !isNaN(valor)) return valor;

  // Se for uma string no formato dd/mm/yyyy → tenta converter
  if (typeof valor === "string") {
    const partes = valor.split("/");
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;                                                                                // JavaScript usa índice 0 para meses
      const ano = parseInt(partes[2], 10);
      const data = new Date(ano, mes, dia);
      if (!isNaN(data.getTime())) return data;
    }
  }

  return null;
}
