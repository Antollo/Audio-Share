function prepareDownload (receivedArray) {
    var textDecoder = new TextDecoder('utf-8');
    console.log(receivedArray);
    var receivedArra = new Array();
    console.log(receivedArray.indexOf(262)-receivedArray.indexOf(260));
    console.log(receivedArray.indexOf(264)-receivedArray.indexOf(262));

    var name = new Uint8Array(receivedArray.indexOf(262) - receivedArray.indexOf(260) - 1);
    var bytes = new Uint8Array(receivedArray.indexOf(264) - receivedArray.indexOf(262) - 1);


    var i = receivedArray.indexOf(260) + 1;
    var s = receivedArray.indexOf(260) + 1;
    while (receivedArray[i] != 262) {
        name[i - s] = receivedArray[i]
        i++;
    }
    i++;
    var s = receivedArray.indexOf(262) + 1;
    while (receivedArray[i] != 264) {
        bytes[i - s] = receivedArray[i]
        i++;
    }

    console.log(textDecoder.decode(name));
    console.log(textDecoder.decode(bytes));

    var a = document.createElement('a');
    a.classList.add('mdl-button');
    a.classList.add('mdl-js-button');
    a.classList.add('mdl-js-ripple-effect');
    a.classList.add('mdl-button--accent');
    a.href = textDecoder.decode(bytes);
    a.download = textDecoder.decode(name);
    a.text = textDecoder.decode(name);
    document.getElementById('received-files').appendChild(a);
    document.getElementById('received-card').style.display = 'block';
}