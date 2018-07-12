if (location.href.indexOf('https') == -1 && location.href.indexOf('localhost') == -1) location.href = location.href.replace('http', 'https');

var fftSize = 8192;
window.onload = function() {
    receiveData();
    initFileReader();
}