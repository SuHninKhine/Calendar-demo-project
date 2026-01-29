"""Business logic services for appointments."""

POSTAL_DISTRICT_MAP = {
    "01": "Raffles Place/Marina",
    "02": "Chinatown/Tanjong Pagar",
    "03": "Alexandra/Commonwealth",
    "04": "Harbourfront/Telok Blangah",
    "05": "Buona Vista/Pasir Panjang",
    "06": "City Hall/Beach Road",
    "07": "Bugis/Rochor",
    "08": "Little India/Farrer Park",
    "09": "Orchard/River Valley",
    "10": "Tanglin/Holland",
    "11": "Newton/Novena",
    "12": "Balestier/Toa Payoh",
    "13": "Macpherson/Braddell",
    "14": "Geylang/Eunos",
    "15": "Katong/Marine Parade",
    "16": "Bedok/Upper East Coast",
    "17": "Changi/Loyang",
    "18": "Pasir Ris/Simei",
    "19": "Tampines/Simei",
    "20": "Hougang/Punggol",
    "21": "Serangoon/Hougang",
    "22": "Sengkang/Punggol",
    "23": "Ang Mo Kio/Yio Chu Kang",
    "25": "Admiralty/Woodlands",
    "26": "Woodlands/Admiralty",
    "27": "Sembawang/Yishun",
    "28": "Yishun/Sembawang",
    "72": "Kranji/Turf Club",
    "73": "Nee Soon/Yishun",
    "75": "Yishun/Canberra",
    "76": "Yishun/Canberra",
    "77": "Sembawang/Canberra",
    "78": "Woodlands/Marsiling",
    "79": "Woodlands/Admiralty",
    "80": "Sengkang/Punggol",
}


def get_district_from_postal(postal_code: str) -> str:
    """Return the district name based on the first two postal digits."""
    if len(postal_code) < 2:
        return "Unknown District"
    return POSTAL_DISTRICT_MAP.get(postal_code[:2], "Unknown District")
