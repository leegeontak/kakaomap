const SearchResultList = ({ searchResultList, movePlace }) => {
    // console.log(restaurantInfo);
    return (
        <div>
            {searchResultList.map((item, index) => (
                <div
                    key={index}
                    onClick={() => movePlace(item)}
                    className="list"
                >
                    <div className="addressName">{item.address_name}</div>
                    <div className="placeName">{item.place_name}</div>
                </div>
            ))}
        </div>
    );
};
export default SearchResultList;
