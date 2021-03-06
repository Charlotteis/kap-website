import {src, dest, watch, parallel, series} from 'gulp';
import del from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import minify from 'cssnano';
import simpleVars from 'postcss-simple-vars';
import rename from 'gulp-rename';
import svgo from 'gulp-svgo';
import imagemin from 'gulp-imagemin';

// Sources
const SRC_DIR = 'src';
const BUILD_DIR = 'build';
const CSS_GLOB = `${SRC_DIR}/**/*.css`;
const IMG_GLOB = `${SRC_DIR}/images/**/*`;

// Clean task
export const clean = () => del([BUILD_DIR]);

// CSS
const processors = [
  atImport,
  simpleVars,
  autoprefixer({browsers: ['last 2 versions']})
];
export const styles = () => src(CSS_GLOB)
  .pipe(postcss(processors))
  .pipe(postcss([minify]))
  .pipe(rename({suffix: '.min'}))
  .pipe(dest(BUILD_DIR));

// Images
export const images = () => src(IMG_GLOB, {base: SRC_DIR})
  .pipe(svgo())
  .pipe(imagemin())
  .pipe(dest(BUILD_DIR));

// Pipe other files
export const misc = () => src([`${SRC_DIR}/**/*`, `!${CSS_GLOB}`, `!${IMG_GLOB}`])
  .pipe(dest(BUILD_DIR));

export const watchSrc = () => {
  watch(CSS_GLOB, styles);
  watch(IMG_GLOB, images);
};

export const build = series(clean, parallel(styles, images, misc));
export const dev = series(clean, parallel(styles, images, misc), watchSrc);

export default build;
