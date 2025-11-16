/**
 * Accessibility Testing Utilities
 * WCAG 2.1 AA Compliance Testing
 */

import axe from 'axe-core';

/**
 * Run accessibility audit on a given element
 */
export async function runAccessibilityAudit(
  element: Element | Document = document,
  options: {
    rules?: Record<string, unknown>;
    runOnly?: string[];
  } = {}
): Promise<axe.AxeResults> {
  return new Promise((resolve, reject) => {
    axe.run(
      element,
      {
        rules: options.rules as Record<string, { enabled: boolean }> | undefined,
        runOnly: options.runOnly || [
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'best-practice',
        ],
      },
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

/**
 * Check if current page passes WCAG 2.1 AA requirements
 */
export async function checkWCAGCompliance(): Promise<{
  passed: boolean;
  violations: axe.Result[];
  incomplete: axe.Result[];
  score: number;
}> {
  try {
    const results = await runAccessibilityAudit();

    // Calculate compliance score (0-100)
    const totalIssues = results.violations.length + results.incomplete.length;
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    ).length;

    // WCAG AA allows some violations but penalizes critical ones heavily
    const score = Math.max(0, 100 - totalIssues * 5 - criticalViolations * 15);

    return {
      passed: results.violations.length === 0,
      violations: results.violations,
      incomplete: results.incomplete,
      score,
    };
  } catch {
    return {
      passed: false,
      violations: [],
      incomplete: [],
      score: 0,
    };
  }
}

/**
 * Test keyboard navigation
 */
export function testKeyboardNavigation(): {
  tabOrder: Element[];
  focusableElements: Element[];
  issues: string[];
} {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const tabOrder: Element[] = [];
  const issues: string[] = [];

  // Check for elements with tabindex > 0 (should be avoided)
  const highTabIndexElements = document.querySelectorAll(
    '[tabindex]:not([tabindex="-1"])'
  );
  highTabIndexElements.forEach((el) => {
    const tabIndex = parseInt(el.getAttribute('tabindex') || '0');
    if (tabIndex > 0) {
      issues.push(`Element with high tabindex: ${tabIndex}`);
    }
  });

  // Check for missing alt text on images
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  imagesWithoutAlt.forEach(() => {
    issues.push('Image without alt attribute found');
  });

  // Check for buttons without accessible names
  const buttonsWithoutLabel = document.querySelectorAll(
    'button:not([aria-label]):not([aria-labelledby])'
  );
  buttonsWithoutLabel.forEach((button) => {
    if (!button.textContent?.trim()) {
      issues.push('Button without accessible name found');
    }
  });

  return {
    tabOrder,
    focusableElements: Array.from(focusableElements),
    issues,
  };
}

/**
 * Test color contrast
 */
export function testColorContrast(): {
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for low contrast text combinations
  const textElements = document.querySelectorAll('*');
  textElements.forEach((element) => {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;

    // This is a simplified check - in production you'd use a proper color contrast library
    if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      // Basic check for white text on light backgrounds
      if (
        color === 'rgb(255, 255, 255)' &&
        (backgroundColor.includes('rgb(255, 255, 255)') ||
          backgroundColor.includes('rgb(248, 250, 252)'))
      ) {
        warnings.push('Potential low contrast: white text on light background');
      }
    }
  });

  return { issues, warnings };
}

/**
 * Generate accessibility report
 */
export async function generateAccessibilityReport(): Promise<string> {
  const audit = await checkWCAGCompliance();
  const keyboard = testKeyboardNavigation();
  const contrast = testColorContrast();

  const report = `
# Accessibility Report - WCAG 2.1 AA

## Compliance Score: ${audit.score}/100
## Passed: ${audit.passed ? '✅' : '❌'}

## Violations (${audit.violations.length})
${audit.violations.map((v) => `- **${v.impact?.toUpperCase()}**: ${v.description}`).join('\n')}

## Incomplete Checks (${audit.incomplete.length})
${audit.incomplete.map((i) => `- ${i.description}`).join('\n')}

## Keyboard Navigation Issues (${keyboard.issues.length})
${keyboard.issues.map((issue) => `- ${issue}`).join('\n')}

## Color Contrast Issues (${contrast.issues.length})
${contrast.issues.map((issue) => `- ${issue}`).join('\n')}

## Color Contrast Warnings (${contrast.warnings.length})
${contrast.warnings.map((warning) => `- ${warning}`).join('\n')}

## Focusable Elements: ${keyboard.focusableElements.length}

---
Generated on: ${new Date().toISOString()}
  `.trim();

  return report;
}

/**
 * Setup automated accessibility testing
 */
export function setupAccessibilityTesting(): void {
  // Add axe-core to window for debugging
  const w = window as unknown as { axe?: typeof axe };
  w.axe = axe;

  // Add keyboard navigation testing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-user');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-user');
  });

  // Mensaje de activación eliminado para cumplimiento estricto
}
