import React from "react";
import styles from "../../styles/Booking/Booking.module.css";
import Y2 from "../../assets/Yatch/Y2.svg";
import BookedCard from "../Layouts/BookedCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookingAPI } from "../../api/bookingApi";

interface BookingType {
  id: string;
  name: string;
  capacity: number;
  startingPrice: string;
  imageUrl: string;
}
const Booking: React.FC = () => {
  const [currentBookings, setCurrentBookings] = useState<BookingType[]>([]);
  const [previousBookings, setPreviousBookings] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const current = await bookingAPI.getCurrentBookings();
        const previous = await bookingAPI.getPreviousBookings();
        console.log("CURRENT DATA IS HERE :",current);
        console.log("PREVIOUS DATA IS HERE :",previous);
        // Validate data before setting state
        if (Array.isArray(current)) {
          setCurrentBookings(current);
        }
        if (Array.isArray(previous)) {
          setPreviousBookings(previous);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);
  if (isLoading) {
    return <div className={styles.loading}>Loading bookings...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  if (!currentBookings || !previousBookings) {
    return <div className={styles.error}>No booking data available</div>;
  }

  const NoBookingsMessage = ({ type }: { type: string }) => (
    <div className={styles.noBookings}>
      <p>No {type} bookings available</p>
    </div>
  );

  return (
    <div className={styles.comp_body}>
      <div className={styles.image_box}>
        <img src={Y2} className={styles.Y2} alt="Yacht" />
      </div>
      <div className={styles.hero_left}>
        <div className={styles.hero_head}>
          Book Your Yacht
        </div>
        <Link to="/location">
          <div className={styles.hero_btn}>
            Start Now
          </div>
        </Link>
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head2}>My bookings</div>
        <div className={styles.section_head}>Current Bookings</div>
        <div className={styles.yatch_slider}>
          {currentBookings.length === 0 ? (
            <NoBookingsMessage type="current" />
          ) : (
            <Swiper
              spaceBetween={10}
              slidesPerView={3.2}
              pagination={{ clickable: true }}
              style={{ padding: "20px 0", width: "100%" }}
            >
              {currentBookings.map((yacht) => (
                <SwiperSlide key={yacht.id}>
                  <BookedCard
                    name={yacht.name}
                    capacity={yacht.capacity}
                    startingPrice={yacht.startingPrice}
                    imageUrl={yacht.imageUrl}
                    yachtId={yacht.id}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>Previous Bookings</div>
        <div className={styles.yatch_slider}>
          {previousBookings.length === 0 ? (
            <NoBookingsMessage type="previous" />
          ) : (
            <Swiper
              spaceBetween={10}
              slidesPerView={3.2}
              pagination={{ clickable: true }}
              style={{ padding: "20px 0", width: "100%" }}
            >
              {previousBookings.map((yacht) => (
                <SwiperSlide key={yacht.id}>
                  <BookedCard
                    name={yacht.name}
                    capacity={yacht.capacity}
                    startingPrice={yacht.startingPrice}
                    imageUrl={yacht.imageUrl}
                    yachtId={yacht.id}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;