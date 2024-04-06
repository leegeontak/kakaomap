const List = ({ itemList, movePlace }) => {
    return (
        <>
            {itemList.map((item, index) => (
                <div
                    className="list"
                    onClick={() => {
                        movePlace(item);
                    }}
                    key={index}
                >
                    <div className="addressName">{item.address_name}</div>
                    <div className="placeName">{item.place_name}</div>
                </div>
            ))}
        </>
    );
};
export default List;
