import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import axios from 'axios'
import App from './App';
import { takeEvery, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga/effects';
// this startingPlantArray should eventually be removed
const startingPlantArray = [

];

const plantList = (state = startingPlantArray, action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return [...state, action.payload]
    case 'SET_PLANTS':
      return action.payload
    default:
      return state;
  }
};

function* fetchPlantList() {
  try {
    const plants = yield axios.get('/api/plant');
    const action = { type: 'SET_PLANTS', payload: plants.data }
    yield put(action);
  } catch (error) {
    console.log(`Error in fetchPlants ${error}`);
    alert('Something went wrong')
    throw error
  }
};

function* sendPlantToServer(action) {
  try {
    yield axios.post('/api/plant', action.payload);
    yield put({type: 'FETCH_PLANTS'})
  } catch (error) {
    console.log(`Error in addPlant ${error}`)
    alert('Something went wrong')
    throw error
  }
};

function* deleteFromServer(action) {
  try{
    yield axios.delete(`/api/plant/${action.payload}`);
    yield put({type:'FETCH_PLANTS'});
  } catch (error) {
    console.log(`Error in deleteFromServer ${error}`);
    alert('Something went wrong');
    throw error
  }
}

function* rootSaga() {
  yield takeLatest('FETCH_PLANTS', fetchPlantList);
  yield takeLatest('SEND_PLANT_TO_SERVER', sendPlantToServer);
  yield takeLatest('DELETE_PLANT', deleteFromServer)

}

const sagaMiddleware = createSagaMiddleware();


const store = createStore(
  combineReducers({ plantList }),
  applyMiddleware(sagaMiddleware, logger)
);
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);