import VisibleSanToyTools from '../containers/VisibleSanToyTools'
import GamePlay from '../containers/GamePlay'
import App from '../containers/App'

const routeConfig = [
    {
        path: '/',
        component: App,
        childRoutes: [
            {path: `${PRODUCTION ? 'site/' : ''}index.html`, component: VisibleSanToyTools},
            {path: 'play', component: GamePlay},
            {path: '', component: App}
        ]
    }
];

export default routeConfig