# Historia para Close Friends

Base de la futura web estática de **Historia para Close Friends**.

## Decisión técnica

- Publicación: GitHub Pages.
- Diseño: HTML, CSS y JavaScript vanilla; no WordPress ni constructores visuales.
- Contenido editorial: Google Sheets.
- Web publicada: archivos HTML estáticos para que cada sección y episodio tenga una URL rastreable.

Google Sheets seguirá siendo el lugar donde se redactan y ordenan los contenidos. Antes de publicar, un proceso de exportación generará los datos estáticos que consume la web. El navegador de los visitantes no tendrá acceso a la hoja de cálculo.

## Estructura prevista

```text
assets/       Estilos, JavaScript e imágenes de la interfaz.
content/      Esquema de los datos exportados desde Google Sheets.
scripts/      Herramientas de exportación y publicación.
index.html    Portada.
episodios/    Listado y páginas individuales de episodios.
bibliografia/ Página de bibliografía.
```

## Seguridad

El repositorio publicado será público. No se deben guardar claves, contraseñas, tokens de GitHub ni documentos privados. Los datos que se exporten serán únicamente los que puedan mostrarse públicamente en la web.
