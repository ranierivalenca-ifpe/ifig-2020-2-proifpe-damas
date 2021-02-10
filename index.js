const express = require('express');

const app = express();

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

var pecas = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];

var peca_selecionada = [-1, -1];

app.get('/', function(req, res) {
    if (req.query['lin'] != undefined && req.query['col'] != undefined) {

        if (peca_selecionada[0] == -1 && peca_selecionada[1] == -1) {
            // Nenhuma peça estava selecionada
            // Marca a peça como selecionada
            peca_selecionada = [req.query['lin'], req.query['col']];
            console.log(peca_selecionada)
        } else {
            // Já existe uma peça selecionada
            // Move a peça selecionada para a posição passada
            var peca_i = peca_selecionada[0];
            var peca_j = peca_selecionada[1];

            var localizacao_i = req.query['lin'];
            var localizacao_j = req.query['col'];

            pecas[localizacao_i][localizacao_j] = pecas[peca_i][peca_j]
            pecas[peca_i][peca_j] = 0
            peca_selecionada = [-1, -1]
        }
    }
    var html = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.">
                <title>Damas</title>
                <style>

                    table {
                        margin: auto;
                        border: 1px solid black;
                        border-collapse: collapse;
                    }
                    td {
                        width: 2em;
                        height: 2em;
                        border: 1px solid black;
                        border-collapse: collapse;
                        padding: 0.2em;
                    }
                    .casa-preta {
                        background: #000;
                    }
                    .casa-preta {
                        background: #CBBFB9;
                    }
                    .espaco {
                        width: 100%;
                        height: 100%;
                    }
                    .peca {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        box-shadow: 2px 2px 5px black;
                    }
                    .peca-branca {
                        background: white;
                        background-image: url('branca.png');
                    }
                    .peca-preta {
                        background: #7F6150;
                        background-image: url('preta.png');
                    }
                    @keyframes piscar {
                        0% { border: 2px solid red; }
                        50% { border: 2px solid blue; }
                        100% { border: 2px solid red; }
                    }
                    .selecionado {

                        animation: piscar 1s infinite;
                    }
                </style>
            </head>
            <body>
                <table>`;
    for (i = 0; i < 8; i++) {
        html += "<tr>";
        for (j = 0; j < 8; j++) {
            var peca = `<div class="espaco"></div>`;
            if (pecas[i][j] == 1) {
                peca = `<div class="peca peca-branca"></div>`;
            } else if (pecas[i][j] == 2) {
                peca = `<div class="peca peca-preta"></div>`;
            }
            // if ((i + j) % 2 == 0) {
            if (casas[i][j] == 1) {
                html += `<td class="casa-preta"></td>`;
            } else if (casas[i][j] == 0) {
                if (peca_selecionada[0] == i && peca_selecionada[1] == j) {
                    html += `
                        <td class="casa-branca selecionado">
                            ${peca}
                        </td>
                    `
                } else {
                    html += `
                        <td class="casa-branca">
                            <a href="/?lin=${i}&col=${j}">${peca}</a>
                        </td>
                    `
                }
            }
        }
        html += "</tr>";
    }
    html += "</table></body></html>";
    res.send(html);
});

app.get('/hello', function(req, res) {
    console.log(req.query);
    // res.send("Hello, " + req.query['nome']);
    res.redirect('/');
})

app.listen(3000);