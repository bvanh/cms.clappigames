function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const importImage = importAll(
  require.context("../static/img", false, /\.(png|jpe?g|svg)$/)
);
export { importImage };
