/** Process-local, ten-minute LRU. No generated PDF is written to disk. */
export class ProjectNoteCache {
  private entries = new Map<string, { bytes: Buffer; expires: number }>()
  private pending = new Map<string, Promise<Buffer>>()
  private active = 0
  private waiting: (() => void)[] = []

  constructor(
    private readonly render: (html: string) => Promise<Buffer>,
    private readonly now = Date.now,
  ) {}

  async get(key: string, html: string): Promise<Buffer> {
    for (const [id, entry] of this.entries) {
      if (entry.expires <= this.now()) this.entries.delete(id)
    }
    const cached = this.entries.get(key)
    if (cached) {
      this.entries.delete(key)
      this.entries.set(key, cached)
      return cached.bytes
    }
    const pending = this.pending.get(key)
    if (pending) return pending
    if (this.pending.size >= 8) throw new Error('Project PDF queue is full')
    const work = this.generate(key, html)
    this.pending.set(key, work)
    try {
      return await work
    } finally {
      this.pending.delete(key)
    }
  }

  private async generate(key: string, html: string) {
    if (this.active >= 2) await new Promise<void>((resolve) => this.waiting.push(resolve))
    else this.active++
    try {
      const bytes = await this.render(html)
      // Cap both entry count and total PDF memory; oversized results are returned uncached.
      if (bytes.length <= 20 * 1024 * 1024) {
        this.entries.set(key, { bytes, expires: this.now() + 10 * 60_000 })
        let size = [...this.entries.values()].reduce((sum, entry) => sum + entry.bytes.length, 0)
        while (this.entries.size > 32 || size > 20 * 1024 * 1024) {
          const oldest = this.entries.keys().next().value!
          size -= this.entries.get(oldest)!.bytes.length
          this.entries.delete(oldest)
        }
      }
      return bytes
    } finally {
      const next = this.waiting.shift()
      if (next) next()
      else this.active--
    }
  }
}
