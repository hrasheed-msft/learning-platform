import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

let _containerClient: ContainerClient | null = null;

function getContainerClient(): ContainerClient {
  if (_containerClient) return _containerClient;

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
  _containerClient = blobServiceClient.getContainerClient('course-content');
  return _containerClient;
}

/**
 * Upload HTML content for a unit to Azure Blob Storage.
 * Returns the public URL of the uploaded blob.
 */
export async function uploadUnitContent(unitId: string, htmlContent: string): Promise<string> {
  const client = getContainerClient();
  const blobName = `unit-${unitId}.html`;
  const blockBlobClient = client.getBlockBlobClient(blobName);

  await blockBlobClient.upload(htmlContent, Buffer.byteLength(htmlContent, 'utf8'), {
    blobHTTPHeaders: {
      blobContentType: 'text/html; charset=utf-8',
      blobCacheControl: 'public, max-age=86400', // 24h cache
    },
  });

  return blockBlobClient.url;
}

/**
 * Check if blob upload is available (connection string set).
 * Seeds can call this to decide whether to upload or fall back to inline.
 */
export function isBlobStorageAvailable(): boolean {
  return !!process.env.AZURE_STORAGE_CONNECTION_STRING;
}
