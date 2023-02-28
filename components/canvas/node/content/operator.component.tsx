import styles from "./operator.module.css";

export function Operator({ value }: { value: number }) {
  return (
    <>
      <div className={styles.contentContainer}>{value}</div>
      <div className={styles.selector}>Addition</div>
    </>
  );
}
