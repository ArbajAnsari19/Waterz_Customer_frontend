import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Layouts/YatchCard.module.css';
import { Yacht } from '../../types/yachts';

interface YachtCardProps {
  yacht: Yacht;
}

const YachtCard: React.FC<YachtCardProps> = ({ yacht }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/yacht/${yacht._id}`, { state: { yacht } });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{yacht.name}</h2>
        <p className={styles.capacity}>Capacity: {yacht.capacity} people</p>
        {/* <p className={styles.capacity}>Crew: {yacht.crewCount}</p> */}
      </div>
      <div className={styles.imageContainer}>
        <img 
          src={yacht.images[0]} 
          alt={yacht.name} 
          className={styles.image} 
        />
        <div className={styles.priceTag}>
          Starting from ₹{yacht.price.sailing.nonPeakTime}
        </div>
      </div>
      <button className={styles.bookButton} onClick={handleBookNow}>
        Book Now
      </button>
    </div>
  );
};

export default YachtCard;
