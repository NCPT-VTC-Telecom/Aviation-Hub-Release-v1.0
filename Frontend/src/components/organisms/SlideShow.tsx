import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import './assets/slider.css';
import AirplaneCard from 'components/molecules/Card';
import { FlightData } from 'types/aviation';
import { EmptyUserCard } from 'components/organisms/skeleton';

interface Props {
  data: FlightData[];
  onSelectAirplane: (flight: FlightData) => void;
}

const ListCardAirplane: React.FC<Props> = ({ data, onSelectAirplane }) => {
  return (
    <>
      {data.length > 0 ? (
        <Swiper
          modules={[Grid, Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={3}
          navigation
          grid={{
            fill: 'row',
            rows: 2
          }}
          pagination={{ clickable: true }}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false
          // }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              grid: { rows: 1, fill: 'row' }
            },
            400: {
              slidesPerView: 1,
              grid: { rows: 1, fill: 'row' }
            },
            500: {
              slidesPerView: 1,
              grid: { rows: 1, fill: 'row' }
            },
            740: {
              slidesPerView: 1,
              grid: { rows: 1, fill: 'row' }
            },
            1024: {
              slidesPerView: 2,
              grid: { rows: 2, fill: 'row' }
            },
            1800: {
              slidesPerView: 3,
              grid: { rows: 2, fill: 'row' }
            }
          }}
          // className="!size-full"
        >
          {data.map((flight, idx) => (
            <SwiperSlide key={idx} className="cursor-pointer">
              <div onClick={() => onSelectAirplane(flight)}>
                <AirplaneCard flight={flight} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyUserCard title={'do-not-have-aircraft-right-now'} />
      )}
    </>
  );
};

export default ListCardAirplane;
