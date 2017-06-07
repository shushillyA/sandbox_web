import { connect } from 'react-redux'
import Game from '../components/game/Game'

const mapStateToProps = (state) => ({
    loading:state.loading,
    drawer:state.drawer,
    game:state.gameTools
});

const VisibleSandToyTools = connect(
    mapStateToProps
)(Game);

export default VisibleSandToyTools