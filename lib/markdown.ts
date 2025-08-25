// Simple markdown parser for basic formatting
export function parseMarkdown(content: string): string {
  if (!content) return '';
  
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    
    // Line breaks
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, '<br>')
    
    // Wrap in paragraph if not already wrapped
    .replace(/^(?!<h[1-6]|<p|<ul|<ol|<li)(.+)/gim, '<p class="mb-4">$1')
    
    // Lists
    .replace(/^\- (.+)$/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gim, '<li class="ml-4 list-decimal">$1. $2</li>')
    
    // Code blocks and inline code
    .replace(/```([^`]+)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>');
}
