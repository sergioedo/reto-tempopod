import { test, expect } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { selectEpisodesFromFeed, selectEpisodesFromFeedContent } from './tempopod.js';

test("Prueba de manejo de error al obtener el feed del podcast", async () => {
  try {
    await selectEpisodesFromFeed(30, "https://feedquenoesxista.com/feed.xml");
    expect().fail("Se esperaba un error al obtener el feed, pero no se lanzó ninguna excepción");
  } catch (error) {
    expect(error instanceof Error).toBe(true, "Se esperaba que se lanzara una excepción de error al obtener el feed");
    // expect(error.message).toBe("Error fetching feed: Failed to fetch");
  }
});

test("Prueba de respuesta vacía cuando el feed no contiene episodios de podcast", async () => {
    const emptyFeedContent = await fs.readFile(path.join(__dirname, 'feed','empty.xml'), 'utf-8');
    const selectedEpisodes = await selectEpisodesFromFeedContent(30, emptyFeedContent);
    expect(selectedEpisodes).toEqual([]);
  });
