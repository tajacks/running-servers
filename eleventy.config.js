import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import he from "he";
import markdownIt from "markdown-it";

export default function(eleventyConfig) {
  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);

  // Markdown renderer for shortcode content
  const md = markdownIt({ html: true });

  // Simple shortcode: {% hello "world" %} outputs "world hello"
  eleventyConfig.addShortcode("hello", function(text) {
    return `${text} hello`;
  });


  // SHORT CODES //
  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  eleventyConfig.addPairedShortcode("command", function(content, label = "Run") {
    const escaped = he.encode(content.trim());
    const raw = content.trim().replace(/"/g, '&quot;');
    return `<div class="command-example">
<div class="command-label">${label}: <button class="copy-btn" data-content="${raw}" data-icon='${copyIcon}' data-check='${checkIcon}'>${copyIcon}</button></div>
<pre><code>${escaped}</code></pre>
</div>`;
  });

  eleventyConfig.addPairedShortcode("codefile", function(content, filename) {
    const escaped = he.encode(content.trim());
    const raw = content.trim().replace(/"/g, '&quot;');
    return `<div class="code-file">
<div class="code-file-name">${filename} <button class="copy-btn" data-content="${raw}" data-icon='${copyIcon}' data-check='${checkIcon}'>${copyIcon}</button></div>
<pre><code>${escaped}</code></pre>
</div>`;
  });


  // TEXT FLOURISH SHORTCODES //

  // Callout shortcode - warning, info, tip variants
  // Usage: {% callout "warning", "Title" %}Content{% endcallout %}
  const calloutIcons = {
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M3.6 15.4L10.4 4.6a2 2 0 0 1 3.2 0l6.8 10.8a2 2 0 0 1-1.6 3.2H5.2a2 2 0 0 1-1.6-3.2z"></path></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
    tip: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v1"></path><path d="M12 21v1"></path><path d="m4.6 4.6.7.7"></path><path d="m18.7 18.7.7.7"></path><path d="M2 12h1"></path><path d="M21 12h1"></path><path d="m4.6 19.4.7-.7"></path><path d="m18.7 5.3.7-.7"></path><circle cx="12" cy="12" r="4"></circle></svg>`
  };

  eleventyConfig.addPairedShortcode("callout", function(content, type = "info", title = "") {
    const validTypes = ["warning", "info", "tip"];
    const safeType = validTypes.includes(type) ? type : "info";
    const icon = calloutIcons[safeType];
    const escapedTitle = title ? he.encode(title) : "";
    const renderedContent = md.render(content.trim());

    const headerHtml = escapedTitle
      ? `<div class="callout-header">${icon}<span class="callout-title">${escapedTitle}</span></div>`
      : `<div class="callout-header">${icon}</div>`;

    return `<aside class="callout callout-${safeType}">
${headerHtml}
<div class="callout-content">${renderedContent}</div>
</aside>`;
  });

  // Pullquote shortcode - emphasized quotes
  // Usage: {% pullquote "Attribution" %}Quote text{% endpullquote %}
  eleventyConfig.addPairedShortcode("pullquote", function(content, attribution = "") {
    const escapedAttribution = attribution ? he.encode(attribution) : "";
    const renderedContent = md.renderInline(content.trim());

    const attributionHtml = escapedAttribution
      ? `<footer class="pullquote-attribution">— ${escapedAttribution}</footer>`
      : "";

    return `<figure class="pullquote">
<blockquote>${renderedContent}</blockquote>
${attributionHtml}
</figure>`;
  });

  // Sidenote shortcode - secondary commentary
  // Usage: {% sidenote "Label" %}Content{% endsidenote %}
  eleventyConfig.addPairedShortcode("sidenote", function(content, label = "Note") {
    const escapedLabel = he.encode(label);
    const renderedContent = md.renderInline(content.trim());

    return `<aside class="sidenote">
<span class="sidenote-label">${escapedLabel}:</span>
<span class="sidenote-content">${renderedContent}</span>
</aside>`;
  });

  // Key takeaway shortcode - highlighted summary
  // Usage: {% keytakeaway "Title" %}Content{% endkeytakeaway %}
  const keyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`;

  eleventyConfig.addPairedShortcode("keytakeaway", function(content, title = "Key Takeaway") {
    const escapedTitle = he.encode(title);
    const renderedContent = md.render(content.trim());

    return `<div class="keytakeaway">
<div class="keytakeaway-header">${keyIcon}<span class="keytakeaway-title">${escapedTitle}</span></div>
<div class="keytakeaway-content">${renderedContent}</div>
</div>`;
  });

  // Inline highlight shortcode - for important inline data
  // Usage: {% hl %}important text{% endhl %}
  eleventyConfig.addPairedShortcode("hl", function(content) {
    const trimmedContent = content.trim();
    return `<mark class="text-highlight">${trimmedContent}</mark>`;
  });

  // Term list shortcode - table of technical terms
  // Usage: {% termlist "Optional Title" %}
  // term1: description of term1
  // term2: description of term2
  // {% endtermlist %}
  eleventyConfig.addPairedShortcode("termlist", function(content, title = "") {
    const lines = content.trim().split('\n').filter(line => line.trim());

    const rows = lines.map(line => {
      const trimmed = line.trim();
      const colonIndex = trimmed.indexOf(':');

      if (colonIndex > 0) {
        const term = trimmed.substring(0, colonIndex).trim();
        const description = trimmed.substring(colonIndex + 1).trim();
        const escapedTerm = he.encode(term);
        const renderedDesc = md.renderInline(description);
        return `<tr>
<td class="termlist-term">${escapedTerm}</td>
<td class="termlist-desc">${renderedDesc}</td>
</tr>`;
      } else {
        const escapedTerm = he.encode(trimmed);
        return `<tr>
<td class="termlist-term">${escapedTerm}</td>
<td class="termlist-desc"></td>
</tr>`;
      }
    });

    const escapedTitle = title ? he.encode(title) : "";
    const captionHtml = escapedTitle
      ? `<caption class="termlist-caption">${escapedTitle}</caption>`
      : "";

    return `<table class="termlist">
${captionHtml}
<tbody>
${rows.join('\n')}
</tbody>
</table>`;
  });


  // Passthrough copy for CSS
  eleventyConfig.addPassthroughCopy("src/css");

  // Create chapters collection - all markdown files in src/chapters
  eleventyConfig.addCollection("chapters", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/chapters/**/*.md")
      .sort((a, b) => {
        const aChapter = a.data.chapterNumber || 0;
        const bChapter = b.data.chapterNumber || 0;
        const aSection = a.data.sectionNumber || 0;
        const bSection = b.data.sectionNumber || 0;

        // Sort by chapter first, then by section
        if (aChapter !== bChapter) {
          return aChapter - bChapter;
        }
        return aSection - bSection;
      });
  });

  // Filter to get unique chapters from sections
  eleventyConfig.addFilter("getUniqueChapters", function(chapters) {
    const chapterMap = new Map();

    chapters.forEach(page => {
      const chapterNum = page.data.chapterNumber;
      if (chapterNum && page.data.sectionNumber && !chapterMap.has(chapterNum)) {
        // Extract directory name and clean it up
        const dirName = page.filePathStem.split('/')[2] || '';
        // Remove chapter number prefix (e.g., "01-introduction" -> "introduction")
        const cleanName = dirName.replace(/^\d+-/, '');
        // Capitalize first letter
        const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        chapterMap.set(chapterNum, {
          chapterNumber: chapterNum,
          title: title || `Chapter ${chapterNum}`
        });
      }
    });

    return Array.from(chapterMap.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);
  });

  // Filter to get sections for a specific chapter
  eleventyConfig.addFilter("getChapterSections", function(chapters, chapterNum) {
    return chapters.filter(page =>
      page.data.chapterNumber === chapterNum && page.data.sectionNumber
    );
  });

  // Filter to get chapter index page by number
  eleventyConfig.addFilter("getChapterByNumber", function(chapters, chapterNum) {
    return chapters.find(page =>
      page.data.chapterNumber === chapterNum && !page.data.sectionNumber
    );
  });

  // Add previous/next page data to each chapter/section
  eleventyConfig.addCollection("chaptersWithNav", function(collectionApi) {
    const chapters = collectionApi.getFilteredByGlob("src/chapters/**/*.md")
      .sort((a, b) => {
        const aChapter = a.data.chapterNumber || 0;
        const bChapter = b.data.chapterNumber || 0;
        const aSection = a.data.sectionNumber || 0;
        const bSection = b.data.sectionNumber || 0;

        if (aChapter !== bChapter) {
          return aChapter - bChapter;
        }
        return aSection - bSection;
      });

    // Add previousPage and nextPage to each item
    chapters.forEach((page, index) => {
      page.data.previousPage = index > 0 ? chapters[index - 1] : null;
      page.data.nextPage = index < chapters.length - 1 ? chapters[index + 1] : null;
    });

    return chapters;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
