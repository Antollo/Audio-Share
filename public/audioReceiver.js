function receiveData () {

    var audioContext = new AudioContext();
    var receivedArray = new Array();
    var active = false;

    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({audio:true}).
        then(function(stream) {
            document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
                message: 'Receiving files will start automatically.',
                timeout: 4000
            });
            startRecieving(stream);
        })
        .catch(function(err) {
            alert('Cannot receive files, microphone not available.');
            document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
                message: 'But you still can send files. To make receiving files possible I advise you to use another browser.',
                timeout: 6000,
                actionHandler: function () {location.href = 'www.mozilla.org/firefox'},
                actionText: 'e.g. Firefox'
            });
        });

    } else { 
        alert('Cannot receive files, microphone not available.');
        document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
            message: 'But you still can send files. To make receiving files possible I advise you to use another browser.',
            timeout: 6000,
            actionHandler: function () {location.href = 'www.mozilla.org/firefox'},
            actionText: 'e.g. Firefox'
        });
    }

    function processData(frequencyArray) {
        var maxFrequency = 0;
        var maxStrenght = 0;  
        for (var i = 0; i < frequencyArray.length; i++) {
            if (maxStrenght < frequencyArray[i] || Math.floor((maxFrequency - 200)/2) < 0) {
                if (Math.floor((i - 200)/2)>=0 && Math.floor((i - 200)/2) <= 264) {
                    maxFrequency = i;
                    maxStrenght = frequencyArray[i];
                }
            }
        }
        var inputValue = Math.floor((maxFrequency - 200)/2);
        console.log(inputValue);
        switch (inputValue) {
            case 258:
                if (active) {
                    if (!receivedArray[receivedArray.length - 1].check(inputValue)) {
                        receivedArray.push(new Counter(inputValue));
                    }
                    return;
                }
                break;
            case 260:
                if (!active) {
                    document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
                        message: 'Receiving file started.',
                        timeout: 4000
                    });
                    active = true;
                    receivedArray = new Array();
                    receivedArray.push(new Counter(260));
                }
                break;
            case 264:
                if (active) {
                    document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
                        message: 'Receiving file ended.',
                        timeout: 4000
                    });
                    active = false;
                    receivedArray.push(new Counter(264));
                    console.log(receivedArray);
                    receivedArray = receivedArray.map(function (b) {
                        return b.value;
                    });
                    prepareDownload(receivedArray);                    
                }
                break;
            default:
                break;
        }
        if (active) {
            if (receivedArray[receivedArray.length - 1].check(inputValue)) {
                receivedArray[receivedArray.length - 1].increment();
            } else if (receivedArray[receivedArray.length - 1].counter > 2) {
                receivedArray.push(new Counter(inputValue));
            } else {
                receivedArray.pop();
                receivedArray.push(new Counter(inputValue));
            }
        }

    }


    function startRecieving(stream){

        var gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);


        var scriptProcessor = audioContext.createScriptProcessor(fftSize, 1, 1);
        scriptProcessor.connect(gainNode);

        var analyzer = audioContext.createAnalyser();
        analyzer.smoothingTimeConstant = 0;
        analyzer.fftSize = fftSize;

        var microphoneStream = audioContext.createMediaStreamSource(stream);
        microphoneStream.connect(analyzer);

        analyzer.connect(scriptProcessor);

        var frequencyArray = new Uint8Array(analyzer.frequencyBinCount);

        scriptProcessor.onaudioprocess = function() {

            analyzer.getByteFrequencyData(frequencyArray);

            if (microphoneStream.playbackState == microphoneStream.PLAYING_STATE) {

                processData(frequencyArray);
            }
        };
    }

}
