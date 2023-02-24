import { Fragment, ReactNode } from "react";
import { NodeData } from "../../../types";
import styles from "./content.module.css";

export function Content({
  title,
  children,
}: Pick<NodeData, "title"> & { children?: ReactNode }) {
  return (
    <Fragment>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.container}>{children}</div>
    </Fragment>
  );
}
