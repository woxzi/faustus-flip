// these can be changed to anything else with no code changes if GGG changes their mind again
// all prices are normalized to the first value in this array
export const primaryCurrency = ['chaos', 'divine'];

export const LOW_CONFIDENCE_VALUE_THRESHOLD = 10000; // in chaos (or primaryCurrency[0])
export const LOW_CONFIDENCE_QUANTITY_THRESHOLD = 1000; // in secondary currency units
export const LOW_CONFIDENCE_RATIO_THRESHOLD = 0.5; // in percent, ex: '0.5' = 50% threshold

export function getCurrencyPairsAndTrios(league: string) {
  return fetch(`https://api.poe.watch/currencyRatios?league=${league}&game=poe1`)
    .then((x) => x.json() as any as PoeWatchCurrencyPair[])
    .then((x: PoeWatchCurrencyPair[]) => {
      const pairs = getCurrencyPairsInternal(x);
      return {
        pairs: pairs,
        trios: getCurrencyProfitTrios(pairs),
      } as CurrencyPairsAndTriosResult;
    });
}

export function getCurrencyProfitTrios(pairs: CurrencyPair[]) {
  const chaosPairs = pairs.filter((x) => x.first_currency === primaryCurrency[0]);
  const divPairs = pairs.filter((x) => x.first_currency === primaryCurrency[1]);

  return chaosPairs
    .map((chaosPair) => {
      const divPair = divPairs.find(
        (divPair) => divPair.second_currency === chaosPair.second_currency
      );

      if (!divPair) {
        return null;
      }

      return {
        currency_name: chaosPair.second_currency,
        chaos_value: chaosPair.primary_currency_value,
        div_value: divPair?.primary_currency_value,
        chaos_quantity_traded: chaosPair.quantity_traded,
        chaos_value_volume_traded: chaosPair.chaos_value_traded,
        div_quantity_traded: divPair.quantity_traded,
        div_value_volume_traded: divPair?.chaos_value_traded,
        profit: Math.abs(chaosPair.primary_currency_value - divPair.primary_currency_value),
        low_confidence: isTrioLowConfidence(chaosPair, divPair),
      } as CurrencyTrio;
    })
    .filter((x) => !!x); // filter out pairs that weren't matched on both sides
}

function getCurrencyPairsInternal(apiPairsListResponse: PoeWatchCurrencyPair[]) {
  // calculate chaos to div ratio
  const chaos_to_div_pair = apiPairsListResponse.filter(
    (x) => primaryCurrency.includes(x.first_currency) && primaryCurrency.includes(x.second_currency)
  )[0];
  const chaos_to_div_ratio = getChaosValueOfPrimaryCurrency(chaos_to_div_pair);

  // calculate other pairs
  const otherPairs = apiPairsListResponse
    .filter(
      (x) =>
        (primaryCurrency.includes(x.first_currency) &&
          !primaryCurrency.includes(x.second_currency)) ||
        (!primaryCurrency.includes(x.first_currency) && primaryCurrency.includes(x.second_currency))
    ) // find pairs where only one of the currencies is a primary currency
    .map((pair) => getCurrencyPair(pair, chaos_to_div_ratio)); // map to usable data format for table

  return otherPairs;
}

function getCurrencyPair(pair: PoeWatchCurrencyPair, chaos_div_cost: number): CurrencyPair {
  var ratio = getCurrencyPairRatio(pair);

  const isFirstCurrencyPrimary = primaryCurrency.includes(pair.first_currency);

  // do this logic twice to normalize so primary currency is in first slot
  if (isFirstCurrencyPrimary) {
    // multiply value by div cost if needed so all values are normalized to chaos
    let chaosValue;
    if (pair.first_currency == primaryCurrency[0]) {
      chaosValue = ratio[0] / ratio[1];
    } else {
      chaosValue = (ratio[0] * chaos_div_cost) / ratio[1];
    }

    const result: CurrencyPair = {
      first_currency: pair.first_currency,
      first_currency_ratio_amount: ratio[0],
      second_currency: pair.second_currency,
      second_currency_ratio_amount: ratio[1],
      primary_currency_value: chaosValue,
      quantity_traded: pair.quantity_traded,
      chaos_value_traded: pair.quantity_traded * chaosValue,
      low_confidence: false,
    };
    result.low_confidence = isPairLowConfidence(result);

    return result;
  } else {
    // multiply value by div cost if needed so all values are normalized to chaos
    let chaosValue;
    if (pair.second_currency == primaryCurrency[0]) {
      chaosValue = ratio[1] / ratio[0];
    } else {
      chaosValue = (ratio[1] * chaos_div_cost) / ratio[0];
    }

    return {
      first_currency: pair.second_currency,
      first_currency_ratio_amount: ratio[1],
      second_currency: pair.first_currency,
      second_currency_ratio_amount: ratio[0],
      primary_currency_value: chaosValue,
      quantity_traded: pair.quantity_traded,
      chaos_value_traded: pair.quantity_traded * chaosValue,
      low_confidence: pair.low_confidence,
    };
  }
}

// returns the value of the main currency exchange pair. uses the values in 'primaryCurrency'.
// will return the ratio of chaos to divines (chaos divided by div) unless 'primaryCurrency' has been changed.
function getChaosValueOfPrimaryCurrency(pair: PoeWatchCurrencyPair): number {
  if (
    !primaryCurrency.includes(pair.first_currency) ||
    !primaryCurrency.includes(pair.second_currency)
  ) {
    throw new Error('Provided pair is not a primary currency pair.');
  }
  const isCurrencyInCorrectOrder =
    pair.first_currency == primaryCurrency[0] && pair.second_currency == primaryCurrency[1];

  const ratio = getCurrencyPairRatio(pair);

  // normalize costs and calc values
  if (isCurrencyInCorrectOrder) {
    return ratio[0] / ratio[1]; // chaos:div -> chaos/div
  } else {
    return ratio[1] / ratio[0]; // div:chaos -> chaos/div
  }
}

function getCurrencyPairRatio(pair: PoeWatchCurrencyPair) {
  return pair.ratio.split(':').map((x) => {
    let value = x.trim();
    if (x.toLowerCase().endsWith('k')) {
      return Number(x.substring(0, x.length - 1)) * 1000;
    }
    if (x.toLowerCase().endsWith('m')) {
      return Number(x.substring(0, x.length - 1)) * 1000000;
    }
    return Number(x);
  });
}

function isPairLowConfidence(pair: CurrencyPair): boolean {
  return (
    pair.low_confidence ||
    pair.quantity_traded * pair.primary_currency_value < LOW_CONFIDENCE_VALUE_THRESHOLD ||
    pair.quantity_traded < LOW_CONFIDENCE_QUANTITY_THRESHOLD
  );
}

function isTrioLowConfidence(chaosPair: CurrencyPair, divPair: CurrencyPair): boolean {
  const numerator = Math.min(chaosPair.primary_currency_value, divPair.primary_currency_value);
  const denominator = Math.max(chaosPair.primary_currency_value, divPair.primary_currency_value);

  const ratio = numerator / denominator;

  return (
    chaosPair.low_confidence || divPair.low_confidence || ratio < LOW_CONFIDENCE_RATIO_THRESHOLD
  );
}
