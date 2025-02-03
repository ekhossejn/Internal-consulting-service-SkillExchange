import {createStore,combineReducers,applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { userLoginReducers, userSignupReducers } from './reducers/userReducers';
import { requestDetailsReducers, requestsListReducers, requestMakeReducers } from './reducers/requestReducers';


const reducer = combineReducers({
    userLogin:userLoginReducers,
    userSignup:userSignupReducers,
    requestsList:requestsListReducers,
    requestDetails:requestDetailsReducers,
    requestMake:requestMakeReducers
})

const initialState={}
const middleware=[thunk]
const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store;