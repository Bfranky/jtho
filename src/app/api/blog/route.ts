import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// ── GET /api/blog ──────────────────────────────────────────────────
// Returns a list of blog posts. Public queries only see published posts.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Check session to see if caller is an admin
    const session = await getAuthSession();
    const isAdmin = session?.role === 'ADMIN';
    
    // Construct where filter
    const where: any = {};
    
    // If not admin, only show published posts
    if (!isAdmin) {
      where.published = true;
    }
    
    // Filter by category
    if (category && category !== 'all') {
      where.category = category;
    }
    
    // Filter by search query (title, summary, or content)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const posts = await db.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('[GET /api/blog]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// ── POST /api/blog ─────────────────────────────────────────────────
// Creates a new blog post. Restricted to ADMIN.
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Administrators only' }, { status: 403 });
    }
    
    const body = await req.json();
    const { title, content, summary, category, authorName, imageUrl, published } = body;
    
    if (!title || !content || !category || !authorName) {
      return NextResponse.json(
        { success: false, error: 'Title, content, category, and author name are required' },
        { status: 400 }
      );
    }
    
    // Generate unique slug
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    if (!slug) {
      slug = `post-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    
    const existingPost = await db.blogPost.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    const newPost = await db.blogPost.create({
      data: {
        title,
        slug,
        content,
        summary: summary || null,
        category,
        authorName,
        imageUrl: imageUrl || null,
        published: published !== undefined ? published : true
      }
    });
    
    return NextResponse.json({ success: true, message: 'Blog post created successfully', data: newPost }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/blog]', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}
