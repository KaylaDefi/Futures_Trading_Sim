use wasm_bindgen::prelude::*;

/// Calculates the liquidation price based on entry price, leverage, and position type.
///
/// # Arguments
/// * `entry_price` - The price at which the position was opened.
/// * `leverage` - The leverage used for the position (e.g., 3x).
/// * `position_type` - A string, either "LONG" or "SHORT"
///
/// # Returns
/// * The liquidation price as a floating-point number.
#[wasm_bindgen]
pub fn calculate_liquidation_price(entry_price: f64, leverage: f64, position_type: &str) -> f64 {
    let maintenance_margin_ratio = 0.005;

    match position_type {
        "LONG" => entry_price * (1.0 - 1.0 / leverage + maintenance_margin_ratio),
        "SHORT" => entry_price * (1.0 + 1.0 / leverage - maintenance_margin_ratio),
        _ => entry_price, // fallback if unknown input
    }
}
