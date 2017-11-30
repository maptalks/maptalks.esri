const gulp = require('gulp'),
    pkg = require('./package.json'),
    BundleHelper = require('maptalks-build-helpers').BundleHelper,
    TestHelper = require('maptalks-build-helpers').TestHelper;
const bundleHelper = new BundleHelper(pkg);
const testHelper = new TestHelper();
const karmaConfig = require('./karma.config');

gulp.task('build', () => {
    const rollupConfig = bundleHelper.getDefaultRollupConfig();
    rollupConfig['external'] = ['maptalks'];
    return bundleHelper.bundle('./src/init.js', rollupConfig);
});

gulp.task('minify', ['build'], () => {
    bundleHelper.minify();
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['./src/**/*', './gulpfile.js'], ['build']);
});

gulp.task('test', ['build'], () => {
    testHelper.test(karmaConfig);
});

gulp.task('tdd', ['build'], () => {
    karmaConfig.singleRun = false;
    gulp.watch(['./src/init.js'], ['test']);
    testHelper.test(karmaConfig);
});

gulp.task('default', ['watch']);
