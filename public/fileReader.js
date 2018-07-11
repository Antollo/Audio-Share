function initFileReader() {
    var fileReader = new FileReader();
    var textEncoder = new TextEncoder('utf-8');
    
    fileReader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            var outputArray = new Array();
            var resultArray = new Uint8Array(evt.target.result.length);
            outputArray.push(260);
            textEncoder.encode(file.name).forEach(function (c) {
                outputArray.push(c)
            });
            outputArray.push(262);
            evt.target.result.split('').forEach(function (c, i) {
                resultArray[i] = c.charCodeAt(0);

                if (outputArray[outputArray.length - 1] == c.charCodeAt(0)) {
                    outputArray.push(258);
                }
                outputArray.push(c.charCodeAt(0));
            });
            //console.log(resultArray);
            //console.log(pako.deflate(resultArray));
            outputArray.push(264);
            console.log(outputArray);
            playData(outputArray);
            document.getElementById('files').value = '';
            
        }
    }

    function readFile (evt) {
        file = document.getElementById('files').files[0];
        fileReader.readAsDataURL(file);
    }

    document.getElementById('files').addEventListener('change', readFile, false);
}