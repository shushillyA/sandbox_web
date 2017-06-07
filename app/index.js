import './scss/main.scss'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { render } from 'react-dom'
import { createStore,applyMiddleware,compose} from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { Router, browserHistory} from 'react-router'
import routeConfig from './router/router'

const loggerMiddleware = createLogger()
const store = createStore(
    reducer,
    compose(applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f)
);

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routeConfig}/>
    </Provider>,
    document.getElementById('root')
);