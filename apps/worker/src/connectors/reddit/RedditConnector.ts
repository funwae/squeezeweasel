/**
 * Reddit Connector - fetches posts and comments from Reddit
 *
 * Uses Reddit's public JSON API (no auth required for public data)
 * Example: https://www.reddit.com/r/shortsqueeze/hot.json
 */

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  numComments: number;
  createdUtc: number;
  selftext?: string;
  url: string;
  permalink: string;
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  createdUtc: number;
  parentId: string;
}

export interface RedditFetchOptions {
  subreddit: string;
  sort?: "hot" | "new" | "top" | "rising";
  limit?: number;
  timeFilter?: "hour" | "day" | "week" | "month" | "year" | "all";
  after?: string; // For pagination
  useSampleData?: boolean; // Use sample data instead of real API
}

export class RedditConnector {
  private baseUrl = "https://www.reddit.com";

  /**
   * Fetch posts from a subreddit
   */
  async fetchPosts(options: RedditFetchOptions): Promise<{
    posts: RedditPost[];
    after?: string;
  }> {
    const { subreddit, sort = "hot", limit = 25, timeFilter = "day", after, useSampleData = false } = options;

    // Use sample data if requested
    if (useSampleData) {
      console.log("Using sample Reddit data for demo");
      try {
        const { readFileSync } = await import("fs");
        const { fileURLToPath } = await import("url");
        const { dirname, join } = await import("path");
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        // Use current date or fallback to example date
        const today = new Date().toISOString().split("T")[0];
        const sampleFile = join(__dirname, "sample-data", `reddit-${today}.json`);

        let sampleData: RedditPost[];
        try {
          const fileContent = readFileSync(sampleFile, "utf-8");
          sampleData = JSON.parse(fileContent);
        } catch {
          // Fallback to example date if today's file doesn't exist
          const fallbackFile = join(__dirname, "sample-data", "reddit-2024-11-15.json");
          const fallbackContent = readFileSync(fallbackFile, "utf-8");
          sampleData = JSON.parse(fallbackContent);
        }

        // Apply limit
        const limitedPosts = sampleData.slice(0, limit);
        return {
          posts: limitedPosts,
          after: undefined,
        };
      } catch (error) {
        console.error("Failed to load sample Reddit data:", error);
        throw new Error(`Failed to load sample Reddit data: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    // Build URL
    let url = `${this.baseUrl}/r/${subreddit}/${sort}.json?limit=${limit}`;
    if (sort === "top" && timeFilter) {
      url += `&t=${timeFilter}`;
    }
    if (after) {
      url += `&after=${after}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SqueezeWeasel/1.0 (Automation Tool)",
        },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Parse Reddit JSON response
      const posts: RedditPost[] = data.data.children.map((child: any) => {
        const post = child.data;
        return {
          id: post.id,
          title: post.title,
          author: post.author,
          subreddit: post.subreddit,
          score: post.score,
          numComments: post.num_comments,
          createdUtc: post.created_utc,
          selftext: post.selftext || undefined,
          url: post.url,
          permalink: `https://www.reddit.com${post.permalink}`,
        };
      });

      return {
        posts,
        after: data.data.after,
      };
    } catch (error) {
      throw new Error(`Failed to fetch Reddit posts: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Fetch comments for a specific post
   */
  async fetchComments(postPermalink: string): Promise<RedditComment[]> {
    // Remove leading slash if present
    const cleanPermalink = postPermalink.startsWith("/") ? postPermalink.slice(1) : postPermalink;
    const url = `${this.baseUrl}/${cleanPermalink}.json`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SqueezeWeasel/1.0 (Automation Tool)",
        },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // Reddit returns [post, comments] array
      const commentsData = data[1]?.data?.children || [];

      const comments: RedditComment[] = [];
      const extractComments = (children: any[]) => {
        for (const child of children) {
          if (child.kind === "t1") {
            // t1 is a comment
            const comment = child.data;
            comments.push({
              id: comment.id,
              author: comment.author,
              body: comment.body,
              score: comment.score,
              createdUtc: comment.created_utc,
              parentId: comment.parent_id,
            });

            // Recursively extract replies
            if (comment.replies && comment.replies.data?.children) {
              extractComments(comment.replies.data.children);
            }
          }
        }
      };

      extractComments(commentsData);

      return comments;
    } catch (error) {
      throw new Error(`Failed to fetch Reddit comments: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Search for posts containing specific keywords
   */
  async searchPosts(
    subreddit: string,
    query: string,
    limit = 25
  ): Promise<RedditPost[]> {
    const url = `${this.baseUrl}/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&restrict_sr=1`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SqueezeWeasel/1.0 (Automation Tool)",
        },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return data.data.children.map((child: any) => {
        const post = child.data;
        return {
          id: post.id,
          title: post.title,
          author: post.author,
          subreddit: post.subreddit,
          score: post.score,
          numComments: post.num_comments,
          createdUtc: post.created_utc,
          selftext: post.selftext || undefined,
          url: post.url,
          permalink: `https://www.reddit.com${post.permalink}`,
        };
      });
    } catch (error) {
      throw new Error(`Failed to search Reddit posts: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

