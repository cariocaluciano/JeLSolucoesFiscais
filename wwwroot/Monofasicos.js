let MonoData = [];
let totalizadoresPorCfop = {};  // Novo objeto para armazenar totais por CFOP
let totalSaidas = 0;
let totalOutrasSaidas = 0;



function handleFilesSelected() {
  updateFileCount();
}

function handleDrop(event) {
  event.preventDefault();

  // Captura os arquivos do evento de drop e atribui ao input
  const fileInput = document.getElementById('xmlFile');
  fileInput.files = event.dataTransfer.files;

  updateFileCount();
}

function handleDragOver(event) {
  event.preventDefault();
}

async function updateFileCount() {

  const fileInput = document.getElementById('xmlFile');
  const fileCountText = document.getElementById('fileCount');

  const files = fileInput.files;
  if (files.length === 0) {
    fileCountText.textContent = 'Nenhum arquivo selecionado';
  } else if (files.length === 1) {
    fileCountText.textContent = `${files.length} Arquivo selecionado`;
  }
  else {
    fileCountText.textContent = `${files.length} Arquivos selecionados`;
  }

  // await processFiles(event);
}

async function updateFileCount2() {

  await processFiles(event);
}








async function fetchMonoData() {
  const response = await fetch("https://gist.githubusercontent.com/cariocaluciano/9e86aecc9603fc0fb3369f507aae2e69/raw/ec92e58b6170d1cba179ac3f022adca829ddbbef/NcmProdutos.json");
  MonoData = await response.json();
}

async function processFiles(event) {
  event.preventDefault();
  await fetchMonoData();
  const files = document.getElementById("xmlFile").files;
  if (!files.length) return alert("Selecione pelo menos um arquivo XML");

  let summary = {};
  let monofasicos = [];
  let totalizadores = { vendas: 0, vendasMono: 0, devolucao: 0, devolucaoMono: 0, devolucaoNaoMono: 0 };
  const devolucaoCfops = ["1201", "1202", "1410", "1411", "2201", "2202", "2410", "2411"];
  const cfopVendas = [5101, 5102, 5102, 5103, 5104, 5105, 5106, 5109, 5110, 5111, 5112, 5113, 5114, 5115, 5116, 5117, 5118, 5119, 5120, 5122, 5123,
    5124, 5125, 5129, 5401, 5402, 5403, 5405, 5651, 5652, 5653, 5654, 5655, 5656, 5667, 6101, 6102, 6102, 6103, 6104, 6105, 6106,
    6107, 6108, 6109, 6110, 6111, 6112, 6113, 6114, 6115, 6116, 6117, 6118, 6119, 6120, 6122, 6123, 6124, 6125, 6129, 6401, 6402,
    6403, 6404, 6651, 6652, 6653, 6654, 6655, 6656, 6667];


  // Inicializar totalizadores por CFOP
  totalizadoresPorCfop = {};
  totalSaidas = 0;
  totalOutrasSaidas = 0;

  for (let file of files) {
    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    document.getElementById("emitente").innerText = xmlDoc.querySelector("xNome")?.textContent + " - CNPJ " + xmlDoc.querySelector("CNPJ")?.textContent;

    xmlDoc.querySelectorAll("det").forEach(item => {
      const ncm = item.querySelector("NCM")?.textContent || "-";
      const cfop = item.querySelector("CFOP")?.textContent || "-";
      const valor = parseFloat(item.querySelector("vProd")?.textContent || "0");
      const descricao = item.querySelector("xProd")?.textContent || "-";
      const natOp = xmlDoc.querySelector("natOp")?.textContent || ""; // Buscando a tag natOp

      // Definir se é devolução
      const isDevolucao = devolucaoCfops.includes(cfop);// Verificando se é devolução
      const isVenda = cfopVendas.includes(cfop)

      const key = `${ncm}-${cfop}`;
      summary[key] = summary[key] || { NCM: ncm, CFOP: cfop, total: 0 };
      summary[key].total += valor;

      // Atualizando o totalizador por CFOP
      totalizadoresPorCfop[cfop] = totalizadoresPorCfop[cfop] || { total: 0, monofasico: 0, naoMonofasico: 0, devolucao: 0, devolucaoMono: 0, devolucaoNaoMono: 0 };
      totalizadoresPorCfop[cfop].total += valor;

      // Se for devolução, soma no totalizador de devoluções
      if (isDevolucao) {
        totalizadores.devolucao += valor;
        totalizadoresPorCfop[cfop].devolucao += valor;

        // Verificando se a devolução é monofásica
        if (MonoData.some(m => m.NCM.replace(/\./g, '') === ncm && m.MONOFASICO)) {
          totalizadores.devolucaoMono += valor;
          totalizadoresPorCfop[cfop].devolucaoMono += valor;
        } else {
          totalizadores.devolucaoNaoMono += valor;
          totalizadoresPorCfop[cfop].devolucaoNaoMono += valor;
        }
      } else {
        // Verificando se o item é monofásico
        if (MonoData.some(m => m.NCM.replace(/\./g, '') === ncm && m.MONOFASICO) && isVenda) {
          // Se for monofásico, adiciona no totalizador monofásico
          monofasicos.push({ descricao, NCM: ncm, CFOP: cfop, total: valor });
          totalizadoresPorCfop[cfop].monofasico += valor;
          totalizadores.vendasMono += valor;
        } else if (isVenda) {
          // Caso contrário, é não monofásico
          totalizadores.vendas += valor;
          totalizadoresPorCfop[cfop].naoMonofasico += valor;
        }
      }
      //if(["5", "6", "7"].some(prefix => cfop.startsWith(prefix)))
      // Atualizando os totais gerais
      if (!isDevolucao) {
        // if (cfop.startsWith("5")) {
        //     totalSaidas += valor;
        // } else {
        //     totalOutrasSaidas += valor;
        // }
      }
    });
  }

  // Exibindo os totalizadores na tela
  document.getElementById("cfopVendas").innerText = `R$ ${totalizadores.vendas.toFixed(2)}`;
  document.getElementById("cfopVendasMono").innerText = `R$ ${totalizadores.vendasMono.toFixed(2)}`;
  document.getElementById("cfopDevolucao").innerText = `R$ ${totalizadores.devolucao.toFixed(2)}`;
  document.getElementById("cfopDevolucaoMono").innerText = `R$ ${totalizadores.devolucaoMono.toFixed(2)}`;
  document.getElementById("cfopDevolucao").innerText = `R$ ${totalizadores.devolucaoNaoMono.toFixed(2)}`;

  // Atualizando os novos totalizadores
  document.getElementById("totalSaidas").innerText = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById("totalOutrasSaidas").innerText = `R$ ${totalOutrasSaidas.toFixed(2)}`;

  populateTables(summary, monofasicos);
  updateCfopTotalizadores();  // Atualizar o totalizador por CFOP
}

function updateCfopTotalizadores() {
  // Limpa os totalizadores por CFOP na tela antes de adicionar novos
  const cfopTotalizadoresDiv = document.getElementById("cfopTotalizadores");
  cfopTotalizadoresDiv.innerHTML = "";  // Limpa antes de adicionar

  // Atualizando os totalizadores por CFOP na tela
  Object.keys(totalizadoresPorCfop).forEach(cfop => {
    const { total, monofasico, naoMonofasico, devolucao, devolucaoMono, devolucaoNaoMono } = totalizadoresPorCfop[cfop];
    let cfopDiv = document.createElement("div");
    cfopDiv.classList.add("col-6");
    cfopDiv.innerHTML = `
            <div class="border p-3 mb-4 rounded shadow">
            <div class="row justify-content-center">

            <div class="mt-2"><strong>CFOP: ${cfop}</strong></div>
            <div><strong>Monofásico:</strong> R$ ${monofasico.toFixed(2)}</div>
            <div><strong>Não Monofásico:</strong> R$ ${naoMonofasico.toFixed(2)}</div>
            <div><strong>Devolução Monofásico:</strong> R$ ${devolucaoMono.toFixed(2)}</div>
            <div><strong>Devolução não Monofásico:</strong> R$ ${devolucaoNaoMono.toFixed(2)}</div>
            <div class="mb-2"><strong>TOTAL:</strong> R$ ${total.toFixed(2)}</div>
            </div>
            </div>

            `;
    cfopTotalizadoresDiv.appendChild(cfopDiv);
  });
}

function populateTables(summary, monofasicos) {
  const summaryTable = document.querySelector("#summaryTable tbody");
  summaryTable.innerHTML = "";
  Object.values(summary).forEach(({ NCM, CFOP, total }) => {
    summaryTable.innerHTML += `<tr><td>${NCM}</td><td>${CFOP}</td><td>R$ ${total.toFixed(2)}</td></tr>`;
  });

  const monoTable = document.querySelector("#monoTable tbody");
  monoTable.innerHTML = "";
  monofasicos.forEach(({ descricao, NCM, CFOP, total }) => {
    monoTable.innerHTML += `<tr><td>${descricao}</td><td>${NCM}</td><td>${CFOP}</td><td>R$ ${total.toFixed(2)}</td></tr>`;
  });
}

function baixarExcel() {
  let wb = XLSX.utils.book_new();
  let summaryTable = document.getElementById("summaryTable");
  let monoTable = document.getElementById("monoTable");

  let summarySheet = XLSX.utils.table_to_sheet(summaryTable);
  let monoSheet = XLSX.utils.table_to_sheet(monoTable);

  XLSX.utils.book_append_sheet(wb, summarySheet, "Resumo");
  XLSX.utils.book_append_sheet(wb, monoSheet, "Monofásico");

  XLSX.writeFile(wb, "relatorio.xlsx");
}

function gerarRelatorio() {
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}