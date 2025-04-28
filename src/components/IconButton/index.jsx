import styles from "./iconbutton.module.css";

export const IconButton = ({ children, disabled, ...rest }) => {
  return (
    <button {...rest} className={styles.btn} disabled={disabled}>
      {children}
    </button>
  );
};
