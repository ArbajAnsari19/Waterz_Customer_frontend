import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Layouts/YatchCard.module.css';

interface YachtCardProps {
  name: string;
  capacity: number;
  startingPrice: string;
  images: string;
  bookingId: string; // Unique ID for the yacht
  booking?: any;
}

const BookedCard: React.FC<YachtCardProps> = ({ name, capacity, startingPrice, images, bookingId, booking }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/booking/${bookingId}`, {state: {booking: booking}});
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.capacity}>Capacity: {capacity} people</p>
      </div>
      <div className={styles.imageContainer}>
        <img src={images} alt={name} className={styles.image} />
        <div className={styles.priceTag}>Starting from {startingPrice}</div>
      </div>
      <button className={styles.bookButton} onClick={handleBookNow}>
        View Details
      </button>
    </div>
  );
};

export default BookedCard;
