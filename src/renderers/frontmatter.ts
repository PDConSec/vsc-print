import * as yaml from "yaml";
import { logger } from '../logger';

/**
 * Represents the result of extracting frontmatter from markdown content
 */
export interface FrontmatterResult {
  frontmatter: any | null;
  content: string;
}

/**
 * HTML escaping utility function for frontmatter values
 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Extracts frontmatter from markdown content
 * Supports both YAML (---) and TOML (+++) delimiters
 * 
 * @param raw The raw markdown content
 * @returns Object containing parsed frontmatter and remaining content
 */
export function extractFrontmatter(raw: string): FrontmatterResult {
  // Check if content starts with frontmatter delimiters (--- or +++)
  const yamlDelimiterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const tomlDelimiterRegex = /^\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*\n/;
  
  let frontmatterMatch = raw.match(yamlDelimiterRegex);
  let frontmatterContent = '';
  let isToml = false;
  
  if (!frontmatterMatch) {
    frontmatterMatch = raw.match(tomlDelimiterRegex);
    isToml = true;
  }
  
  if (frontmatterMatch) {
    frontmatterContent = frontmatterMatch[1];
    const content = raw.substring(frontmatterMatch[0].length);
    
    try {
      let frontmatterData;
      if (isToml) {
        // For TOML, we'll try to parse it as YAML for now
        // You might want to add a TOML parser like @iarna/toml if needed
        frontmatterData = yaml.parse(frontmatterContent);
      } else {
        frontmatterData = yaml.parse(frontmatterContent);
      }
      
      return { frontmatter: frontmatterData, content };
    } catch (error) {
      logger.warn(`Failed to parse frontmatter: ${error}`);
      return { frontmatter: null, content: raw };
    }
  }
  
  return { frontmatter: null, content: raw };
}

/**
 * Converts frontmatter object to HTML table string
 * 
 * @param frontmatter The parsed frontmatter object
 * @returns HTML string representing the frontmatter as a table
 */
export function frontmatterToTable(frontmatter: any): string {
  if (!frontmatter || typeof frontmatter !== 'object') {
    return '';
  }
  
  const rows = Object.entries(frontmatter).map(([key, value]) => {
    let displayValue = '';
    if (value === null || value === undefined) {
      displayValue = '';
    } else if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (typeof value === 'object') {
      displayValue = JSON.stringify(value, null, 2);
    } else {
      displayValue = String(value);
    }
    
    return `    <tr>
      <th class="frontmatter-key">${escapeHtml(key)}</th>
      <td class="frontmatter-value">${escapeHtml(displayValue)}</td>
    </tr>`;
  }).join('\n');
  
  if (rows) {
    return `<div class="frontmatter-metadata">
  <h3 class="frontmatter-title">Document Metadata</h3>
  <table class="frontmatter-table">
${rows}
  </table>
</div>`;
  }
  
  return '';
}

/**
 * Checks if the given string has frontmatter delimiters at the start
 * 
 * @param raw The raw markdown content
 * @returns true if frontmatter is detected, false otherwise
 */
export function hasFrontmatter(raw: string): boolean {
  const yamlDelimiterRegex = /^---\s*\n/;
  const tomlDelimiterRegex = /^\+\+\+\s*\n/;
  
  return yamlDelimiterRegex.test(raw) || tomlDelimiterRegex.test(raw);
}