import React from "react";
import Navbar from "../Navbar/Navbar";
import {ContactForm} from "../Contact/Contact";
import styles from "../../styles/Layouts/MainLayout.module.css"
import Loader1 from "../Loaders/Loader1";
import { useAppSelector } from "../../redux/store/hook";

type MainLayoutProps = {
    children: React.ReactNode; 
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isLoading = useAppSelector((state) => state.loading.isLoading);

    if(isLoading){
        return( 
        <Loader1/>)
        ;
    }
    return(
        <div className={styles.comp_body}>
            <Navbar/>
            {children}
            <ContactForm/>
        </div>
    )
}

export default MainLayout;