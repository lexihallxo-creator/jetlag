(function () {
  const plannerRoot = document.getElementById("globe-map");
  if (!plannerRoot) return;

  const oaAirportRaw = `
new york|john f kennedy international|jfk|america/new_york|-5|40.6413|-73.7781|north america
newark|newark liberty international|ewr|america/new_york|-5|40.6895|-74.1745|north america
boston|logan international|bos|america/new_york|-5|42.3656|-71.0096|north america
washington|dulles international|iad|america/new_york|-5|38.9531|-77.4565|north america
washington|reagan national|dca|america/new_york|-5|38.8512|-77.0402|north america
atlanta|hartsfield jackson|atl|america/new_york|-5|33.6407|-84.4277|north america
miami|miami international|mia|america/new_york|-5|25.7959|-80.2870|north america
orlando|orlando international|mco|america/new_york|-5|28.4312|-81.3081|north america
charlotte|charlotte douglas|clt|america/new_york|-5|35.2144|-80.9473|north america
detroit|detroit metro|dtw|america/new_york|-5|42.2162|-83.3554|north america
philadelphia|philadelphia international|phl|america/new_york|-5|39.8744|-75.2424|north america
chicago|ohare international|ord|america/chicago|-6|41.9742|-87.9073|north america
dallas|dfw international|dfw|america/chicago|-6|32.8998|-97.0403|north america
houston|george bush intercontinental|iah|america/chicago|-6|29.9902|-95.3368|north america
minneapolis|minneapolis saint paul|msp|america/chicago|-6|44.8848|-93.2223|north america
denver|denver international|den|america/denver|-7|39.8561|-104.6737|north america
phoenix|phoenix sky harbor|phx|america/phoenix|-7|33.4342|-112.0116|north america
salt lake city|salt lake city international|slc|america/denver|-7|40.7899|-111.9791|north america
las vegas|harry reid international|las|america/los_angeles|-8|36.0840|-115.1537|north america
san diego|san diego international|san|america/los_angeles|-8|32.7338|-117.1933|north america
los angeles|los angeles international|lax|america/los_angeles|-8|33.9416|-118.4085|north america
san francisco|san francisco international|sfo|america/los_angeles|-8|37.6213|-122.3790|north america
seattle|seattle tacoma|sea|america/los_angeles|-8|47.4502|-122.3088|north america
portland|portland international|pdx|america/los_angeles|-8|45.5898|-122.5951|north america
honolulu|daniel k inouye international|hnl|pacific/honolulu|-10|21.3187|-157.9225|north america
anchorage|ted stevens anchorage international|anc|america/anchorage|-9|61.1744|-149.9964|north america
toronto|pearson international|yyz|america/toronto|-5|43.6777|-79.6248|north america
montreal|trudeau international|yul|america/toronto|-5|45.4706|-73.7408|north america
ottawa|macdonald cartier|yow|america/toronto|-5|45.3225|-75.6692|north america
calgary|calgary international|yyc|america/edmonton|-7|51.1139|-114.0203|north america
vancouver|vancouver international|yvr|america/vancouver|-8|49.1967|-123.1815|north america
mexico city|benito juarez international|mex|america/mexico_city|-6|19.4361|-99.0719|latin america
san jose|juan santamaria international|sjo|america/costa_rica|-6|9.9939|-84.2088|latin america
panama city|tocumen international|pty|america/panama|-5|9.0714|-79.3835|latin america
bogota|el dorado international|bog|america/bogota|-5|4.7016|-74.1469|latin america
lima|jorge chavez international|lim|america/lima|-5|-12.0219|-77.1143|latin america
rio de janeiro|galeao international|gig|america/sao_paulo|-3|-22.8090|-43.2506|latin america
sao paulo|guarulhos international|gru|america/sao_paulo|-3|-23.4356|-46.4731|latin america
buenos aires|ezeiza international|eze|america/argentina/buenos_aires|-3|-34.8222|-58.5358|latin america
santiago|arturo merino benitez|scl|america/santiago|-4|-33.3930|-70.7858|latin america
reykjavik|keflavik international|kef|atlantic/reykjavik|0|63.9850|-22.6056|europe
dublin|dublin airport|dub|europe/dublin|0|53.4213|-6.2701|europe
lisbon|humberto delgado|lis|europe/lisbon|0|38.7742|-9.1342|europe
london|heathrow|lhr|europe/london|0|51.4700|-0.4543|europe
london|gatwick|lgw|europe/london|0|51.1537|-0.1821|europe
edinburgh|edinburgh airport|edi|europe/london|0|55.9500|-3.3725|europe
manchester|manchester airport|man|europe/london|0|53.3650|-2.2728|europe
paris|charles de gaulle|cdg|europe/paris|1|49.0097|2.5479|europe
paris|orly|ory|europe/paris|1|48.7262|2.3652|europe
amsterdam|schiphol|ams|europe/amsterdam|1|52.3105|4.7683|europe
brussels|brussels airport|bru|europe/brussels|1|50.9010|4.4844|europe
frankfurt|frankfurt airport|fra|europe/berlin|1|50.0379|8.5622|europe
munich|munich airport|muc|europe/berlin|1|48.3538|11.7861|europe
zurich|zurich airport|zrh|europe/zurich|1|47.4581|8.5555|europe
geneva|geneva airport|gva|europe/zurich|1|46.2381|6.1089|europe
madrid|adolfo suarez madrid barajas|mad|europe/madrid|1|40.4983|-3.5676|europe
barcelona|el prat|bcn|europe/madrid|1|41.2974|2.0833|europe
rome|fiumicino|fco|europe/rome|1|41.8003|12.2389|europe
milan|malpensa|mxp|europe/rome|1|45.6301|8.7281|europe
vienna|vienna international|vie|europe/vienna|1|48.1103|16.5697|europe
prague|vaclav havel|prg|europe/prague|1|50.1008|14.2600|europe
budapest|ferenc liszt|bud|europe/budapest|1|47.4399|19.2611|europe
warsaw|chopin|waw|europe/warsaw|1|52.1657|20.9671|europe
copenhagen|copenhagen airport|cph|europe/copenhagen|1|55.6181|12.6560|europe
stockholm|arlanda|arn|europe/stockholm|1|59.6498|17.9238|europe
oslo|gardermoen|osl|europe/oslo|1|60.1976|11.1004|europe
helsinki|helsinki vantaa|hel|europe/helsinki|2|60.3172|24.9633|europe
athens|athens international|ath|europe/athens|2|37.9364|23.9445|europe
istanbul|istanbul airport|ist|europe/istanbul|3|41.2753|28.7519|europe
bucharest|henri coanda|otp|europe/bucharest|2|44.5711|26.0850|europe
tel aviv|ben gurion|tlv|asia/jerusalem|2|32.0005|34.8708|middle east
amman|queen alia|amm|asia/amman|2|31.7226|35.9932|middle east
cairo|cairo international|cai|africa/cairo|2|30.1219|31.4056|africa
casablanca|mohammed v|cmn|africa/casablanca|1|33.3675|-7.5899|africa
lagos|murtala muhammed|los|africa/lagos|1|6.5774|3.3212|africa
addis ababa|bole international|add|africa/addis_ababa|3|8.9779|38.7993|africa
nairobi|jomo kenyatta|nbo|africa/nairobi|3|-1.3192|36.9278|africa
johannesburg|or tambo|jnb|africa/johannesburg|2|-26.1337|28.2420|africa
cape town|cape town international|cpt|africa/johannesburg|2|-33.9700|18.5972|africa
zanzibar|abeid amani karume|znz|africa/nairobi|3|-6.2220|39.2249|africa
mauritius|sir seewoosagur ramgoolam|mru|indian/mauritius|4|-20.4302|57.6836|africa
dubai|dubai international|dxb|asia/dubai|4|25.2532|55.3657|middle east
abu dhabi|zayed international|auh|asia/dubai|4|24.4330|54.6511|middle east
doha|hamad international|doh|asia/qatar|3|25.2731|51.6080|middle east
riyadh|king khalid international|ruh|asia/riyadh|3|24.9576|46.6988|middle east
jeddah|king abdulaziz international|jed|asia/riyadh|3|21.6796|39.1565|middle east
mumbai|chhatrapati shivaji maharaj|bom|asia/kolkata|5.5|19.0896|72.8656|asia
delhi|indira gandhi international|del|asia/kolkata|5.5|28.5562|77.1000|asia
bangalore|kempegowda international|blr|asia/kolkata|5.5|13.1986|77.7066|asia
hyderabad|rajiv gandhi international|hyd|asia/kolkata|5.5|17.2403|78.4294|asia
chennai|chennai international|maa|asia/kolkata|5.5|12.9941|80.1709|asia
singapore|changi|sin|asia/singapore|8|1.3644|103.9915|asia
bangkok|suvarnabhumi|bkk|asia/bangkok|7|13.6900|100.7501|asia
phuket|phuket international|hkt|asia/bangkok|7|8.1132|98.3169|asia
kuala lumpur|kuala lumpur international|kul|asia/kuala_lumpur|8|2.7456|101.7090|asia
jakarta|soekarno hatta|cgk|asia/jakarta|7|-6.1256|106.6559|asia
denpasar|ngurah rai|dps|asia/makassar|8|-8.7482|115.1670|asia
manila|ninoy aquino international|mnl|asia/manila|8|14.5086|121.0198|asia
ho chi minh city|tan son nhat|sgn|asia/ho_chi_minh|7|10.8188|106.6519|asia
hanoi|noi bai|han|asia/bangkok|7|21.2212|105.8072|asia
hong kong|hong kong international|hkg|asia/hong_kong|8|22.3080|113.9185|asia
taipei|taoyuan international|tpe|asia/taipei|8|25.0797|121.2342|asia
seoul|incheon|icn|asia/seoul|9|37.4602|126.4407|asia
seoul|gimpo international|gmp|asia/seoul|9|37.5583|126.7906|asia
tokyo|haneda|hnd|asia/tokyo|9|35.5494|139.7798|asia
tokyo|narita|nrt|asia/tokyo|9|35.7720|140.3929|asia
osaka|kansai international|kix|asia/tokyo|9|34.4347|135.2440|asia
nagoya|chubu centrair|ngo|asia/tokyo|9|34.8584|136.8054|asia
fukuoka|fukuoka airport|fuk|asia/tokyo|9|33.5859|130.4507|asia
beijing|beijing capital|pek|asia/shanghai|8|40.0801|116.5846|asia
beijing|daxing international|pkx|asia/shanghai|8|39.5098|116.4105|asia
shanghai|pudong|pvg|asia/shanghai|8|31.1443|121.8083|asia
shanghai|hongqiao|sha|asia/shanghai|8|31.1979|121.3363|asia
guangzhou|baiyun international|can|asia/shanghai|8|23.3924|113.2988|asia
shenzhen|baoan international|szx|asia/shanghai|8|22.6393|113.8107|asia
chengdu|tianfu international|tfu|asia/shanghai|8|30.3190|104.4458|asia
sydney|sydney kingsford smith|syd|australia/sydney|10|-33.9399|151.1753|oceania
melbourne|melbourne airport|mel|australia/melbourne|10|-37.6690|144.8410|oceania
brisbane|brisbane airport|bne|australia/brisbane|10|-27.3842|153.1175|oceania
perth|perth airport|per|australia/perth|8|-31.9403|115.9672|oceania
adelaide|adelaide airport|adl|australia/adelaide|9.5|-34.9450|138.5306|oceania
auckland|auckland airport|akl|pacific/auckland|12|-37.0082|174.7850|oceania
christchurch|christchurch international|chc|pacific/auckland|12|-43.4894|172.5322|oceania
fiji|nadi international|nan|pacific/fiji|12|-17.7554|177.4434|oceania
maldives|velana international|mle|indian/maldives|5|-4.1918|73.5291|asia
saint martin|princess juliana|sxm|america/puerto_rico|-4|18.0410|-63.1089|latin america
`.trim();

  const oaAirports = oaAirportRaw.split("\n").map((line) => {
    const [city, airport, code, timezone, offset, lat, lon, region] = line.split("|");
    return { city, airport, code, timezone, offset: Number(offset), lat: Number(lat), lon: Number(lon), region };
  });

  const oaByCode = new Map(oaAirports.map((airport) => [airport.code, airport]));
  const oaHubCodes = ["jfk", "lhr", "cdg", "fra", "dxb", "sin", "hnd", "lax", "gru", "syd", "jnb", "del", "hkg", "ord", "scl", "yyz"];
  const oaMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  const els = {
    datalist: document.getElementById("airport-options"),
    departure: document.getElementById("departure-airport"),
    arrival: document.getElementById("arrival-airport"),
    nextLeg: document.getElementById("return-airport"),
    nextLegWrap: document.getElementById("return-airport-wrap"),
    tripShape: document.getElementById("trip-shape"),
    goal: document.getElementById("arrival-goal"),
    eventWindow: document.getElementById("event-window"),
    travelMonth: document.getElementById("travel-month"),
    planStyle: document.getElementById("plan-style"),
    preview: document.getElementById("preview-route"),
    generate: document.getElementById("generate-protocol"),
    reset: document.getElementById("reset-route"),
    routeSummary: document.getElementById("route-summary"),
    routeTimezones: document.getElementById("route-timezones"),
    routeWeatherTitle: document.getElementById("route-weather-title"),
    routeWeather: document.getElementById("route-weather"),
    protocolPreview: document.getElementById("protocol-preview"),
    protocolSections: document.getElementById("protocol-sections"),
    routePrimary: document.getElementById("globe-route-primary"),
    routeSecondary: document.getElementById("globe-route-secondary"),
    globeMap: document.getElementById("globe-map"),
    globeFocus: document.getElementById("globe-focus"),
    airportCount: document.getElementById("airport-count"),
    driftHours: document.getElementById("drift-hours"),
    criticalWindow: document.getElementById("critical-window"),
    routeIntensity: document.getElementById("route-intensity"),
    leadName: document.getElementById("lead-name"),
    leadEmail: document.getElementById("lead-email"),
    leadCompany: document.getElementById("lead-company"),
    leadFrequency: document.getElementById("lead-frequency"),
    leadNotes: document.getElementById("lead-notes"),
    saveLead: document.getElementById("save-lead"),
    downloadBrief: document.getElementById("download-brief"),
    leadStatus: document.getElementById("lead-status"),
    protocolMailto: document.getElementById("protocol-mailto")
  };

  const oaLabel = (airport) => `${airport.city} - ${airport.airport} - ${airport.code} - ${airport.timezone}`;
  const oaShort = (airport) => `${airport.city} (${airport.code})`;
  const oaNorm = (value) => value.trim().toLowerCase();
  const oaDescribeShift = (hours) => hours === 0 ? "same timezone" : `${Math.abs(hours)} hour${Math.abs(hours) === 1 ? "" : "s"} ${hours > 0 ? "ahead" : "behind"}`;
  const oaCriticalLabel = (value) => ({
    "same-day": "arrival day",
    "next-morning": "next morning",
    "next-afternoon": "next afternoon",
    "next-evening": "next evening"
  }[value]);

  let oaFocusField = "departure";
  let oaLastBrief = "";

  els.datalist.innerHTML = oaAirports
    .slice()
    .sort((a, b) => oaLabel(a).localeCompare(oaLabel(b)))
    .map((airport) => `<option value="${oaLabel(airport)}"></option>`)
    .join("");
  els.airportCount.textContent = String(oaAirports.length);

  const oaFindAirport = (value) => {
    const needle = oaNorm(value);
    if (!needle) return null;
    return oaAirports.find((airport) => {
      const label = oaNorm(oaLabel(airport));
      return label === needle
        || airport.code === needle
        || oaNorm(airport.city) === needle
        || oaNorm(`${airport.city} ${airport.airport}`).includes(needle);
    }) || null;
  };

  const oaStatus = (title, message) => {
    els.leadStatus.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  };

  const oaProject = (airport) => ({
    x: 50 + (airport.lon / 180) * 34 * Math.cos((airport.lat * Math.PI) / 180),
    y: 50 - (airport.lat / 90) * 30
  });

  const oaPath = (from, to) => {
    if (!from || !to) return "";
    const start = oaProject(from);
    const end = oaProject(to);
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - Math.max(10, 22 - Math.min(16, Math.abs(to.lon - from.lon) / 12));
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const oaSeasonal = (airport, month) => {
    const tropicalCodes = ["sin", "kul", "cgk", "dps", "mnl", "hkg", "bkk", "hkt", "dxb", "auh", "doh", "mle", "nbo", "los"];
    const southernCodes = ["syd", "mel", "bne", "per", "adl", "akl", "chc", "gru", "gig", "eze", "scl", "jnb", "cpt"];
    if (tropicalCodes.includes(airport.code)) {
      return "typically warm or humid. hydration, lighter meals, and cooling breaks matter more than temperature swings.";
    }
    const isSouthern = southernCodes.includes(airport.code);
    const summer = isSouthern ? [11, 0, 1] : [5, 6, 7];
    const shoulder = isSouthern ? [2, 3, 8, 9] : [3, 4, 8, 9];
    if (summer.includes(month)) return "typically warmer with longer light windows. protect evening wind-down if you land late.";
    if (shoulder.includes(month)) return "typically mild to variable. keep layers and light timing flexible.";
    return "typically cooler or darker. morning light and a cleaner first night matter more.";
  };

  const oaIntensity = (shift, tripShape, style) => {
    const absolute = Math.abs(shift);
    if (tripShape === "multi-city" || absolute >= 8 || style === "aggressive") return "high adaptation";
    if (tripShape === "round-trip" || absolute >= 4) return "structured reset";
    return "light reset";
  };

  const oaSyncTripShape = () => {
    const visible = els.tripShape.value !== "one-way";
    els.nextLegWrap.classList.toggle("hidden", !visible);
    els.nextLegWrap.querySelector("span").textContent = els.tripShape.value === "round-trip" ? "return airport" : "next-leg airport";
  };

  const oaRenderGlobe = (departure, arrival, nextLeg) => {
    const codes = new Set(oaHubCodes);
    [departure, arrival, nextLeg].filter(Boolean).forEach((airport) => codes.add(airport.code));
    els.globeMap.innerHTML = [...codes].map((code) => oaByCode.get(code)).filter(Boolean).map((airport) => {
      const point = oaProject(airport);
      const active = [departure?.code, arrival?.code, nextLeg?.code].includes(airport.code);
      return `<button class="globe-marker ${active ? "active" : "secondary"}" type="button" data-code="${airport.code}" title="${airport.city} ${airport.code}" style="left:${point.x}%; top:${point.y}%"></button>`;
    }).join("");
    els.globeMap.querySelectorAll("[data-code]").forEach((button) => {
      button.addEventListener("click", () => {
        const airport = oaByCode.get(button.dataset.code);
        if (!airport) return;
        const target = oaFocusField === "arrival" ? els.arrival : oaFocusField === "return" ? els.nextLeg : els.departure;
        target.value = oaLabel(airport);
        oaRender(false);
      });
    });
    els.routePrimary.setAttribute("d", oaPath(departure, arrival));
    els.routeSecondary.setAttribute("d", (els.tripShape.value !== "one-way" && arrival && nextLeg) ? oaPath(arrival, nextLeg) : "");
    els.globeFocus.innerHTML = !departure || !arrival
      ? `<strong>globe interaction</strong><span>selected airports will light up here. click a marker to fill the current planner field.</span>`
      : `<strong>${oaShort(departure)} to ${oaShort(arrival)}</strong><span>current click target: ${oaFocusField === "departure" ? "departure airport" : oaFocusField === "arrival" ? "arrival airport" : "return or next-leg airport"}.</span>`;
  };

  const oaPreviewSteps = (ctx) => {
    const shift = ctx.arrival.offset - ctx.departure.offset;
    return [
      `plan around ${oaDescribeShift(shift)} with a ${ctx.planStyle} protocol and a ${ctx.goal.replace("-", " ")} priority.`,
      Math.abs(shift) >= 5 ? "start shifting light, meals, and bedtime before wheels up." : "keep the protocol compact and anchor the arrival day with light, meals, and movement.",
      shift > 0 ? "treat destination bedtime as the main boundary and avoid long naps." : shift < 0 ? "delay extra sleep pressure until local evening." : "stay steady and avoid overcorrecting when the shift is small.",
      ctx.tripShape === "multi-city" ? "stabilize the first stop, then use a lighter second-leg reset." : ctx.tripShape === "round-trip" ? "preserve enough margin for the return leg." : "focus everything on the first arrival window."
    ];
  };

  const oaSections = (ctx) => {
    const shift = ctx.arrival.offset - ctx.departure.offset;
    const eastbound = shift > 0;
    const blocks = [
      {
        title: "pre-flight setup",
        text: `align ${oaShort(ctx.departure)} to ${oaShort(ctx.arrival)} before the cabin takes over.`,
        bullets: [
          Math.abs(shift) >= 5 ? "start adjusting your bedtime and first meal before departure if you have at least one day of lead time." : "protect sleep the night before and do not create extra debt before departure.",
          eastbound ? "pull evening light earlier and dim late-night light exposure." : "protect a later evening and avoid going to bed too early.",
          "choose your first arrival meal and movement plan before you board."
        ]
      },
      {
        title: "in-flight behavior",
        text: "use the flight to reduce the cost of the landing window, not to chase a perfect sleep score.",
        bullets: [
          eastbound ? "shift toward destination night quickly and minimize bright cabin light during the sleep window." : "stay lightly alert until the destination sleep window opens.",
          "eat lighter than usual and avoid stacking alcohol, sugar, and heavy sodium together.",
          "use caffeine as a timing tool, not a comfort habit."
        ]
      },
      {
        title: "first 6 hours on arrival",
        text: `your critical window is ${oaCriticalLabel(ctx.eventWindow)}.`,
        bullets: [
          "get outside light as early as the route allows, even for a short walk.",
          ctx.goal === "happy-hour" ? "keep lunch and late afternoon intake light so the evening stays alive." : "use the first meal to reinforce local time instead of chasing comfort.",
          oaSeasonal(ctx.arrival, ctx.month)
        ]
      },
      {
        title: "first night",
        text: "the first night is where recovery compounds or gets pushed backward.",
        bullets: [
          eastbound ? "do not push bedtime too late because the rebound will cost the next morning." : "cap stimulation so you can still anchor local sleep.",
          "reduce screens and decisions in the last hour before bed.",
          ctx.planStyle === "aggressive" ? "hold the bedtime line even if you feel sleepy early." : "choose the cleanest realistic bedtime and protect it."
        ]
      },
      {
        title: "next day stabilization",
        text: "day two is where arrival performance becomes visible.",
        bullets: [
          ctx.goal === "meeting" ? "stack morning light, early hydration, and a lighter lunch to stabilize afternoon cognition." : "anchor the first major work or social block with light, movement, and consistent meal timing.",
          Math.abs(shift) >= 8 ? "expect a second-wave dip and answer it with movement, not a long nap." : "move enough to stay awake without chasing a punishing workout.",
          "review how the first day felt and adjust the second half of the trip instead of repeating friction."
        ]
      }
    ];

    if (ctx.tripShape === "round-trip" && ctx.nextLeg) {
      blocks.push({
        title: "return strategy",
        text: `protect the trip home to ${oaShort(ctx.nextLeg)} so the hidden recovery cost does not show up after the trip.`,
        bullets: [
          "preserve a little sleep pressure for the flight home instead of fully overcorrecting at the destination.",
          "keep the final evening cleaner than your first instinct wants.",
          "make the return arrival day lighter and earlier."
        ]
      });
    }

    if (ctx.tripShape === "multi-city" && ctx.nextLeg) {
      blocks.push({
        title: "multi-city handoff",
        text: `your second leg into ${oaShort(ctx.nextLeg)} should inherit the first stop rather than start from zero.`,
        bullets: [
          "reuse the strongest anchors from the first arrival: morning light, meal timing, and the sleep boundary.",
          "drop anything that creates friction before the second flight.",
          "optimize for consistency, not perfect recovery at every stop."
        ]
      });
    }

    return blocks;
  };

  const oaBrief = (ctx, sections) => {
    const route = ctx.nextLeg ? `${oaShort(ctx.departure)} -> ${oaShort(ctx.arrival)} -> ${oaShort(ctx.nextLeg)}` : `${oaShort(ctx.departure)} -> ${oaShort(ctx.arrival)}`;
    return [
      "on arrival protocol brief",
      "",
      `traveler: ${els.leadName.value.trim() || "traveler"}`,
      `email: ${els.leadEmail.value.trim() || "not provided"}`,
      `company: ${els.leadCompany.value.trim() || "not provided"}`,
      `travel cadence: ${els.leadFrequency.value}`,
      `trip shape: ${ctx.tripShape}`,
      `route: ${route}`,
      `goal: ${els.goal.options[els.goal.selectedIndex].text}`,
      `event timing: ${els.eventWindow.options[els.eventWindow.selectedIndex].text}`,
      `travel month: ${oaMonths[ctx.month]}`,
      `plan style: ${ctx.planStyle}`,
      `notes: ${els.leadNotes.value.trim() || "none"}`,
      "",
      ...sections.flatMap((section) => [section.title, section.text, ...section.bullets.map((bullet) => `- ${bullet}`), ""])
    ].join("\n");
  };

  const oaInvalid = () => {
    els.routeSummary.textContent = "choose matching airports from the worldwide directory";
    els.routeTimezones.textContent = "pick both airports from the search list or use the globe markers to preview the timezone shift.";
    els.routeWeatherTitle.textContent = "seasonal arrival weather";
    els.routeWeather.textContent = "choose a route and travel month to see a rough seasonal weather expectation.";
    els.protocolPreview.innerHTML = "<li>choose a valid departure airport</li><li>choose a valid arrival airport</li><li>preview the route first, then generate the fuller protocol</li>";
    els.protocolSections.innerHTML = '<div class="protocol-section"><strong>waiting for route details</strong><p>generate the full protocol after choosing a route to see pre-flight, in-flight, arrival, first-night, next-day, and return guidance.</p></div>';
    els.driftHours.textContent = "0 hours";
    els.criticalWindow.textContent = "arrival day";
    els.routeIntensity.textContent = "light reset";
  };

  const oaRender = (full) => {
    const departure = oaFindAirport(els.departure.value);
    const arrival = oaFindAirport(els.arrival.value);
    const nextLeg = oaFindAirport(els.nextLeg.value);
    oaRenderGlobe(departure, arrival, nextLeg);

    if (!departure || !arrival) {
      oaInvalid();
      return null;
    }

    const ctx = {
      departure,
      arrival,
      nextLeg,
      tripShape: els.tripShape.value,
      goal: els.goal.value,
      eventWindow: els.eventWindow.value,
      month: Number(els.travelMonth.value),
      planStyle: els.planStyle.value
    };

    const shift = arrival.offset - departure.offset;
    const routeText = ctx.tripShape === "one-way"
      ? `${departure.city} to ${arrival.city}`
      : ctx.tripShape === "round-trip" && nextLeg
        ? `${departure.city} to ${arrival.city} and back to ${nextLeg.city}`
        : ctx.tripShape === "multi-city" && nextLeg
          ? `${departure.city} to ${arrival.city} to ${nextLeg.city}`
          : `${departure.city} to ${arrival.city}`;

    els.routeSummary.textContent = `${routeText} - ${oaDescribeShift(shift)}`;
    els.routeTimezones.textContent = `${departure.code} (${departure.timezone}) to ${arrival.code} (${arrival.timezone}) built for ${els.goal.options[els.goal.selectedIndex].text}`;
    els.routeWeatherTitle.textContent = `${arrival.city} in ${oaMonths[ctx.month]}`;
    els.routeWeather.textContent = oaSeasonal(arrival, ctx.month);
    els.protocolPreview.innerHTML = oaPreviewSteps(ctx).map((item) => `<li>${item}</li>`).join("");
    els.driftHours.textContent = `${Math.abs(shift)} hour${Math.abs(shift) === 1 ? "" : "s"}`;
    els.criticalWindow.textContent = oaCriticalLabel(ctx.eventWindow);
    els.routeIntensity.textContent = oaIntensity(shift, ctx.tripShape, ctx.planStyle);

    const sections = oaSections(ctx);
    oaLastBrief = oaBrief(ctx, sections);
    els.protocolMailto.href = `mailto:hello@onarrival.travel?subject=${encodeURIComponent("on arrival protocol request")}&body=${encodeURIComponent(oaLastBrief)}`;

    if (full) {
      els.protocolSections.innerHTML = sections.map((section) => `
        <div class="protocol-section">
          <strong>${section.title}</strong>
          <p>${section.text}</p>
          <ul>${section.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
        </div>
      `).join("");
    }

    return { ctx, brief: oaLastBrief };
  };

  const oaDownload = () => {
    const result = oaRender(true);
    if (!result) {
      oaStatus("route needed first", "generate a route before downloading the protocol brief.");
      return;
    }
    const blob = new Blob([result.brief], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `on-arrival-protocol-${result.ctx.departure.code}-${result.ctx.arrival.code}-${oaMonths[result.ctx.month]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    oaStatus("brief downloaded", "a clean protocol handoff file was downloaded for this traveler.");
  };

  const oaSaveLead = async () => {
    const result = oaRender(true);
    if (!result) {
      oaStatus("route needed first", "choose a valid departure and arrival airport before saving the lead.");
      return;
    }
    const email = els.leadEmail.value.trim();
    if (!email) {
      oaStatus("email needed", "add an email so this lead can be useful once you wire a live endpoint.");
      return;
    }
    const payload = {
      createdAt: new Date().toISOString(),
      name: els.leadName.value.trim(),
      email,
      company: els.leadCompany.value.trim(),
      cadence: els.leadFrequency.value,
      notes: els.leadNotes.value.trim(),
      route: els.routeSummary.textContent,
      brief: result.brief
    };
    const existing = JSON.parse(localStorage.getItem("onArrivalLeads") || "[]");
    existing.unshift(payload);
    localStorage.setItem("onArrivalLeads", JSON.stringify(existing.slice(0, 100)));
    try {
      await navigator.clipboard.writeText(result.brief);
      oaStatus("lead saved locally", `saved in this browser and copied the protocol brief to your clipboard. current stored leads: ${existing.length}.`);
    } catch {
      oaStatus("lead saved locally", `saved in this browser. clipboard access was unavailable, but the brief is ready through the email and download actions. current stored leads: ${existing.length}.`);
    }
  };

  [els.departure, els.arrival, els.nextLeg].forEach((input) => {
    input.addEventListener("focus", () => {
      oaFocusField = input === els.arrival ? "arrival" : input === els.nextLeg ? "return" : "departure";
      oaRender(false);
    });
    input.addEventListener("change", () => oaRender(false));
  });

  [els.goal, els.eventWindow, els.travelMonth, els.planStyle].forEach((input) => {
    input.addEventListener("change", () => oaRender(false));
  });

  els.tripShape.addEventListener("change", () => {
    oaSyncTripShape();
    oaRender(false);
  });
  els.preview.addEventListener("click", () => oaRender(false));
  els.generate.addEventListener("click", () => oaRender(true));
  els.saveLead.addEventListener("click", oaSaveLead);
  els.downloadBrief.addEventListener("click", oaDownload);
  els.reset.addEventListener("click", () => {
    setTimeout(() => {
      els.travelMonth.value = String(new Date().getMonth());
      oaFocusField = "departure";
      oaSyncTripShape();
      oaRender(false);
      oaStatus("lead capture ready", "once a real form endpoint is connected, this panel can hand off directly to your crm. for now it stores inquiries in the browser and prepares a clean handoff brief.");
    }, 0);
  });

  els.travelMonth.value = String(new Date().getMonth());
  oaSyncTripShape();
  oaInvalid();
  oaRenderGlobe(null, null, null);
})();
