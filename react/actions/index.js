import extensionActions from './extensionActions'
import statusActions from './statusActions'

let downloadActions = { ...extensionActions, ...statusActions };
export default downloadActions;