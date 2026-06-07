import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// ── GET /api/blog/[id] ──────────────────────────────────────────────
// Fetches a single blog post by its database ID or unique slug.
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const post = await db.blogPost.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    
    // If post is not published, only allow administrators to view it
    if (!post.published) {
      const session = await getAuthSession();
      if (session?.role !== 'ADMIN') {
        return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
      }
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('[GET /api/blog/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// ── PATCH /api/blog/[id] ────────────────────────────────────────────
// Updates a blog post. Restricted to ADMIN.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Administrators only' }, { status: 403 });
    }
    
    const { id } = await params;
    const body = await req.json();
    const { title, content, summary, category, authorName, imageUrl, published } = body;
    
    // Find the post first
    const post = await db.blogPost.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (summary !== undefined) data.summary = summary;
    if (category !== undefined) data.category = category;
    if (authorName !== undefined) data.authorName = authorName;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (published !== undefined) data.published = published;
    
    // If the title changed, we don't automatically change the slug to avoid breaking external SEO links,
    // unless they explicitly want to or we just keep the slug stable. Keeping it stable is standard practice.
    
    const updatedPost = await db.blogPost.update({
      where: { id: post.id },
      data
    });
    
    return NextResponse.json({ success: true, message: 'Blog post updated successfully', data: updatedPost });
  } catch (error) {
    console.error('[PATCH /api/blog/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

// ── DELETE /api/blog/[id] ───────────────────────────────────────────
// Deletes a blog post. Restricted to ADMIN.
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Administrators only' }, { status: 403 });
    }
    
    const { id } = await params;
    
    // Find the post first
    const post = await db.blogPost.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    
    await db.blogPost.delete({
      where: { id: post.id }
    });
    
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/blog/[id]]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}
