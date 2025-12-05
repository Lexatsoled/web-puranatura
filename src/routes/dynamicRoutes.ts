import {
  RouteMetadata,
  buildCategoryMetadata,
  getCategoryPaths,
  getBlogPostPaths,
  buildBlogPostMetadata,
  getProductPaths,
  getProductMetadata,
} from './dynamicRoutes.helpers';

interface DynamicRoute<T = any> {
  path: string;
  getMetadata: (params: T) => Promise<RouteMetadata>;
  generateStaticPaths?: () => Promise<T[]>;
}

interface CategoryParams {
  category: string;
}

interface ProductParams {
  id: string;
}

interface BlogPostParams {
  slug: string;
}

export const categoryRoute: DynamicRoute<CategoryParams> = {
  path: '/tienda/categoria/:category',
  getMetadata: buildCategoryMetadata,
  generateStaticPaths: getCategoryPaths,
};

export const productRoute: DynamicRoute<ProductParams> = {
  path: '/tienda/producto/:id',
  getMetadata: getProductMetadata,
  generateStaticPaths: getProductPaths,
};

export const blogPostRoute: DynamicRoute<BlogPostParams> = {
  path: '/blog/:slug',
  getMetadata: buildBlogPostMetadata,
  generateStaticPaths: getBlogPostPaths,
};

export const dynamicRoutes = [categoryRoute, productRoute, blogPostRoute];
