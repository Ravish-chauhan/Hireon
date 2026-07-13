"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var ts_morph_1 = require("ts-morph");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var project = new ts_morph_1.Project();
var templatesDir = path.join('e:/hireon/frontend/src/components/resume/templates');
var files = fs.readdirSync(templatesDir).filter(function (f) { return f.startsWith('ResumeTemplate') && f.endsWith('.tsx'); });
for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    var filePath = path.join(templatesDir, file);
    project.addSourceFileAtPath(filePath);
}
var sectionKeys = [
    'summary', 'experience', 'education', 'skills', 'projects',
    'certificates', 'awards', 'languages', 'publications',
    'memberships', 'volunteer', 'customSections'
];
for (var _a = 0, _b = project.getSourceFiles(); _a < _b.length; _a++) {
    var sourceFile = _b[_a];
    var fileChanged = false;
    // 1. Update font sizes and alignments using Tailwind arbitrary properties
    var stringLiterals = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.StringLiteral);
    for (var _c = 0, stringLiterals_1 = stringLiterals; _c < stringLiterals_1.length; _c++) {
        var literal = stringLiterals_1[_c];
        var text = literal.getLiteralValue();
        if (text.includes('text-[')) {
            // Find all text-[XXpx] classes
            var regex = /text-\[(\d+)px\]/g;
            var newText = text.replace(regex, function (match, pxStr) {
                var px = parseInt(pxStr, 10);
                if (px >= 24) {
                    // Name/Main Title
                    return "text-[length:var(--font-size-name)] font-[family-name:var(--font-family-name)] [text-align:var(--align-name)]";
                }
                else if (px >= 16) {
                    // Heading
                    return "text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] [text-align:var(--align-heading)]";
                }
                else {
                    // Body/Subtext
                    var ratio = (px / 12).toFixed(3);
                    // Only add line-height to body if needed, but tailwind text-[length:X] doesn't set line-height by default.
                    return "text-[length:calc(var(--font-size-body)*".concat(ratio, ")] font-[family-name:var(--font-family-body)]");
                }
            });
            if (newText !== text) {
                literal.replaceWithText("\"".concat(newText, "\""));
                fileChanged = true;
            }
        }
    }
    // 2. Add flex-col to root resume-page container so `order` works
    var jsxElements = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.JsxOpeningElement);
    for (var _d = 0, jsxElements_1 = jsxElements; _d < jsxElements_1.length; _d++) {
        var elem = jsxElements_1[_d];
        var classNameAttr = elem.getAttribute('className');
        if (classNameAttr && classNameAttr.getKind() === ts_morph_1.SyntaxKind.JsxAttribute) {
            var init = classNameAttr.getInitializerIfKind(ts_morph_1.SyntaxKind.StringLiteral);
            if (init && init.getLiteralValue().includes('resume-page')) {
                var val = init.getLiteralValue();
                if (!val.includes('flex flex-col')) {
                    init.replaceWithText("\"".concat(val, " flex flex-col\""));
                    fileChanged = true;
                }
            }
        }
    }
    // 3. Section Ordering via flexbox `order`
    var logicalExpressions = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.LogicalExpression);
    for (var _e = 0, logicalExpressions_1 = logicalExpressions; _e < logicalExpressions_1.length; _e++) {
        var expr = logicalExpressions_1[_e];
        var left = expr.getLeft().getText();
        // look for `data.summary` or `data.summary && data.summary.length > 0`
        // We can just check if left includes `data.xxx`
        var matchedSection = null;
        for (var _f = 0, sectionKeys_1 = sectionKeys; _f < sectionKeys_1.length; _f++) {
            var key = sectionKeys_1[_f];
            if (left.includes("data.".concat(key))) {
                matchedSection = key;
                break;
            }
        }
        if (matchedSection) {
            var right = expr.getRight();
            // If right is a JsxElement or JsxFragment
            if (right.getKind() === ts_morph_1.SyntaxKind.JsxElement || right.getKind() === ts_morph_1.SyntaxKind.ParenthesizedExpression) {
                var jsxElem = right.getKind() === ts_morph_1.SyntaxKind.JsxElement ? right : null;
                if (right.getKind() === ts_morph_1.SyntaxKind.ParenthesizedExpression) {
                    var inner = right.getFirstChildByKind(ts_morph_1.SyntaxKind.JsxElement);
                    if (inner)
                        jsxElem = inner;
                }
                if (jsxElem) {
                    var opening = jsxElem.getFirstChildByKind(ts_morph_1.SyntaxKind.JsxOpeningElement);
                    if (opening) {
                        var styleAttr = opening.getAttribute('style');
                        var orderStr = "order: data.sectionOrder?.indexOf('".concat(matchedSection, "') ?? 99");
                        if (!styleAttr) {
                            opening.addAttribute({
                                name: 'style',
                                initializer: "{{ ".concat(orderStr, " }}")
                            });
                            fileChanged = true;
                        }
                        else if (styleAttr.getKind() === ts_morph_1.SyntaxKind.JsxAttribute) {
                            var init = styleAttr.getInitializerIfKind(ts_morph_1.SyntaxKind.JsxExpression);
                            if (init) {
                                var expr_1 = init.getExpressionIfKind(ts_morph_1.SyntaxKind.ObjectLiteralExpression);
                                if (expr_1 && !expr_1.getProperty('order')) {
                                    expr_1.addPropertyAssignment({
                                        name: 'order',
                                        initializer: "data.sectionOrder?.indexOf('".concat(matchedSection, "') ?? 99")
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
        console.log("Updated ".concat(sourceFile.getBaseName()));
    }
}
