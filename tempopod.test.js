import { test, expect } from 'vitest';
import selectEpisodesFromFeed from './tempopod.js';

test("Prueba de manejo de error al obtener el feed del podcast", async () => {
  try {
    await selectEpisodesFromFeed(30, "https://feedquenoesxista.com/feed.xml");
    expect().fail("Se esperaba un error al obtener el feed, pero no se lanzó ninguna excepción");
  } catch (error) {
    expect(error instanceof Error).toBe(true, "Se esperaba que se lanzara una excepción de error al obtener el feed");
    // expect(error.message).toBe("Error fetching feed: Failed to fetch");
  }
});
