import React, { useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Polyline,
} from "@react-google-maps/api";
import "./styles.css";
import icon from "./assets/pngwing.com.png";

const center = {
    lat: 18.653801781141713,
    lng: 73.76033069492429,
};

const SimulateDroneMovement = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyC0F-liolMY1ypgueRBFlcHqtBK_2KlwkI",
    });
    const [start, setStart] = useState(false);
    const [position, setPosition] = useState(null);
    const [paths, setPaths] = useState([
        [
            { lat: center.lat, lng: center.lng },
            { lat: center.lat, lng: center.lng },
        ],
        [
            { lat: center.lat, lng: center.lng },
            { lat: center.lat, lng: center.lng },
        ],
        [
            { lat: center.lat, lng: center.lng },
            { lat: center.lat, lng: center.lng },
        ],
    ]);
    const [droneInfo, setDroneInfo] = useState([
        {
            latitude: 0,
            longitude: 0,
            time: 0,
            pause: false,
            interval: null,
            marker: null,
            completed: true,
        },
        {
            latitude: 0,
            longitude: 0,
            time: 0,
            pause: false,
            interval: null,
            marker: null,
            completed: true,
        },
        {
            latitude: 0,
            longitude: 0,
            time: 0,
            pause: false,
            interval: null,
            marker: null,
            completed: true,
        },
    ]);

    const handleChange = (e) => {
        let id;
        if (
            e.target.id == "1lat" ||
            e.target.id == "1lng" ||
            e.target.id == "1time"
        ) {
            id = 0;
        } else if (
            e.target.id == "2lat" ||
            e.target.id == "2lng" ||
            e.target.id == "2time"
        ) {
            id = 1;
        } else if (
            e.target.id == "3lat" ||
            e.target.id == "3lng" ||
            e.target.id == "3time"
        ) {
            id = 2;
        }

        setDroneInfo((droneInfo) => {
            let newArray = [...droneInfo];
            if (e.target.id.includes("lat")) {
                newArray[id] = {
                    ...newArray[id],
                    latitude: e.target.value,
                };
            }
            if (e.target.id.includes("lng")) {
                newArray[id] = {
                    ...newArray[id],
                    longitude: e.target.value,
                };
            }
            if (e.target.id.includes("time")) {
                newArray[id] = {
                    ...newArray[id],
                    time: e.target.value,
                };
            }
            return newArray;
        });
    };

    const simulateDroneMovement = (e) => {
        e.preventDefault();
        let id;

        if (e.target.id == "1sim") {
            id = 0;
        } else if (e.target.id == "2sim") {
            id = 1;
        } else if (e.target.id == "3sim") {
            id = 2;
        }

        let { latitude, longitude, time } = droneInfo[id];
        latitude = Number(latitude);
        longitude = Number(longitude);
        time = Number(time) * 1000;
        if (!time) {
            alert("0 time not allowed");
            return;
        }

        setDroneInfo((droneInfo) => {
            let newArray = [...droneInfo];
            newArray[id] = {
                ...newArray[id],
                pause: true,
                completed: false,
            };
            return newArray;
        });

        setPaths((paths) => {
            const newArray = [...paths];
            newArray[id] = [
                { lat: center.lat, lng: center.lng },
                { lat: latitude, lng: longitude },
            ];
            return newArray;
        });

        const steps = 1000;
        const stepLat = (latitude - center.lat) / steps;
        const stepLng = (longitude - center.lng) / steps;
        let currentLat;
        if (!droneInfo[id].completed) {
            currentLat = droneInfo[id].marker.lat;
        } else {
            currentLat = center.lat;
        }
        let currentLng;
        if (!droneInfo[id].completed) {
            currentLng = droneInfo[id].marker.lng;
        } else {
            currentLng = center.lng;
        }

        setDroneInfo((prevDroneInfo) => {
            const newDroneInfo = [...prevDroneInfo];
            newDroneInfo[id] = {
                ...newDroneInfo[id],
                marker: { lat: currentLat, lng: currentLng },
            };
            return newDroneInfo;
        });

        const interval = setInterval(() => {
            currentLat += stepLat;
            currentLng += stepLng;

            setDroneInfo((prevDroneInfo) => {
                const newDroneInfo = [...prevDroneInfo];
                newDroneInfo[id] = {
                    ...newDroneInfo[id],
                    marker: { lat: currentLat, lng: currentLng },
                };
                return newDroneInfo;
            });

            if (
                (stepLat >= 0 &&
                    currentLat >= latitude &&
                    stepLng >= 0 &&
                    currentLng >= longitude) ||
                (stepLat <= 0 &&
                    currentLat <= latitude &&
                    stepLng >= 0 &&
                    currentLng >= longitude) ||
                (stepLat <= 0 &&
                    currentLat <= latitude &&
                    stepLng <= 0 &&
                    currentLng <= longitude) ||
                (stepLat >= 0 &&
                    currentLat >= latitude &&
                    stepLng <= 0 &&
                    currentLng <= longitude)
            ) {
                setDroneInfo((prevDroneInfo) => {
                    const newDroneInfo = [...prevDroneInfo];
                    newDroneInfo[id] = {
                        ...newDroneInfo[id],
                        pause: false,
                        completed: true,
                    };
                    return newDroneInfo;
                });
                clearInterval(interval);
            }
        }, time / steps);

        setDroneInfo((prevDroneInfo) => {
            const newDroneInfo = [...prevDroneInfo];
            newDroneInfo[id] = {
                ...newDroneInfo[id],
                interval: interval,
            };
            return newDroneInfo;
        });
    };

    const handlePause = (e) => {
        e.preventDefault();
        let id;
        if (e.target.id == "1pause") {
            id = 0;
        } else if (e.target.id == "2pause") {
            id = 1;
        } else if (e.target.id == "3pause") {
            id = 2;
        }

        setDroneInfo((droneInfo) => {
            let newArray = [...droneInfo];
            newArray[id] = {
                ...newArray[id],
                pause: false,
            };
            clearInterval(droneInfo[id].interval);
            return newArray;
        });
    };

    const handleClear = (e) => {
        e.preventDefault();
        let id;
        if (e.target.id == "1clear") {
            id = 0;
        } else if (e.target.id == "2clear") {
            id = 1;
        } else if (e.target.id == "3clear") {
            id = 2;
        }

        setDroneInfo((droneInfo) => {
            let newArray = [...droneInfo];
            newArray[id] = {
                ...newArray[id],
                pause: false,
                marker: null,
                interval: null,
                latitude: 0,
                longitude: 0,
                time: 0,
                completed: true,
            };
            clearInterval(droneInfo[id].interval);
            return newArray;
        });

        setPaths((paths) => {
            const newArray = [...paths];
            newArray[id] = [
                { lat: center.lat, lng: center.lng },
                { lat: center.lat, lng: center.lng },
            ];
            return newArray;
        });
    };

    return (
        <div className="container">
            {isLoaded ? (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={15}
                    centerControl={true}
                >
                    {start &&
                        droneInfo.map((e, i) => (
                            <Marker
                                key={i}
                                position={e.marker}
                                icon={{
                                    url: icon,
                                    scaledSize: new window.google.maps.Size(
                                        50,
                                        50
                                    ),
                                    anchor: new window.google.maps.Point(
                                        25,
                                        25
                                    ),
                                }}
                            />
                        ))}

                    {start &&
                        paths.map((path, index) => (
                            <Polyline key={index} path={path} />
                        ))}
                </GoogleMap>
            ) : (
                <div>Loading Map...</div>
            )}
            <div className="container">
                {start ? (
                    <form className="form">
                        <div className="inputs">
                            <label>
                                Latitude:
                                <input
                                    type="number"
                                    value={droneInfo[0].latitude}
                                    onChange={handleChange}
                                    id="1lat"
                                />
                            </label>
                            <label>
                                Longitude:
                                <input
                                    type="number"
                                    value={droneInfo[0].longitude}
                                    onChange={handleChange}
                                    id="1lng"
                                />
                            </label>
                            <label>
                                Time (in seconds):
                                <input
                                    type="number"
                                    value={droneInfo[0].time}
                                    onChange={handleChange}
                                    id="1time"
                                />
                            </label>
                            {droneInfo[0].pause ? (
                                <button
                                    id="1pause"
                                    onClick={handlePause}
                                    style={{ backgroundColor: "orange" }}
                                >
                                    Pause
                                </button>
                            ) : (
                                <button
                                    id="1sim"
                                    onClick={simulateDroneMovement}
                                >
                                    Simulate
                                </button>
                            )}
                            <button
                                id="1clear"
                                onClick={handleClear}
                                style={{ backgroundColor: "red" }}
                            >
                                Clear
                            </button>
                        </div>
                        <div className="inputs">
                            <label>
                                Latitude:
                                <input
                                    type="number"
                                    value={droneInfo[1].latitude}
                                    onChange={handleChange}
                                    id="2lat"
                                />
                            </label>
                            <label>
                                Longitude:
                                <input
                                    type="number"
                                    value={droneInfo[1].longitude}
                                    onChange={handleChange}
                                    id="2lng"
                                />
                            </label>
                            <label>
                                Time (in seconds):
                                <input
                                    type="number"
                                    value={droneInfo[1].time}
                                    onChange={handleChange}
                                    id="2time"
                                />
                            </label>
                            {droneInfo[1].pause ? (
                                <button
                                    id="2pause"
                                    onClick={handlePause}
                                    style={{ backgroundColor: "orange" }}
                                >
                                    Pause
                                </button>
                            ) : (
                                <button
                                    id="2sim"
                                    onClick={simulateDroneMovement}
                                >
                                    Simulate
                                </button>
                            )}
                            <button
                                id="2clear"
                                onClick={handleClear}
                                style={{ backgroundColor: "red" }}
                            >
                                Clear
                            </button>
                        </div>
                        <div className="inputs">
                            <label>
                                Latitude:
                                <input
                                    type="number"
                                    value={droneInfo[2].latitude}
                                    onChange={handleChange}
                                    id="3lat"
                                />
                            </label>
                            <label>
                                Longitude:
                                <input
                                    type="number"
                                    value={droneInfo[2].longitude}
                                    onChange={handleChange}
                                    id="3lng"
                                />
                            </label>
                            <label>
                                Time (in seconds):
                                <input
                                    type="number"
                                    value={droneInfo[2].time}
                                    onChange={handleChange}
                                    id="3time"
                                />
                            </label>
                            {droneInfo[2].pause ? (
                                <button
                                    id="3pause"
                                    onClick={handlePause}
                                    style={{ backgroundColor: "orange" }}
                                >
                                    Pause
                                </button>
                            ) : (
                                <button
                                    id="3sim"
                                    onClick={simulateDroneMovement}
                                >
                                    Simulate
                                </button>
                            )}
                            <button
                                id="3clear"
                                onClick={handleClear}
                                style={{ backgroundColor: "red" }}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setStart(true)}
                        disabled={!isLoaded}
                        style={{
                            backgroundColor: "#4caf50",
                            border: "1px solid #4caf50",
                            borderRadius: "5px",
                            color: "white",
                            padding: "10px 20px",
                            textAlign: "center",
                            textDecoration: "none",
                            display: "inline-block",
                            fontSize: "16px",
                            cursor: "pointer",
                            width: "auto",
                        }}
                    >
                        Start
                    </button>
                )}
            </div>
        </div>
    );
};

export default SimulateDroneMovement;
