import DOMPurify from 'dompurify';

/**
 * 安全地清理HTML内容，防止XSS攻击
 * @param html - 原始HTML字符串
 * @param options - DOMPurify配置选项
 * @returns 清理后的安全HTML字符串
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // DOMPurify默认配置足够安全，直接使用
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'target', 'rel',
      'width', 'height',
    ],
  });
}

/**
 * 清理并渲染HTML内容
 * 用于 dangerouslySetInnerHTML
 */
export function createSafeHtml(html: string): { __html: string } {
  return {
    __html: sanitizeHtml(html),
  };
}

/**
 * 清理URL，确保是安全的链接
 * @param url - 原始URL字符串
 * @returns 清理后的安全URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // 只允许 http, https, mailto 协议
  const safeProtocols = ['http://', 'https://', 'mailto:', '/', '#'];
  const isSafe = safeProtocols.some(protocol => 
    url.toLowerCase().startsWith(protocol)
  );
  
  // 如果是相对路径或安全协议，返回原URL
  if (isSafe) {
    return url;
  }
  
  // 否则返回空字符串或安全占位符
  return '';
}

/**
 * 清理图片URL
 * @param url - 图片URL
 * @returns 安全的图片URL
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  
  // 允许 data:image (base64), http, https, 相对路径
  const safeProtocols = ['http://', 'https://', 'data:image/', '/', './'];
  const isSafe = safeProtocols.some(protocol => 
    url.toLowerCase().startsWith(protocol.toLowerCase())
  );
  
  if (isSafe) {
    return url;
  }
  
  // 返回占位图
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="200" height="200" fill="#f3f4f6"/>
      <text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-size="12">Invalid Image</text>
    </svg>
  `);
}