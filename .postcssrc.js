// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
    	browsers: ["> 1%","last 7 versions","not ie <= 8","ios >= 6","android >= 4.0"]
    }
  }
}
