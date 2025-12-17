from supabase import create_client, Client

SUPABASE_URL = "https://twcofgyxiitfvoedftik.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE3MDI3NSwiZXhwIjoyMDc1NzQ2Mjc1fQ.TlT5PBCFIthkInEQnKNunUUTqLk4q8kDnv5Y1dT-uN0"  # full access key

supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

def delete_provider(provider_id: int):
    response = supabase.table("providers").delete().eq("id", provider_id).execute()
    print(f"Deleted provider {provider_id}: {response}")

def query(sql: str):
    """Run any SQL safely with the service role key"""
    result = supabase.rpc('sql_exec', {'query': sql}).execute()
    print(result)

if __name__ == "__main__":
    delete_provider(16004)
