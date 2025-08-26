"use client";

import { useState } from 'react';
import React from 'react';
import { FileText, Video, ExternalLink, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

type Resource = {
  type: 'document' | 'video' | 'blog';
  id: string;
  name?: string;
  title?: string;
  description?: string;
  fileType?: string;
  duration?: string;
  views?: string;
  url?: string;
  slug?: string;
  excerpt?: {
    en: string;
    ur: string;
    ps: string;
  } | string;
  featuredImage?: {
    url: string;
    alt?: {
      en: string;
      ur: string;
      ps: string;
    };
  };
  publishedAt?: string;
};

type ProductResourcesProps = {
  resources: Resource[];
};

// Button component (simplified version)
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
  className?: string;
  asChild?: boolean;
  [key: string]: any;
};

const Button = ({ children, variant = "default", size = "default", className = "", asChild = false, ...props }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-background hover:bg-gray-50"
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (asChild && React.isValidElement(children) && children.type === 'a') {
    const anchorProps = children.props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a {...anchorProps} className={classes}>{anchorProps.children}</a>;
  }
  
  return <button className={classes} {...props}>{children}</button>;
};

// Tabs components (simplified version)
const Tabs = ({ children, defaultValue, value, onValueChange, className = "" }: any) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalActiveTab;
  const setActiveTab = onValueChange || setInternalActiveTab;
  
  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.map(children, (child) => {
        if (!child) return null;
        
        if (child.type === TabsList) {
          return React.cloneElement(child, { onTabChange: setActiveTab, activeTab });
        }
        
        if (child.type === TabsContent && child.props.value === activeTab) {
          return child;
        }
        
        return null;
      })}
    </div>
  );
};

const TabsList = ({ children, onTabChange, activeTab }: any) => (
  <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600">
    {React.Children.map(children, (child, index) => {
      if (!child || !child.props) return null;
      
      return (
        <button
          key={index}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
            activeTab === child.props.value 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onTabChange && onTabChange(child.props.value)}
        >
          {child.props.children}
        </button>
      );
    })}
  </div>
);

const TabsTrigger = ({ value, children }: any) => <span>{children}</span>;

const TabsContent = ({ value, children, className = "" }: any) => (
  <div className={className}>{children}</div>
);

export default function ProductResources({ resources = [] }: ProductResourcesProps) {
  // Test data to verify the component works with string URLs
  const testResources = [
    {
      id: "1",
      type: "video" as const,
      title: "Test Video 1",
      description: "This is a test video from YouTube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "3:32",
      views: "1B"
    },
    {
      id: "2", 
      type: "video" as const,
      title: "Test Video 2",
      description: "Another test video",
      url: "https://youtu.be/dQw4w9WgXcQ",
      duration: "3:32",
      views: "1B"
    },
    {
      id: "3",
      type: "document" as const,
      name: "Sample Document",
      description: "Test PDF document",
      url: "https://example.com/doc.pdf",
      fileType: "pdf"
    }
  ];
  
  // Ensure resources is an array and validate each resource
  const validatedResources = Array.isArray(resources) ? resources.filter(resource => {
    if (!resource || typeof resource !== 'object') {
      console.error('Invalid resource:', resource);
      return false;
    }
    if (!resource.type || !resource.id) {
      console.error('Resource missing required fields:', resource);
      return false;
    }
    
    // Additional type-specific validation
    if (resource.type === 'document' && !resource.url) {
      console.error('Document resource missing URL:', resource);
      return false;
    }
    if (resource.type === 'video' && !resource.url) {
      console.error('Video resource missing URL:', resource);
      return false;
    }
    if (resource.type === 'blog') {
      if (!resource.slug) {
        console.error('Blog resource missing slug:', resource);
        return false;
      }
      if (!resource.title) {
        console.error('Blog resource missing title:', resource);
        return false;
      }
      // Check for valid title structure (string or localized object)
      if (typeof resource.title !== 'string' && (!resource.title?.en && !resource.title?.ur && !resource.title?.ps)) {
        console.error('Blog resource has invalid title format:', resource);
        return false;
      }
      // Check for valid excerpt structure
      if (resource.excerpt && typeof resource.excerpt !== 'string' && (!resource.excerpt?.en && !resource.excerpt?.ur && !resource.excerpt?.ps)) {
        console.error('Blog resource has invalid excerpt format:', resource);
        return false;
      }
      // Validate featuredImage if present
      if (resource.featuredImage && (!resource.featuredImage.url || typeof resource.featuredImage.url !== 'string')) {
        console.error('Blog resource has invalid featuredImage format:', resource);
        return false;
      }
    }
    return true;
  }) : [];
  
  // Remove duplicates based on id and type
  const finalResources = validatedResources.filter((resource, index, array) => {
    const firstIndex = array.findIndex(r => r.id === resource.id && r.type === resource.type);
    return firstIndex === index;
  });
  
  const documents = finalResources.filter(resource => resource.type === 'document');
  const videos = finalResources.filter(resource => resource.type === 'video');
  const blogs = finalResources.filter(resource => resource.type === 'blog');
  const [selectedVideo, setSelectedVideo] = useState<Resource | null>(videos.length > 0 ? videos[0] : null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Function to handle video selection from all resources tab
  const handleVideoSelect = (video: Resource) => {
    setSelectedVideo(video);
    setActiveTab('videos');
  };
  
  // Function to extract YouTube video ID
  const getVideoId = (url: string): string => {
    if (!url) return '';
    
    try {
      if (url.includes('youtube.com/watch')) {
        return new URL(url).searchParams.get('v') || '';
      }
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      return '';
    } catch {
      return '';
    }
  };
  
  // Debug logging for resource processing
  console.log('Processing resources:', {
    originalResources: resources,
    finalResources,
    documents,
    videos,
    selectedVideo
  });

  if (finalResources.length === 0) {
    console.log('No resources available to display');
    return (
      <div className="bg-gray-50 p-8 text-center rounded-md">
        <p className="text-gray-500">No resources available for this product.</p>
      </div>
    );
  }
  
  // Function to get document URL through backend proxy
  const getDocumentUrl = (cloudinaryUrl: string): string => {
    console.log('Processing Cloudinary URL:', cloudinaryUrl);
    
    try {
      // Check if it's already a Cloudinary URL
      if (!cloudinaryUrl.includes('cloudinary.com')) {
        console.log('Not a Cloudinary URL, using as-is:', cloudinaryUrl);
        return cloudinaryUrl;
      }
      
      // Extract the public ID from the Cloudinary URL
      // URL format: https://res.cloudinary.com/dcgcxw70o/raw/upload/v1754914983/products/documents/1754914982963_EP-5_EP-11_Updated.pdf
      const urlParts = cloudinaryUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex === -1) {
        console.error('Invalid Cloudinary URL format:', cloudinaryUrl);
        return cloudinaryUrl; // fallback to original URL
      }
      
      // Get everything after /upload/
      const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
      
      // Remove version number if present (starts with 'v' followed by numbers and a slash)
      const publicId = pathAfterUpload.replace(/^v\d+\//, '');
      
      console.log('Extracted public ID:', publicId);
      console.log('Path after upload:', pathAfterUpload);
      
      // The backend expects the full public ID including the folder structure
      const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/products/document/${encodeURIComponent(publicId)}`;
      console.log('Document URL through backend:', backendUrl);
      
      return backendUrl;
    } catch (error) {
      console.error('Error processing document URL:', error);
      return cloudinaryUrl; // fallback to original URL
    }
  };
  
  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Resources ({finalResources.length})</TabsTrigger>
          {documents.length > 0 && <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>}
          {videos.length > 0 && <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>}
          {blogs.length > 0 && <TabsTrigger value="blogs">Blogs ({blogs.length})</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="videos" className="pt-6">
          {/* Video player */}
          {selectedVideo && (
            <div className="mb-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden max-w-2xl mx-auto lg:mx-0">
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  {selectedVideo.url ? (
                    <iframe 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.url)}?rel=0&modestbranding=1`}
                      title={selectedVideo.title || "Product Video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <p className="text-gray-500">Invalid video URL</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video info */}
              <div className="mt-4 max-w-2xl mx-auto lg:mx-0">
                <h3 className="text-lg font-medium">{selectedVideo.title || 'Untitled Video'}</h3>
                {selectedVideo.description && (
                  <p className="text-sm text-gray-600 mt-1">{selectedVideo.description}</p>
                )}
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  {selectedVideo.duration && <span className="mr-3">{selectedVideo.duration}</span>}
                  {selectedVideo.views && <span>{selectedVideo.views} views</span>}
                </div>
              </div>
            </div>
          )}
          
          {/* Video list */}
          {videos.length > 1 && (
            <>
              <h4 className="font-medium mb-3 text-lg">All Videos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((resource, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 hover:shadow-md cursor-pointer ${
                      selectedVideo?.url === resource.url ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedVideo(resource)}
                  >
                    <div className="flex items-start">
                      <div className="rounded-full p-2 bg-blue-100 text-blue-600 mr-3">
                        <Video size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{resource.title || 'Product Video'}</h4>
                        {resource.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="pt-6">
          {console.log('Rendering documents tab, documents:', documents)}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((resource: Resource, index: number) => (
                <div key={resource.id || `doc-${index}`} className="border rounded-lg p-4 hover:shadow-md">
                  <div className="flex items-start">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 mr-3">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{resource.name || 'Untitled Document'}</h4>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      )}
                      {resource.fileType && (
                        <span className="bg-gray-100 px-2 py-1 rounded mr-2 text-xs">
                          {resource.fileType.toUpperCase()}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 flex items-center justify-center"
                        asChild
                      >
                        <a href={getDocumentUrl(resource.url || '')} target="_blank" rel="noopener noreferrer">
                          Download <ExternalLink size={16} className="ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="blogs" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((resource: Resource, index: number) => (
              <Link key={`blogs-${resource.id || index}`} href={`/blog/${resource.slug}`}>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start">
                    <div className="rounded-full p-2 bg-green-100 text-green-600 mr-3">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1 line-clamp-2">{resource.title || 'Untitled Blog'}</h4>
                      {resource.excerpt && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{typeof resource.excerpt === 'string' ? resource.excerpt : resource.excerpt?.en || resource.description}</p>
                      )}
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Calendar size={12} className="mr-1" />
                        {resource.publishedAt ? new Date(resource.publishedAt).toLocaleDateString() : 'No date'}
                      </div>
                      <div className="mt-3">
                        <span className="text-blue-600 text-sm font-medium hover:underline">
                          Read Article →
                        </span>
                      </div>
                    </div>
                  </div>
                  {resource.featuredImage?.url && (
                    <div className="mt-3">
                      <img 
                        src={resource.featuredImage.url} 
                        alt={resource.featuredImage.alt?.en || resource.title || 'Blog featured image'} 
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finalResources.map((resource: Resource, index: number) => {
              if (resource.type === 'blog') {
                return (
                  <Link key={`all-${resource.id}`} href={`/blog/${resource.slug}`}>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start">
                        <div className="rounded-full p-2 bg-green-100 text-green-600 mr-3">
                          <BookOpen size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 line-clamp-2">
                            {typeof resource.title === 'string' 
                              ? resource.title 
                              : (resource.title as any)?.en || (resource.title as any)?.ur || (resource.title as any)?.ps || 'Untitled Blog'
                            }
                          </h4>
                          {(resource.excerpt || resource.description) && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                              {typeof resource.excerpt === 'string' 
                                ? resource.excerpt 
                                : (resource.excerpt as any)?.en || (resource.excerpt as any)?.ur || (resource.excerpt as any)?.ps || resource.description || ''
                              }
                            </p>
                          )}
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <Calendar size={12} className="mr-1" />
                            {resource.publishedAt ? new Date(resource.publishedAt).toLocaleDateString() : 'No date'}
                          </div>
                          <div className="mt-3">
                            <span className="text-blue-600 text-sm font-medium hover:underline">
                              Read Article →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <div 
                  key={`all-${resource.id}`}
                  className={`border rounded-lg p-4 hover:shadow-md ${
                    resource.type === 'video' ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => resource.type === 'video' ? handleVideoSelect(resource) : null}
                >
                  <div className="flex items-start">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 mr-3">
                      {resource.type === 'document' ? <FileText size={20} /> : <Video size={20} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">
                        {resource.type === 'document' ? (resource.name || 'Untitled Document') : (resource.title || 'Untitled Video')}
                      </h4>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      )}
                      {resource.type === 'document' && resource.fileType && (
                        <span className="bg-gray-100 px-2 py-1 rounded mr-2 text-xs">
                          {resource.fileType.toUpperCase()}
                        </span>
                      )}
                      {resource.type === 'document' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 flex items-center justify-center"
                          asChild
                        >
                          <a href={getDocumentUrl(resource.url || '')} target="_blank" rel="noopener noreferrer">
                            Download <ExternalLink size={16} className="ml-1" />
                          </a>
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-400 truncate flex-1 mr-2">
                            {resource.url}
                          </div>
                          <div className="text-xs text-blue-600 font-medium whitespace-nowrap">
                            Click to watch
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}