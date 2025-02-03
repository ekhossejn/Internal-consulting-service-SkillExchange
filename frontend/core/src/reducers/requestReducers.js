import { REQUEST_LIST_REQUEST,REQUEST_LIST_SUCCESS,REQUEST_LIST_FAIL,REQUEST_DETAILS_REQUEST,REQUEST_DETAILS_SUCCESS,REQUEST_DETAILS_FAIL, REQUEST_MAKE_REQUEST, REQUEST_MAKE_SUCCESS, REQUEST_MAKE_FAIL } from "../constants/requestConstants";


export const requestsListReducers =(state={requests:[]},action)=>{
    switch(action.type){
        case REQUEST_LIST_REQUEST:
            return {loading:true,requests:[]}
        case REQUEST_LIST_SUCCESS:
            return {loading:false,requests:action.payload}
        case REQUEST_LIST_FAIL:
            return {loading:false,error:action.payload}
        default:
            return state
    }
}

export const requestDetailsReducers =(state={request:[]},action)=>{
    switch(action.type){
        case REQUEST_DETAILS_REQUEST:
            return {loading:true,...state}
        case REQUEST_DETAILS_SUCCESS:
            return {loading:false,request:action.payload}
        case REQUEST_DETAILS_FAIL:
            return {loading:false,error:action.payload}
        default:
            return state
    }
}

export const requestMakeReducers = (state={request:[]}, action)=> {
    switch(action.type){
        case REQUEST_MAKE_REQUEST:
            return {loading:true,...state}
        case REQUEST_MAKE_SUCCESS:
            return {loading:false,request:action.payload}
        case REQUEST_MAKE_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}