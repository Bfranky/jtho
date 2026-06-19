'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  category: string;
  authorName: string;
  imageUrl: string | null;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'ortho', label: 'Orthopaedics & Joint Care' },
  { id: 'massage', label: 'Massaging (Hand & Machine)' },
  { id: 'physio', label: 'Physiotherapy & Rehab' },
  { id: 'spinal', label: 'Bone Fractures & Spinal Cord' },
  { id: 'arthritis', label: 'Arthritis' },
  { id: 'rheumatism', label: 'Rheumatism' }
];

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'fb1',
    title: 'Managing Joint Health: Range of Motion Exercises & Faith-Centred Care',
    slug: 'managing-joint-health-exercises',
    summary: 'An educational guide on simple daily physical therapy movements and clinical orthopaedic treatments designed to restore joint function and reduce chronic stiffness.',
    content: 'Osteoarthritis is one of the most common joint issues, particularly affecting weight-bearing joints such as the knees, hips, and spine. While it represents a wear-and-tear condition of the cartilage, you can significantly enhance your quality of life using target physical therapy. range of motion (ROM) exercises are essential for preserving joint mobility. Simple leg lifts, gentle shoulder rotations, and wrist stretches help circulate synovial fluid, which lubricates the joint. In conjunction with our clinical orthopedic care, combining daily active movement with therapeutic manual manipulation has shown significant recovery results in patients. We believe that caring for your body is a stewardship, and restoring structural mobility is our clinical calling.',
    category: 'ortho',
    authorName: 'Dr. Adebayo Olusola',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fb2',
    title: 'Hand vs. Machine Massaging: Selecting the Optimal Therapy for Tissue Stiffness',
    slug: 'hand-vs-machine-massaging-therapy',
    summary: 'An evidence-based breakdown of manual hand massage therapy and mechanical machine processes, helping you choose the right approach for deep muscle rehabilitation.',
    content: 'Massaging is a highly effective clinical modality for alleviating muscular stiffness, improving blood circulation, and promoting healing. We offer both hand-applied massage therapy and machine-assisted processes. Manual massaging allows our physiotherapists to apply intuitive touch, feeling for trigger points and adjusting pressure dynamically to match your tolerance. On the other hand, machine-assisted massaging processes utilize professional-grade percussive or pneumatic massage instruments. These devices provide precise, deep-tissue vibrations at constant frequencies that can penetrate deeper muscle fibers. For chronic, deep-seated spasm recovery, machine processes excel; whereas for acute rehabilitation, manual therapy is often preferred.',
    category: 'massage',
    authorName: 'Mrs. Funmilayo Oke',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fb3',
    title: 'Living with Arthritis: Clinical Pain Management & Home Services Options',
    slug: 'living-with-arthritis-management',
    summary: 'Discover key pharmacologic treatments, lifestyle alterations, and home visits options to successfully navigate arthritis and enjoy pain-free movement.',
    content: 'Arthritis represents chronic inflammation of one or more joints, leading to pain and structural deterioration. Successfully managing arthritis requires a multi-faceted approach. We combine clinical pharmacology, anti-inflammatory therapies, and therapeutic exercises. Importantly, arthritis patients often experience severe flares that make traveling difficult. That is why our home services department operates 24/7. Our specialists visit patients in the comfort of their homes to perform physiotherapy sessions, provide guidance on anti-inflammatory diet strategies, and check mobility progressions. Do not let joint pain restrict your life.',
    category: 'arthritis',
    authorName: 'Pharm. Taiwo Adeyemi',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  }
];

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = `/api/blog?category=${categoryFilter}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.success && json.data.length > 0) {
        setPosts(json.data);
      } else {
        // Fallback static posts filtered locally
        const basePosts = FALLBACK_POSTS;
        const filtered = basePosts.filter(p => {
          const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
          const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                              p.content.toLowerCase().includes(search.toLowerCase()) ||
                              (p.summary || '').toLowerCase().includes(search.toLowerCase());
          return matchCat && matchSearch;
        });
        setPosts(filtered);
      }
    } catch (e) {
      console.error('Error fetching blog posts:', e);
      // fallback locally on error
      setPosts(FALLBACK_POSTS.filter(p => categoryFilter === 'all' || p.category === categoryFilter));
    } finally {
      setLoading(false);
    }
  };

  const getReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 225));
    return `${minutes} min read`;
  };

  const getCategoryLabel = (catId: string) => {
    const found = CATEGORIES.find(c => c.id === catId);
    return found ? found.label : catId;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'ortho': return 'badge-blue';
      case 'massage': return 'badge-teal';
      case 'physio': return 'badge-green';
      case 'spinal': return 'badge-red';
      case 'arthritis': return 'badge-gold';
      case 'rheumatism': return 'badge-gray';
      default: return 'badge-gray';
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--teal-light)' }}>
            Medical Education Hub
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Jesus The Healer Blog
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, maxWidth: 600 }}>
            Stay informed with clinical medical education written by our orthopaedic doctors, chiropractors, and physical therapists. We operate 24/7, providing home consultation services.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="container-responsive-padding" style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  background: categoryFilter === cat.id ? 'var(--sky)' : '#fff',
                  color: categoryFilter === cat.id ? '#fff' : 'var(--muted)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 300 }}>
            <input
              type="text"
              className="input"
              placeholder="Search health topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchPosts()}
            />
            <button className="btn btn-primary btn-sm" onClick={fetchPosts}>Search</button>
          </div>

        </div>
      </div>

      {/* Posts Section */}
      <section className="section-responsive-padding" style={{ background: 'var(--cream)', minHeight: '50vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <div style={{ color: 'var(--muted)', fontSize: 15 }}>Loading medical articles...</div>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', background: '#fff', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h3 className="serif" style={{ fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>No Articles Found</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 20px' }}>
                We could not find any medical education articles matching this category or search query.
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => { setCategoryFilter('all'); setSearch(''); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
              {posts.map(post => (
                <article key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', overflow: 'hidden' }}>
                  
                  {/* Post Image */}
                  <div style={{ height: 200, background: 'var(--light)', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span className={`badge ${getCategoryBadgeClass(post.category)}`} style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 12, marginBottom: 12 }}>
                      <span>📅 {formatDate(post.createdAt)}</span>
                      <span>⏱️ {getReadingTime(post.content)}</span>
                    </div>

                    <h3 className="serif" style={{ fontSize: 20, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 12, flexShrink: 0 }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>

                    <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20, flexGrow: 1 }}>
                      {post.summary || (post.content.length > 150 ? post.content.substring(0, 147) + '...' : post.content)}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                          {post.authorName.charAt(0)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{post.authorName}</span>
                      </div>

                      <Link href={`/blog/${post.slug}`} className="btn btn-outline btn-sm" style={{ padding: '6px 14px', borderRadius: 4, fontWeight: 600 }}>
                        Read Article →
                      </Link>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="section-responsive-padding" style={{ background: 'var(--navy)', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 16 }}>Need Immediate Musculoskeletal Care?</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Our orthopedic home services operate 24/7. You do not need to travel while in pain. Book an appointment, and our physiotherapists or doctors will visit you at home.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/appointments" className="btn btn-primary">Book a Home Service</Link>
            <a href="tel:08023758036" className="btn btn-outline-white">📞 Call 0802 375 8036</a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
    </>
  );
}
