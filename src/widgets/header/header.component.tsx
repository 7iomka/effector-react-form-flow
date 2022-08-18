import clsx from "clsx";
import { createView } from "@/shared/lib/view";
import styles from "./header.module.scss";

interface HeaderProps {}

const Header = createView<HeaderProps>().view(() => (
  <div className={clsx(styles.Header)}>
    <div className="container">
      <div className={styles.HeaderTop} id="header_top">
        header
      </div>
    </div>
  </div>
));

export type { HeaderProps };
export { Header };
