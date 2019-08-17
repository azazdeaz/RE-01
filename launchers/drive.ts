import ioHook from 'iohook'
ioHook.start(false)

import zmq from 'zeromq'
const sock = zmq.socket('req');

sock.connect('tcp://192.168.0.101:5556');

enum KeyCodes {
    UP = '57416',
    RIGHT = '57421',
    DOWN = '57424',
    LEFT = '57419',
    LIGHT = '38',
}

const state = {
    [KeyCodes.UP]: false,
    [KeyCodes.RIGHT]: false,
    [KeyCodes.DOWN]: false,
    [KeyCodes.LEFT]: false,
    [KeyCodes.LIGHT]: false,
}

type Event = {
    keycode: number,
    type: 'keydown' | 'keyup'
}

const listener = (e: Event) => {
    const code = e.keycode.toString()
    console.log(code)
    if (code in state) {
        state[code as KeyCodes] = e.type === 'keydown'
        sendMotorCommand()
        sendLedCommand()
    }
}

ioHook.on('keydown', listener)
ioHook.on('keyup', listener)

const sendMotorCommand = () => {
    let left = 0
    let right = 0
    if (state[KeyCodes.UP]) {
        left += 1
        right += 1
    }
    if (state[KeyCodes.DOWN]) {
        left -= 1
        right -= 1
    }
    if (state[KeyCodes.LEFT]) {
        left += 1
    }
    if (state[KeyCodes.RIGHT]) {
        right += 1
    }
    const norm = left !== 0 || right !== 0
        ? 1 / Math.max(Math.abs(left), Math.abs(right))
        : 0
    left *= norm
    right *= norm
    const msg = `motor speed ${left} ${right}`
    console.log(msg)
    sock.send(msg)
}

const sendLedCommand = () => {
    const msg = `led ${state[KeyCodes.LIGHT] ? 'on' : 'off'}`
    console.log(msg)
    sock.send(msg)
}