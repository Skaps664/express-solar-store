// Simple markdown parser for basic formatting
export function parseMarkdown(content: string): string {
  if (!content) return '';
  
  // Check if content is already HTML (contains HTML tags)
  const hasHTMLTags = /<[^>]*>/g.test(content);
  
  if (hasHTMLTags) {
    // Content is already HTML (from TinyMCE), just add proper CSS classes
    return content
      // Add proper classes to existing HTML headings
      .replace(/<h1([^>]*)>/gim, '<h1 class="text-3xl font-bold mb-6 mt-8"$1>')
      .replace(/<h2([^>]*)>/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8"$1>')
      .replace(/<h3([^>]*)>/gim, '<h3 class="text-xl font-semibold mb-3 mt-6"$1>')
      .replace(/<h4([^>]*)>/gim, '<h4 class="text-lg font-semibold mb-3 mt-5"$1>')
      .replace(/<h5([^>]*)>/gim, '<h5 class="text-base font-semibold mb-2 mt-4"$1>')
      .replace(/<h6([^>]*)>/gim, '<h6 class="text-sm font-semibold mb-2 mt-4"$1>')
      // Add classes to paragraphs if they don't have any
      .replace(/<p>/gim, '<p class="mb-4">')
      // Add classes to lists
      .replace(/<ul>/gim, '<ul class="list-disc pl-6 mb-4">')
      .replace(/<ol>/gim, '<ol class="list-decimal pl-6 mb-4">')
      .replace(/<li>/gim, '<li class="mb-1">')
      // Add classes to blockquotes
      .replace(/<blockquote>/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">')
      // Add classes to links
      .replace(/<a([^>]*?)>/gim, '<a class="text-blue-600 hover:text-blue-800 underline"$1>')
      // Add classes to strong and em
      .replace(/<strong>/gim, '<strong class="font-semibold">')
      .replace(/<em>/gim, '<em class="italic">');
  }
  
  // Content is Markdown, parse it normally
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
