export function getPermaView(listener) {
    if (!listener.$tw) return '';
    const $tw = listener.$tw;
    const story = $tw.wiki.getTiddlerList("$:/StoryList");
    if (story.length > 0) {
        const filter = story.map((s) => `[[${s}]]`);
        return `#:${encodeURIComponent(filter.join(' '))}`;
    }
    return '';
}