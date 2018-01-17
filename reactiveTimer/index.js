const startButton = document.querySelector('.start')
const pauseButton = document.querySelector('.pause')
const stopButton= document.querySelector('.stop')

const minutes = document.querySelector('.minutes')
const seconds = document.querySelector('.seconds')
const miliseconds = document.querySelector('.miliseconds')

const start$ = Rx.Observable.fromEvent(startButton, 'click')
const pause$ = Rx.Observable.fromEvent(pauseButton, 'click')
const stop$ = Rx.Observable.fromEvent(stopButton, 'click')

const initialState = 0
const reset = () => initialState
const increment = prev => prev + 1
const toTime = time => ({
    miliseconds: Math.floor(time % 100),
    seconds: Math.floor((time/100) % 60),
    minutes: Math.floor(time / 6000),
})
const padNumber = number => number <= 9 ? `0${number}` : number.toString();
const render = time => {
    minutes.innerHTML = padNumber(time.minutes)
    seconds.innerHTML = padNumber(time.seconds)
    miliseconds.innerHTML = padNumber(time.miliseconds)
}

const interval$ = Rx.Observable.interval(10)
const stopInterval$ = pause$.merge(stop$)
const resetCounter$ = stop$.mapTo(reset)
const incrementCounter$ = interval$.takeUntil(stopInterval$).mapTo(increment)
const incrementOrResetCounter$ = incrementCounter$.merge(resetCounter$)

start$
  .switchMapTo(incrementOrResetCounter$)
  .startWith(initialState)
  .scan((prev, increment) => increment(prev))
  .map(toTime)
  .subscribe(render)
