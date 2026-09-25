"""Agronomic Advisory Engine: Organic, Chemical, Cultural and Soil Health Management."""

ADVISORY_DATABASE = {
    "Tomato___Early_blight": {
        "disease_name": "Early Blight (Alternaria solani)",
        "urgency": "High",
        "organic_treatment": [
            {
                "title": "Bio-fungicide Spray",
                "detail": "Spray Trichoderma harzianum or Pseudomonas fluorescens @ 5-10g/litre of water in early morning or late evening.",
                "type": "Biological"
            },
            {
                "title": "Neem Oil Formulation",
                "detail": "Apply 5ml Cold-Pressed Neem Oil (10,000 ppm azadirachtin) + 1ml liquid soap per litre of water every 7-10 days.",
                "type": "Botanical"
            },
            {
                "title": "Bordeaux Mixture / Copper Hydroxide",
                "detail": "Spray 0.5% - 1% Bordeaux mixture or Copper Oxychloride 50 WP @ 2.5g/litre for organic barrier protection.",
                "type": "Preventive"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Mancozeb 75% WP",
                "dosage": "2.0 - 2.5 g / litre of water",
                "method": "Foliar spray ensuring complete coverage of upper and lower leaf surfaces",
                "waiting_period_days": 7
            },
            {
                "title": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
                "dosage": "1.0 ml / litre of water",
                "method": "Systemic translaminar protection during active lesion expansion",
                "waiting_period_days": 5
            },
            {
                "title": "Chlorothalonil 75% WP",
                "dosage": "2.0 g / litre of water",
                "method": "Multi-site contact fungicide; alternate with systemic fungicides to avoid resistance",
                "waiting_period_days": 7
            }
        ],
        "cultural_practices": [
            "Prune and destroy infected lower leaves touching or close to the soil surface.",
            "Switch from overhead sprinkler to drip irrigation to prevent foliar leaf wetness.",
            "Maintain 60cm row-to-row spacing for improved canopy aeration and sunlight penetration.",
            "Practice minimum 2-year crop rotation away from Solanaceae (Potato, Brinjal, Chilli)."
        ],
        "soil_synergies": {
            "potassium": "Low Potassium (K) softens plant cell walls, drastically increasing susceptibility to Alternaria blight. Apply Muriate of Potash (MOP) or SOP @ 20-25 kg/acre.",
            "nitrogen": "Avoid excess Nitrogen fertilization, which produces succulent leafy growth highly vulnerable to fungal infection.",
            "calcium": "Ensure adequate Calcium availability to strengthen cell pectin layers against fungal enzyme penetration."
        }
    },
    "Tomato___Late_blight": {
        "disease_name": "Late Blight (Phytophthora infestans)",
        "urgency": "Critical",
        "organic_treatment": [
            {
                "title": "Copper Hydroxide Bio-protective Spray",
                "detail": "Apply Copper Hydroxide @ 2g/L or Bordeaux mixture (1%) proactively before rain events.",
                "type": "Barrier"
            },
            {
                "title": "Bacillus subtilis Bio-control",
                "detail": "Apply Bacillus subtilis formulations @ 5ml/litre to colonize leaf surface against oospore germination.",
                "type": "Microbial"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ)",
                "dosage": "2.5 g / litre of water",
                "method": "Systemic and contact action; apply immediately upon first symptoms",
                "waiting_period_days": 10
            },
            {
                "title": "Cymoxanil 8% + Mancozeb 64% WP",
                "dosage": "2.0 g / litre of water",
                "method": "Provides curative 'kickback' activity within 48 hours of infection",
                "waiting_period_days": 7
            },
            {
                "title": "Dimethomorph 50% WP",
                "dosage": "1.0 - 1.5 g / litre of water",
                "method": "Oomycete cell-wall inhibitor; highly effective in severe outbreaks",
                "waiting_period_days": 5
            }
        ],
        "cultural_practices": [
            "Immediately remove and deeply bury or burn severely blighted plant canopies; do not compost.",
            "Avoid late evening irrigation; ensure leaves dry before nightfall.",
            "Install raised beds with plastic mulching to reduce soil splash onto leaves."
        ],
        "soil_synergies": {
            "drainage": "Late blight spores move in standing water. Improve field drainage and avoid waterlogging.",
            "phosphorus": "Apply Phosphite-based foliar nutrition (e.g. Potassium Phosphite) which induces systemic acquired resistance (SAR)."
        }
    },
    "Tomato___Bacterial_spot": {
        "disease_name": "Bacterial Spot (Xanthomonas spp.)",
        "urgency": "High",
        "organic_treatment": [
            {
                "title": "Copper Oxychloride + Streptomycin combo",
                "detail": "Spray Copper Oxychloride 50 WP (2.5g) mixed with Plantomycin / Streptocycline (1g in 10L water).",
                "type": "Bactericide"
            },
            {
                "title": "Bio-formulation (Pseudomonas)",
                "detail": "Seed treatment and foliar spray of Pseudomonas fluorescens @ 10g/L.",
                "type": "Microbial"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Copper Hydroxide 53.8% DF",
                "dosage": "2.0 g / litre of water",
                "method": "Protective bactericidal foliar spray",
                "waiting_period_days": 3
            },
            {
                "title": "Streptocycline (Agricultural Streptomycin + Tetracycline)",
                "dosage": "0.1 g / litre (1g in 10 litres) mixed with copper fungicide",
                "method": "Apply at 10-12 day intervals during warm, stormy rainy spells",
                "waiting_period_days": 14
            }
        ],
        "cultural_practices": [
            "Use certified disease-free seeds or hot-water soak seeds at 50°C for 25 minutes before sowing.",
            "Avoid handling, pruning or staking wet tomato plants to prevent mechanical bacterial transmission.",
            "Disinfect pruning shears with 10% sodium hypochlorite or rubbing alcohol between rows."
        ],
        "soil_synergies": {
            "ph": "Maintain neutral soil pH (6.2 - 6.8). Highly acidic soils aggravate bacterial plant stress."
        }
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "disease_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "urgency": "High",
        "organic_treatment": [
            {
                "title": "Yellow Sticky Traps",
                "detail": "Install 15-20 yellow sticky traps per acre at crop canopy height to monitor and trap whitefly vectors.",
                "type": "Physical Control"
            },
            {
                "title": "Neem / Pongamia Oil Spray",
                "detail": "Spray 5ml Neem oil + 2ml detergent per litre water every 5 days to repel and disrupt whitefly feeding.",
                "type": "Repellent"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Diafenthiuron 50% WP",
                "dosage": "1.2 g / litre of water",
                "method": "Target under-surface of foliage where whitefly nymphs congregate",
                "waiting_period_days": 7
            },
            {
                "title": "Acetamiprid 20% SP",
                "dosage": "0.4 g / litre of water",
                "method": "Systemic neonicotinoid targeting sap-sucking whitefly adults and nymphs",
                "waiting_period_days": 7
            }
        ],
        "cultural_practices": [
            "Erect 40-50 mesh insect barrier nylon netting around nursery seedbeds.",
            "Immediately rogue out and destroy young infected plants showing leaf curl.",
            "Plant 2-3 border rows of tall maize, sorghum or pearl millet to act as physical vector barriers."
        ],
        "soil_synergies": {
            "silicon": "Apply soluble potassium silicate to soil or foliar. Silicon deposits in leaf epidermis deter stylet penetration by sucking insects."
        }
    },
    "Tomato___healthy": {
        "disease_name": "Healthy Tomato Foliage",
        "urgency": "Low (Maintenance)",
        "organic_treatment": [
            {
                "title": "Preventive Bio-Shield",
                "detail": "Apply Panchagavya (3%) or Seaweed liquid extract (2ml/L) as foliar biostimulant once every 14 days.",
                "type": "Biostimulant"
            }
        ],
        "chemical_treatment": [],
        "cultural_practices": [
            "Maintain consistent soil moisture through drip lines to prevent blossom end rot and fruit splitting.",
            "Continue regular scouting of lower foliage twice a week for early signs of pests or spotting."
        ],
        "soil_synergies": {
            "balanced": "Maintain balanced N-P-K (120:60:60 kg/ha) with regular vermicompost or FYM top-dressing."
        }
    },
    "Potato___Early_blight": {
        "disease_name": "Potato Early Blight (Alternaria solani)",
        "urgency": "High",
        "organic_treatment": [
            {
                "title": "Trichoderma Foliar Application",
                "detail": "Spray Trichoderma harzianum @ 10g/L in moist evening conditions.",
                "type": "Biological"
            },
            {
                "title": "Copper Oxychloride 50 WP",
                "detail": "Spray 2.5g/L preventive barrier before canopy closure.",
                "type": "Contact"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Mancozeb 75% WP",
                "dosage": "2.5 g / litre of water",
                "method": "First spray at 30-35 days after planting, repeat after 10 days",
                "waiting_period_days": 7
            },
            {
                "title": "Tebuconazole 25.9% EC",
                "dosage": "1.0 ml / litre of water",
                "method": "Systemic triazole with excellent curative leaf protection",
                "waiting_period_days": 10
            }
        ],
        "cultural_practices": [
            "Avoid water stress or nitrogen deficiency during tuber bulking phase.",
            "Ensure good ridge height (earthing up) to protect developing tubers from spore runoff."
        ],
        "soil_synergies": {
            "potassium": "Potassium deficiency accelerates tuber senescence and early blight severity. Ensure potash top-dressing @ 30kg/acre."
        }
    },
    "Potato___Late_blight": {
        "disease_name": "Potato Late Blight (Phytophthora infestans)",
        "urgency": "Critical",
        "organic_treatment": [
            {
                "title": "Bordeaux Mixture (1%)",
                "detail": "Copper sulphate (1kg) + Quick lime (1kg) in 100L water. Thorough prophylactic canopy spray.",
                "type": "Preventive"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Dimethomorph 50% WP + Mancozeb 75% WP",
                "dosage": "1g Dimethomorph + 2g Mancozeb per litre",
                "method": "Apply upon first localized forecast alert or blight warnings in the district",
                "waiting_period_days": 10
            },
            {
                "title": "Famoxadone 16.6% + Cymoxanil 22.1% SC",
                "dosage": "1.0 ml / litre of water",
                "method": "High-potency dual action protectant & translaminar fungicide",
                "waiting_period_days": 7
            }
        ],
        "cultural_practices": [
            "Destroy volunteer potato plants and cull piles around the farm perimeter.",
            "De-haulm (cut and destroy foliage) 10-12 days before harvest to prevent tuber contamination during digging."
        ],
        "soil_synergies": {
            "aeration": "Heavy waterlogged soils facilitate zoospores infecting tubers. Implement deep drainage furrows."
        }
    },
    "Corn_(maize)___Common_rust_": {
        "disease_name": "Corn Common Rust (Puccinia sorghi)",
        "urgency": "Moderate",
        "organic_treatment": [
            {
                "title": "Sulfur Wettable Powder",
                "detail": "Spray Wettable Sulfur 80% WP @ 2.5g/L when pustules are first observed on lower leaves.",
                "type": "Contact"
            }
        ],
        "chemical_treatment": [
            {
                "title": "Azoxystrobin 11% + Tebuconazole 18.3% w/w SC",
                "dosage": "1.5 ml / litre of water",
                "method": "Foliar application at tassel emergence if rust pustules cover >5% of leaves",
                "waiting_period_days": 14
            },
            {
                "title": "Propiconazole 25% EC",
                "dosage": "1.0 ml / litre of water",
                "method": "Systemic ergosterol biosynthesis inhibitor",
                "waiting_period_days": 14
            }
        ],
        "cultural_practices": [
            "Plant certified rust-resistant maize hybrid cultivars suited to your agro-climatic zone.",
            "Avoid planting adjacent maize fields with staggered sowing dates that allow pathogen bridge."
        ],
        "soil_synergies": {
            "nitrogen_balance": "Avoid unbalanced excess nitrogen which promotes dense succulent canopies that trap moisture."
        }
    }
}

def get_recommendations(disease_class: str, severity_percent: float = 0.0) -> dict:
    """Retrieve structured advisory recommendations tailored to disease and severity."""
    if disease_class in ADVISORY_DATABASE:
        data = ADVISORY_DATABASE[disease_class]
    else:
        # Default smart generic advisory for other crops
        is_healthy = "healthy" in disease_class.lower()
        if is_healthy:
            data = {
                "disease_name": "Healthy Crop",
                "urgency": "Low",
                "organic_treatment": [
                    {"title": "Nutrient Maintenance", "detail": "Apply seaweed or humic acid foliar spray @ 2ml/L to maintain immunity.", "type": "Biostimulant"}
                ],
                "chemical_treatment": [],
                "cultural_practices": ["Maintain clean weeding and optimal soil moisture."],
                "soil_synergies": {"status": "Soil appears balanced for current crop growth."}
            }
        else:
            data = {
                "disease_name": disease_class.replace("___", " - ").replace("_", " "),
                "urgency": "Moderate" if severity_percent < 25 else "High",
                "organic_treatment": [
                    {"title": "Neem Seed Kernel Extract (5%)", "detail": "Spray NSKE 5% or Cold-Pressed Neem Oil (5ml/L) as broad-spectrum barrier.", "type": "Botanical"},
                    {"title": "Bio-Agent Inoculation", "detail": "Apply Trichoderma or Pseudomonas bio-fungicide @ 5g/L.", "type": "Biological"}
                ],
                "chemical_treatment": [
                    {"title": "Broad Spectrum Protectant (Mancozeb 75 WP)", "dosage": "2.5 g / litre", "method": "Foliar spray covering canopy", "waiting_period_days": 7}
                ],
                "cultural_practices": [
                    "Remove and safely burn or bury infected leaves.",
                    "Ensure adequate field drainage to avoid standing humidity."
                ],
                "soil_synergies": {
                    "general": "Test soil for potassium and micro-nutrient deficiencies that lower crop disease resistance."
                }
            }
            
    # Add severity-adapted alert note
    severity_note = ""
    if severity_percent > 40:
        severity_note = "CRITICAL ALERT: Over 40% leaf area is damaged. Immediate systemic intervention is required to prevent whole-field crop loss."
    elif severity_percent > 15:
        severity_note = "MODERATE NOTICE: Visible lesions expanding. Spray during clear weather within the next 24-48 hours."
    else:
        severity_note = "EARLY STAGE: Mild or early onset detected. Preventive bio-fungicide or cultural measures will keep infection in check."
        
    result = dict(data)
    result["severity_note"] = severity_note
    return result
