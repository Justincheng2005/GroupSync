
const MapSearch = () => {
    const searchParams = new URLSearchParams({
        query,
        types: 'place',
        ll: `${userLat},${userLng}`,
        radius: 50000,
    }).toString();
    
    async () => {
        try {
            const searchResults = await axios.post("http://localhost:8800/api/search", searchParams,{
                withCredentials: true,
            });
            const data = searchResults.json().results;
            if(data && data.length){
                data.forEach((value) => {
                    
                })
            }
        } catch( err ){
            console.log(err)
        }
    }
    return(
        <>
        </>
    );
}
