export async function show(req, res, next) {
  res.render('alertDashboard', { title: 'Alert Dashboard' });
}