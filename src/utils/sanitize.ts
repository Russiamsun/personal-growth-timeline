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
 * 检测内容是否为HTML格式
 */
function isHtmlContent(content: string): boolean {
  // 检查是否包含HTML标签
  const htmlPattern = /<[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
}

/**
 * 将纯文本转换为HTML格式
 * - 自动将换行符转换为段落
 * - 保留空行作为段落分隔
 */
function textToHtml(text: string): string {
  if (!text) return '';

  // 分割为段落（以双换行或单换行为分隔）
  const paragraphs = text
    .split(/\n\s*\n/) // 先按双换行分割
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .flatMap(p => {
      // 如果段落内有单换行，也作为分段处理
      const lines = p.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      return lines;
    });

  // 转换为HTML段落
  return paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

/**
 * 转义HTML特殊字符
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * 格式化内容（智能处理HTML和纯文本）
 * - 如果内容已经是HTML格式，保持原样
 * - 如果是纯文本，自动将换行符转换为段落
 */
export function formatContent(content: string): string {
  if (!content) return '';

  // 如果已经是HTML格式，直接返回
  if (isHtmlContent(content)) {
    return content;
  }

  // 否则将纯文本转换为HTML
  return textToHtml(content);
}

/**
 * 清理并渲染HTML内容
 * 用于 dangerouslySetInnerHTML
 * 自动处理纯文本换行
 */
export function createSafeHtml(html: string): { __html: string } {
  // 先格式化内容（处理纯文本换行），再消毒
  const formattedContent = formatContent(html);
  return {
    __html: sanitizeHtml(formattedContent),
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