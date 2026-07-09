import { supabase } from '../supabaseClient';

/**
 * Uploads a file or Blob to the private "app-files" bucket.
 * Follows the folder rule: every uploaded file path must start with the user ID:
 * ${userId}/${featureName}/${itemId}/${uuid}.${extension}
 */
export async function uploadToSupabaseStorage(
  userId: string,
  featureName: string,
  itemId: string,
  file: File | Blob,
  extension: string
): Promise<string> {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const filePath = `${userId}/${featureName}/${itemId}/${uuid}.${extension}`;

  const { data, error } = await supabase.storage
    .from('app-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  return filePath;
}

/**
 * Resolves a list of private storage paths into their corresponding signed URLs.
 * Keeps standard web/base64 URLs intact.
 */
export async function resolveSignedUrls(paths: string[]): Promise<Record<string, string>> {
  if (!paths || paths.length === 0) return {};

  const storagePaths = paths.filter(p => p && !p.startsWith('http') && !p.startsWith('data:'));
  if (storagePaths.length === 0) {
    return {};
  }

  try {
    const { data, error } = await supabase.storage
      .from('app-files')
      .createSignedUrls(storagePaths, 604800); // 7 days expiration

    if (error || !data) {
      console.error('Error creating signed URLs:', error);
      return {};
    }

    const mapping: Record<string, string> = {};
    data.forEach(item => {
      if (item.signedUrl) {
        mapping[item.path] = item.signedUrl;
      }
    });
    return mapping;
  } catch (err) {
    console.error('Failed to resolve signed URLs:', err);
    return {};
  }
}

/**
 * Deletes files from the Supabase Storage "app-files" bucket.
 * Safely ignores non-storage URLs.
 */
export async function deleteFromSupabaseStorage(paths: string[]): Promise<void> {
  if (!paths || paths.length === 0) return;

  const storagePaths = paths.filter(p => p && !p.startsWith('http') && !p.startsWith('data:'));
  if (storagePaths.length === 0) return;

  try {
    const { error } = await supabase.storage
      .from('app-files')
      .remove(storagePaths);

    if (error) {
      console.error('Error deleting files from storage:', error);
    }
  } catch (err) {
    console.error('Failed to delete files from storage:', err);
  }
}
