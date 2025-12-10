import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔧 BASE44 SUPABASE URL:', supabaseUrl);
console.log('🔧 BASE44 SUPABASE KEY:', supabaseAnonKey ? 'EXISTS' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Column name mappings: Base44 → Supabase
const COLUMN_MAPPINGS: Record<string, string> = {
  'created_date': 'created_at',
  'updated_date': 'updated_at',
};

// Map Base44 column names to Supabase column names
function mapColumnName(field: string): string {
  return COLUMN_MAPPINGS[field] || field;
}

class Entity {
  constructor(private tableName: string) {}

  async list(sortField?: string, limit: number = 10000) {
    try {
      // Parse sort field
      const isDescending = sortField?.startsWith('-');
      const field = sortField ? (isDescending ? sortField.slice(1) : sortField) : 'created_at';
      const mappedField = mapColumnName(field);

      // If limit is <= 1000, just fetch normally
      if (limit <= 1000) {
        let query = supabase.from(this.tableName).select('*');
        query = query.order(mappedField, { ascending: !isDescending });
        query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }

      // For larger limits, fetch in batches of 1000
      const allData = [];
      const pageSize = 1000;
      let page = 0;
      let hasMore = true;

      while (hasMore && allData.length < limit) {
        let query = supabase.from(this.tableName).select('*');
        query = query.order(mappedField, { ascending: !isDescending });
        query = query.range(page * pageSize, (page + 1) * pageSize - 1);

        const { data, error } = await query;
        
        if (error) throw error;

        if (data && data.length > 0) {
          allData.push(...data);
          hasMore = data.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }

      return allData.slice(0, limit);
    } catch (error) {
      console.error(`Error listing ${this.tableName}:`, error);
      return [];
    }
  }

  async filter(conditions: Record<string, any> = {}, sortField?: string, limit: number = 10000) {
    try {
      // Parse sort field
      const isDescending = sortField?.startsWith('-');
      const field = sortField ? (isDescending ? sortField.slice(1) : sortField) : 'created_at';
      const mappedField = mapColumnName(field);

      // If limit is <= 1000, just fetch normally
      if (limit <= 1000) {
        let query = supabase.from(this.tableName).select('*');

        Object.entries(conditions).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        query = query.order(mappedField, { ascending: !isDescending });
        query = query.limit(limit);

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }

      // For larger limits, fetch in batches
      const allData = [];
      const pageSize = 1000;
      let page = 0;
      let hasMore = true;

      while (hasMore && allData.length < limit) {
        let query = supabase.from(this.tableName).select('*');

        Object.entries(conditions).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        query = query.order(mappedField, { ascending: !isDescending });
        query = query.range(page * pageSize, (page + 1) * pageSize - 1);

        const { data, error } = await query;
        
        if (error) throw error;

        if (data && data.length > 0) {
          allData.push(...data);
          hasMore = data.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }

      return allData.slice(0, limit);
    } catch (error) {
      console.error(`Error filtering ${this.tableName}:`, error);
      return [];
    }
  }

  async get(id: string | number) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting ${this.tableName} record:`, error);
      return null;
    }
  }

  async create(data: Record<string, any>) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error creating ${this.tableName} record:`, error);
      throw error;
    }
  }

  async update(id: string | number, data: Record<string, any>) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${this.tableName} record:`, error);
      throw error;
    }
  }

  async delete(id: string | number) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName} record:`, error);
      return false;
    }
  }
}

export const base44 = {
  entities: {
    Resource: new Entity('resources'),
    Event: new Entity('events'),
    BlogPost: new Entity('blog_posts'),
    Submission: new Entity('submissions'),
  },
  supabase,
};

export type Base44Client = typeof base44;
export type ResourceEntity = typeof base44.entities.Resource;