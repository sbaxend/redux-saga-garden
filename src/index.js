import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import axios from 'axios'
import App from './App';
import { takeEvery, put } from 'redux-saga/effects'
// this startingPlantArray should eventually be removed
const startingPlantArray = [
  { id: 1, name: 'Rose' },
  { id: 2, name: 'Tulip' },
  { id: 3, name: 'Oak' }
];

const plantList = (state = startingPlantArray, action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return [ ...state, action.payload ]
    default:
      return state;
  }
};

function* fetchPlantList() {
  try {
    const plants = yield axios.get('/plants');
    yield put ({type: 'ADD_PLANT', payload: plants.data})
  } catch (error) {
    console.log(`Error in fetchPlants ${error}`);
    alert('Something went wrong')
  }

}
function* rootSaga() {
  yield takeEvery('FETCH_PLANTS', fetchPlantList)

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