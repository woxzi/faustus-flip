interface PoeWatchCurrencyPair {
  first_currency: string;
  second_currency: string;
  ratio: string;
  exchange_rate: number;
  quantity_traded: number;
  id: number;
  chaos_value: number;
  low_confidence: boolean;
  created_at: number;
  category: string;
  icon: string;
  item_id: number;
  volume_24h: number;
}

interface CurrencyPair {
  first_currency: string;
  first_currency_ratio_amount: number;
  second_currency: string;
  second_currency_ratio_amount: number;
  primary_currency_value: number;
  quantity_traded: number;
  chaos_value_traded: number;
  low_confidence: boolean;
}

interface CurrencyTrio {
  currency_name: string;
  chaos_value: number;
  div_value: number;
  chaos_quantity_traded: number;
  chaos_value_volume_traded: number;
  div_quantity_traded: number;
  div_value_volume_traded: number;
  profit: number;
  low_confidence: boolean;
}

interface CurrencyPairsAndTriosResult {
  pairs: CurrencyPair[];
  trios: CurrencyTrio[];
}
