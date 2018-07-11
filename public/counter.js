function Counter (newValue) {
    this.value = newValue;
    this.counter = 1;
    this.increment = function() {
        this.counter++;
    };
    this.check = function (anotherValue) {
        return anotherValue == this.value;
    };
    return this;
}