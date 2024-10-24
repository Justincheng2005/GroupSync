import { useRef,useEffect,useState } from "react";
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css';

import "./map.scss"

const Map = () => {
    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [ userLat, setUserLat] = useState(50);
    const [ userLng, setUserLng ] = useState(50);
    const [ inputSearch, setInputSearch ] = useState("");
    const [ showSearch, setShowSearch ] = useState(null);
    const [ searchData, setSearchData ] = useState(null);
    const [ placeData, setPlaceData ] = useState(null);
    const [ showDetails, setShowDetails ] = useState(false);

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
        
    function success(pos){
        const crd = pos.coords;
        setUserLat(crd.latitude);
        setUserLng(crd.longitude);
        //map.flyTo({center:[userLat,userLng]})
    };
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    const getCurrentPosition = async() =>{
        try{
            navigator.geolocation.getCurrentPosition(success, error, options);
        } catch(err){
            console.log(err+"location error");
        }
    }
    getCurrentPosition();

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    
        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [userLng, userLat], 
            zoom: 12,
        });
        map.current.on('load', () => {
            console.log('A load event occurred.');
            map.current.resize();
        });
        //map.current.addControl(new mapboxgl.GeolocateControl());
        map.current.addControl(new mapboxgl.NavigationControl());
    }, [userLat,userLng]);
    const getResults = async () => {
        let {mapLng, mapLat} = map.getCenter();

        const searchParams = new URLSearchParams({
            inputSearch,
            types: 'place',
            ll: `${mapLng},${mapLat}`,
            radius: 50000,
        }).toString();
        const searchResults = await axios.post("http://localhost:8800/api/search", searchParams,{
            withCredentials: true,
        });
        setSearchData(searchResults.json().results);
        setShowSearch(true);
    }
    const handleSearchChange = (e) => {
        setInputSearch(e.target.value);
    }

    const viewPlace = async(fsq_Id) => {
        const placeDetails = await axios.post("http://localhost:8800/api/search", fsq_Id,{
            withCredentials: true,
        });
        setPlaceData(placeDetails.json().results)
        setShowDetails(true);
    }

        
        

        
    //<div style={{height:'100%'}} id="map" className="map-container"></div>
    return(
        <div className="mapBox">
            <div ref={mapContainerRef} className="map-container"></div>
            <form className="search-container">
                <input 
                    type="text" 
                    placeholder="keyword" 
                    className="search-input" 
                    name="search"
                    onChange={handleSearchChange}
                />
                <button className="search-button" onClick={getResults}>Search</button>
            </form>
            <div className="dropdown-container">
                {showSearch ? 
                    <div className="result-container">
                    {searchData.map((result) => 
                        <button
                            className="result"
                            key={result.fsq_id}
                            onClick={viewPlace(result.fsq_id)}
                        >
                            <div className="result-name">{result.fsq_id}</div>
                            <div className="result-city">{result.location.address}</div>
                            <div>{result.location.locality.concat(", ", result.location.region,", ", result.location.address)}</div>
                        </button>
                    )}
                    </div>
                    
                :
                    <div className="seach-error">No search results found for {inputSearch}</div>
                }
            </div>
            <div className="detail-container">
                {showDetails ? 
                    <div>
                    </div>
                    :
                    null
                }
            </div>
        </div>
        
    )
    
}

export default Map;