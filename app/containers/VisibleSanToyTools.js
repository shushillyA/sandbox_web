import { connect } from 'react-redux'
import Game from '../components/game/Game'

const mapStateToProps = (state) => {
    console.log(state,'111111111111111111111111111')   // 此时已经是true了
    return {
        loading:state.loading,
        drawer:state.drawer,
        game:state.gameTools
    }
};

const VisibleSandToyTools = connect(
    mapStateToProps
)(Game);

export default VisibleSandToyTools