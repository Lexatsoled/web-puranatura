import { sanitizeHtml, sanitizeText, sanitizeUrl } from './sanitizer';
import { BlogPost } from '../../types';

export const sanitizeBlogPost = (post: BlogPost): BlogPost => ({
  ...post,
  title: sanitizeText(post.title),
  summary: sanitizeText(post.summary),
  imageUrl: sanitizeUrl(post.imageUrl),
  content: sanitizeHtml(post.content),
});
