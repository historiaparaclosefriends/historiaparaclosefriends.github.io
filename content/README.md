# Datos editoriales

Esta carpeta documenta el contrato entre Google Sheets y la web estática. En la siguiente fase añadiremos los archivos generados; no se copiarán valores a mano desde el código de la interfaz.

## Episodio

Cada episodio conservará los campos que ya existen en `EPISODIOS`:

- `fecha`
- `titulo`
- `subtitulo`
- `categorias`
- `periodo`
- `url_audio`
- `url_youtube`

La bibliografía se vinculará mediante el título de cada episodio durante la primera importación, pero el archivo generado guardará la relación directamente para no depender de coincidencias de texto en la web publicada.

## Categoría

Cada categoría conservará `id`, `nombre`, `descripcion`, `imagen_drive_url`, `color` y `orden`.

## Datos globales

Los textos de `HOME`, los enlaces, plataformas y redes sociales se exportarán como datos globales. Las URLs de Google Apps Script no formarán parte de la versión publicada.
