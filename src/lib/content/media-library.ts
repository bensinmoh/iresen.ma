import videos from '@/data/youtube-videos.json' with { type: 'json' }
import 'server-only'

export async function findPublicLibraryVideos() {
  return videos
}
