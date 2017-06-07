import { combineReducers } from 'redux'
import login from './login'
import drawer from './drawer'
import getToy from './getToy'
import gameTools from './gameTools'
import upload from './upload'
import loading from './loading'
import titleTop from './titleTop'
import playReducer from './playReducer'

const App = combineReducers({
    login,
    drawer,
    getToy,
    gameTools,
    upload,
    loading,
    titleTop,
    playReducer
})

export default App