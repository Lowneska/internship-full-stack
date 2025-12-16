###########################
# AI Prompt Definitions
###########################


SYSTEM_PROMPT = """
Tu génères un programme d'entraînement à partir du texte utilisateur.

FORMAT (OBLIGATOIRE) :
- Réponds UNIQUEMENT avec un JSON valide conforme au schéma (strict). Aucun texte hors JSON.
- Tous les nombres sont des ENTIERS.

SI DEMANDE INVALIDE (hors sujet, dangereuse, contradictoire/irréalisable, charabia) :
{
  "success": false,
  "error_message": "message court ≤ 200 caractères",
  "days": []
}

SINON :
{
  "success": true,
  "error_message": null,
  "days": [...]
}

DÉFAUTS si manquant :
- séances/semaine=3, durée=45, matériel=aucun, niveau=débutant, objectif=forme générale
- max 7 jours

RÈGLES :
- max 7 jours, day séquentiel (1..n sans trous)
- warmup/cooldown : 1 phrase super courte (≤ 80 caractères)
- focus ≤ 50 caractères
- equipment : seulement le matériel utilisé (≤ 3 items) et pas de doublons
- exercises : 1 à 6 exercices/jour, noms ≥ 5 caractères
- pas de notes/progression dans exercises (uniquement warmup/cooldown)
"""

# JSON Schema for validating the AI response
PROGRAM_RESPONSE_JSON_SCHEMA = {
    "name": "program_response",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "success": {"type": "boolean"},
            "error_message": {
                "type": ["string", "null"],
                "maxLength": 200,
            },
            "days": {
                "type": "array",
                "minItems": 0,
                "maxItems": 7,
                "items": {
                    "type": "object",
                    "properties": {
                        "day": {"type": "integer", "minimum": 1, "maximum": 7},
                        "focus": {"type": "string", "maxLength": 50},
                        "duration_min": {
                            "type": "integer",
                            "minimum": 10,
                            "maximum": 120,
                        },
                        "estimated_calories": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 1500,
                        },
                        "equipment": {
                            "type": "array",
                            "maxItems": 3,
                            "items": {"type": "string", "maxLength": 30},
                        },
                        "warmup": {"type": "string", "maxLength": 120},
                        "cooldown": {"type": "string", "maxLength": 120},
                        "exercises": {
                            "type": "array",
                            "minItems": 1,
                            "maxItems": 6,
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "minLength": 5,
                                        "maxLength": 50,
                                    },
                                    "sets": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 6,
                                    },
                                    "reps": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 50,
                                    },
                                    "rest_sec": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 300,
                                    },
                                },
                                "required": ["name", "sets", "reps", "rest_sec"],
                                "additionalProperties": False,
                            },
                        },
                    },
                    "required": [
                        "day",
                        "focus",
                        "duration_min",
                        "estimated_calories",
                        "equipment",
                        "warmup",
                        "cooldown",
                        "exercises",
                    ],
                    "additionalProperties": False,
                },
            },
        },
        "required": ["success", "error_message", "days"],
        "additionalProperties": False,
    },
}
