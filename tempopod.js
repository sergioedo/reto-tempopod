import fetch from "node-fetch"

const fetchFeedContentFromURL = async (feedUrl) => {
    try {
        const response = await fetch(feedUrl)
        if (!response.ok) {
            throw new Error("Failed to fetch")
        }
        const str = await response.text()
        return str
    } catch (error) {
        throw new Error("Error fetching feed: " + error.message)
    }
}

export const selectEpisodesFromFeedContent = (selectedTempo, feedContent) => {
    const episodes = []
    const itemRegex = /<item>(.*?)<\/item>/gs
    let itemMatch
    while ((itemMatch = itemRegex.exec(feedContent)) !== null) {
        const episodeContent = itemMatch[1]
        const titleMatch = episodeContent.match(/<title>(.*?)<\/title>/)
        const durationMatch = episodeContent.match(
            /<itunes:duration>(.*?)<\/itunes:duration>/
        )
        if (titleMatch && durationMatch) {
            episodes.push({
                title: titleMatch[1],
                duration: parseInt(durationMatch[1]),
            })
        }
    }
    return selectEpisodes(episodes, selectedTempo)
}

export const selectEpisodesFromFeed = async (selectedTempo, feedUrl) => {
    const feedContent = await fetchFeedContentFromURL(feedUrl)
    return selectEpisodesFromFeedContent(selectedTempo, feedContent)
}

const selectEpisodes = (episodes, tempo) => {
    let selected = []
    let totalTime = 0
    episodes = episodes.sort(() => 0.5 - Math.random())

    for (let episode of episodes) {
        if (totalTime + episode.duration <= tempo * 60) {
            selected.push(episode.title)
            totalTime += episode.duration
        }
    }

    return selected
}
