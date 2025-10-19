/**
 * Custom hook for fetching provider ratings
 * Fetches data from the provider_ratings_summary materialized view
 */

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust import path as needed

export interface ProviderRating {
  google_place_id: string;
  review_count: number;
  avg_rating: number;
  min_rating: number;
  max_rating: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
  latest_review_date: string;
}

interface UseProviderRatingsReturn {
  ratings: Record<string, ProviderRating>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch ratings for multiple providers at once
 */
export function useProviderRatings(
  googlePlaceIds: string[]
): UseProviderRatingsReturn {
  const [ratings, setRatings] = useState<Record<string, ProviderRating>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = async () => {
    if (!googlePlaceIds || googlePlaceIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('provider_ratings_summary')
        .select('*')
        .in('google_place_id', googlePlaceIds);

      if (fetchError) {
        throw fetchError;
      }

      // Convert array to object keyed by google_place_id for easy lookup
      const ratingsMap: Record<string, ProviderRating> = {};
      data?.forEach((rating) => {
        ratingsMap[rating.google_place_id] = rating;
      });

      setRatings(ratingsMap);
    } catch (err) {
      console.error('Error fetching provider ratings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [JSON.stringify(googlePlaceIds)]); // Use JSON.stringify for array comparison

  return {
    ratings,
    loading,
    error,
    refetch: fetchRatings,
  };
}

/**
 * Fetch rating for a single provider
 */
export function useProviderRating(
  googlePlaceId: string | null
): {
  rating: ProviderRating | null;
  loading: boolean;
  error: string | null;
} {
  const [rating, setRating] = useState<ProviderRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!googlePlaceId) {
      setLoading(false);
      return;
    }

    const fetchRating = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('provider_ratings_summary')
          .select('*')
          .eq('google_place_id', googlePlaceId)
          .single();

        if (fetchError) {
          // If no rating found, that's OK (not all providers have reviews)
          if (fetchError.code === 'PGRST116') {
            setRating(null);
          } else {
            throw fetchError;
          }
        } else {
          setRating(data);
        }
      } catch (err) {
        console.error('Error fetching provider rating:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rating');
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [googlePlaceId]);

  return { rating, loading, error };
}

export default useProviderRatings;