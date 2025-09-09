export async function show(req, res, next) {
  res.render('search', { title: 'Search Page' });
}