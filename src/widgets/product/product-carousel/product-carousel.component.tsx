import { useCallback, useEffect, useId, useState } from "react";
import clsx from "clsx";
import type { Embla } from "@mantine/carousel";
import { Carousel } from "@mantine/carousel";
import { Image } from "@/shared/ui";
import { createView } from "@/shared/lib/view";
import styles from "./product-carousel.module.scss";
import { useProductThumbCarouselStyles } from "./product-carouse.styles";

interface ProductCarouselProps {
  className?: string;
  items: {
    src: string;
    thumbSrc?: string;
    caption?: string;
  }[];
}

const ProductCarousel = createView<ProductCarouselProps>()
  .displayName("ProductCarousel")
  .map(() => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [embla, setEmbla] = useState<Embla | null>(null);
    const [emblaThumbs, setEmblaThumbs] = useState<Embla | null>(null);

    const instanceId = useId();
    const { classes: productCarouselClasses } = useProductThumbCarouselStyles();

    const onThumbClick = useCallback(
      (index: number) => {
        if (!embla || !emblaThumbs) return;
        if (emblaThumbs.clickAllowed()) embla.scrollTo(index);
      },
      [embla, emblaThumbs]
    );

    const onSelect = useCallback(() => {
      if (!embla || !emblaThumbs) return;
      setSelectedIndex(embla.selectedScrollSnap());
      emblaThumbs.scrollTo(embla.selectedScrollSnap());
    }, [embla, emblaThumbs, setSelectedIndex]);

    return {
      instanceId,
      productCarouselClasses,
      selectedIndex,
      setSelectedIndex,
      onSelect,
      onThumbClick,
      embla,
      setEmbla,
      emblaThumbs,
      setEmblaThumbs,
    };
  })
  .effect(({ embla, onSelect }) => {
    useEffect(() => {
      if (!embla) return;
      onSelect();
      embla.on("select", onSelect);
    }, [embla, onSelect]);
  })
  .memo()
  .view(
    ({
      className,
      productCarouselClasses,
      items,
      instanceId,
      selectedIndex,
      onThumbClick,
      setEmbla,
      setEmblaThumbs,
    }) => {
      if (items.length === 0) return null;

      return (
        <div className={clsx(styles.root, className)}>
          <div className={styles.main}>
            <Carousel getEmblaApi={setEmbla} skipSnaps={false} loop>
              {items.map((item, index) => (
                <Carousel.Slide key={index}>
                  <div
                    className={styles.mainSlide}
                    data-fancybox={instanceId}
                    data-src={item.src}
                    data-caption={item.caption}
                    key={index}
                  >
                    <div className="relative w-full h-full aspect-w-11 aspect-h-13">
                      <Image
                        src={item.src}
                        alt=""
                        className="object-cover object-bottom"
                        fill
                        quality={100}
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
          <div className={styles.thumbs}>
            <Carousel
              getEmblaApi={setEmblaThumbs}
              containScroll="keepSnaps"
              dragFree
              classNames={productCarouselClasses}
            //   withControls={false}
              slidesToScroll={1}
              includeGapInSize
              slideGap={6}
              slideSize="20%"
            >
              {items.map((item, index) => (
                <Carousel.Slide
                  key={index}
                  className={clsx(
                    styles.thumbSlide,
                    index === selectedIndex && styles.thumbSlideActive
                  )}
                >
                  <button
                    type="button"
                    className={styles.thumbSlideInner}
                    onClick={() => onThumbClick(index)}
                    key={index}
                  >
                    <div className="relative w-full h-50 aspect-w-11 aspect-h-13">
                      <Image
                        src={item.thumbSrc || item.src}
                        alt=""
                        className={clsx("object-cover object-bottom")}
                        fill
                        quality={100}
                        priority={index < 5}
                      />
                    </div>
                  </button>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>
      );
    }
  ).Memo;

export { ProductCarousel };
