import React from "react";
import styles from "../../styles/Navbar/Navbar.module.css"
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return(
        <div className={styles.comp_body}>
            <div className={styles.content}>
                <Link to="/">
                    <div className={styles.item}>Home</div>
                </Link>
                <Link to="/discover">
                    <div className={styles.item}>Discover</div>
                </Link>
                <Link to="/bookings">
                    <div className={styles.item}>My Bookings</div>
                </Link>
                <Link to="/location">
                <div className={styles.item}>Location</div>
                </Link>
                <Link to="/signup">
                <div className={styles.item}>SignUp</div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar;