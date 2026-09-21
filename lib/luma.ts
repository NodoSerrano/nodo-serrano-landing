// Luma's public calendar endpoint (the one their embed uses; undocumented, so
// every failure resolves to null -> Events falls back to the iframe).
const LUMA_API =
  "https://api.lu.ma/calendar/get-items?calendar_api_id=cal-7uziZDmq9SFGggQ";

export const LUMA_CALENDAR_URL = "https://luma.com/nodoserrano";

export interface LumaEvent {
  name: string;
  url: string;
  startAt: string;
  city: string | null;
}

export interface LumaStatus {
  hasUpcoming: boolean;
  lastEvent: LumaEvent | null;
}

async function getEntries(period: "future" | "past") {
  // pagination_limit=1 returns 0 past entries (Luma quirk) — 3 is the smallest that works.
  const response = await fetch(
    `${LUMA_API}&period=${period}&pagination_limit=3`,
    {
      next: { revalidate: 600 },
    }
  );
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);
  const data = await response.json();
  if (!Array.isArray(data.entries))
    throw new Error("unexpected response shape");
  return data.entries;
}

export async function getLumaStatus(): Promise<LumaStatus | null> {
  try {
    if ((await getEntries("future")).length > 0)
      return { hasUpcoming: true, lastEvent: null };

    const event = (await getEntries("past"))[0]?.event;
    return {
      hasUpcoming: false,
      lastEvent: event
        ? {
            name: event.name,
            url: `https://luma.com/${event.url}`,
            startAt: event.start_at,
            city: event.geo_address_info?.city ?? null,
          }
        : null,
    };
  } catch (error) {
    console.error("[luma] getLumaStatus: request failed", error);
    return null;
  }
}
