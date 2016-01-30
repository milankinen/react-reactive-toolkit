# Embedding observables to VDOM

This example demonstrates how to embed your observables to vdom so that
the vdom becomes a sink and renders the observable contents every time
when its value changes.

All the magic is done by wrapping the observable with `R.<component>`:
if you normally used `<div>{myValue}</div>`, with observables you should
use `<R.div>{myObservable}</R.div>` 

Without JSX the syntax would be
```javascript 
React.createElement(R.div, {}, [ myObservable ])
```

Remember that only observables from properties and **direct children** 
will get rendered and observables inside e.g. childrens' children/props
wont!

## Running the example

```bash 
npm i && npm start
```

The code of this example can be found from `index.js` file.
