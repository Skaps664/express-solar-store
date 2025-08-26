import React, { useState, useRef, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { api } from "@/lib/services/api";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  contentImageUploading?: boolean;
  setContentImageUploading?: (loading: boolean) => void;
  activeLanguage: 'en' | 'ur' | 'ps';
}

interface TinyMCEEditor {
  focus: () => void;
  getContainer: () => HTMLElement;
}

const RichTextEditor = React.memo(({ value, onChange, placeholder, contentImageUploading = false, setContentImageUploading = () => {}, activeLanguage }: EditorProps) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Add z-index styles for dialogs - using much lower z-index values
    const style = document.createElement('style');
    style.innerHTML = `
      .tox-tinymce {
        z-index: 1 !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        transition: all 0.2s ease !important;
        background: #ffffff !important;
      }
      .tox-tinymce:focus-within {
        border-color: #3b82f6 !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      }
      .tox-toolbar {
        background: linear-gradient(to bottom, #fafafa, #f4f4f5) !important;
        border-bottom: 1px solid #e4e4e7 !important;
        padding: 8px 12px !important;
      }
      .tox-toolbar__group {
        margin-right: 12px !important;
      }
      .tox-tbtn {
        border-radius: 6px !important;
        margin: 1px 2px !important;
        transition: all 0.15s ease !important;
      }
      .tox-tbtn:hover {
        background: rgba(59, 130, 246, 0.1) !important;
        border-color: rgba(59, 130, 246, 0.2) !important;
      }
      .tox-tbtn--enabled {
        background: rgba(59, 130, 246, 0.15) !important;
        border-color: rgba(59, 130, 246, 0.3) !important;
      }
      .tox-tinymce-aux {
        z-index: 1000 !important;
      }
      .tox-dialog-wrap {
        z-index: 1000 !important;
      }
      .tox-dialog__backdrop {
        z-index: 999 !important;
        background-color: rgba(0, 0, 0, 0.4) !important;
        backdrop-filter: blur(4px) !important;
      }
      .tox-dialog {
        z-index: 1001 !important;
        position: fixed !important;
        border-radius: 12px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        border: 1px solid #e2e8f0 !important;
      }
      .tox-dialog__header {
        padding: 16px 20px !important;
        background: linear-gradient(to bottom, #fafafa, #f4f4f5) !important;
        border-bottom: 1px solid #e4e4e7 !important;
        border-radius: 12px 12px 0 0 !important;
      }
      .tox-dialog__footer {
        padding: 12px 20px !important;
        background: #fafafa !important;
        border-top: 1px solid #e4e4e7 !important;
        border-radius: 0 0 12px 12px !important;
      }
      .tox-dialog__body-content {
        padding: 20px !important;
        background: #ffffff !important;
      }
      .tox-dialog__body-content input,
      .tox-dialog__body-content textarea,
      .tox-dialog__body-content select,
      .tox-dialog__body-content button {
        pointer-events: auto !important;
        z-index: auto !important;
      }
      .tox-textfield,
      .tox-textarea,
      .tox-selectfield select,
      .tox-checkbox,
      .tox-checkbox__input,
      .tox-label {
        pointer-events: auto !important;
        z-index: auto !important;
      }
      /* Ensure dialog buttons are clickable */
      .tox-button {
        pointer-events: auto !important;
        z-index: 1002 !important;
        border-radius: 6px !important;
        font-weight: 500 !important;
        transition: all 0.15s ease !important;
      }
      .tox-button--primary {
        background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
        border: none !important;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2) !important;
      }
      .tox-button--primary:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3) !important;
      }
      /* Fix any overlay issues */
      .tox-collection {
        z-index: 1002 !important;
        border-radius: 8px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        border: 1px solid #e2e8f0 !important;
      }
      .tox-menu {
        z-index: 1002 !important;
        border-radius: 8px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        border: 1px solid #e2e8f0 !important;
      }
      .tox-menubar {
        background: linear-gradient(to bottom, #fafafa, #f4f4f5) !important;
        border-bottom: 1px solid #e4e4e7 !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Handle image upload
  const handleImageUpload = async (blobInfo: any): Promise<string> => {
    const file = blobInfo.blob();
    const formData = new FormData();
    formData.append('image', file);

    try {
      setContentImageUploading(true);
      
      // Use the same API service as the main page
      const response = await api.post('/api/blogs/upload/content-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data); // Debug log
      
      // Check if upload was successful
      if (response.data.success) {
        const imageUrl = response.data.image?.url || response.data.url || response.data.imageUrl;
        
        if (!imageUrl) {
          console.error('Invalid response structure:', response.data);
          throw new Error('Invalid upload response - no image URL found');
        }

        return imageUrl;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Image upload failed', err);
      throw new Error(err.response?.data?.message || err.message || 'Image upload failed');
    } finally {
      setContentImageUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Professional container with enhanced styling */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;
            // Initial focus after a short delay
            setTimeout(() => editor.focus(), 100);
          }}
          value={value}
          onEditorChange={onChange}
          init={{
            min_height: 400,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount', 'directionality',
              'formatselect', 'hr', 'nonbreaking', 'pagebreak', 'paste', 'preview'
            ],
            toolbar: [
              'undo redo | formatselect | bold italic underline strikethrough',
              'h1 h2 h3 h4 h5 h6 | alignleft aligncenter alignright alignjustify',
              'bullist numlist | outdent indent | link image | blockquote hr',
              'removeformat | ltr rtl | code fullscreen | help'
            ],
            content_style: `
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 16px;
                padding: 24px;
                min-height: 380px;
                line-height: 1.7;
                color: #1e293b;
                background: #ffffff;
              }
              h1 { 
                font-size: 2.5em; 
                font-weight: 700; 
                margin: 1.2em 0 0.6em 0; 
                line-height: 1.2;
                color: #0f172a;
                background: linear-gradient(135deg, #1e293b, #475569);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              h2 { 
                font-size: 2em; 
                font-weight: 700; 
                margin: 1.1em 0 0.5em 0; 
                line-height: 1.3;
                color: #1e293b;
              }
              h3 { 
                font-size: 1.75em; 
                font-weight: 600; 
                margin: 1em 0 0.5em 0; 
                line-height: 1.3;
                color: #334155;
              }
              h4 { 
                font-size: 1.5em; 
                font-weight: 600; 
                margin: 1em 0 0.4em 0; 
                line-height: 1.4;
                color: #475569;
              }
              h5 { 
                font-size: 1.25em; 
                font-weight: 600; 
                margin: 0.9em 0 0.4em 0; 
                line-height: 1.4;
                color: #64748b;
              }
              h6 { 
                font-size: 1.1em; 
                font-weight: 600; 
                margin: 0.8em 0 0.3em 0; 
                line-height: 1.4;
                color: #64748b;
              }
              p {
                margin: 0 0 1.2em 0;
                color: #334155;
              }
              blockquote {
                border-left: 4px solid #3b82f6;
                margin: 1.5em 0;
                padding: 1em 0 1em 1.5em;
                font-style: italic;
                background: linear-gradient(135deg, #f8fafc, #f1f5f9);
                border-radius: 0 8px 8px 0;
                color: #475569;
                font-size: 1.05em;
                position: relative;
              }
              blockquote::before {
                content: '"';
                font-size: 4em;
                color: #3b82f6;
                position: absolute;
                left: 8px;
                top: -10px;
                font-family: serif;
                opacity: 0.3;
              }
              a {
                color: #3b82f6;
                text-decoration: none;
                border-bottom: 1px solid rgba(59, 130, 246, 0.3);
                transition: all 0.2s ease;
              }
              a:hover {
                color: #2563eb;
                border-bottom-color: #2563eb;
              }
              ul, ol {
                padding-left: 1.5em;
              }
              li {
                margin-bottom: 0.5em;
              }
              img {
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                max-width: 100%;
                height: auto;
              }
            `,
            valid_elements: '*[*]',
            extended_valid_elements: 'h1[*],h2[*],h3[*],h4[*],h5[*],h6[*],p[*],div[*],span[*],a[*],img[*],strong[*],em[*],u[*],s[*],ul[*],ol[*],li[*],blockquote[*],br,hr[*]',
            block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Blockquote=blockquote;',
            formats: {
              h1: { block: 'h1' },
              h2: { block: 'h2' },
              h3: { block: 'h3' },
              h4: { block: 'h4' },
              h5: { block: 'h5' },
              h6: { block: 'h6' }
            },
            placeholder,
            language: activeLanguage === 'ur' ? 'ar' : 'en',
            directionality: activeLanguage === 'ur' || activeLanguage === 'ps' ? 'rtl' : 'ltr',
            images_upload_handler: handleImageUpload,
            relative_urls: false,
            remove_script_host: true,
            branding: false,
            promotion: false,
            statusbar: false,
            resize: false,
            width: "100%",
            autoresize_bottom_margin: 0,
            image_advtab: true,
            image_dimensions: false,
            image_title: true,
            object_resizing: true,
            paste_data_images: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            auto_focus: false, // Disable auto focus to prevent conflicts
            dialog_type: 'modal',
            setup: (editor: any) => {
              editor.on('init', () => {
                editor.getContainer().style.zIndex = "1";
              });

              // Improve focus management
              editor.on('blur', (e: any) => {
                // Check if we're clicking inside a dialog
                const isClickingDialog = e.relatedTarget && 
                  (e.relatedTarget.closest('.tox-dialog') || 
                   e.relatedTarget.closest('.tox-button') ||
                   e.relatedTarget.closest('.tox-menu') ||
                   e.relatedTarget.closest('.tox-collection'));

                if (isFocused && !isClickingDialog) {
                  // Small delay to allow other click handlers to execute first
                  requestAnimationFrame(() => {
                    if (document.activeElement?.tagName !== 'BODY') {
                      editor.focus();
                    }
                  });
                }
              });
              
              editor.on('focus', () => {
                setIsFocused(true);
              });

              // Improve dialog behavior
              editor.on('OpenWindow', (e: any) => {
                setIsFocused(false); // Temporarily disable auto-focus while dialog is open
                // Ensure dialog is properly positioned and clickable
                setTimeout(() => {
                  const dialog = document.querySelector('.tox-dialog');
                  if (dialog) {
                    (dialog as HTMLElement).style.pointerEvents = 'auto';
                    (dialog as HTMLElement).style.zIndex = '1001';
                  }
                  const backdrop = document.querySelector('.tox-dialog__backdrop');
                  if (backdrop) {
                    (backdrop as HTMLElement).style.zIndex = '999';
                  }
                }, 10);
              });

              editor.on('CloseWindow', () => {
                setTimeout(() => {
                  setIsFocused(true); // Re-enable auto-focus after dialog closes
                  editor.focus();
                }, 100);
              });
            }
          }}
        />
      </div>
      
      {/* Professional loading indicator */}
      {contentImageUploading && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn">
            <div className="relative">
              <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-sm font-medium">Uploading image...</span>
          </div>
        </div>
      )}
      
      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
});

export default RichTextEditor;