

In `Memo.Mon.digest.html.html`, add this **inside** `<main class="article-grid">`, alongside the existing cards:

```html
<a class="article-card article-card--cover"
   href="Digest%20Articles/Memory%20Monday%20Digest%20Edition%20%232.html">
    <img src="Digest%20Articles/edition-2-cover.jpg"
         alt="">
    <h2>Memory Monday Digest edition #2</h2>
</a>
```

Change the `href` to the new article’s filename, the `src` to its cover image, and the heading to its title. The article HTML and image paths must point to files that actually exist. Keep the `%23` encoding for `#` in the filename.