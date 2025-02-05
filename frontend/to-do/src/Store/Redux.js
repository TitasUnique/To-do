import {createStore} from 'redux';
const INITIAL_STATE = {
    cardsData: [],
};

const  createReducer = (store = INITIAL_STATE, action) => {
    if(action.type === "reduxDataUpload"){
        return {...store, cardsData: action.payload};
    }

    else if(action.type === "updateTaskStatus"){
        return{...store, cardsData: action.payload};
    }

    else if(action.type === "deleteTask"){
        return{...store, cardsData: action.payload};
    }

    else if(action.type==="newTaskAdd"){
        return{...store, cardsData: action.payload};
    }

    else if(action.type==="updatedTextData"){
        return{...store, cardsData: action.payload};
    }

    else {
        return store;
    }
};

const store = createStore(createReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;
