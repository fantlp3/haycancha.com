# Redirects de las URLs legacy

El sitio anterior (PHP, ~20 años) exponía fichas de club en
`/cancha.php?url=<UrlAmigable>`. Google todavía tiene muchas de esas URLs
indexadas. El `redirects-worker` las atiende con un 301, pero como los slugs
viejos no coinciden con los de Directus, termina cayendo al listado genérico.

Este directorio cruza el dump MySQL viejo (`complejos_complejos.UrlAmigable`)
contra los clubes actuales para resolver cada URL a su ficha.

## Resultado

| | |
|---|---|
| Complejos con `UrlAmigable` en el dump | 124 (76 activos) |
| Redirects 301 verificados | 13 |
| Sin destino confiable | 111 |

`redirects-legacy.csv` — listo para importar en **Cloudflare → Bulk Redirects**.
Formato `source,target,status`. No usar Single Redirect Rules: el plan Free
admite sólo 10.

`legacy-sin-destino.csv` — las que no resolvieron, con el mejor candidato y su
score, para revisar a mano. Siguen cayendo al fallback del worker.

## Cómo se hizo el match

`match-legacy-urls.py` normaliza nombres (saca acentos y el doble mojibake del
dump, que es UTF-8 guardado como latin-1 dos veces) y puntúa cada par legacy ↔
Directus combinando Jaccard de tokens distintivos con similitud de secuencia,
más refuerzos por barrio y por dirección.

Dos reglas evitan los falsos positivos que arruinarían un 301:

1. **Token distintivo obligatorio.** Sin al menos una palabra compartida que no
   sea genérica (`club`, `tenis`, `padel`, `center`…), el score es 0. Sin esto,
   "Noir Tennis" matcheaba con "Botánico – Tennis".
2. **Sólo candidatos del AMBA.** La tabla `barrios` del dump son barrios de CABA
   y partidos del conurbano: el directorio viejo era de Buenos Aires. Cualquier
   match fuera del AMBA es casi con certeza falso. Sin esto, "Top Ten" (Quilmes)
   iba a parar a Pergamino.

Sobre ese resultado hay cinco descartes manuales, anotados en la columna `nota`
de `legacy-sin-destino.csv`, donde el score era alto pero la geografía no cerraba
(p. ej. "Asociación Urquiza Tenis Club", de Villa Urquiza, contra un "Urquiza
Padel" de Monserrat).

## Para revisar

`alcorta-tenis` → `Sportium Alcorta` quedó en 0,49, apenas debajo del umbral.
Probablemente sea el mismo lugar rebrandeado, y **"sportium alcorta" es la
consulta con más clics de todo el sitio** (71 en el último trimestre), así que
conviene confirmarlo a mano y agregar la fila al CSV.

## Regenerar

```bash
python3 match-legacy-urls.py --dump ruta/al/backup.sql
```

Baja los clubes activos de Directus y reescribe los dos CSV.
