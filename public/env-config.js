// Placeholder pro dev/build local — em produção (Docker), este arquivo é sobrescrito
// no start do container pelo script em docker-entrypoint.d/, com os valores reais de
// LOGHUB_API_URL/LOGHUB_API_KEY do ambiente. Ver loghubApi.ts pro fallback pra
// import.meta.env quando window.__ENV__ não estiver populado (ex: npm run dev).
window.__ENV__ = {
  LOGHUB_API_URL: "",
  LOGHUB_API_KEY: "",
};
