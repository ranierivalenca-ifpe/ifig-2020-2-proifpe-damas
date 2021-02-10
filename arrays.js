// varrer o array
// iterar sobre o array

arr = [
    ['proifpe', 'logica', 'redes'],
    ['web 1', 'bd', 'poo', 'projeto 1', 'seguranca', 'so']
];

for (i = 0; i < arr.length; i++) {
    var linha = arr[i]; // linha é um array
    console.log(linha)
    for (j = 0; j < linha.length; j++) {
        console.log(linha[j]) // console.log(arr[i][j])
    }
}