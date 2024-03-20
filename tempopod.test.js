import { test, expect } from "vitest"
import fs from "fs/promises"
import path from "path"
import {
    selectEpisodesFromFeed,
    selectEpisodesFromFeedContent,
} from "./tempopod.js"

test("Prueba de manejo de error al obtener el feed del podcast", async () => {
    try {
        await selectEpisodesFromFeed(
            30,
            "https://feedquenoesxista.com/feed.xml"
        )
        expect().fail(
            "Se esperaba un error al obtener el feed, pero no se lanzó ninguna excepción"
        )
    } catch (error) {
        expect(error instanceof Error).toBe(
            true,
            "Se esperaba que se lanzara una excepción de error al obtener el feed"
        )
        // expect(error.message).toBe("Error fetching feed: Failed to fetch")
    }
})

test("Prueba de respuesta vacía cuando el feed no contiene episodios de podcast", async () => {
    const emptyFeedContent = await fs.readFile(
        path.join(__dirname, "feed", "empty.xml"),
        "utf-8"
    )
    const selectedEpisodes = await selectEpisodesFromFeedContent(
        30,
        emptyFeedContent
    )
    expect(selectedEpisodes).toEqual([])
})

test("Prueba de respuesta vacía cuando el tiempo seleccionado es menor que la duración del episodio más corto", async () => {
    // Mock feed con un episodio de 10 minutos
    const feedContent = `
    <rss version="2.0">
    <channel>
        <item>
        <title>Episodio 1</title>
        <itunes:duration>600</itunes:duration> <!-- Duración de 10 minutos -->
        </item>
    </channel>
    </rss>
`
    // Temporizador seleccionado de 5 minutos
    const selectedTempo = 5

    // Probar la función selectEpisodesFromFeed con el feed mock y el tempo seleccionado
    const selectedEpisodes = await selectEpisodesFromFeedContent(
        selectedTempo,
        feedContent
    )
    // Comprobar que devuelve un array vacío
    expect(selectedEpisodes).toEqual([])
})

test("Prueba de manejo de episodios sin duración o sin etiqueta 'itunes:duration'", async () => {
    // Mock feed con un episodio sin duración
    const feedContent = `
    <rss version="2.0">
    <channel>
        <item>
        <title>Episodio 1</title>
        <!-- No se incluye la duración -->
        </item>
    </channel>
    </rss>
`
    // Temporizador seleccionado arbitrariamente grande
    const selectedTempo = 1000

    // Probar la función selectEpisodesFromFeed con el feed mock y el tempo seleccionado
    const selectedEpisodes = await selectEpisodesFromFeedContent(
        selectedTempo,
        feedContent
    )
    // Comprobar que devuelve un array vacío ya que el episodio no tiene duración
    expect(selectedEpisodes).toEqual([])
})
