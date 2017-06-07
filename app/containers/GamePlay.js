import { connect } from 'react-redux'
import Play from '../components/game/Play'

const mapStateToProps = (state) => ({
    control:state.playReducer
});

const GamePlay = connect(
    mapStateToProps
)(Play);

export default GamePlay