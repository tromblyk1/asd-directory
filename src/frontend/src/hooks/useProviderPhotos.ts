import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

type ProviderPhoto = {
  imageUrl: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
  localFile?: string;
};

type PhotoMap = Record<string, ProviderPhoto[]>;

const PHOTO_DATA_URL = '/data/website_photo_map.csv';

let cachedPhotoMap: PhotoMap | null = null;
let loadingPromise: Promise<PhotoMap> | null = null;

async function loadPhotoMap(): Promise<PhotoMap> {
  if (cachedPhotoMap) {
    return cachedPhotoMap;
  }

  if (!loadingPromise) {
    loadingPromise = fetch(PHOTO_DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load provider photos (${response.status})`);
        }
        return response.text();
      })
      .then<PhotoMap>((csvText) => {
        const parsedMap: PhotoMap = {};

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = Array.isArray(results.data) ? results.data : [];

            rows.forEach((raw) => {
              const row = raw as Record<string, string | undefined>;
              const providerId = row['provider_id']?.toString().trim();
              const imageUrl = row['image_url']?.toString().trim();
              const sourceUrl = row['website']?.toString().trim();
              const width = row['width'] ? Number(row['width']) : undefined;
              const height = row['height'] ? Number(row['height']) : undefined;

              if (!providerId || !imageUrl) {
                return;
              }

              if (!parsedMap[providerId]) {
                parsedMap[providerId] = [];
              }

              const photos = parsedMap[providerId];
              const alreadyExists = photos.some((photo) => photo.imageUrl === imageUrl);

              if (!alreadyExists && photos.length < 2) {
                photos.push({
                  imageUrl,
                  sourceUrl,
                  width: Number.isFinite(width) ? width : undefined,
                  height: Number.isFinite(height) ? height : undefined,
                });
              }
            });
          },
        });

        cachedPhotoMap = parsedMap;
        return parsedMap;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export function useProviderPhotos(providerIds?: Array<string | number | null | undefined>) {
  const [photoMap, setPhotoMap] = useState<PhotoMap>(cachedPhotoMap ?? {});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedPhotoMap) {
      return;
    }

    let cancelled = false;

    loadPhotoMap()
      .then((map) => {
        if (!cancelled) {
          setPhotoMap(map);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load provider photos', err);
          setError(err instanceof Error ? err.message : 'Failed to load provider photos');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedIds = useMemo(() => {
  if (!Array.isArray(providerIds)) return [];
  return Array.from(
    new Set(
      providerIds
        .filter((v): v is string | number => v !== null && v !== undefined)
        .map((v) => v.toString())
    )
  );
}, [providerIds]);

  const photos = useMemo(() => {
    const result: PhotoMap = {};
    normalizedIds.forEach((id) => {
      result[id] = photoMap[id] ?? [];
    });
    return result;
  }, [normalizedIds, photoMap]);

  return {
    photos,
    error,
  };
}

export type { ProviderPhoto };
