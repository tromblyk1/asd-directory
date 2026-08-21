#!/usr/bin/env python3
"""
Nominatim geocoder for providers_nominatim_2026-08-20.csv  (2026-08-20)

Run this ON A MACHINE WITH INTERNET ACCESS. Python 3.8+, standard library only.

    python run_nominatim_2026-08-20.py

Reads : providers_nominatim_2026-08-20.csv     (same folder)
Writes: nominatim_coordinates_2026-08-20.csv   (same folder)
        nominatim_raw_2026-08-20.json          (raw API responses, for audit)

Respects Nominatim usage policy: 1 request/sec, sequential, descriptive
User-Agent with contact address. Does not touch any database. Does not
modify the input file.
"""

import csv, json, os, re, sys, time, urllib.parse, urllib.request

HERE     = os.path.dirname(os.path.abspath(__file__))
IN_CSV   = os.path.join(HERE, 'providers_nominatim_2026-08-20.csv')
OUT_CSV  = os.path.join(HERE, 'nominatim_coordinates_2026-08-20.csv')
RAW_JSON = os.path.join(HERE, 'nominatim_raw_2026-08-20.json')

CONTACT    = 'keithtrombly07@gmail.com'
USER_AGENT = ('FloridaAutismServices-DirectoryCuration/1.0 '
              '(+https://floridaautismservices.com; contact: %s)' % CONTACT)

ENDPOINT   = 'https://nominatim.openstreetmap.org/search'
RATE_LIMIT = 1.1          # seconds between requests. Do not lower.

# ---------------------------------------------------------------- validation

# premise-level types: an actual building / address point
ACCEPT_TYPES = {
    'building','house','yes','commercial','retail','office','clinic','hospital',
    'school','doctors','healthcare','dentist','pharmacy','veterinary','college',
    'university','kindergarten','childcare','nursing_home','social_facility',
    'community_centre','church','place_of_worship','chapel','industrial',
    'warehouse','apartments','detached','terrace','civic','government','public',
    'hotel','physiotherapist','clinic_centre','residential_building',
}
# area / road fallbacks: a confident-looking answer pointing at nothing
FALLBACK_TYPES = {
    'city','town','village','hamlet','suburb','neighbourhood','quarter',
    'administrative','residential','highway','road','primary','secondary',
    'tertiary','trunk','motorway','unclassified','service','living_street',
    'postcode','postal_code','county','state','municipality','isolated_dwelling',
    'locality','region','borough','city_block','island',
}
FALLBACK_CLASSES = {'boundary','place','highway','landuse','waterway','natural','railway'}

ABBR = {
 'STREET':'ST','ST':'ST','AVENUE':'AVE','AVE':'AVE','AV':'AVE','ROAD':'RD','RD':'RD',
 'DRIVE':'DR','DR':'DR','BOULEVARD':'BLVD','BLVD':'BLVD','LANE':'LN','LN':'LN',
 'COURT':'CT','CT':'CT','CIRCLE':'CIR','CIR':'CIR','PLACE':'PL','PL':'PL',
 'PARKWAY':'PKWY','PKWY':'PKWY','PKY':'PKWY','TERRACE':'TER','TER':'TER','TERR':'TER',
 'TRAIL':'TRL','TRL':'TRL','HIGHWAY':'HWY','HWY':'HWY','WAY':'WAY','SQUARE':'SQ','SQ':'SQ',
 'CROSSING':'XING','XING':'XING','BYPASS':'BYP','BYP':'BYP','ROUTE':'RTE','RTE':'RTE',
 'CAUSEWAY':'CSWY','CSWY':'CSWY','EXPRESSWAY':'EXPY','EXPY':'EXPY','LOOP':'LOOP',
 'RUN':'RUN','PATH':'PATH','PLAZA':'PLZ','PLZ':'PLZ','POINT':'PT','PT':'PT',
 'BEND':'BND','BND':'BND','GARDENS':'GDNS','GDNS':'GDNS','US':'US','USA':'US',
}
TYPES = set(ABBR.values())
DIRS  = {'N':'N','S':'S','E':'E','W':'W','NE':'NE','NW':'NW','SE':'SE','SW':'SW',
         'NORTH':'N','SOUTH':'S','EAST':'E','WEST':'W','NORTHEAST':'NE',
         'NORTHWEST':'NW','SOUTHEAST':'SE','SOUTHWEST':'SW'}
DIRVALS  = set(DIRS.values())
UNIT_RE  = re.compile(r'\b(SUITE|STE|APT|UNIT|LOT|BLDG|BUILDING|RM|ROOM|#)\b.*$', re.I)

def toks(s):
    s = s.upper().replace('.', ' ').replace(',', ' ')
    s = re.sub(r'[^A-Z0-9 ]', ' ', s)
    return [ABBR.get(t, DIRS.get(t, t)) for t in s.split()]

def split_addr(tokens):
    """-> (house_number, leading_directionals, name_tokens, trailing_type_tokens)"""
    num  = tokens[0] if tokens and re.fullmatch(r'\d+[A-Z]?', tokens[0]) else None
    rest = tokens[1:] if num else list(tokens)
    dirs = []
    while rest and rest[0] in DIRVALS:
        dirs.append(rest.pop(0))
    types = []
    while rest and rest[-1] in TYPES | DIRVALS:
        types.insert(0, rest.pop())
    return num, dirs, rest, types

# ---------------------------------------------------------------- fetching

def fetch(q):
    params = urllib.parse.urlencode({
        'q': q, 'format': 'json', 'countrycodes': 'us',
        'limit': '1', 'addressdetails': '1',
    })
    req = urllib.request.Request(ENDPOINT + '?' + params,
                                 headers={'User-Agent': USER_AGENT,
                                          'Accept': 'application/json'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode('utf-8')), None
        except Exception as e:
            if attempt == 2:
                return None, str(e)
            time.sleep(5 * (attempt + 1))   # back off; never hammer

# ---------------------------------------------------------------- main

def main():
    if not os.path.exists(IN_CSV):
        sys.exit('Input not found: %s' % IN_CSV)
    rows = list(csv.DictReader(open(IN_CSV, encoding='utf-8-sig')))
    print('Input rows: %d' % len(rows))
    print('User-Agent: %s' % USER_AGENT)
    print('Rate limit: %.1fs between requests -> approx %d min total\n'
          % (RATE_LIMIT, int(len(rows) * RATE_LIMIT / 60) + 1))

    out, raw = [], []
    for i, r in enumerate(rows, 1):
        addr  = (r.get('address') or '').strip()
        city  = (r.get('city') or '').strip()
        state = (r.get('state') or '').strip()
        izip  = (r.get('zip_code') or '').strip()
        if izip.lower() == 'null':
            izip = ''
        q = ', '.join(p for p in [addr, city, state] if p)
        if izip:
            q += ' ' + izip

        data, err = fetch(q)
        raw.append({'id': r['id'], 'query': q, 'error': err, 'response': data})

        rec = {'id': r['id'], 'name': r.get('name', ''), 'city': city,
               'input_address': addr, 'matched_display_name': '', 'osm_type': '',
               'osm_class': '', 'latitude': '', 'longitude': '',
               'input_zip': izip, 'matched_zip': '', 'geocode_method': '', 'notes': ''}

        if err is not None:
            rec['geocode_method'] = 'FAILED'
            rec['notes'] = 'Request error: %s' % err
        elif not data:
            rec['geocode_method'] = 'FAILED'
            rec['notes'] = 'No Nominatim result'
        else:
            h = data[0]
            # Nominatim returns lat/lon as STRINGS in conventional order.
            lat = float(h['lat'])           # lat IS latitude
            lon = float(h['lon'])           # lon IS longitude
            det = h.get('address', {}) or {}
            o_type, o_class = h.get('type', ''), h.get('class', '')
            mzip = (det.get('postcode') or '').strip()[:5]
            rec.update({'matched_display_name': h.get('display_name', ''),
                        'osm_type': o_type, 'osm_class': o_class,
                        'matched_zip': mzip})

            problems, fallback = [], None
            if o_class in FALLBACK_CLASSES or o_type in FALLBACK_TYPES:
                fallback = 'class=%s type=%s is an area/road, not a premise' % (o_class, o_type)
            elif o_type not in ACCEPT_TYPES:
                fallback = 'class=%s type=%s not a recognised premise-level type' % (o_class, o_type)

            if fallback is None:
                m_num  = (det.get('house_number') or '').strip()
                m_road = (det.get('road') or '').strip()
                in_street = UNIT_RE.sub('', addr).strip().rstrip(',').strip()
                i_num, i_dirs, i_name, i_types = split_addr(toks(in_street))
                m_n, m_dirs, m_name, m_types = split_addr(
                    toks((m_num + ' ' + m_road).strip()))
                if i_num and m_n and i_num != m_n:
                    problems.append('house number %s != %s' % (i_num, m_n))
                if not m_road:
                    problems.append('no road in matched address details')
                if i_name != m_name:
                    problems.append('street name [%s] != [%s]'
                                    % (' '.join(i_name), ' '.join(m_name)))
                if i_types != m_types:
                    problems.append('street type [%s] != [%s]'
                                    % (' '.join(i_types) or '(none)',
                                       ' '.join(m_types) or '(none)'))
                if i_dirs != m_dirs:
                    problems.append('directional [%s] != [%s]'
                                    % (' '.join(i_dirs) or '(none)',
                                       ' '.join(m_dirs) or '(none)'))
                if not (24.5 <= lat <= 31.0 and -87.6 <= lon <= -80.0 and lon < 0):
                    problems.append('outside Florida bounds: lat %s lon %s' % (lat, lon))

            if fallback is not None:
                rec['geocode_method'] = 'FALLBACK_NOT_ADDRESS'
                rec['notes'] = fallback + '; returned "%s"' % h.get('display_name', '')
            elif problems:
                rec['geocode_method'] = 'REJECTED_BAD_MATCH'
                rec['notes'] = '; '.join(problems)
            elif izip != mzip:
                # coordinates RECORDED but NOT applied - exact ZIP match required
                rec['geocode_method'] = 'ZIP_MISMATCH'
                rec['latitude'], rec['longitude'] = '%.7f' % lat, '%.7f' % lon
                rec['notes'] = ('ZIP differs: input %s, matched %s - candidate '
                                'source-data error, verify by hand'
                                % (izip or '(none)', mzip or '(none)'))
            else:
                rec['geocode_method'] = 'NOMINATIM'
                rec['latitude'], rec['longitude'] = '%.7f' % lat, '%.7f' % lon

        out.append(rec)
        print('[%3d/%d] %-7s %-22s %s' % (i, len(rows), r['id'],
                                          rec['geocode_method'], q[:58]), flush=True)
        if i < len(rows):
            time.sleep(RATE_LIMIT)

    fields = ['id','name','city','input_address','matched_display_name','osm_type',
              'osm_class','latitude','longitude','input_zip','matched_zip',
              'geocode_method','notes']
    with open(OUT_CSV, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(out)
    json.dump(raw, open(RAW_JSON, 'w'), indent=1)

    from collections import Counter
    c = Counter(x['geocode_method'] for x in out)
    print('\n--- counts ---')
    for k in ['NOMINATIM','ZIP_MISMATCH','FALLBACK_NOT_ADDRESS','REJECTED_BAD_MATCH','FAILED']:
        print('%-22s %d' % (k, c.get(k, 0)))
    print('\nZIP_MISMATCH rows (check by hand):')
    for x in out:
        if x['geocode_method'] == 'ZIP_MISMATCH':
            print('  %s  %s | %s, %s | input %s vs matched %s'
                  % (x['id'], x['name'][:38], x['input_address'], x['city'],
                     x['input_zip'], x['matched_zip']))
    print('\nWrote %s\nWrote %s' % (OUT_CSV, RAW_JSON))

if __name__ == '__main__':
    main()
