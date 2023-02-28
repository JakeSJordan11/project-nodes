import styles from "./port.module.css";
import type { PortProps } from "./port.types";

export function Port({ id, title }: PortProps) {
  return <button id={id} title={title} type="button" className={styles.port} />;
}
