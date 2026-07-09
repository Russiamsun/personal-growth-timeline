import { Activity, Question, Reflection } from '@/types';

interface ExportData {
  activities: Activity[];
  questions: Question[];
  reflections: Reflection[];
  exportedAt: string;
  version: string;
}

/**
 * 导出所有数据为JSON格式
 */
export function exportToJson(
  activities: Activity[],
  questions: Question[],
  reflections: Reflection[]
): void {
  const exportData: ExportData = {
    activities,
    questions,
    reflections,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `emma-growth-portfolio-${formatDateForFilename(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 从JSON文件导入数据
 */
export async function importFromJson(file: File): Promise<ExportData | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;
        
        // 基本验证
        if (!data.activities || !data.questions || !data.reflections) {
          reject(new Error('Invalid data format'));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * 导出为HTML报告（可打印）
 */
export function exportToHtml(
  activities: Activity[],
  questions: Question[],
  reflections: Reflection[],
  language: 'zh' | 'en'
): void {
  const html = generateHtmlReport(activities, questions, reflections, language);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `emma-growth-portfolio-${formatDateForFilename(new Date())}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成HTML报告
 */
function generateHtmlReport(
  activities: Activity[],
  questions: Question[],
  reflections: Reflection[],
  language: 'zh' | 'en'
): string {
  const title = language === 'zh' ? 'Emma成长Portfolio' : 'Emma\'s Growth Portfolio';
  const exportDate = language === 'zh' 
    ? new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
<!DOCTYPE html>
<html lang="${language === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    h1 { color: #1a1a1a; margin-bottom: 10px; }
    h2 { color: #4a4a4a; margin: 30px 0 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
    h3 { color: #666; margin: 20px 0 10px; }
    .export-info { color: #888; margin-bottom: 30px; }
    .section { margin-bottom: 40px; }
    .activity, .question, .reflection { margin-bottom: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
    .activity-title, .question-title { font-size: 1.2em; font-weight: 600; margin-bottom: 10px; }
    .meta { color: #888; font-size: 0.9em; margin-bottom: 15px; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
    .tag { background: #e0e0e0; padding: 4px 10px; border-radius: 12px; font-size: 0.85em; }
    .content { margin-top: 15px; line-height: 1.8; }
    .content p { margin-bottom: 10px; }
    .content h3 { margin-top: 15px; }
    @media print { body { padding: 20px; } .activity, .question, .reflection { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="export-info">${language === 'zh' ? '导出日期：' : 'Exported: '}${exportDate}</p>
  
  <div class="section">
    <h2>${language === 'zh' ? '实践经历' : 'Real World Experiences'} (${activities.length})</h2>
    ${activities.map(activity => `
      <div class="activity">
        <div class="activity-title">${language === 'zh' ? activity.titleZh : activity.titleEn}</div>
        <div class="meta">
          <span>${language === 'zh' ? activity.locationZh : activity.locationEn || ''}</span>
          <span> · </span>
          <span>${formatDate(activity.date, language)}</span>
        </div>
        <div class="content">${language === 'zh' ? activity.contentZh : activity.contentEn}</div>
        ${(activity.tagsZh?.length || activity.tagsEn?.length) ? `
          <div class="tags">
            ${(language === 'zh' ? activity.tagsZh : activity.tagsEn)?.map(tag => 
              `<span class="tag">${tag}</span>`
            ).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <h2>${language === 'zh' ? '思考探究' : 'Questions I\'m Thinking About'} (${questions.length})</h2>
    ${questions.map(question => `
      <div class="question">
        <div class="question-title">${language === 'zh' ? question.questionZh : question.questionEn}</div>
        <div class="meta">${formatDate(question.date, language)}</div>
        ${(question.thoughtsZh || question.thoughtsEn) ? `
          <div class="content">${language === 'zh' ? question.thoughtsZh : question.thoughtsEn}</div>
        ` : ''}
        ${(question.tagsZh?.length || question.tagsEn?.length) ? `
          <div class="tags">
            ${(language === 'zh' ? question.tagsZh : question.tagsEn)?.map(tag => 
              `<span class="tag">${tag}</span>`
            ).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <h2>${language === 'zh' ? '成长感悟' : 'Reflection Journal'} (${reflections.length})</h2>
    ${reflections.map(reflection => `
      <div class="reflection">
        <div class="content">${language === 'zh' ? reflection.contentZh : reflection.contentEn}</div>
        <div class="meta">${formatDate(reflection.date, language)}</div>
        ${(reflection.tagsZh?.length || reflection.tagsEn?.length) ? `
          <div class="tags">
            ${(language === 'zh' ? reflection.tagsZh : reflection.tagsEn)?.map(tag => 
              `<span class="tag">${tag}</span>`
            ).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();
}

/**
 * 格式化日期用于显示
 */
function formatDate(dateStr: string, language: 'zh' | 'en'): string {
  const date = new Date(dateStr);
  if (language === 'zh') {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * 格式化日期用于文件名
 */
function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default {
  exportToJson,
  importFromJson,
  exportToHtml,
};