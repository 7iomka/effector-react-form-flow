import clsx from "clsx";
import styles from "./footer.module.scss";
import { createView } from "@/shared/lib/view";

interface FooterProps {
  className?: string;
}

const Footer = createView<FooterProps>()
  .displayName("Footer")
  .memo()
  .view(({ className }) => (
    <footer className={clsx(styles.Footer, className)}>
      <div className="container">footer</div>
    </footer>
  )).Memo;

export { Footer };
