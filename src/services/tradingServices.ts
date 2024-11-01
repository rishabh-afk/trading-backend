import colors from 'colors';
import { strings } from '../config/messages';

export class TradingService {
    /**
     * Calculates trading points based on high, low, and close values.
     * 
     * @param {number} high - The highest price.
     * @param {number} low - The lowest price.
     * @param {number} close - The closing price.
     * @returns {Promise<Object>} - An object containing calculated trading points:
     *   - `pivot`: The pivot point
     *   - `bc`: The base central pivot
     *   - `tc`: The top central pivot
     *   - `r1`: Resistance level 1
     *   - `r2`: Resistance level 2
     *   - `r3`: Resistance level 3
     *   - `r4`: Resistance level 4
     *   - `s1`: Support level 1
     *   - `s2`: Support level 2
     *   - `s3`: Support level 3
     *   - `s4`: Support level 4
     */
    static async CalculatePoints(high: number, low: number, close: number): Promise<object> {
        const pivot = parseFloat(((high + low + close) / 3).toFixed(3));
        const bc = parseFloat(((high + low) / 2).toFixed(3));
        const tc = parseFloat((pivot - bc + pivot).toFixed(3));
        const r1 = parseFloat(((2 * pivot) - low).toFixed(3));
        const r2 = parseFloat((pivot + (high - low)).toFixed(3));
        const r3 = parseFloat((r1 + (high - low)).toFixed(3));
        const r4 = parseFloat((r2 + (high - low)).toFixed(3));
        const s1 = parseFloat(((2 * pivot) - high).toFixed(3));
        const s2 = parseFloat((pivot - (high - low)).toFixed(3));
        const s3 = parseFloat((s1 - (high - low)).toFixed(3));
        const s4 = parseFloat((s2 - (high - low)).toFixed(3));

        return {
            pivot,
            bc,
            tc,
            r1,
            r2,
            r3,
            r4,
            s1,
            s2,
            s3,
            s4,
        };
    }

    /**
     * Determines the trading action (Buy Call, Monitor, or Buy Put) based on the price and key points (TC, Pivot, BC).
     * 
     * @param {number} price - The current price of the stock.
     * @param {number} tc - The TC (Top Center) line value.
     * @param {number} pivot - The Pivot line value.
     * @param {number} bc - The BC (Bottom Center) line value.
     * @returns {Promise<object>} - An object containing the recommended trading action.
     */
    static async DetermineAction(price: number, tc: number, pivot: number, bc: number): Promise<object> {
        console.log(`Price: ${price}, TC: ${tc.toFixed(3)}, Pivot: ${pivot.toFixed(3)}, BC: ${bc.toFixed(3)}`);
        let message = "";
        if (price > tc) {
            console.log(colors.green(strings.CALL_BUY));
            message = strings.CALL_BUY;
        } else if (price >= bc && price <= tc) {
            console.log(colors.blue(strings.MONITORING));
            message = strings.MONITORING;
        } else if (price < bc) {
            console.log(colors.red(strings.PUT_BUY));
            message = strings.PUT_BUY;
        }
        return { message: message };
    }
}
