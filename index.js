const express = require('express');
const fs = require('fs');

const app = express();
app.use('/static', express.static('public'));

var casas = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];

var clicaveis = [];
var pecas = [];
var jogador = 1;
var peca_selecionada = [-1, -1];

function temPecaSelecionada() {
    return peca_selecionada[0] != -1 && peca_selecionada[1] != -1
}

function resetarClicaveis() {
    clicaveis =[
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
}

function pecaPodeMover(i, j) {
    if (pecas[i][j] == 1) { // é uma peça do jogador 1, pode mover pra "cima" (i - 1)
        if (i > 0 && j > 0 && pecas[i - 1][j - 1] == 0) {
            return true;
        }
        if (i > 0 && j < 8 && pecas[i - 1][j + 1] == 0) {
            return true;
        }
        return false;
    } else if (pecas[i][j] == 2) { // é uma peça do jogador 2, pode mover pra "baixo" (i + 1)
        if (i < 8 && j > 0 && pecas[i + 1][j - 1] == 0) {
            return true;
        }
        if (i < 8 && j < 8 && pecas[i + 1][j + 1] == 0) {
            return true;
        }
        return false;
    }
    return false;
}

function movimentoValido(i, j) {
    if (!temPecaSelecionada()) {
        return false;
    }
    if (pecas[i][j] != 0) {
        return false;
    }
    if (jogador == 1) { // a peça selecionada precisa estar numa das posições de baixo (i + 1)
        if (peca_selecionada[0] == i + 1 && peca_selecionada[1] == j + 1) {
            return true;
        }
        if (peca_selecionada[0] == i + 1 && peca_selecionada[1] == j - 1) {
            return true;
        }
        return false;
    } else if (jogador == 2) { // a peça selecionada precisa estar numa das posições de cima (i - 1)
        if (peca_selecionada[0] == i - 1 && peca_selecionada[1] == j + 1) {
            return true;
        }
        if (peca_selecionada[0] == i - 1 && peca_selecionada[1] == j - 1) {
            return true;
        }
        return false;
    }
}

function setClicaveis() {
    resetarClicaveis();
    for (i = 0; i < pecas.length; i++) {
        for (j = 0; j < pecas.length; j++) {
            // se não tem peça selecionada
            if (!temPecaSelecionada()) {
                // se é uma peça do jogador atual
                if (pecas[i][j] == jogador) {
                    // se a peça tem pra onde se mover
                    if (pecaPodeMover(i, j)) {
                        clicaveis[i][j] = 1;
                    }
                }
            } else { // tem uma peça selecionada
                // posições clicáveis são as posições para onde a peça pode se mover
                if (movimentoValido(i, j)) {
                    clicaveis[i][j] = 1;
                }
            }
        }
    }
}

function resetarPecas() {
    pecas = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ];

    peca_selecionada = [-1, -1];

    jogador = 1;

    setClicaveis();
}

function gerarHTML() {
    var table = '';
    for (i = 0; i < 8; i++) {
        table += "<tr>";
        for (j = 0; j < 8; j++) {
            var peca = `<div class="espaco"></div>`;
            if (pecas[i][j] == 1) {
                peca = `<div class="peca peca-branca"></div>`;
            } else if (pecas[i][j] == 2) {
                peca = `<div class="peca peca-preta"></div>`;
            }
            // if ((i + j) % 2 == 0) {
            if (casas[i][j] == 1) {
                table += `<td class="casa-preta"></td>`;
            } else if (casas[i][j] == 0) {
                if (clicaveis[i][j] == 1) {
                    table += `
                         <td class="casa-branca selecionado">
                             <a href="/jogar?lin=${i}&col=${j}">${peca}</a>
                         </td>
                     `;
                } else {
                    table += `
                        <td class="casa-branca">
                            ${peca}
                        </td>
                    `;
                }
                // if (peca_selecionada[0] == i && peca_selecionada[1] == j) {
                //     table += `
                //         <td class="casa-branca selecionado">
                //             ${peca}
                //         </td>
                //     `
                // } else {
                //     table += `
                //         <td class="casa-branca">
                //             <a href="/jogar?lin=${i}&col=${j}">${peca}</a>
                //         </td>
                //     `
                // }
            }
        }
        table += "</tr>";
    }

    var html = fs.readFileSync('jogo.html').toString();
    html = html.replace("{{tabela}}", table)

    return html;
}



function jogar(lin, col) {
    if (!temPecaSelecionada()) {
        // Nenhuma peça estava selecionada
        // Marca a peça como selecionada
        peca_selecionada = [lin, col];
        // atualizar array de clicaveis
        setClicaveis();
        console.log(peca_selecionada)
    } else {
        // Já existe uma peça selecionada
        // Move a peça selecionada para a posição passada
        var peca_i = peca_selecionada[0];
        var peca_j = peca_selecionada[1];

        var localizacao_i = lin;
        var localizacao_j = col;

        pecas[localizacao_i][localizacao_j] = pecas[peca_i][peca_j]
        pecas[peca_i][peca_j] = 0
        peca_selecionada = [-1, -1]
        if (jogador == 1) {
            jogador = 2;
        } else if (jogador == 2) {
            jogador = 1;
        }
        setClicaveis();
    }
}




app.get('/', function(req, res) {
  let index = fs.readFileSync('index.html').toString(); // string contendo o conteúdo do arquivo
  res.send(index);
});

app.get('/iniciar-jogo', function(req, res) {
    resetarPecas();
    var html = gerarHTML();
    res.send(html);
});

app.get('/jogar', function(req, res) {
    if (req.query['lin'] != undefined && req.query['col'] != undefined) {
        jogar(req.query['lin'], req.query['col'])
    }
    var html = gerarHTML()
    res.send(html);
});

app.get('/hello', function(req, res) {
    console.log(req.query);
    // res.send("Hello, " + req.query['nome']);
    res.redirect('/');
})

app.listen(3000);