import { BLOGS_DATA } from '../data/blogsData';

interface NewsArticle {
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
  source_id: string;
  content: string;
}

interface NewsResponse {
  results: NewsArticle[];
  totalResults: number;
}

class RealNewsService {
  async getEducationNews(pageSize: number = 12): Promise<NewsResponse> {
    try {
      // Prioritize our curated content
      return {
        results: BLOGS_DATA.map(blog => ({
          title: blog.title,
          description: blog.summary,
          link: '#',
          image_url: blog.image,
          pubDate: blog.createdAt,
          source_id: blog.source,
          content: blog.content
        })),
        totalResults: BLOGS_DATA.length
      };
    } catch (error) {
      console.error('Failed to fetch real news:', error);
      throw error;
    }
  }

  async getFeaturedNews(): Promise<{ data: any[] }> {
    try {
      // Return the first 3 blogs as featured
      return { data: BLOGS_DATA.slice(0, 3) };
    } catch (error) {
      console.error('Error fetching featured news:', error);
      return { data: BLOGS_DATA.slice(0, 3) };
    }
  }

  private getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('rupee') || lowerTitle.includes('currency') || lowerTitle.includes('inflation') || lowerTitle.includes('economic')) {
      return 'Finance & Economy';
    }
    return 'The Quantum Corner';
  }
}

export const realNewsService = new RealNewsService();