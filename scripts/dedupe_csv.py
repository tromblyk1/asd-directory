import pandas as pd

input_file = "aba_verification_final_20251024_060947.csv"
output_file = "aba_verification_final_deduped.csv"

df = pd.read_csv(input_file)
df = df.drop_duplicates(subset=["provider_name", "phone", "city"])
df.to_csv(output_file, index=False)

print(f"✅ Deduped CSV saved as {output_file} with {len(df)} unique rows.")
