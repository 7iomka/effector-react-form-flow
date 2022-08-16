/* eslint-disable import/first */
import type { ReactElement } from "react";
import clsx from "clsx";
import { CoreLayout } from "@/widgets/layouts/_core";
import type { CoreLayoutProps } from "@/widgets/layouts/_core";
import { Header } from "@/widgets/header";

import { Main } from "@/widgets/main";
import { Footer } from "@/widgets/footer";
import { createView } from "@/shared/lib/view";
import styles from "./base-layout.module.scss";

type BaseLayoutProps = CoreLayoutProps & {
  header?: ReactElement;
  footer?: ReactElement;
};

/**
 * Overrides the CoreLayout to adapt it to the Base layout.
 */

const BaseLayout = createView<BaseLayoutProps>()
  .displayName("BaseLayout")
  .view(({ className, children, header = <Header />, footer = <Footer /> }) => (
    <CoreLayout className={clsx(styles.BaseLayout, className)}>
      {/* <Fancybox /> */}
      <div className={styles.BaseLayout__header}>{header}</div>
      <div className={styles.BaseLayout__wrapper}>
        <div className={styles.BaseLayout__main}>
          <Main>{children}</Main>
        </div>
        <div className={styles.BaseLayout__footer}>{footer}</div>
      </div>
    </CoreLayout>
  ));

export type { BaseLayoutProps };
export { BaseLayout };
