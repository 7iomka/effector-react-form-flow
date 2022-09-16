import clsx from 'clsx';
import xss from 'xss';
import { formatPrice } from '@steklo24/utils';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { ToggleCompareButton } from '@/features/toggle-compare';
import type { ProductEntity } from '@/entities/product';
import { StockStatus } from '@/entities/product';
import { Media } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import { ProductCarousel } from './product-carousel';
import styles from './product.module.scss';

interface ProductProps {
  className?: string;
  data: ProductEntity;
}

const Product = createView<ProductProps>()
  .map(({ data: { price, discount } }) => {
    const priceFormatted = formatPrice(price);
    const showPriceWithDiscount = !!discount && discount > 0;

    const priceWithDiscountFormatted = showPriceWithDiscount ? formatPrice(price - discount) : null;
    return {
      priceFormatted,
      showPriceWithDiscount,
      priceWithDiscountFormatted,
    };
  })
  .view(
    ({
      className,
      priceFormatted,
      showPriceWithDiscount,
      priceWithDiscountFormatted,
      data: {
        productMedia,
        id,
        sku,
        url,
        title,
        description,
        availability,
        price,
        quantity,
        discount,
        isInTray,
        isInFavorite,
        isComparing,
      },
    }) => (
      <div className={clsx(styles.root, className)}>
        <div className="row gy-12">
          <div className="col-12 md:col-6 xxl:col-5">
            {/* Mobile nav */}
            <Media lessThan="md">
              <div className={styles.top}>
                <div className="row gx-4 xs:gx-12 gy-8 justify-between sm:justify-start">
                  <div className="col-6 xs:col-auto">
                    <ToggleCompareButton productId={id} isActive={isComparing} />
                  </div>
                  <div className="col-6 xs:col-auto">
                    <ToggleFavoriteButton productId={id} isActive={isInFavorite} />
                  </div>
                </div>
                <hr className="divide-y opacity-5 my-12" />
                <div className={styles.topInfo}>
                  <div className={styles.vendorCode}>Артикул {sku}</div>
                  <StockStatus className={styles.stockStatus} value={availability} />
                </div>
              </div>
            </Media>
            <ProductCarousel items={productMedia} className="mt-14 md:mt-0" />
          </div>
          <div className="col-12 md:col-6 xxl:col-7">
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: xss(title) }} />
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: xss(description) }}
            />
            {/* Tablet & Desktop nav */}
            <Media greaterThanOrEqual="md">
              <div className={styles.top}>
                <div className="row gx-12 gy-8">
                  <div className="col-auto">
                    <ToggleCompareButton productId={id} isActive={isComparing} />
                  </div>
                  <div className="col-auto">
                    <ToggleFavoriteButton productId={id} isActive={isInFavorite} />
                  </div>
                </div>
                <div className={styles.top_info}>
                  <div className={styles.vendorCode}>Артикул {sku}</div>
                  <StockStatus className={styles.stockStatus} value={availability} />
                </div>
              </div>
            </Media>
          </div>
        </div>
      </div>
    ),
  );

export { Product };
