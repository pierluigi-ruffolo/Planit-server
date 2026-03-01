export default function notFound(req, res, next) {
  return res.status(404).json({
    message: "La risorsa richiesta non è stata trovata sul server",
    error: "RESOURCE_NOT_FOUND",
  });
}
