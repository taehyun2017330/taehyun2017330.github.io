export const GOATCOUNTER_CODE = "";

export function getGoatCounterBaseUrl() {
  return GOATCOUNTER_CODE ? `https://${GOATCOUNTER_CODE}.goatcounter.com` : "";
}

export function getGoatCounterCountUrl() {
  const baseUrl = getGoatCounterBaseUrl();
  return baseUrl ? `${baseUrl}/count` : "";
}

export function getGoatCounterTotalUrl() {
  const baseUrl = getGoatCounterBaseUrl();
  return baseUrl ? `${baseUrl}/counter/TOTAL.json` : "";
}
