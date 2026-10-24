import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://awinashgoswami.github.io',
  output: 'static',
  // base is intentionally unset (defaults to '/') because this is a user site.
  redirects: {
    '/home.html': '/portal',
    '/classroom.html': '/classroom',
    '/notes.html': '/notes',
    '/quiz.html': '/quiz',
    '/tutorials.html': '/tutorials',
    '/blog.html': '/blog',
    '/blog-post.html': '/blog-post',
    '/glossary.html': '/glossary',
    '/books.html': '/books',
  },
});

