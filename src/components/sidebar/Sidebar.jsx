import { Outlet } from "react-router-dom";
import AppNav from "../appNav/AppNav";
import Footer from "../footer/Footer";
import Logo from "../logo/Logo";
import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <p>List of cities</p>
      <Footer />
    </div>
  );
}

export default Sidebar;
