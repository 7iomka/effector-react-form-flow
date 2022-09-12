import { createEvent } from "effector";
// import { $$category } from '@/entities/category';

const enter = createEvent();

// // Fetch categories on layout started
// sample({
//   source: enter,
//   fn: () => {},
//   target: $$category.getCategoriesFx,
// });

// // Fetch featured subcategories
// sample({
//   source: enter,
//   fn: () => {},
//   target: $$category.getFeatureSubcategoriesFx,
// });

export { enter };
