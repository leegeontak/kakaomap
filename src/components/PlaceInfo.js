const PlaceInfo = ({ item, searchCategory }) => {
    return (
        <div className="currentLocation">
            <div className="currentLocationName">
                현재위치: {item.place_name}
            </div>
            <div className="currentLocationBtnContainer">
                <button onClick={() => searchCategory("FD6")}>맛집</button>
                <button onClick={() => searchCategory("CE7")}>카페</button>
                <button onClick={() => searchCategory("OL7")}>주유소</button>
            </div>
        </div>
    );
};
export default PlaceInfo;
