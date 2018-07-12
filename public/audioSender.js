function playData (data) {
    var i = 0;
    var audioContext = new AudioContext();
    var x = audioContext.sampleRate/fftSize;
    var oscillator = audioContext.createOscillator();
    var amplifier = audioContext.createGain();
    var sendingCard = document.getElementById('sending-card');
    var volumeCard = document.getElementById('volume-card');
    var progressBar = document.getElementById('progress-bar');
    var level = document.getElementById('level');

    function playSingleNumber () {
        if (i < data.length) {
            oscillator.frequency.value = 200*x + data[i]*x*2 + x;
            progressBar.MaterialProgress.setProgress(Math.round(i / data.length * 100));
            i++;
            window.setTimeout(playSingleNumber, 700);
        } else {
            document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
                message: 'Sending file ended.',
                timeout: 4000
            });
            oscillator.stop();
            sendingCard.style.display = 'none';
            volumeCard.style.display = 'none';
            level.removeEventListener('mousedown', updateLevel);
            level.removeEventListener('mouseup', updateLevel);
            level.removeEventListener('mousemove', updateLevel);
            level.removeEventListener('touchstart', updateLevel);
            level.removeEventListener('touchend', updateLevel);
            level.removeEventListener('touchmove', updateLevel);
        }
    }

    function updateLevel () {
        amplifier.gain.value = Number.parseFloat(this.value)/100;
    }

    sendingCard.style.display = 'block';
    volumeCard.style.display = 'block';
    level.addEventListener('mousedown', updateLevel);
    level.addEventListener('mouseup', updateLevel);
    level.addEventListener('mousemove', updateLevel);
    level.addEventListener('touchstart', updateLevel);
    level.addEventListener('touchend', updateLevel);
    level.addEventListener('touchmove', updateLevel);

    oscillator.type = 'square';
    oscillator.start();
    oscillator.connect(amplifier);
    amplifier.gain.value = 0.7;
    amplifier.connect(audioContext.destination);

    document.getElementById('snackbar').MaterialSnackbar.showSnackbar({
        message: 'Sending file started.',
        timeout: 4000
    });

    playSingleNumber();
}