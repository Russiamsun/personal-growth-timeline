/**
 * 翻译服务
 * 使用免费翻译API实现中英互译
 */

const TRANSLATE_API = 'https://api.mymemory.translated.net/get';

/**
 * 翻译文本
 * @param text - 要翻译的文本
 * @param from - 源语言 ('zh' | 'en')
 * @param to - 目标语言 ('zh' | 'en')
 * @returns 翻译后的文本
 */
export async function translateText(
  text: string,
  from: 'zh' | 'en',
  to: 'zh' | 'en'
): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }

  // 相同语言不翻译
  if (from === to) {
    return text;
  }

  try {
    // MyMemory API 格式：langpair=zh-CN|en
    const langPair = from === 'zh' ? 'zh-CN|en' : 'en|zh-CN';

    const url = `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    console.log(`[翻译] ${from} → ${to}: ${text.substring(0, 50)}...`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`翻译请求失败: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      console.log(`[翻译成功] ${translated.substring(0, 50)}...`);
      return translated;
    }

    // 如果翻译失败，返回原文
    console.warn('[翻译失败] 返回原文');
    return text;
  } catch (error) {
    console.error('[翻译错误]', error);
    // 翻译失败时返回原文
    return text;
  }
}

/**
 * 批量翻译（用于长文本分段翻译）
 * @param text - 要翻译的长文本
 * @param from - 源语言
 * @param to - 目标语言
 * @param maxLength - 每段最大长度（默认500字符）
 */
export async function translateLongText(
  text: string,
  from: 'zh' | 'en',
  to: 'zh' | 'en',
  maxLength: number = 500
): Promise<string> {
  if (!text || text.length <= maxLength) {
    return translateText(text, from, to);
  }

  // 分段翻译
  const paragraphs = text.split('\n');
  const translatedParagraphs: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      translatedParagraphs.push('');
      continue;
    }

    // 每段单独翻译
    const translated = await translateText(paragraph, from, to);
    translatedParagraphs.push(translated);

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return translatedParagraphs.join('\n');
}

/**
 * 检测文本语言
 * 简单判断：如果包含中文字符则为中文
 */
export function detectLanguage(text: string): 'zh' | 'en' {
  // 匹配中文字符
  const chinesePattern = /[\u4e00-\u9fa5]/;
  return chinesePattern.test(text) ? 'zh' : 'en';
}