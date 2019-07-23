import rpio from 'rpio'
/*
 * Set the initial state to low.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
rpio.init({mapping: 'gpio'});
rpio.open(25, rpio.OUTPUT, rpio.HIGH);

/*
 * The sleep functions block, but rarely in these simple programs does
 * one care about that.  Use a setInterval()/setTimeout() loop instead
 * if it matters.
 */
for (let i = 0; i < 5; i++) {
    /* On for 1 second */
    rpio.write(12, rpio.HIGH);
    console.log('ON')
    rpio.sleep(1);

    /* Off for half a second (500ms) */
    rpio.write(12, rpio.LOW);
    console.log('OFF')
    rpio.msleep(500);
}