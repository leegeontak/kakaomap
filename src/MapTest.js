import React, { useEffect, useRef, useState } from "react";
import List from "./components/List";
import PlaceInfo from "./components/PlaceInfo";
import SearchResultList from "./components/SearchResultList";

const MapTest = () => {
    const mapContainer = useRef(null);
    const { kakao } = window;

    const [word, setWord] = useState("");
    const [itemList, setItemList] = useState([]);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [currentPosition, setCurrentPosition] = useState({
        location: null,
        radius: 1000,
    });
    const [map, setMap] = useState(null);
    const [searchResultList, setSearchResultList] = useState([]);
    const position = new kakao.maps.LatLng(33.450701, 126.570667);
    const mapOptions = {
        center: position, // 지도의 중심좌표
        level: 4, // 지도의 확대 레벨
    };
    const [infowindowArr, setInfowindowArr] = useState(null);
    const [mapMarker, setMapMarker] = useState(
        new kakao.maps.Marker({
            position: position,
        })
    );
    const place = new kakao.maps.services.Places();
    useEffect(() => {
        setMap(new kakao.maps.Map(mapContainer.current, mapOptions));
        mapMarker.setMap(map);
    }, []); //맨 처음 맵 그리기

    useEffect(() => {
        mapMarker.setMap(map);
    }, [map, mapMarker]); //마커위치가 바뀌면 바뀐 위치에 마커 찍기

    const handelSubmit = (event) => {
        search(word);
        event.preventDefault();
    };
    useEffect(() => {
        if (placeInfo !== null) {
            let iwContent = `<div class = "iwContainer"">
                <div>도로명 주소</div>
                <div> ${placeInfo.address_name}</div>
                <div>장소</div>
                <div>${placeInfo.place_name}</div>
                <div>연락처</div>
                <div>${placeInfo.phone}</div>
                <div>음식점 사이트</div>
                <a href="${placeInfo.place_url}" target="_blank">${placeInfo.place_url}</a>
            </div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
            let iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
            let infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
                removable: iwRemoveable,
            });
            if (infowindowArr !== null) {
                infowindowArr.close();
            }
            infowindow.open(map, mapMarker);
            setInfowindowArr(infowindow);
            map.panTo(new kakao.maps.LatLng(placeInfo.y, placeInfo.x));
        }
    }, [placeInfo]); //

    const search = (word) => {
        let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setItemList(result);
            } else {
                console.log("검색 실패");
            }
        };
        place.keywordSearch(word, callback);
        setWord("");
        setSearchResultList(null);
    }; //input에 검색할거 검색시 수행

    const movePlace = (item) => {
        mapOptions.level = 4;
        let searchPosition = new kakao.maps.LatLng(item.y, item.x);
        mapMarker.setMap(null);
        setMapMarker((prevMapMarker) => {
            if (prevMapMarker) {
                prevMapMarker.setMap(null);
            }
            return new kakao.maps.Marker({
                position: searchPosition,
            });
        }); //맵 마커 변경하기

        setCurrentPosition({
            location: searchPosition,
            radius: 5000,
        }); //현재 위치 변경하기
        setPlaceInfo(item); //장소 정보를 최신화
        setItemList([]); //검색된 결과 리스트 지우기
    };
    const [currentCategoryList, setCurrentCategoryList] = useState([]); //맛집, 주유소, 카페 버튼을 눌렀을때 나온 결과를 저장할 state
    const searchCategory = (categoryCode) => {
        let categoryImg;
        switch (categoryCode) {
            case "FD6":
                categoryImg = "/images/restaurant.png";
                break;
            case "CE7":
                categoryImg = "/images/coffee.png";
                break;
            case "OL7":
                categoryImg = "/images/gasStation.png";
                break;
        }
        let imageSize = new kakao.maps.Size(35, 40);
        const markerImage = new kakao.maps.MarkerImage(categoryImg, imageSize); //새롭게 쓰일 마커이미지 생성
        let callback = function (result, status) {
            console.log(result);
            if (status === kakao.maps.services.Status.OK) {
                setSearchResultList(result);
                let refreshCategoryList = [];

                if (currentCategoryList.length > 0) {
                    for (let i = 0; i < currentCategoryList.length; i++) {
                        currentCategoryList[i].setMap(null);
                    }
                } //이미 맵 마커가 찍혀있다면 기존 맵 마커를 삭제
                for (let i = 0; i < result.length; i++) {
                    const categoryMapmarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(
                            result[i].y,
                            result[i].x
                        ),
                        title: result[i].place_name,
                        image: markerImage,
                    }); //근처 맛집,주유소,카페 버튼을 누를때 새로운 마커 생성할 변수 선언
                    refreshCategoryList.push(categoryMapmarker);
                    categoryMapmarker.setMap(map);
                    kakao.maps.event.addListener(
                        categoryMapmarker,
                        "click",
                        () => {
                            movePlace(result[i]);
                        }
                    );
                }
                setCurrentCategoryList(refreshCategoryList);
            } else {
                console.log("검색 실패");
            }
        };
        place.categorySearch(categoryCode, callback, currentPosition);
        map.panTo(new kakao.maps.LatLng(currentPosition.y, currentPosition.x));
    };
    return (
        <div className="container">
            <div className="searchContainer">
                <div className="formContainer">
                    <form onSubmit={handelSubmit}>
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => {
                                setWord(e.target.value);
                            }}
                        ></input>
                        <button
                            className="searchBtn"
                            onClick={() => {
                                search(word);
                            }}
                        >
                            검색
                        </button>
                    </form>

                    <button onClick={() => setItemList([])}>검색 취소</button>
                </div>

                <div className="itemListContainer">
                    {itemList && (
                        <List itemList={itemList} movePlace={movePlace}></List>
                    )}
                </div>
            </div>

            <div className="travelContainer">
                <div className="searchResultContainer">
                    {placeInfo && (
                        <PlaceInfo
                            item={placeInfo}
                            searchCategory={searchCategory}
                        ></PlaceInfo>
                    )}
                    {searchResultList && (
                        <SearchResultList
                            searchResultList={searchResultList}
                            movePlace={movePlace}
                        ></SearchResultList>
                    )}
                </div>
                <div
                    id="map"
                    ref={mapContainer}
                    style={{
                        width: "calc(100% - 600px)",
                        height: "calc(100vh - 51px)",
                        display: "block",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default MapTest;
