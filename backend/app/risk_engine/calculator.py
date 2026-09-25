"""Epidemiological Disease-Spread Risk Engine."""

from typing import Dict, Any, List

def calculate_disease_spread_risk(
    pathogen_type: str,
    disease_name: str,
    current_weather: Dict[str, Any],
    forecast_days: List[Dict[str, Any]],
    current_severity: float = 10.0
) -> Dict[str, Any]:
    """Calculate multi-day disease spread risk index based on microclimate variables."""
    if pathogen_type == "none" or "healthy" in disease_name.lower():
        return {
            "risk_score": 10.0,
            "risk_level": "LOW",
            "risk_color": "green",
            "alert_headline": "Low Environmental Threat",
            "alert_message": "Current microclimate presents low disease pressure for healthy crops. Continue regular monitoring.",
            "spread_probability_percent": 12.0,
            "projected_trend": "Stable",
            "best_spraying_window": "No emergency chemical application needed.",
            "key_drivers": ["Optimal dry-warm conditions", "Low foliar moisture duration"]
        }

    temp = current_weather.get("temperature_c", 26.0)
    humidity = current_weather.get("humidity_percent", 70.0)
    rain = current_weather.get("precipitation_mm", 0.0)
    wind = current_weather.get("wind_speed_kmh", 10.0)
    
    # Analyze 3-day future outlook
    forecast_humidity = [d.get("mean_humidity_percent", 65.0) for d in forecast_days[:3]]
    forecast_rain = [d.get("precip_sum_mm", 0.0) for d in forecast_days[:3]]
    forecast_temps = [d.get("max_temp_c", 28.0) for d in forecast_days[:3]]
    
    avg_future_humidity = sum(forecast_humidity) / len(forecast_humidity) if forecast_humidity else humidity
    total_future_rain = sum(forecast_rain)
    avg_future_temp = sum(forecast_temps) / len(forecast_temps) if forecast_temps else temp

    risk_score = 30.0 # Base biological pressure
    drivers = []

    if pathogen_type == "fungal":
        # Fungi thrive between 18-28C with high humidity
        if 18 <= temp <= 30:
            risk_score += 20.0
            drivers.append("Optimal temperature for fungal spore germination (18°C - 30°C)")
        
        if humidity >= 80:
            risk_score += 25.0
            drivers.append(f"Excessive relative humidity ({humidity:.0f}%) extends leaf wetness duration")
        elif humidity >= 65:
            risk_score += 15.0
            drivers.append(f"Elevated relative humidity ({humidity:.0f}%) promotes fungal sporulation")

        if total_future_rain > 5.0 or rain > 1.0:
            risk_score += 18.0
            drivers.append(f"Forecasted rainfall ({total_future_rain:.1f} mm) will splash and spread spores across canopy")
            
    elif pathogen_type == "bacterial":
        # Bacteria thrive with warmth, rain splashes, and wind
        if 24 <= temp <= 35:
            risk_score += 20.0
            drivers.append("Warm temperatures accelerate bacterial division and systemic infection")
            
        if total_future_rain > 3.0 or rain > 0.5:
            risk_score += 25.0
            drivers.append("Rain droplet impact creates water-congestion in stomata, facilitating bacterial entry")
            
        if wind > 15.0:
            risk_score += 15.0
            drivers.append(f"Strong winds ({wind:.1f} km/h) disperse aerosolized bacterial exudates")
            
    elif pathogen_type == "viral":
        # Viral diseases (e.g. TYLCV) depend on vector activity (Whiteflies, aphids)
        # Sucking pests thrive in warmer, drier weather
        if temp > 28 and humidity < 70:
            risk_score += 30.0
            drivers.append("Hot, dry conditions stimulate rapid whitefly/aphid vector multiplication")
        else:
            risk_score += 15.0
            drivers.append("Moderate vector flight activity observed in ambient temperatures")

    # Factor in existing infection severity
    if current_severity > 25.0:
        risk_score += 12.0
        drivers.append(f"High existing field inoculum density ({current_severity:.1f}% affected leaf area)")
    elif current_severity > 10.0:
        risk_score += 6.0

    # Cap score
    risk_score = min(max(risk_score, 10.0), 98.0)

    # Classify Risk Tier
    if risk_score >= 75.0:
        risk_level = "CRITICAL"
        risk_color = "red"
        alert_headline = "CRITICAL OUTBREAK ALERT"
        alert_message = f"Immediate danger of rapid {pathogen_type} epidemic spread over the next 48-72 hours due to high humidity and favorable temperatures."
        best_spray = "Spray within 24 hours before incoming rainfall. Ensure translaminar or systemic fungicide/bactericide."
    elif risk_score >= 55.0:
        risk_level = "HIGH"
        risk_color = "orange"
        alert_headline = "HIGH DISEASE SPREAD RISK"
        alert_message = f"Current microclimate strongly favors {pathogen_type} proliferation. Lesions likely to expand rapidly to younger foliage."
        best_spray = "Best spray window: Tomorrow early morning (6:30 AM - 9:30 AM) when wind speed is low."
    elif risk_score >= 35.0:
        risk_level = "MODERATE"
        risk_color = "yellow"
        alert_headline = "MODERATE SPREAD RISK"
        alert_message = "Pathogen reproduction is steady. Monitor lower foliage and apply preventive bio-protective formulation."
        best_spray = "Foliar bio-shield or contact spray recommended within 3 to 4 days."
    else:
        risk_level = "LOW"
        risk_color = "green"
        alert_headline = "LOW EPIDEMIOLOGICAL PRESSURE"
        alert_message = "Weather conditions are currently unfavorable for rapid pathogen dissemination."
        best_spray = "No emergency spray needed; maintain good soil and crop nutrition."

    # Future Trend
    if avg_future_humidity > humidity + 5 or total_future_rain > 10:
        trend = "Rising (Deteriorating)"
    elif avg_future_humidity < humidity - 10:
        trend = "Declining (Improving)"
    else:
        trend = "Stable"

    return {
        "risk_score": round(risk_score, 1),
        "risk_level": risk_level,
        "risk_color": risk_color,
        "alert_headline": alert_headline,
        "alert_message": alert_message,
        "spread_probability_percent": round(min(risk_score * 0.95, 95.0), 1),
        "projected_trend": trend,
        "best_spraying_window": best_spray,
        "key_drivers": drivers
    }
