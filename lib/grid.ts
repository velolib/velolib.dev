import Hashids from 'hashids';
import Cloudflare from 'cloudflare';

export interface MediaData {
  id: string;
  title: string;
  posterUrl: string;
  label: string;
  type: string;
}

export interface GridData {
  medias: (MediaData | null)[];
  showTitles: boolean;
  showLabels: boolean;
  isSquare: boolean;
  createdAt: number;
}

export interface MediaSearchResult {
  id: string;
  name: string;
  posterPath: string;
  year?: number;
}

const hashids = new Hashids(process.env.HASHIDS_SALT!, 6);

const client = new Cloudflare({
  apiToken: process.env.CF_API_TOKEN!,
});

const accountId = process.env.CF_ACCOUNT_ID!;
const databaseId = process.env.CF_D1_DATABASE_ID!;

export async function getSharedGrid(hash: string) {
  const decoded = hashids.decode(hash);
  const dbId = decoded[0];

  if (!dbId) {
    return null;
  }

  const response = await client.d1.database.query(databaseId, {
    account_id: accountId,
    sql: "SELECT * FROM grids WHERE id = ?",
    params: [dbId.toString()],
  });

  return response.result?.[0]?.results?.[0] as { id: number, data: string, expires_at: number } ?? null;
}