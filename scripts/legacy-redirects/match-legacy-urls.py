#!/usr/bin/env python3
"""
Cruza las URLs del sitio PHP viejo contra los clubes actuales de Directus y
emite el CSV de Bulk Redirects de Cloudflare. Ver README.md.

    python3 match-legacy-urls.py --dump ruta/al/backup.sql
"""
import argparse, csv, json, re, subprocess, sys, unicodedata, urllib.parse, urllib.request
from difflib import SequenceMatcher

DIRECTUS = "https://api.haycancha.com"
SITE = "https://haycancha.com"
AUTO_THRESHOLD = 0.70

# El dump es UTF-8 guardado como latin-1, a veces dos veces ("LujÃÂ¡n").
def unmojibake(s: str) -> str:
    for _ in range(3):
        try:
            t = s.encode("latin-1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            return s
        if t == s:
            return s
        s = t
    return s

def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", unmojibake(s or "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()

# Palabras que aparecen en medio directorio: compartirlas no prueba nada.
GENERIC = {"club","de","del","la","el","los","las","y","tenis","tennis","padel","paddle",
           "complejo","deportivo","deportiva","centro","center","social","sport","sports",
           "atletico","asociacion","gym","pistas","canchas","cancha","the"}

def tokens(s): return [t for t in norm(s).split() if t]
def distinctive(s): return {t for t in tokens(s) if t not in GENERIC and len(t) > 2}

# La tabla `barrios` del dump son barrios de CABA y partidos del conurbano: el
# directorio viejo era de Buenos Aires. Restringir a AMBA evita mandar un club
# porteño a Salta.
AMBA = {"buenos-aires","gba-norte","gba-sur","gba-oeste","vicente-lopez","san-isidro","quilmes",
 "lomas-de-zamora","lanus","avellaneda","san-martin","tres-de-febrero","moron","moreno","merlo",
 "tigre","san-fernando","ituzaingo","hurlingham","ramos-mejia","castelar","san-miguel","jose-c-paz",
 "malvinas-argentinas","escobar","pilar","berazategui","florencio-varela","esteban-echeverria",
 "ezeiza","almirante-brown","burzaco","adrogue","temperley","banfield","la-plata","isidro-casanova",
 "la-matanza","9-de-abril","don-torcuato","martinez","olivos","florida","beccar","boulogne"}

# Descartes manuales: el score daba alto pero la geografía no cierra.
MANUAL_REJECT = {
 "club-belgrano": 'legacy en Quilmes (GBA Sur); "Belgrano Padel" está en GBA Oeste',
 "urquiza-tenis": '"Asociación Urquiza" es de Villa Urquiza; "Urquiza Padel" está en Monserrat',
 "asociacion-urquiza-tenis-club": "mismo caso: Villa Urquiza vs Monserrat",
 "buenos-aires-rowing-tenis": "Rowing (Tigre) y Lawn Tennis Club son clubes distintos",
 "tenis-point": '"Tenis Point" y "Match Point" son clubes distintos',
}
# Aceptados a mano por debajo del umbral.
MANUAL_ACCEPT = {"doblas-tenis": 'mismo club; el registro nuevo sólo agrega "y Futbol"'}


def sql_columns(raw, table):
    m = re.search(r"CREATE TABLE `%s` \((.*?)\n\) ENGINE" % table, raw, re.S)
    if not m:
        sys.exit(f"no encontré la tabla `{table}` en el dump")
    return [c.group(1) for c in re.finditer(r"^\s*`([^`]+)`\s", m.group(1), re.M)]

def sql_rows(raw, table):
    """Parser mínimo de INSERT … VALUES (…),(…); respetando comillas y escapes."""
    out = []
    for ins in re.finditer(r"INSERT INTO `%s`[^)]*?VALUES\s*" % table, raw):
        i = ins.end()
        while True:
            while i < len(raw) and raw[i] in " \n\r\t,":
                i += 1
            if i >= len(raw) or raw[i] != "(":
                break
            i += 1; vals=[]; cur=""; quoted=False
            while i < len(raw):
                ch = raw[i]
                if quoted:
                    if ch == "\\": cur += raw[i+1]; i += 2; continue
                    if ch == "'": quoted = False; i += 1; continue
                    cur += ch; i += 1; continue
                if ch == "'": quoted = True; i += 1; continue
                if ch == ",": vals.append(cur.strip()); cur = ""; i += 1; continue
                if ch == ")": vals.append(cur.strip()); i += 1; break
                cur += ch; i += 1
            out.append(vals)
            if i < len(raw) and raw[i] == ";":
                break
    return out


def fetch_clubs():
    q = urllib.parse.urlencode({
        "filter[activo][_eq]": "true",
        "fields": "nombre,slug,direccion,pais.slug,ciudad.slug,ciudad.nombre,barrio.slug,barrio.nombre",
        "limit": "-1"})
    url = f"{DIRECTUS}/items/clubes?{q}"
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return json.load(r)["data"]
    except Exception as e:
        # Detrás de un proxy corporativo urllib suele fallar donde curl anda.
        print(f"  urllib falló ({e}); reintento con curl", file=sys.stderr)
        out = subprocess.run(["curl", "-sSf", "--max-time", "60", url],
                             capture_output=True, check=True).stdout
        return json.loads(out)["data"]

def club_href(c):
    pais, ciudad = c["pais"]["slug"], c["ciudad"]["slug"]
    barrio = (c["barrio"] or {}).get("slug")
    return f"/canchas/{pais}/{ciudad}/{barrio}/{c['slug']}" if barrio else f"/canchas/{pais}/{ciudad}/{c['slug']}"


def score(legacy, club):
    ld, cd = distinctive(legacy["nombre"]), distinctive(club["nombre"])
    if not (ld and cd and ld & cd):
        return 0.0
    jaccard = len(ld & cd) / len(ld | cd)
    seq = SequenceMatcher(None, norm(legacy["nombre"]), norm(club["nombre"])).ratio()
    s = 0.55 * jaccard + 0.45 * seq
    lb = norm(legacy["barrio"])
    if lb:
        cb = norm((club["barrio"] or {}).get("nombre", "")); cc = norm(club["ciudad"]["nombre"])
        if lb in (cb, cc): s += 0.20
        elif cb and (lb in cb or cb in lb): s += 0.10
    if legacy["direccion"] and club.get("direccion"):
        a, b = set(tokens(legacy["direccion"])), set(tokens(club["direccion"]))
        if a and b and len(a & b) / len(a | b) > 0.4: s += 0.15
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dump", required=True, help="backup .sql del sitio viejo")
    ap.add_argument("--out-dir", default=".")
    args = ap.parse_args()

    raw = open(args.dump, "rb").read().decode("latin-1")
    cols = sql_columns(raw, "complejos_complejos")
    idx = {n: k for k, n in enumerate(cols)}
    barrios = {r[0]: unmojibake(r[2]) for r in sql_rows(raw, "barrios") if len(r) == 3}

    legacy = []
    for r in sql_rows(raw, "complejos_complejos"):
        if len(r) != len(cols):
            continue
        url = r[idx["UrlAmigable"]]
        if url in ("NULL", ""):
            continue
        legacy.append({
            "url": url,
            "nombre": unmojibake(r[idx["Nombre"]]),
            "barrio": barrios.get(r[idx["idBarrio"]], ""),
            "direccion": "" if r[idx["Direccion"]] == "NULL" else unmojibake(r[idx["Direccion"]]),
            "activo": r[idx["Estado"]] == "1",
        })

    clubs = fetch_clubs()
    candidates = [c for c in clubs
                  if c["pais"]["slug"] == "argentina" and c["ciudad"]["slug"] in AMBA]
    print(f"legacy con UrlAmigable: {len(legacy)} · candidatos AMBA: {len(candidates)}")

    matched, unmatched = [], []
    for L in legacy:
        best_score, best = 0.0, None
        for C in candidates:
            s = score(L, C)
            if s > best_score:
                best_score, best = s, C
        rec = {**L, "score": round(best_score, 3),
               "match": best["nombre"] if best else "", "to": club_href(best) if best else ""}
        if L["url"] in MANUAL_REJECT:
            rec["nota"] = MANUAL_REJECT[L["url"]]; unmatched.append(rec)
        elif L["url"] in MANUAL_ACCEPT or best_score >= AUTO_THRESHOLD:
            rec["nota"] = MANUAL_ACCEPT.get(L["url"], ""); matched.append(rec)
        else:
            rec["nota"] = ""; unmatched.append(rec)

    with open(f"{args.out_dir}/redirects-legacy.csv", "w", newline="") as f:
        w = csv.writer(f); w.writerow(["source", "target", "status"])
        for r in sorted(matched, key=lambda x: x["url"]):
            w.writerow([f"{SITE}/cancha.php?url={r['url']}", f"{SITE}{r['to']}", 301])

    with open(f"{args.out_dir}/legacy-sin-destino.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["url_legacy","nombre","barrio","activo_en_legacy","mejor_candidato","score","nota"])
        for r in sorted(unmatched, key=lambda x: -x["score"]):
            w.writerow([r["url"], r["nombre"], r["barrio"], "si" if r["activo"] else "no",
                        r["match"], r["score"], r["nota"]])

    print(f"  301 verificados : {len(matched)}")
    print(f"  sin destino     : {len(unmatched)} ({sum(1 for r in unmatched if r['activo'])} activos)")


if __name__ == "__main__":
    main()
