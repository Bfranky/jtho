'use client';
import { useState, useEffect, use } from 'react';
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

const CATEGORY_LABELS: Record<string, string> = {
  ortho: 'Orthopaedics & Joint Care',
  massage: 'Massaging (Hand & Machine)',
  physio: 'Physiotherapy & Rehab',
  spinal: 'Bone Fractures & Spinal Cord',
  arthritis: 'Arthritis',
  rheumatism: 'Rheumatism'
};

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

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/${slug}`);
      const json = await res.json();
      
      if (json.success && json.data) {
        setPost(json.data);
      } else {
        // Fallback to static lists
        const matched = FALLBACK_POSTS.find(p => p.slug === slug);
        setPost(matched || null);
      }
    } catch (e) {
      console.error('Error fetching blog post details:', e);
      const matched = FALLBACK_POSTS.find(p => p.slug === slug);
      setPost(matched || null);
    } finally {
      setLoading(false);
    }
  };

  const getReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 225));
    return `${minutes} min read`;
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

  const renderCTA = (category: string) => {
    switch (category) {
      case 'ortho':
      case 'spinal':
      case 'arthritis':
      case 'rheumatism':
        return (
          <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)', color: '#fff', padding: '32px', borderRadius: '12px', borderLeft: '5px solid var(--sky)', marginTop: '40px', boxShadow: '0 8px 30px rgba(10,22,40,.08)' }}>
            <span style={{ fontSize: 24 }}>🏥</span>
            <h4 className="serif" style={{ fontSize: 20, margin: '12px 0 8px' }}>Struggling with Joint Pain or Bone Fractures?</h4>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Avoid the pain of travelling. Our orthopaedic and physical therapy team is fully equipped to provide professional home visits services 24/7 across Lagos.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/appointments?service=orthopaedic" className="btn btn-primary btn-sm">Request Orthopaedic Home Visit</Link>
              <a href="tel:08023758036" className="btn btn-outline-white btn-sm">📞 Call Specialists Now</a>
            </div>
          </div>
        );
      case 'massage':
        return (
          <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0F766E 100%)', color: '#fff', padding: '32px', borderRadius: '12px', borderLeft: '5px solid var(--teal)', marginTop: '40px', boxShadow: '0 8px 30px rgba(10,22,40,.08)' }}>
            <span style={{ fontSize: 24 }}>💆‍♂️</span>
            <h4 className="serif" style={{ fontSize: 20, margin: '12px 0 8px' }}>Request a Clinical Home Massage (Hand & Machine)</h4>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              We provide both customized manual hand massaging and high-frequency percussive massage machine therapies in the comfort of your home.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/appointments?service=massage" className="btn btn-teal btn-sm">Book a Home Massage</Link>
              <a href="tel:08023758036" className="btn btn-outline-white btn-sm">📞 Call Ojodu Clinic</a>
            </div>
          </div>
        );
      case 'physio':
        return (
          <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #16A34A 100%)', color: '#fff', padding: '32px', borderRadius: '12px', borderLeft: '5px solid var(--green)', marginTop: '40px', boxShadow: '0 8px 30px rgba(10,22,40,.08)' }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <h4 className="serif" style={{ fontSize: 20, margin: '12px 0 8px' }}>Personalised Home Rehabilitation & Physiotherapy</h4>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Recover your mobility with regular home visits from expert physiotherapists. We develop targeted rehabilitation regimes tailored to your schedule.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/appointments?service=physiotherapy" className="btn btn-primary btn-sm" style={{ background: 'var(--green)' }}>Request Home Physiotherapist</Link>
              <a href="tel:08023758036" className="btn btn-outline-white btn-sm">📞 Call Rehab Center</a>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ background: 'var(--light)', padding: '32px', borderRadius: '12px', marginTop: '40px', borderLeft: '5px solid var(--sky)' }}>
            <h4 className="serif" style={{ fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>Restoring Mobility, Restoring Hope</h4>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Jesus The Healer Orthopaedic Home operates 24 hours a day, 7 days a week, offering in-clinic consultations and active home treatment visits.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/appointments" className="btn btn-primary btn-sm">Book Consultation</Link>
              <a href="tel:08023758036" className="btn btn-outline btn-sm">Call 08023758036</a>
            </div>
          </div>
        );
    }
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
          <div style={{ color: 'var(--muted)' }}>Loading article details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>Article Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24, maxWidth: 400 }}>The medical education post you are looking for does not exist or has been removed.</p>
          <Link href="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Main Container */}
      <div style={{ background: 'var(--cream)', padding: '40px 20px', minHeight: '80vh' }}>
        <article style={{ maxWidth: 840, margin: '0 auto', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(10,22,40,.02)' }}>
          
          {/* Cover image banner */}
          <div className="post-hero-container" style={{ height: 400, position: 'relative', overflow: 'hidden', background: 'var(--navy)' }}>
            <img
              src={post.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,.8) 0%, rgba(10,22,40,.2) 70%, transparent 100%)' }} />
            
            {/* Overlay Header */}
            <div className="post-banner-header" style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
              <span className={`badge ${getCategoryBadgeClass(post.category)}`} style={{ background: '#fff', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
              <h1 className="serif" style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#fff', lineHeight: 1.2, margin: '8px 0 16px' }}>
                {post.title}
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {post.authorName.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{post.authorName}</span>
                </div>
                <span>•</span>
                <span>📅 {formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>⏱️ {getReadingTime(post.content)}</span>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="card-responsive-padding">
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic', borderLeft: '4px solid var(--border)', paddingLeft: '16px' }}>
              {post.summary}
            </p>

            <div style={{ color: 'var(--navy)', fontSize: 16, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>

            {/* Custom CTA related to Category */}
            {renderCTA(post.category)}

            {/* Back button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <Link href="/blog" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                ← Back to Medical Education Blog
              </Link>
            </div>
          </div>

        </article>
      </div>

      <Footer />
      <WhatsApp />
      <style>{`
        @media(max-width: 600px) {
          .post-hero-container {
            height: 300px !important;
          }
          .post-banner-header {
            bottom: 16px !important;
            left: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
