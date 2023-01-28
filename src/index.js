import xlsx from "node-xlsx";
import puppeteer from "puppeteer";

const planilha = xlsx.parse("./planilha.xlsx")[0].data;
planilha.shift();

const planilhaFormatada = planilha.map(([nome, status, numero]) => {
  return { nome, status, numero };
});

const opcoes = [
  {
    tipo: "Chegou lead",
    mensagem:
      "Opa [NOME], tudo certo? sou o Daniel, especialista da plataforma CERA, vi que você se registrou ali com a gente. Conseguiu entrar nela? Tá conseguindo usar o sistema?",
  },
  {
    tipo: "Fez primeiro contato",
    mensagem: "",
  },
  {
    tipo: "+2d follow",
    mensagem:
      "Oi [NOME], como foram esses dias com a plataforma? Sente que é o que tão precisando?",
  },
  {
    tipo: "Negociação",
    mensagem: "Opa, tudo certo [NOME]? E aí, a plataforma vai servir pra você?",
  },
];

const opcao = 1;

const planilhaFiltrada = planilhaFormatada
  .filter(({ status }) => status === opcoes[opcao - 1].tipo)
  .map(({ nome, numero }) => {
    return {
      nome: nome.split(" ")[0],
      numero,
    };
  });

console.log(planilhaFiltrada);

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function abrirNavegador() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    `https://web.whatsapp.com/send?phone=${
      planilhaFiltrada[0].numero
    }&text=${opcoes[opcao - 1].mensagem.replace(
      "[NOME]",
      planilhaFiltrada[0].nome
    )}`
  );
  await delay(15000);

  console.log("Conectado com sucesso!");

  await page.click("span[data-testid='send']");

  await delay(5000);

  for (let i = 1; i < planilhaFiltrada.length; i++) {
    await page.goto(
      `https://web.whatsapp.com/send?phone=${
        planilhaFiltrada[i].numero
      }&text=${opcoes[opcao - 1].mensagem.replace(
        "[NOME]",
        planilhaFiltrada[i].nome
      )}`
    );
    await delay(5000);
    await page.click("span[data-testid='send']");
    await delay(5000);
  }
  console.log("Finalizado com sucesso");
}
abrirNavegador();

// planilhaFormatada.forEach(async ({ nome, status, numero }) => {
//   // console.log(opcoes[opcao - 1]);
//   if (status === opcoes[opcao - 1]) {
//     console.log(
//       `Enviando mensagem para ${nome.split(" ")[0]} no número ${numero}`
//     );
//   }
// });

// console.log(planilhaFormatada);
