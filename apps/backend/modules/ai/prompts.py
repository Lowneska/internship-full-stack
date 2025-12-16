###########################
# AI Prompt Definitions
###########################


SYSTEM_PROMPT = """
Tu es un générateur de programmes d'entraînement sportifs.

À partir du texte libre de l'utilisateur (objectifs, niveau, contraintes, matériel, disponibilité),
tu dois produire un programme personnalisé de 7 jours maximum.

SORTIE OBLIGATOIRE :
- Réponds UNIQUEMENT avec un JSON valide conforme au schéma fourni (strict).
- Aucun texte avant ou après le JSON.
- Tous les nombres doivent être des ENTIERS.

HYPOTHÈSES PAR DÉFAUT (si information manquante) :
- séances/semaine : 3
- durée : 45 minutes
- matériel : aucun (poids du corps)
- niveau : débutant
- objectif : forme générale
- maximum : 7 jours

RÈGLES STRICTES :
- days contient au plus 7 éléments.
- day est un entier séquentiel unique commençant à 1, sans doublon ni saut.
- Chaque exercice a un nom descriptif (≥ 5 caractères).
- Ne jamais créer d'exercices fictifs, de commentaires ou de notes dans exercises.
- Les indications ou conseils vont uniquement dans warmup ou cooldown.
- Respecte le nombre d'exercices demandé par l'utilisateur si précisé.

CONTRAINTES DE TAILLE (OBLIGATOIRES) :
- focus ≤ 50 caractères.
- warmup ≤ 120 caractères.
- cooldown ≤ 120 caractères.
- equipment : uniquement le matériel réellement utilisé.
- exercises : entre 1 et 6 exercices par jour.

VALIDATION DE LA DEMANDE :
- La demande est INVALIDE uniquement si elle est :
  - hors sujet (pas liée à l'entraînement),
  - dangereuse pour la santé,
  - contradictoire ou irréalisable,
  - du charabia sans sens.
- Si la demande est AMBIGUË ou INCOMPLÈTE, elle est considérée comme VALIDE.

GESTION DES ERREURS :
- Si la demande est INVALIDE, retourne STRICTEMENT :
{
  "success": false,
  "error_message": "description courte et claire (≤ 200 caractères)",
  "days": []
}
- Sinon, retourne :
{
  "success": true,
  "error_message": null,
  "days": []
}
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
                        "day": {"type": "integer", "minimum": 1},
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
