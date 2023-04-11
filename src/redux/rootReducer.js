// ** Reducers Imports
import authentication from './authentication'
import propertyList from './propertyData'
import launch from './launch'
import tableBooking from './tableBooking'
import modals from './modals'
import options from './options'
 
const rootReducer = {
 launch, authentication, propertyList, tableBooking, modals, options
}

export default rootReducer
