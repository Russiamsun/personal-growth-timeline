/**
 * SVG占位图生成工具
 * 用于生成美观的本地SVG占位图，完全消除网络图片依赖
 */

// 主题颜色配置
const themeColors = {
  mint: ['#10B981', '#34D399', '#6EE7B7'],
  coral: ['#F59E0B', '#FBBF24', '#FCD34D'],
  lavender: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
  rose: ['#EC4899', '#F472B6', '#F9A8D4'],
  sky: ['#3B82F6', '#60A5FA', '#93C5FD'],
  amber: ['#F59E0B', '#FBBF24', '#FDE68A'],
  emerald: ['#10B981', '#34D399', '#6EE7B7'],
  purple: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
};

// 根据seed生成hash值
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 根据seed选择颜色组合
function getColorsFromSeed(seed: string): string[] {
  const hash = hashSeed(seed);
  const colorKeys = Object.keys(themeColors);
  const selectedKey = colorKeys[hash % colorKeys.length];
  return themeColors[selectedKey as keyof typeof themeColors];
}

// 相机图标SVG路径
const cameraIconPath = `
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="13" r="4" fill="none" stroke="white" stroke-width="2"/>
`;

// 图片图标SVG路径
const imageIconPath = `
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="white" stroke-width="2"/>
  <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
  <polyline points="21 15 16 10 5 21" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
`;

/**
 * 生成SVG占位图
 * @param seed 种子字符串，用于生成一致的颜色
 * @param width 宽度，默认800
 * @param height 高度，默认600
 * @param showText 是否显示seed文本，默认false
 * @returns SVG data URI
 */
export function generatePlaceholder(
  seed: string,
  width: number = 800,
  height: number = 600,
  showText: boolean = false
): string {
  const colors = getColorsFromSeed(seed);
  const [color1, color2, color3] = colors;

  // 创建SVG内容
  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 渐变背景 -->
        <linearGradient id="bgGradient-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
        </linearGradient>

        <!-- 装饰圆圈渐变 -->
        <radialGradient id="circleGradient-${seed}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
      </defs>

      <!-- 背景 -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient-${seed})" />

      <!-- 装饰圆圈 -->
      <circle cx="${width * 0.15}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.15}" fill="url(#circleGradient-${seed})" opacity="0.5" />
      <circle cx="${width * 0.85}" cy="${height * 0.75}" r="${Math.min(width, height) * 0.2}" fill="url(#circleGradient-${seed})" opacity="0.4" />
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.25}" fill="url(#circleGradient-${seed})" opacity="0.3" />

      <!-- 图标容器 -->
      <g transform="translate(${width / 2}, ${height / 2 - (showText ? 30 : 0)})">
        <!-- 相机图标 -->
        <svg width="80" height="80" viewBox="0 0 24 24" x="-40" y="-40">
          ${cameraIconPath}
        </svg>
      </g>

      ${showText ? `
      <!-- Seed文本 -->
      <text x="${width / 2}" y="${height / 2 + 50}" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">
        ${seed}
      </text>
      ` : ''}

      <!-- 底部提示 -->
      <text x="${width / 2}" y="${height - 30}" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.6">
        图片占位
      </text>
    </svg>
  `;

  // 使用URL编码而不是Base64，避免某些浏览器的兼容性问题
  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

/**
 * 生成简单的渐变背景占位图（无图标）
 * @param seed 种子字符串
 * @param width 宽度，默认800
 * @param height 高度，默认600
 * @returns SVG data URI
 */
export function generateGradientPlaceholder(
  seed: string,
  width: number = 800,
  height: number = 600
): string {
  const colors = getColorsFromSeed(seed);
  const [color1, color2, color3] = colors;

  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad-${seed})" />
    </svg>
  `;

  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

/**
 * 生成圆形头像占位图
 * @param seed 种子字符串
 * @param size 尺寸，默认200
 * @param text 显示的文字（首字母）
 * @returns SVG data URI
 */
export function generateAvatarPlaceholder(
  seed: string,
  size: number = 200,
  text?: string
): string {
  const colors = getColorsFromSeed(seed);
  const [color1, color2] = colors;
  const displayText = text || seed.substring(0, 2).toUpperCase();

  const svgContent = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="avatarGrad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#avatarGrad-${seed})" />
      <text x="${size / 2}" y="${size / 2 + size * 0.1}" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" font-weight="bold">
        ${displayText}
      </text>
    </svg>
  `;

  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}