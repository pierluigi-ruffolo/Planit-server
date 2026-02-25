export default function notFound(req, res, next) {
  return res.status(404).json({
    error: "NOT FOUND",
    message: "Pagina non trovata",
  });
}
