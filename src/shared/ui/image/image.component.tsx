import type { ImageProps as NextImageProps } from 'next/future/image';
import NextImage from 'next/future/image';
import clsx from 'clsx';
import { createView } from '@/shared/lib/view';

interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt?: string; // make alt optional (by provided fallback)
  withoutAutoSize?: boolean;
}

const Image = createView<ImageProps>()
  .displayName('Image')
  .view(
    ({
      className,
      alt = '',
      fill,
      sizes = fill ? '100vw' : undefined,
      placeholder = 'blur',
      blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88R8AAvUB+VkkrXoAAAAASUVORK5CYII=',
      withoutAutoSize,
      ...rest
    }) => (
      <NextImage
        className={clsx(className, !fill && !withoutAutoSize && 'w-full h-auto')}
        alt={alt}
        fill={fill}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        {...rest}
      />
    ),
  );

export type { ImageProps };
export { Image };
