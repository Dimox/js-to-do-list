import gulp from 'gulp';
import file from 'gulp-file';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';

import { PATHS } from '../config';

export function cleanSvg() {
  return file('sprite.svg', '', { src: true }).pipe(gulp.dest(PATHS.build.svg));
}

export default function svg() {
  return gulp
    .src(PATHS.src.svg)
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(
      svgmin({
        full: true,
        plugins: [
          'removeDoctype',
          'removeXMLProcInst',
          'removeComments',
          'removeMetadata',
          'removeXMLNS',
          'removeEditorsNSData',
          'cleanupAttrs',
          'mergeStyles',
          'inlineStyles',
          'minifyStyles',
          'convertStyleToAttrs',
          'cleanupIDs',
          'removeRasterImages',
          'removeUselessDefs',
          'cleanupNumericValues',
          'convertColors',
          'removeUnknownsAndDefaults',
          'removeNonInheritableGroupAttrs',
          'removeUselessStrokeAndFill',
          'cleanupEnableBackground',
          'removeHiddenElems',
          'removeEmptyText',
          'convertShapeToPath',
          'moveElemsAttrsToGroup',
          'moveGroupAttrsToElems',
          'collapseGroups',
          'convertPathData',
          'convertEllipseToCircle',
          'convertTransform',
          'removeEmptyAttrs',
          'removeEmptyContainers',
          'mergePaths',
          'removeUnusedNS',
          'reusePaths',
          'sortAttrs',
          'sortDefsChildren',
          'removeTitle',
          'removeDesc',
          'removeStyleElement',
          'removeScriptElement',
        ],
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(PATHS.build.svg));
}
