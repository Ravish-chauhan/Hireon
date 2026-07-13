import { Project, SyntaxKind, JsxAttribute, JsxExpression, ObjectLiteralExpression } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

const project = new Project();
const templatesDir = path.join('e:/hireon/frontend/src/components/resume/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.startsWith('ResumeTemplate') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  project.addSourceFileAtPath(filePath);
}

const sectionKeys = [
  'summary', 'experience', 'education', 'skills', 'projects', 
  'certificates', 'awards', 'languages', 'publications', 
  'memberships', 'volunteer', 'customSections'
];

for (const sourceFile of project.getSourceFiles()) {
  let fileChanged = false;

  // 1. Update font sizes and alignments using Tailwind arbitrary properties
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  for (const literal of stringLiterals) {
    let text = literal.getLiteralValue();
    if (text.includes('text-[')) {
      // Find all text-[XXpx] classes
      const regex = /text-\[(\d+)px\]/g;
      let newText = text.replace(regex, (match, pxStr) => {
        const px = parseInt(pxStr, 10);
        if (px >= 24) {
          // Name/Main Title
          return `text-[length:var(--font-size-name)] font-[family-name:var(--font-family-name)] [text-align:var(--align-name)]`;
        } else if (px >= 16) {
          // Heading
          return `text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)]`;
        } else {
          // Body/Subtext
          const ratio = (px / 12).toFixed(3);
          // Only add line-height to body if needed, but tailwind text-[length:X] doesn't set line-height by default.
          return `text-[length:calc(var(--font-size-body)*${ratio})] font-[family-name:var(--font-family-body)]`;
        }
      });
      
      if (newText !== text) {
        literal.replaceWithText(`"${newText}"`);
        fileChanged = true;
      }
    }
  }

  // 2. Add flex-col to root resume-page container so `order` works
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
  for (const elem of jsxElements) {
    const classNameAttr = elem.getAttribute('className');
    if (classNameAttr && classNameAttr.getKind() === SyntaxKind.JsxAttribute) {
      const init = (classNameAttr as JsxAttribute).getInitializerIfKind(SyntaxKind.StringLiteral);
      if (init && init.getLiteralValue().includes('resume-page')) {
        let val = init.getLiteralValue();
        if (!val.includes('flex flex-col')) {
          init.replaceWithText(`"${val} flex flex-col"`);
          fileChanged = true;
        }
      }
    }
  }

  // 3. Section Ordering via flexbox `order`
  const logicalExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.LogicalExpression);
  for (const expr of logicalExpressions) {
    const left = expr.getLeft().getText();
    // look for `data.summary` or `data.summary && data.summary.length > 0`
    // We can just check if left includes `data.xxx`
    let matchedSection = null;
    for (const key of sectionKeys) {
      if (left.includes(`data.${key}`)) {
        matchedSection = key;
        break;
      }
    }

    if (matchedSection) {
      const right = expr.getRight();
      // If right is a JsxElement or JsxFragment
      if (right.getKind() === SyntaxKind.JsxElement || right.getKind() === SyntaxKind.ParenthesizedExpression) {
        let jsxElem = right.getKind() === SyntaxKind.JsxElement ? right : null;
        if (right.getKind() === SyntaxKind.ParenthesizedExpression) {
          const inner = right.getFirstChildByKind(SyntaxKind.JsxElement);
          if (inner) jsxElem = inner;
        }

        if (jsxElem) {
          const opening = jsxElem.getFirstChildByKind(SyntaxKind.JsxOpeningElement);
          if (opening) {
            const styleAttr = opening.getAttribute('style');
            const orderStr = `order: data.sectionOrder?.indexOf('${matchedSection}') ?? 99`;
            
            if (!styleAttr) {
              opening.addAttribute({
                name: 'style',
                initializer: `{{ ${orderStr} }}`
              });
              fileChanged = true;
            } else if (styleAttr.getKind() === SyntaxKind.JsxAttribute) {
              const init = (styleAttr as JsxAttribute).getInitializerIfKind(SyntaxKind.JsxExpression);
              if (init) {
                const expr = init.getExpressionIfKind(SyntaxKind.ObjectLiteralExpression);
                if (expr && !expr.getProperty('order')) {
                  expr.addPropertyAssignment({
                    name: 'order',
                    initializer: `data.sectionOrder?.indexOf('${matchedSection}') ?? 99`
                  });
                  fileChanged = true;
                }
              }
            }
          }
        }
      }
    }
  }

  if (fileChanged) {
    sourceFile.saveSync();
    console.log(`Updated ${sourceFile.getBaseName()}`);
  }
}
