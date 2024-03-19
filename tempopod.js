import fetch from 'node-fetch';

async function selectEpisodesFromFeed(selectedTempo, feedUrl) {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const str = await response.text();
    const episodes = [];
    const itemRegex = /<item>(.*?)<\/item>/gs;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(str)) !== null) {
      const episodeContent = itemMatch[1];
      const titleMatch = episodeContent.match(/<title>(.*?)<\/title>/);
      const durationMatch = episodeContent.match(/<itunes:duration>(.*?)<\/itunes:duration>/);
      if (titleMatch && durationMatch) {
        episodes.push({
          title: titleMatch[1],
          duration: parseInt(durationMatch[1]),
        });
      }
    }
    return selectEpisodes(episodes, selectedTempo);
  } catch (error) {
    throw new Error('Error fetching feed: ' + error.message);
  }
}

function selectEpisodes(episodes, tempo) {
  let selected = [];
  let totalTime = 0;
  episodes = episodes.sort(() => 0.5 - Math.random());

  for (let episode of episodes) {
    if (totalTime + episode.duration <= tempo * 60) {
      selected.push(episode.title);
      totalTime += episode.duration;
    }
  }

  return selected;
}

export default selectEpisodesFromFeed;
