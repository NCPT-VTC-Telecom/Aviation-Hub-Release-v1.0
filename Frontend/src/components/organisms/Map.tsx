import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import useConfig from 'hooks/useConfig';
import useFlightPhaseTooltip from 'hooks/useFlightPhase';
import { FormattedMessage } from 'react-intl';

//project-import
import { Link } from '@mui/material';
import ChipStatus from 'components/atoms/ChipStatus';

//third-party
import { format } from 'date-fns';
import vn from 'date-fns/locale/vi';
import 'leaflet/dist/leaflet.css';
import L, { Marker as LeafletMarker } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, AttributionControl, useMap } from 'react-leaflet';

//types
import { FlightData } from 'types/aviation';

const airplaneOff = require('assets/images/icons/png/plane-off.png');
const airplaneOn = require('assets/images/icons/png/plane.png');

const iconAirplaneOn = new L.Icon({
  iconUrl: airplaneOn,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const iconAirplaneOff = new L.Icon({
  iconUrl: airplaneOff,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [5, -30]
});

function MarkerWithPopup({
  airplane,
  selectedAirplane,
  popupVisible
}: {
  airplane: FlightData;
  selectedAirplane: FlightData | null;
  popupVisible: boolean;
}) {
  const navigate = useNavigate();
  const map = useMap();
  const flightPhase = useFlightPhaseTooltip(airplane.flight_phase);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (selectedAirplane && selectedAirplane.aircraft.tail_number === airplane.aircraft.tail_number) {
      map.flyTo([airplane.lat_location, airplane.long_location], map.getZoom());
      if (markerRef.current) {
        popupVisible ? markerRef.current.openPopup() : markerRef.current.closePopup();
      }
    }
  }, [selectedAirplane, map, airplane, popupVisible]);

  return (
    <Marker
      ref={markerRef}
      position={[airplane.lat_location, airplane.long_location]}
      icon={airplane.status_id !== 14 ? iconAirplaneOff : iconAirplaneOn}
    >
      <Popup className="!m-0">
        <div className="w-60 mt-6 flex flex-col">
          <header className="w-full py-1 bg-blue-800 text-white font-semibold text-center">
            <Link
              component="button"
              className="text-white"
              variant="h5"
              onClick={() => navigate(`/flight/profile/${airplane.aircraft?.flight_number}`)}
            >
              {airplane.aircraft?.flight_number}
            </Link>
          </header>
          <div className="w-full">
            <div className="flex justify-between items-center font-medium my-1 mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full">
              <label>
                <FormattedMessage id="tail-number" />:
              </label>
              <span>
                <Link
                  component="button"
                  className="text-blue-600"
                  variant="body1"
                  onClick={() => navigate(`/aircraft/profile/${airplane.aircraft?.tail_number}`)}
                >
                  {airplane.tail_model}
                </Link>
              </span>
            </div>

            <div className="flex justify-between items-center font-medium my-2">
              <label>
                <FormattedMessage id="route" />:
              </label>
              <span>{airplane.route}</span>
            </div>

            <div className="flex justify-between items-center font-medium my-2">
              <label>
                <FormattedMessage id="departure-time" />:
              </label>
              <span>{airplane.departure_time}</span>
            </div>

            <div className="flex justify-between items-center font-medium my-2">
              <label>
                <FormattedMessage id="arrival-time" />:
              </label>
              <span>{airplane.arrival_time}</span>
            </div>

            <div className="flex justify-between items-center font-medium my-2">
              <label>
                <FormattedMessage id="flight_phase" />:
              </label>
              <span>{flightPhase}</span>
            </div>

            <div className="flex justify-between items-center font-medium my-2">
              <label>
                <FormattedMessage id="ifc-status" />:
              </label>
              <ChipStatus id={airplane.status_id} successLabel="online" errorLabel="offline" />
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
function Map({
  airCraftInfo,
  isShowTime,
  heightFull,
  selectedAirplane,
  popupVisibility
}: {
  airCraftInfo: FlightData[];
  isShowTime: boolean;
  heightFull?: boolean;
  selectedAirplane: FlightData | null;
  popupVisibility: Record<number, boolean>;
}) {
  const [dateTime, setDateTime] = useState('');
  const { i18n } = useConfig();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (i18n === 'vi') {
        const formattedDateTime = format(now, 'EEEE, dd MMMM yyyy HH:mm:ss', { locale: vn });
        setDateTime(formattedDateTime);
      } else {
        const formattedDateTime = format(now, 'EEEE, dd MMMM yyyy HH:mm:ss');
        setDateTime(formattedDateTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [i18n]);

  return (
    <>
      {isShowTime && <h2 className="py-6 font-medium text-xl">{dateTime.toString()}</h2>}
      <MapContainer
        className={`select-none ${heightFull ? 'min-h-[400px] h-full' : 'h-[500px]'} w-full`}
        center={[16.9, 104.1]}
        zoom={5}
        attributionControl={false}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}?apikey=ca52cae166e440f18779607cdbf9221b" />
        <AttributionControl prefix="VTC Telecom" />
        {airCraftInfo.map((item) => {
          const isLatValid = !isNaN(Number(item.lat_location));
          const isLongValid = !isNaN(Number(item.long_location));
          if (isLatValid && isLongValid) {
            return (
              <MarkerWithPopup
                key={item.id}
                airplane={item}
                selectedAirplane={selectedAirplane}
                popupVisible={!!popupVisibility[item.id]}
              />
            );
          } else {
            return null;
          }
        })}
      </MapContainer>
    </>
  );
}

export default Map;
