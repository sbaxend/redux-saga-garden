import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';


function PlantList() {
    const dispatch = useDispatch();

    const plantList = useSelector(store => store.plantList);

    const getPlants=() => {
        dispatch({type: 'FETCH_PLANTS'})
    }
    useEffect(() => {
        console.log('component did mount');
        // dispatch an action to request the plantList from the API
        getPlants()
    }, []); 

    const removePlant = (id) => {
        dispatch({type: 'DELETE_PLANT', payload: id})

    }

    return (
        <div>
            <h3>This is the plant list</h3>
            {/* <pre>{JSON.stringify(reduxState)}</pre> */}
            {
                plantList.map(plant => (
                    <div key={plant.id} >
                        {plant.name}
                        <button onClick={() => removePlant(plant.id)}>Remove</button>
                        </div>
                ))
            }
        </div>
    );
}

export default PlantList;
